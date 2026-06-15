import React, { useState, useRef, useEffect } from 'react';
import './GlobalChat.css';
import { ChatDotsFill, XCircleFill, SendFill } from 'react-bootstrap-icons';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const WELCOME =
  "👋 Hi! I'm PharmaLink's assistant.\n\nI can help you:\n• Find medicines & prices\n• Locate pharmacies\n• Navigate the platform\n• Answer account questions\n\nWhat can I help you with?";

// ── Intent classifier ─────────────────────────────────────────────────────
function detectIntent(text) {
  const t = text.toLowerCase();
  if (/^(hi|hello|hey|good\s|مرحبا|اهلا|السلام)/.test(t)) return 'greeting';
  if (/(help|what can you|commands|options|what do you do)/.test(t)) return 'help';
  if (/(sign.?up|register|create.?account|new account|انشاء حساب)/.test(t)) return 'signup';
  if (/(sign.?in|log.?in|login|تسجيل الدخول)/.test(t)) return 'signin';
  if (/(my order|track order|order status|delivery|dashboard)/.test(t)) return 'orders';
  if (/(pharmacy|pharmacies|nearest|near me|صيدلية|صيدليات)/.test(t)) return 'pharmacy';
  if (/(medicine|medication|drug|pill|tablet|capsule|find|search|need|looking for|available|stock|price|cost|how much|دواء|علاج)/.test(t)) return 'medicine';
  return 'unknown';
}

// ── Response generator (uses real APIs) ───────────────────────────────────
async function generateResponse(userMessage) {
  const intent = detectIntent(userMessage);

  switch (intent) {
    case 'greeting':
      return "Hello! 😊 Great to see you. How can I assist you today?";

    case 'help':
      return (
        "Here's what I can help with:\n\n" +
        "🔍 Medicine lookup — \"Find Paracetamol\"\n" +
        "💰 Pricing — \"Price of Ibuprofen\"\n" +
        "🏪 Pharmacies — \"Show me pharmacies\"\n" +
        "📦 Orders — \"Where are my orders?\"\n" +
        "🔑 Account — \"How do I sign up?\"\n\n" +
        "Just type naturally!"
      );

    case 'signup':
      return (
        "To create an account:\n\n" +
        "1. Click 'Get Started' on the Home page\n" +
        "2. Choose your role: Client, Pharmacy, or Warehouse\n" +
        "3. Fill in your details and submit\n\n" +
        "You'll be taken to your dashboard right away! ✅"
      );

    case 'signin':
      return (
        "To sign in, go to the Sign In page and enter your email and password.\n\n" +
        "Forgot your password? Use the 'Forgot Password' link on the sign-in page — we'll send a reset link to your email."
      );

    case 'orders':
      return (
        "You can view and track your orders in your Client Dashboard.\n\n" +
        "Sign in first, then navigate to your dashboard to see all orders and their current status."
      );

    case 'pharmacy': {
      try {
        const res = await fetch(`${API_BASE}/pharm-info`);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          return "I couldn't load pharmacy info right now. Please use the Search page to browse pharmacies.";
        }
        const sample = data.slice(0, 5);
        const list = sample
          .map((p) => `• ${p.pharm_name}${p.area ? ` — ${p.area}` : ''}`)
          .join('\n');
        return `Here are some pharmacies on PharmaLink:\n\n${list}\n\nWe have ${data.length} registered pharmacies in total. Use the Search page to find medicines near you.`;
      } catch {
        return "I'm having trouble loading pharmacy data right now. Please use the Search page to find pharmacies.";
      }
    }

    case 'medicine': {
      // Strip intent words to isolate the medicine name
      const stripped = userMessage
        .replace(
          /(find|search|look for|do you have|where can i (find|get)|need|looking for|price of|cost of|how much is|is|available|in stock|a|the)/gi,
          ' '
        )
        .replace(/[?!,.؟]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      if (!stripped || stripped.length < 2) {
        return "What medicine are you looking for? Just type the name — for example, \"Find Paracetamol\".";
      }

      try {
        const res = await fetch(
          `${API_BASE}/medications/search?query=${encodeURIComponent(stripped)}`
        );

        let results = [];
        if (res.ok) {
          const data = await res.json();
          results = data.results || (Array.isArray(data) ? data : []);
        }

        if (results.length === 0) {
          // Fallback: try full medications list
          const fallback = await fetch(`${API_BASE}/medications`);
          if (fallback.ok) {
            const all = await fallback.json();
            results = all.filter((m) =>
              m.medication_name?.toLowerCase().includes(stripped.toLowerCase())
            );
          }
        }

        if (results.length === 0) {
          return `I couldn't find "${stripped}" in our database. Try a different spelling, or browse all medicines on the Search page.`;
        }

        const top = results.slice(0, 4);
        const list = top
          .map((m) => {
            const price = m.lowest_price
              ? `${Number(m.lowest_price).toFixed(2)} EGP`
              : 'price varies';
            return `• ${m.medication_name} — ${price}`;
          })
          .join('\n');

        const extra =
          results.length > 4
            ? `\n\n...and ${results.length - 4} more. Visit the Search page for full results.`
            : '\n\nClick any result on the Search page to see which pharmacies carry it.';

        return `Found ${results.length} result(s) for "${stripped}":\n\n${list}${extra}`;
      } catch {
        return `I couldn't fetch medicine data right now. Please try the Search page for "${stripped}".`;
      }
    }

    default:
      return (
        "I'm not sure I understand that. 🤔\n\n" +
        "Try asking:\n" +
        "• \"Find Amoxicillin\"\n" +
        "• \"Show me pharmacies\"\n" +
        "• \"How do I sign up?\"\n\n" +
        "Type \"help\" to see everything I can do."
      );
  }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: WELCOME, time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: 'bot', text: response, time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'bot',
          text: 'Sorry, something went wrong. Please try again.',
          time: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="global-chat-container">
      {isOpen && (
        <div className="chat-window shadow-lg">
          {/* Header */}
          <div className="chat-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="chat-online-dot" />
              <div>
                <div className="chat-header-title">PharmaLink Support</div>
                <div className="chat-header-sub">Online • AI Assistant</div>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <XCircleFill size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-row ${msg.from === 'user' ? 'chat-row--user' : 'chat-row--bot'}`}
              >
                {msg.from === 'bot' && (
                  <div className="chat-avatar">
                    <ChatDotsFill size={14} />
                  </div>
                )}
                <div className={`chat-bubble ${msg.from === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot'}`}>
                  <div className="chat-bubble-text">{msg.text}</div>
                  <div className="chat-bubble-time">{fmt(msg.time)}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-row chat-row--bot">
                <div className="chat-avatar">
                  <ChatDotsFill size={14} />
                </div>
                <div className="chat-bubble chat-bubble--bot">
                  <div className="chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-footer">
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              autoComplete="off"
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <SendFill size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className="chat-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle chat"
      >
        <ChatDotsFill size={24} />
      </button>
    </div>
  );
}
