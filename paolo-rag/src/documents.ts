import type { Env } from "./http";

export type DocMeta = {
  id: string;
  filename: string;
  chunkCount: number;
  chars: number;
  updatedAt: string;
};

const DOCS_LIST_KEY = "docs:list";

export function docMetaKey(docId: string): string {
  return `doc:${docId}:meta`;
}

export function docIdsKey(docId: string): string {
  return `doc:${docId}:ids`;
}

export function docFullKey(docId: string): string {
  return `doc:${docId}:full`;
}

export async function listDocs(env: Env): Promise<DocMeta[]> {
  const docs = await env.META.get(DOCS_LIST_KEY, "json");
  return Array.isArray(docs) ? (docs as DocMeta[]) : [];
}

export async function upsertDocInList(env: Env, meta: DocMeta): Promise<void> {
  const docs = await listDocs(env);
  const next = docs.filter((d) => d.id !== meta.id);
  next.unshift(meta);
  await env.META.put(DOCS_LIST_KEY, JSON.stringify(next));
}

export async function removeDocFromList(env: Env, docId: string): Promise<void> {
  const docs = await listDocs(env);
  await env.META.put(
    DOCS_LIST_KEY,
    JSON.stringify(docs.filter((d) => d.id !== docId))
  );
}

export async function deleteDocVectors(env: Env, docId: string): Promise<void> {
  const previous = await env.META.get(docIdsKey(docId), "json");
  if (Array.isArray(previous) && previous.length > 0) {
    await env.VECTORIZE.deleteByIds(previous as string[]);
  }
}

export async function saveDocument(
  env: Env,
  meta: DocMeta,
  ids: string[],
  fullText: string
): Promise<void> {
  await env.META.put(docMetaKey(meta.id), JSON.stringify(meta));
  await env.META.put(docIdsKey(meta.id), JSON.stringify(ids));
  await env.META.put(docFullKey(meta.id), fullText);
  await upsertDocInList(env, meta);
}

export async function removeDocument(env: Env, docId: string): Promise<void> {
  await deleteDocVectors(env, docId);
  await env.META.delete(docMetaKey(docId));
  await env.META.delete(docIdsKey(docId));
  await env.META.delete(docFullKey(docId));
  await removeDocFromList(env, docId);
}
