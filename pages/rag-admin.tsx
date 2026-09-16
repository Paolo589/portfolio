import {
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Head from "next/head";

const RAG_URL =
  process.env.NEXT_PUBLIC_RAG_URL || "https://paolo-rag.d-vettura.workers.dev";

type DocMeta = {
  id: string;
  filename: string;
  chunkCount: number;
  chars: number;
  updatedAt: string;
};

export default function RagAdminPage() {
  const [secret, setSecret] = useState("");
  const [filename, setFilename] = useState("");
  const [text, setText] = useState("");
  const [documents, setDocuments] = useState<DocMeta[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDocs = useCallback(async () => {
    try {
      const res = await fetch(`${RAG_URL}/docs`);
      const data = await res.json();
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
    } catch {
      setError("Could not load documents from the worker.");
    }
  }, []);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  async function onFileChange(file: File | null) {
    if (!file) return;
    setFilename(file.name);
    const content = await file.text();
    setText(content);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!secret.trim()) {
      setError("Enter the upload secret.");
      return;
    }
    if (!text.trim()) {
      setError("Paste text or choose a .txt / .md file.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${RAG_URL}/ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret.trim()}`,
        },
        body: JSON.stringify({
          text,
          filename: filename || "document.txt",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }
      setMessage(
        `Uploaded "${data.document.filename}" (${data.document.chunkCount} chunks).`
      );
      setText("");
      setFilename("");
      await loadDocs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(docId: string) {
    if (!secret.trim()) {
      setError("Enter the secret to delete a document.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${RAG_URL}/docs/${encodeURIComponent(docId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }
      setMessage(`Document ${docId} deleted.`);
      await loadDocs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>RAG Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>RAG — upload documents</h1>
        <p style={styles.sub}>
          Worker: <code>{RAG_URL}</code>
        </p>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            Upload secret
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="INGEST_SECRET"
              style={styles.input}
              autoComplete="off"
            />
          </label>

          <label style={styles.label}>
            File (.txt / .md)
            <input
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Filename
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="resume.txt"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Document text
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={14}
              placeholder="Paste the document content here…"
              style={styles.textarea}
            />
          </label>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Uploading…" : "Upload to RAG"}
          </button>
        </form>

        {message && <p style={styles.ok}>{message}</p>}
        {error && <p style={styles.err}>{error}</p>}

        <section style={styles.section}>
          <h2 style={styles.h2}>Indexed documents ({documents.length})</h2>
          {documents.length === 0 ? (
            <p style={styles.sub}>No documents yet.</p>
          ) : (
            <ul style={styles.list}>
              {documents.map((doc) => (
                <li key={doc.id} style={styles.item}>
                  <div>
                    <strong>{doc.filename}</strong>
                    <div style={styles.meta}>
                      {doc.chunkCount} chunks · {doc.chars} chars ·{" "}
                      {new Date(doc.updatedAt).toLocaleString()}
                    </div>
                    <code style={styles.code}>{doc.id}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(doc.id)}
                    disabled={loading}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    maxWidth: 720,
    margin: "2rem auto",
    padding: "0 1rem 3rem",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  title: { fontSize: "1.6rem", marginBottom: "0.25rem" },
  h2: { fontSize: "1.15rem", marginBottom: "0.75rem" },
  sub: { color: "#555", fontSize: "0.9rem", marginBottom: "1.25rem" },
  form: { display: "grid", gap: "0.9rem", marginBottom: "1.5rem" },
  label: { display: "grid", gap: "0.35rem", fontSize: "0.9rem", fontWeight: 600 },
  input: {
    padding: "0.55rem 0.7rem",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: "0.95rem",
    fontWeight: 400,
  },
  textarea: {
    padding: "0.7rem",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: "0.9rem",
    fontWeight: 400,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    resize: "vertical",
  },
  button: {
    padding: "0.7rem 1rem",
    border: "none",
    borderRadius: 6,
    background: "#111",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "0.4rem 0.7rem",
    border: "1px solid #c44",
    borderRadius: 6,
    background: "#fff",
    color: "#c44",
    cursor: "pointer",
    height: "fit-content",
  },
  ok: { color: "#0a7a32", marginBottom: "1rem" },
  err: { color: "#b00020", marginBottom: "1rem" },
  section: { marginTop: "2rem" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.85rem 1rem",
    border: "1px solid #e2e2e2",
    borderRadius: 8,
  },
  meta: { fontSize: "0.85rem", color: "#666", marginTop: 4 },
  code: { fontSize: "0.75rem", color: "#444" },
};
