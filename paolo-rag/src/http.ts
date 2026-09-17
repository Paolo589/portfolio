export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  META: KVNamespace;
  EMBEDDING_MODEL: string;
  CHAT_MODEL: string;
  TOP_K: string;
  MAX_COMPLETION_TOKENS: string;
  CHUNK_SIZE: string;
  CHUNK_OVERLAP: string;
  INGEST_SECRET?: string;
}

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const SSE_HEADERS: Record<string, string> = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
  ...CORS_HEADERS,
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

export function isAuthorized(request: Request, env: Env): boolean {
  if (!env.INGEST_SECRET) return true;
  const header = request.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token === env.INGEST_SECRET;
}

export function sanitizeDocId(value?: string | null): string | null {
  if (!value) return null;
  const cleaned = value.trim();
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(cleaned)) return null;
  return cleaned;
}

export function sseResponse(body: ReadableStream<Uint8Array>): Response {
  return new Response(body, { headers: SSE_HEADERS });
}

export function immediateSseStream(
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

export async function pipeAiStreamToSse(
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
