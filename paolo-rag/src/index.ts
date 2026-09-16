export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  META: KVNamespace;
  EMBEDDING_MODEL: string;
  CHAT_MODEL: string;
  TOP_K: string;
  CHUNK_SIZE: string;
  CHUNK_OVERLAP: string;
  INGEST_SECRET?: string;
}

type DocMeta = {
  id: string;
  filename: string;
  chunkCount: number;
  chars: number;
  updatedAt: string;
};

type IngestBody = {
  text?: string;
  filename?: string;
  docId?: string;
};

type AskBody = {
  question?: string;
  docIds?: string[];
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const SSE_HEADERS: Record<string, string> = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
  ...CORS_HEADERS,
};

const DOCS_LIST_KEY = "docs:list";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/health") {
        return json({ ok: true, worker: "paolo-rag" });
      }

      if (request.method === "GET" && url.pathname === "/status") {
        const docs = await listDocs(env);
        return json({
          ingested: docs.length > 0,
          documentCount: docs.length,
          documents: docs,
        });
      }

      if (request.method === "GET" && url.pathname === "/docs") {
        return json({ documents: await listDocs(env) });
      }

      if (request.method === "POST" && url.pathname === "/ingest") {
        return handleIngest(request, env);
      }

      if (request.method === "DELETE" && url.pathname.startsWith("/docs/")) {
        const docId = decodeURIComponent(url.pathname.slice("/docs/".length));
        return handleDeleteDoc(request, env, docId);
      }

      if (request.method === "POST" && url.pathname === "/ask") {
        return handleAsk(request, env);
      }

      return json({ error: "Not found" }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return json({ error: message }, 500);
    }
  },
};

async function handleIngest(request: Request, env: Env): Promise<Response> {
  if (!isAuthorized(request, env)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const parsed = await parseIngestPayload(request);
  if ("error" in parsed) {
    return json({ error: parsed.error }, 400);
  }

  return ingestDocument(env, parsed);
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

  await env.META.put(docMetaKey(docId), JSON.stringify(meta));
  await env.META.put(docIdsKey(docId), JSON.stringify(ids));
  await env.META.put(docFullKey(docId), text);
  await upsertDocInList(env, meta);

  return json({ ok: true, document: meta });
}

function asFormFile(value: unknown): File | null {
  if (value == null || typeof value === "string") return null;
  // Workers FormData may type uploads as Blob-like without a usable File constructor.
  if (typeof value === "object" && "arrayBuffer" in value && "name" in value) {
    return value as File;
  }
  return null;
}

function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
}

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const result = await extractText(pdf, { mergePages: true });
  const text = Array.isArray(result.text) ? result.text.join("\n\n") : String(result.text || "");
  return text.replace(/\u0000/g, "").trim();
}

async function handleDeleteDoc(
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

  await deleteDocVectors(env, cleanId);
  await env.META.delete(docMetaKey(cleanId));
  await env.META.delete(docIdsKey(cleanId));
  await env.META.delete(docFullKey(cleanId));
  await removeDocFromList(env, cleanId);

  return json({ ok: true, deleted: cleanId });
}

async function handleAsk(request: Request, env: Env): Promise<Response> {
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

  const filterDocIds = Array.isArray(body.docIds)
    ? body.docIds.map(sanitizeDocId).filter((id): id is string => Boolean(id))
    : [];

  const queryEmbedding = await embed(env, question);
  const topK = Number(env.TOP_K) || 5;

  const queryOptions: VectorizeQueryOptions = {
    topK,
    returnMetadata: "all",
  };

  if (filterDocIds.length === 1) {
    queryOptions.filter = { docId: filterDocIds[0] };
  }

  const matches = await env.VECTORIZE.query(queryEmbedding, queryOptions);

  let contextChunks = (matches.matches || [])
    .map((m) => {
      const text =
        m.metadata && typeof m.metadata.text === "string" ? m.metadata.text : "";
      const docId =
        m.metadata && typeof m.metadata.docId === "string" ? m.metadata.docId : "";
      return {
        text: text.trim(),
        docId,
      };
    })
    .filter((c) => c.text);

  if (filterDocIds.length > 1) {
    const allowed = new Set(filterDocIds);
    contextChunks = contextChunks.filter((c) => allowed.has(c.docId));
  }

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

  const system = [
    "You are Paolo Minopoli. Answer in the first person as Paolo Minopoli.",
    "Use ONLY the provided document context about yourself.",
    "If the information is not in the context, say so clearly in the first person.",
    "Reply in the same language as the user's question (Italian if they write in Italian, English if they write in English).",
    "Format answers with clean Markdown: use bullet lists and **bold** for key titles or role names.",
    "Prefer short structured lists when summarizing work or skills; keep tone warm and conversational.",
    "Do not invent experiences, skills, dates, or facts.",
    "Do not use emoticons.",
    "Do not mention documents, sources, file names, or that you are an AI/RAG system.",
    "Do not reveal sensitive or personal data beyond what is in the context.",
  ].join(" ");

  const userPrompt = `Context about you:\n${context}\n\nVisitor question: ${question}\n\nAnswer in first person using Markdown (lists and bold are welcome).`;

  const aiResult = await env.AI.run(env.CHAT_MODEL as keyof AiModels, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
    stream: true,
    max_completion_tokens: 1024,
    reasoning_effort: "low",
    chat_template_kwargs: { thinking: false },
  } as Record<string, unknown>);

  const outbound = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        await pipeAiStreamToSse(aiResult, send);
        send({ type: "done" });
        controller.close();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Stream failed";
        send({ type: "error", error: message });
        controller.close();
      }
    },
  });

  return sseResponse(outbound);
}

function sseResponse(body: ReadableStream<Uint8Array>): Response {
  return new Response(body, { headers: SSE_HEADERS });
}

function immediateSseStream(
  events: Record<string, unknown>[]
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      controller.close();
    },
  });
}

async function pipeAiStreamToSse(
  aiResult: unknown,
  send: (event: Record<string, unknown>) => void
): Promise<void> {
  const reader = getAiStreamReader(aiResult);
  if (!reader) {
    const fallback = extractChatAnswer(aiResult);
    if (fallback) send({ type: "token", text: fallback });
    return;
  }

  const decoder = new TextDecoder();
  let sseBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value == null) continue;

    if (typeof value === "string") {
      const token = extractStreamToken(value);
      if (token) send({ type: "token", text: token });
      continue;
    }

    if (value instanceof Uint8Array || ArrayBuffer.isView(value)) {
      const bytes =
        value instanceof Uint8Array
          ? value
          : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      sseBuffer += decoder.decode(bytes, { stream: true });

      const lines = sseBuffer.split("\n");
      sseBuffer = lines.pop() || "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith(":") || line.startsWith("event:")) continue;
        if (!line.startsWith("data:")) continue;

        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload) as unknown;
          const token = extractStreamToken(parsed);
          if (token) send({ type: "token", text: token });
        } catch {
          if (payload) send({ type: "token", text: payload });
        }
      }
      continue;
    }

    if (typeof value === "object") {
      const token = extractStreamToken(value);
      if (token) send({ type: "token", text: token });
    }
  }

  if (sseBuffer.trim()) {
    const leftover = sseBuffer.trim();
    if (leftover.startsWith("data:")) {
      const payload = leftover.slice(5).trim();
      if (payload && payload !== "[DONE]") {
        try {
          const token = extractStreamToken(JSON.parse(payload));
          if (token) send({ type: "token", text: token });
        } catch {
          /* ignore trailing partial */
        }
      }
    }
  }
}

function getAiStreamReader(
  aiResult: unknown
): ReadableStreamDefaultReader<unknown> | null {
  if (!aiResult) return null;

  if (aiResult instanceof ReadableStream) {
    return aiResult.getReader();
  }

  if (typeof Response !== "undefined" && aiResult instanceof Response && aiResult.body) {
    return aiResult.body.getReader();
  }

  if (
    typeof aiResult === "object" &&
    aiResult !== null &&
    "getReader" in aiResult &&
    typeof (aiResult as ReadableStream).getReader === "function"
  ) {
    return (aiResult as ReadableStream).getReader();
  }

  return null;
}

function extractStreamToken(chunk: unknown): string {
  if (typeof chunk === "string") {
    // Ignore raw SSE wrappers if they somehow land here.
    if (chunk.startsWith("data:")) return "";
    return chunk;
  }

  if (!chunk || typeof chunk !== "object") return "";

  const obj = chunk as Record<string, unknown>;

  if (typeof obj.response === "string") return obj.response;
  if (typeof obj.text === "string") return obj.text;
  if (typeof obj.token === "string") return obj.token;

  const choices = obj.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const choice = choices[0] as Record<string, unknown>;
    const delta = choice.delta;
    if (delta && typeof delta === "object") {
      const d = delta as Record<string, unknown>;
      if (typeof d.content === "string") return d.content;
      if (typeof d.text === "string") return d.text;
    }
    if (typeof choice.text === "string") return choice.text;
    const message = choice.message;
    if (message && typeof message === "object") {
      const content = (message as Record<string, unknown>).content;
      if (typeof content === "string") return content;
    }
  }

  return "";
}

async function listDocs(env: Env): Promise<DocMeta[]> {
  const docs = await env.META.get(DOCS_LIST_KEY, "json");
  return Array.isArray(docs) ? (docs as DocMeta[]) : [];
}

async function upsertDocInList(env: Env, meta: DocMeta): Promise<void> {
  const docs = await listDocs(env);
  const next = docs.filter((d) => d.id !== meta.id);
  next.unshift(meta);
  await env.META.put(DOCS_LIST_KEY, JSON.stringify(next));
}

async function removeDocFromList(env: Env, docId: string): Promise<void> {
  const docs = await listDocs(env);
  await env.META.put(
    DOCS_LIST_KEY,
    JSON.stringify(docs.filter((d) => d.id !== docId))
  );
}

async function deleteDocVectors(env: Env, docId: string): Promise<void> {
  const previous = await env.META.get(docIdsKey(docId), "json");
  if (Array.isArray(previous) && previous.length > 0) {
    await env.VECTORIZE.deleteByIds(previous as string[]);
  }
}

async function embed(env: Env, text: string): Promise<number[]> {
  const result = await env.AI.run(env.EMBEDDING_MODEL as keyof AiModels, {
    text: [text],
  });

  const data =
    typeof result === "object" && result && "data" in result
      ? (result as { data: number[][] }).data
      : null;

  if (!data?.[0]) {
    throw new Error("Embedding model returned empty data");
  }

  return data[0];
}

function extractChatAnswer(result: unknown): string {
  if (typeof result === "string") return result;

  if (result && typeof result === "object") {
    const obj = result as Record<string, unknown>;

    if (typeof obj.response === "string") return obj.response;

    const choices = obj.choices;
    if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
      const choice = choices[0] as Record<string, unknown>;
      const message = choice.message;
      if (message && typeof message === "object") {
        const content = (message as Record<string, unknown>).content;
        if (typeof content === "string") return content;
      }
      if (typeof choice.text === "string") return choice.text;
    }
  }

  return String(result);
}

function chunkText(text: string, size: number, overlap: number): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\t/g, " ").trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + size, normalized.length);

    if (end < normalized.length) {
      const slice = normalized.slice(start, end);
      const lastBreak = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf("\n")
      );
      if (lastBreak > size * 0.4) {
        end = start + lastBreak + 1;
      }
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk) chunks.push(chunk);

    if (end >= normalized.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks;
}

function sanitizeDocId(value?: string): string | null {
  if (!value) return null;
  const cleaned = value.trim();
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(cleaned)) return null;
  return cleaned;
}

function docMetaKey(docId: string): string {
  return `doc:${docId}:meta`;
}

function docIdsKey(docId: string): string {
  return `doc:${docId}:ids`;
}

function docFullKey(docId: string): string {
  return `doc:${docId}:full`;
}

function isAuthorized(request: Request, env: Env): boolean {
  if (!env.INGEST_SECRET) return true;
  const header = request.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token === env.INGEST_SECRET;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}
