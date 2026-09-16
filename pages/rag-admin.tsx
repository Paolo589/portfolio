import {
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

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export default function RagAdminPage() {
  const [secret, setSecret] = useState("");
  const [filename, setFilename] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
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

  async function onFileChange(next: File | null) {
    if (!next) {
      setFile(null);
      return;
    }

    setFile(next);
    setFilename(next.name);

    if (isPdf(next)) {
      setText("");
      return;
    }

    setText(await next.text());
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!secret.trim()) {
      setError("Enter the upload secret.");
      return;
    }

    const hasPdf = Boolean(file && isPdf(file));
    if (!hasPdf && !text.trim()) {
      setError("Paste text or choose a .txt / .md / .pdf file.");
      return;
    }

    setLoading(true);
    try {
      let res: Response;

      if (hasPdf && file) {
        const form = new FormData();
        form.append("file", file);
        form.append("filename", filename || file.name);
        res = await fetch(`${RAG_URL}/ingest`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret.trim()}`,
          },
          body: form,
        });
      } else {
        res = await fetch(`${RAG_URL}/ingest`, {
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
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }
      setMessage(
        `Uploaded "${data.document.filename}" (${data.document.chunkCount} chunks).`
      );
      setText("");
      setFilename("");
      setFile(null);
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

      <main className="rag-admin">
        <div className="rag-admin__inner">
        <h1 className="rag-admin__title">RAG — upload documents</h1>
        <p className="rag-admin__sub">
          Worker: <code>{RAG_URL}</code>
        </p>

        <form onSubmit={onSubmit} className="rag-admin__form">
          <label className="rag-admin__label">
            Upload secret
            <input
              type="text"
              name="ingest-secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Paste INGEST_SECRET here"
              className="rag-admin__input"
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <label className="rag-admin__label">
            File (.txt / .md / .pdf)
            <input
              type="file"
              accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              className="rag-admin__input"
            />
          </label>

          <label className="rag-admin__label">
            Filename
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="resume.pdf"
              className="rag-admin__input"
            />
          </label>

          {file && isPdf(file) ? (
            <p className="rag-admin__sub">
              PDF selected: <strong>{file.name}</strong> — text will be extracted
              on the worker during upload.
            </p>
          ) : (
            <label className="rag-admin__label">
              Document text
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setFile(null);
                }}
                rows={14}
                placeholder="Paste the document content here…"
                className="rag-admin__textarea"
              />
            </label>
          )}

          <button type="submit" disabled={loading} className="rag-admin__button">
            {loading ? "Uploading…" : "Upload to RAG"}
          </button>
        </form>

        {message && <p className="rag-admin__ok">{message}</p>}
        {error && <p className="rag-admin__err">{error}</p>}

        <section className="rag-admin__section">
          <h2 className="rag-admin__h2">Indexed documents ({documents.length})</h2>
          {documents.length === 0 ? (
            <p className="rag-admin__sub">No documents yet.</p>
          ) : (
            <ul className="rag-admin__list">
              {documents.map((doc) => (
                <li key={doc.id} className="rag-admin__item">
                  <div className="rag-admin__item-body">
                    <strong>{doc.filename}</strong>
                    <div className="rag-admin__meta">
                      {doc.chunkCount} chunks · {doc.chars} chars ·{" "}
                      {new Date(doc.updatedAt).toLocaleString()}
                    </div>
                    <code className="rag-admin__code">{doc.id}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(doc.id)}
                    disabled={loading}
                    className="rag-admin__delete"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        </div>
      </main>
    </>
  );
}
