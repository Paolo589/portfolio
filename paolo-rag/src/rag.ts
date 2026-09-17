import type { Env } from "./http";
import { pipeAiStreamToSse } from "./http";

export function chunkText(text: string, size: number, overlap: number): string[] {
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

export async function embed(env: Env, text: string): Promise<number[]> {
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

export type ContextChunk = {
  text: string;
  docId: string;
};

export async function retrieveContext(
  env: Env,
  question: string,
  filterDocIds: string[] = []
): Promise<ContextChunk[]> {
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

  return contextChunks;
}

export function buildPaoloPrompt(context: string, question: string) {
  const system = [
    "You are Paolo Minopoli. Answer in the first person as Paolo Minopoli.",
    "Tone: warm, friendly, and polished — like speaking with a good friend, but still professional and respectful.",
    "Be approachable and genuine; avoid stiff corporate language, slang, or being overly casual.",
    "Use ONLY the provided document context about yourself for facts.",
    "Chat history is only to understand follow-up questions (e.g. \"sure?\", \"and then?\").",
    "If the information is not in the context, say so clearly and kindly in the first person.",
    "Reply in the same language as the user's question (Italian if they write in Italian, English if they write in English).",
    "Format answers with clean Markdown: use bullet lists and **bold** for key titles or role names.",
    "Prefer short structured lists when summarizing work or skills; keep the voice natural and welcoming.",
    "Always reply with at least one short sentence. Never return an empty answer.",
    "Do not invent experiences, skills, dates, or facts.",
    "Do not use emoticons.",
    "Do not mention documents, sources, file names, or that you are an AI/RAG system.",
    "Do not reveal sensitive or personal data beyond what is in the context.",
  ].join(" ");

  const user = `Context about you:\n${context}\n\nVisitor question: ${question}\n\nAnswer in first person, warmly and professionally, using Markdown (lists and bold are welcome).`;

  return { system, user };
}

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function runChatStream(
  env: Env,
  system: string,
  user: string,
  history: ChatHistoryMessage[] = []
): Promise<unknown> {
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: system },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: user },
  ];

  return env.AI.run(env.CHAT_MODEL as keyof AiModels, {
    messages,
    stream: true,
    max_completion_tokens: Number(env.MAX_COMPLETION_TOKENS) || 512,
    reasoning_effort: "low",
    chat_template_kwargs: { thinking: false },
  } as Record<string, unknown>);
}

const EMPTY_ANSWER_FALLBACK =
  "I couldn't generate an answer just now. Please try asking again.";

export function streamChatToSse(aiResult: unknown): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const tokenCount = await pipeAiStreamToSse(aiResult, send);
        if (tokenCount === 0) {
          send({ type: "token", text: EMPTY_ANSWER_FALLBACK });
        }
        send({ type: "done" });
        controller.close();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Stream failed";
        send({ type: "error", error: message });
        controller.close();
      }
    },
  });
}

export async function warmupModels(env: Env): Promise<void> {
  const embedding = await embed(env, "warmup");
  await env.VECTORIZE.query(embedding, { topK: 1, returnMetadata: "none" });

  await env.AI.run(env.CHAT_MODEL as keyof AiModels, {
    messages: [{ role: "user", content: "hi" }],
    stream: false,
    max_completion_tokens: Number(env.MAX_COMPLETION_TOKENS) || 512,
    reasoning_effort: "low",
    chat_template_kwargs: { thinking: false },
  } as Record<string, unknown>);
}
