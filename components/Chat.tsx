import { FormEvent, useEffect, useRef, useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const RAG_URL =
  process.env.NEXT_PUBLIC_RAG_URL || "https://paolo-rag.d-vettura.workers.dev";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  "What is his background?",
  "Which software does he use?",
  "What projects has he worked on?",
];

const Chat = (): JSX.Element => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${RAG_URL}/status`);
        const data = await res.json();
        if (!cancelled) setReady(Boolean(data.ingested));
      } catch {
        if (!cancelled) setReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${RAG_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      const text =
        res.ok && data.answer
          ? String(data.answer)
          : String(data.error || "I can't answer right now.");

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Connection error with the assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="rag-chat">
      <div className="rag-chat__header">
        <span className="rag-chat__title">Ask Paolo</span>
        <span className="rag-chat__status">
          {ready === null ? "…" : ready ? "online" : "no docs"}
        </span>
      </div>

      <div className="rag-chat__messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="rag-chat__empty">
            <p>Ask a question about the resume and projects.</p>
            <div className="rag-chat__suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rag-chat__chip"
                  onClick={() => ask(s)}
                  disabled={loading || ready === false}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rag-chat__bubble rag-chat__bubble--${msg.role}`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="rag-chat__bubble rag-chat__bubble--assistant rag-chat__bubble--loading">
            Searching…
          </div>
        )}
      </div>

      <form className="rag-chat__form" onSubmit={onSubmit}>
        <input
          className="rag-chat__input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question…"
          disabled={loading || ready === false}
          aria-label="Question for the assistant"
        />
        <button
          className="rag-chat__send"
          type="submit"
          disabled={loading || !input.trim() || ready === false}
          aria-label="Send"
        >
          <SendRoundedIcon fontSize="small" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
