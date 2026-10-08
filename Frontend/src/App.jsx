import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const suggestions = [
  {
    title: "Return an item",
    description: "Learn about returns and eligibility",
    prompt: "What is your return policy?"
  },
  {
    title: "Track my order",
    description: "Find the latest delivery updates",
    prompt: "How can I track my order?"
  },
  {
    title: "Talk to support",
    description: "Get help with a shopping question",
    prompt: "I need help with my purchase."
  }
];

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    bot: <><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M12 3v4m-4 5h.01M16 12h.01M8 17h8" /></>,
    chat: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-4-.9L4 20l1.2-3A7.4 7.4 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    paperclip: <path d="m18.5 11.5-6.8 6.8a4.2 4.2 0 0 1-6-6l7.4-7.4a2.8 2.8 0 0 1 4 4l-7.4 7.4a1.4 1.4 0 0 1-2-2l6.4-6.4" />,
    plus: <path d="M12 5v14M5 12h14" />,
    send: <><path d="m21 3-7.4 18-3.5-8.1L2 9.4 21 3Z" /><path d="M10.1 12.9 21 3" /></>,
    sparkle: <><path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3ZM19 16l.5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" /></>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>
  };

  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function StructuredAnswer({ content }) {
  const normalizedContent = content
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return (
    <div className="structured-answer">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
          h1: ({ node, ...props }) => <h3 className="answer-heading" {...props} />,
          h2: ({ node, ...props }) => <h3 className="answer-heading" {...props} />,
          h3: ({ node, ...props }) => <h3 className="answer-heading" {...props} />,
          ul: ({ node, ...props }) => <ul className="answer-list" {...props} />,
          ol: ({ node, ...props }) => <ol className="answer-list answer-list-ordered" {...props} />
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("Health check failed");
        setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function submitQuestion(event, preset = question) {
    event?.preventDefault();
    const trimmedQuestion = preset.trim();
    if (!trimmedQuestion || isLoading) return;

    setQuestion("");
    setMessages((current) => [...current, { role: "user", content: trimmedQuestion }]);
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "The support service is unavailable.");
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
      setApiOnline(true);
    } catch (error) {
      setApiOnline(false);
      setMessages((current) => [...current, {
        role: "assistant",
        error: true,
        content: `${error.message} Please check that the backend is running on port 5001 and try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function startNewChat() {
    setMessages([]);
    setQuestion("");
    inputRef.current?.focus();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="sparkle" size={19} /></div>
          <span>ShopSphere</span>
        </div>

        <button className="new-chat-button" onClick={startNewChat}><Icon name="plus" size={17} /> New conversation</button>

        <div className="side-section">
          <p className="side-label">Workspace</p>
          <button className="side-link active"><Icon name="chat" size={18} /> Support assistant</button>
        </div>

        <div className="side-section history-section">
          <p className="side-label">Recent</p>
          {messages.length > 0 ? (
            <button className="history-item active-history" onClick={() => inputRef.current?.focus()}>
              <Icon name="clock" size={16} /> Current conversation
            </button>
          ) : <p className="empty-history">Your conversations will appear here.</p>}
        </div>

        <div className="sidebar-footer">
          <div className="status-row"><span className={`status-dot ${apiOnline === false ? "offline" : ""}`} /> {apiOnline === false ? "Service offline" : "AI assistant online"}</div>
          <p>Answers are grounded in ShopSphere documents.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark"><Icon name="sparkle" size={17} /></div> ShopSphere</div>
          <div className="topbar-title"><span>Support assistant</span><span className="topbar-divider">/</span><span className="muted">Customer care</span></div>
          <button className="clear-button" onClick={startNewChat} disabled={!messages.length}><Icon name="trash" size={16} /> Clear chat</button>
        </header>

        <section className={`chat-area ${messages.length ? "has-messages" : ""}`}>
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon"><Icon name="bot" size={30} /></div>
              <p className="eyebrow">SHOPSPHERE SUPPORT</p>
              <h1>How can we help<br /><em>you today?</em></h1>
              <p className="welcome-copy">Ask me anything about your orders, returns, or shopping with ShopSphere.</p>
              <div className="suggestion-grid">
                {suggestions.map((suggestion) => (
                  <button className="suggestion-card" key={suggestion.title} onClick={() => submitQuestion(null, suggestion.prompt)}>
                    <span><strong>{suggestion.title}</strong><small>{suggestion.description}</small></span>
                    <Icon name="arrow" size={17} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="conversation">
              <div className="conversation-intro"><span className="status-dot" /> ShopSphere support <span>•</span> Answers from your knowledge base</div>
              {messages.map((message, index) => (
                <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
                  <div className={`avatar ${message.role} ${message.error ? "error-avatar" : ""}`}><Icon name={message.role === "user" ? "user" : "bot"} size={17} /></div>
                  <div className="message-body">
                    <div className="message-meta">{message.role === "user" ? "You" : "ShopSphere AI"} <span>{message.role === "assistant" && "· just now"}</span></div>
                    <div className={`message-bubble ${message.error ? "error-bubble" : ""}`}>
                      {message.role === "assistant" && !message.error ? <StructuredAnswer content={message.content} /> : message.content}
                    </div>
                    {message.role === "assistant" && !message.error && <button className="copy-button" onClick={() => navigator.clipboard?.writeText(message.content)}><Icon name="copy" size={14} /> Copy answer</button>}
                  </div>
                </div>
              ))}
              {isLoading && <div className="message-row assistant"><div className="avatar assistant"><Icon name="bot" size={17} /></div><div className="message-body"><div className="message-meta">ShopSphere AI <span>· thinking</span></div><div className="message-bubble loading-bubble"><i /><i /><i /></div></div></div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </section>

        <div className="composer-wrap">
          <form className="composer" onSubmit={submitQuestion}>
            <button type="button" className="attach-button" aria-label="Attach a file"><Icon name="paperclip" size={19} /></button>
            <input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about orders, returns, shipping..." maxLength={500} disabled={isLoading} />
            <span className="character-count">{question.length}/500</span>
            <button type="submit" className="send-button" aria-label="Send message" disabled={!question.trim() || isLoading}><Icon name="send" size={18} /></button>
          </form>
          <p className="composer-note"><Icon name="sparkle" size={13} /> ShopSphere AI can make mistakes. Check important details with our team.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
