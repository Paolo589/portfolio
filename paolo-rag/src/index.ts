import type { Env } from "./http";
import { CORS_HEADERS, json } from "./http";
import {
  handleAsk,
  handleDeleteDoc,
  handleHealth,
  handleIngest,
  handleListDocs,
  handleStatus,
  handleWarmup,
} from "./routes";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/health") {
        return handleHealth();
      }

      if (request.method === "GET" && url.pathname === "/warmup") {
        return handleWarmup(env);
      }

      if (request.method === "GET" && url.pathname === "/status") {
        return handleStatus(env);
      }

      if (request.method === "GET" && url.pathname === "/docs") {
        return handleListDocs(env);
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
