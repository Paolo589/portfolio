import type { Env } from "./http";
import {
  immediateSseStream,
  isAuthorized,
  json,
  sanitizeDocId,
  sseResponse,
} from "./http";
import {
  deleteDocVectors,
  docMetaKey,
  listDocs,
  removeDocument,
  saveDocument,
  type DocMeta,
} from "./documents";
import { asFormFile, extractPdfText, isPdfFile } from "./pdf";
import {
  buildPaoloPrompt,
  chunkText,
  embed,
  retrieveContext,
  runChatStream,
  streamChatToSse,
  warmupModels,
  type ChatHistoryMessage,
} from "./rag";

type IngestBody = {
  text?: string;
  filename?: string;
  docId?: string;
};

type AskBody = {
  question?: string;
  docIds?: string[];
  history?: Array<{ role?: string; content?: string }>;
};

const MAX_HISTORY_MESSAGES = 6;

export async function handleHealth(): Promise<Response> {
  return json({ ok: true, worker: "paolo-rag" });
}

export async function handleWarmup(env: Env): Promise<Response> {
  const started = Date.now();
  await warmupModels(env);
  return json({
    ok: true,
    warmed: true,
    ms: Date.now() - started,
  });
}

export async function handleStatus(env: Env): Promise<Response> {
  const docs = await listDocs(env);
  return json({
    ingested: docs.length > 0,
    documentCount: docs.length,
    documents: docs,
  });
}

export async function handleListDocs(env: Env): Promise<Response> {
  return json({ documents: await listDocs(env) });
}

export async function handleIngest(request: Request, env: Env): Promise<Response> {
  if (!isAuthorized(request, env)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const parsed = await parseIngestPayload(request);
  if ("error" in parsed) {
    return json({ error: parsed.error }, 400);
  }

  return ingestDocument(env, parsed);
}

export async function handleDeleteDoc(
  request: Request,
  env: Env,
  docId: string
): Promise<Response> {
  if (!isAuthorized(request, env)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const cleanId = sanitizeDocId(docId);
  if (!cleanId) {
    return json({ error: "Invalid document id" }, 400);
  }

  const existing = await env.META.get(docMetaKey(cleanId), "json");
  if (!existing) {
    return json({ error: "Document not found" }, 404);
  }

  await removeDocument(env, cleanId);
  return json({ ok: true, deleted: cleanId });
}

export async function handleAsk(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as AskBody;
  const question = body.question?.trim();
  if (!question) {
    return json({ error: "Missing question. Send JSON { question: string }" }, 400);
  }

  const docs = await listDocs(env);
  if (docs.length === 0) {
    return json(
      {
        error:
          "No documents uploaded yet. Use POST /ingest with { text } before asking.",
      },
      409
    );
  }

  const history = normalizeHistory(body.history);
  const filterDocIds = Array.isArray(body.docIds)
    ? body.docIds.map(sanitizeDocId).filter((id): id is string => Boolean(id))
    : [];

  // Short follow-ups retrieve better if we include the previous user question.
  const retrievalQuery = buildRetrievalQuery(question, history);
  const contextChunks = await retrieveContext(env, retrievalQuery, filterDocIds);

  if (contextChunks.length === 0) {
    return sseResponse(
      immediateSseStream([
        {
          type: "token",
          text: "I could not find relevant information in the documents to answer this question.",
        },
        { type: "done" },
      ])
    );
  }

  const context = contextChunks
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join("\n\n");

  const { system, user } = buildPaoloPrompt(context, question);
  const aiResult = await runChatStream(env, system, user, history);
  return sseResponse(streamChatToSse(aiResult));
}

function normalizeHistory(
  raw: AskBody["history"]
): ChatHistoryMessage[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const role = item?.role === "assistant" ? "assistant" : item?.role === "user" ? "user" : null;
      const content = typeof item?.content === "string" ? item.content.trim() : "";
      if (!role || !content) return null;
      return { role, content } satisfies ChatHistoryMessage;
    })
    .filter((m): m is ChatHistoryMessage => Boolean(m))
    .slice(-MAX_HISTORY_MESSAGES);
}

function buildRetrievalQuery(
  question: string,
  history: ChatHistoryMessage[]
): string {
  if (question.length >= 40) return question;
  const previousUser = [...history].reverse().find((m) => m.role === "user");
  if (!previousUser) return question;
  return `${previousUser.content}\n${question}`;
}

async function parseIngestPayload(
  request: Request
): Promise<{ text: string; filename: string; docId?: string } | { error: string }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const docIdRaw = form.get("docId");
    const filenameRaw = form.get("filename");
    const textRaw = form.get("text");
    const file = asFormFile(form.get("file"));

    const docId =
      typeof docIdRaw === "string" ? sanitizeDocId(docIdRaw) || undefined : undefined;
    let filename =
      (typeof filenameRaw === "string" && filenameRaw.trim()) ||
      file?.name ||
      "document.txt";
    let text = typeof textRaw === "string" ? textRaw.trim() : "";

    if (file && file.size > 0) {
      filename = (typeof filenameRaw === "string" && filenameRaw.trim()) || file.name;
      if (isPdfFile(file)) {
        text = await extractPdfText(await file.arrayBuffer());
      } else {
        text = (await file.text()).trim();
      }
    }

    if (!text) {
      return {
        error:
          "Missing content. Send multipart with a text/md/pdf file, or a text field.",
      };
    }

    return { text, filename, docId };
  }

  if (
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream")
  ) {
    const buffer = await request.arrayBuffer();
    if (!buffer.byteLength) {
      return { error: "Empty PDF body" };
    }
    const text = await extractPdfText(buffer);
    if (!text) {
      return { error: "Could not extract text from PDF" };
    }
    const url = new URL(request.url);
    const filename = url.searchParams.get("filename") || "document.pdf";
    const docId = sanitizeDocId(url.searchParams.get("docId") || undefined) || undefined;
    return { text, filename, docId };
  }

  const body = (await request.json()) as IngestBody;
  const text = body.text?.trim();
  if (!text) {
    return {
      error:
        "Missing text. Send JSON { text }, multipart file (txt/md/pdf), or raw PDF body.",
    };
  }

  return {
    text,
    filename: (body.filename || "document.txt").trim(),
    docId: sanitizeDocId(body.docId) || undefined,
  };
}

async function ingestDocument(
  env: Env,
  input: { text: string; filename: string; docId?: string }
): Promise<Response> {
  const text = input.text.trim();
  const filename = input.filename.trim() || "document.txt";
  const docId = input.docId || crypto.randomUUID();

  const chunkSize = Number(env.CHUNK_SIZE) || 800;
  const overlap = Number(env.CHUNK_OVERLAP) || 150;
  const chunks = chunkText(text, chunkSize, overlap);

  if (chunks.length === 0) {
    return json({ error: "No usable text after chunking" }, 400);
  }

  await deleteDocVectors(env, docId);

  const vectors: VectorizeVector[] = [];
  const ids: string[] = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const embedding = await embed(env, chunk);
    const id = `${docId}-${i}`;
    ids.push(id);
    vectors.push({
      id,
      values: embedding,
      metadata: {
        text: chunk.slice(0, 3500),
        index: i,
        docId,
        source: filename,
      },
    });
  }

  for (let i = 0; i < vectors.length; i += 50) {
    await env.VECTORIZE.upsert(vectors.slice(i, i + 50));
  }

  const meta: DocMeta = {
    id: docId,
    filename,
    chunkCount: chunks.length,
    chars: text.length,
    updatedAt: new Date().toISOString(),
  };

  await saveDocument(env, meta, ids, text);

  return json({ ok: true, document: meta });
}
