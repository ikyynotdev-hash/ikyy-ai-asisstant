import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message) return;

    setChat((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`/api/chat?message=${encodeURIComponent(message)}`);
      const data = await res.json();
      setChat((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (err) {
      setChat((prev) => [...prev, { role: "ai", content: "Terjadi error saat memanggil AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>ikyy-AI Assistant</h1>
      <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", minHeight: "400px", overflowY: "auto", background: "#f9f9f9" }}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: c.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                background: c.role === "user" ? "#4f46e5" : "#e5e7eb",
                color: c.role === "user" ? "#fff" : "#000",
                padding: "0.5rem 1rem",
                borderRadius: "15px",
                maxWidth: "70%",
                whiteSpace: "pre-line",
              }}
            >
              {c.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "0.5rem" }}>
            <div style={{ background: "#e5e7eb", color: "#000", padding: "0.5rem 1rem", borderRadius: "15px" }}>
              AI sedang mengetik...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "0.5rem 1rem", background: "#4f46e5", color: "#fff", borderRadius: "5px", border: "none" }}
        >
          Kirim
        </button>
      </div>
    </div>
  );
  }
