import { useState, useEffect, useRef } from 'react';
import { Send, Plus, MessageCircle, Sparkles, Bot, User } from 'lucide-react';
import { api } from '../lib/api';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './ChatPage.css';

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Fetch sessions and history on mount */
  useEffect(() => {
    async function load() {
      try {
        const [sessRes, histRes] = await Promise.allSettled([
          api.get('/ai/chat/sessions'),
          api.get('/ai/chat/history'),
        ]);
        const fetchedSessions = sessRes.status === 'fulfilled' ? sessRes.value.sessions || [] : [];
        const fetchedHistory = histRes.status === 'fulfilled' ? histRes.value.history || [] : [];
        setSessions(fetchedSessions);
        setAllHistory(fetchedHistory);

        if (fetchedSessions.length > 0) {
          const firstSid = fetchedSessions[0].sessionId;
          setActiveSession(firstSid);
          setMessages(fetchedHistory.filter(m => m.sessionId === firstSid));
        }
      } catch (err) {
        console.error('Failed to load chat data:', err);
      } finally {
        setLoadingSessions(false);
      }
    }
    load();
  }, []);

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Select session */
  const selectSession = (sid) => {
    setActiveSession(sid);
    setMessages(allHistory.filter(m => m.sessionId === sid));
  };

  /* Create new session */
  const newSession = () => {
    const sid = generateId();
    setActiveSession(sid);
    setMessages([]);
    inputRef.current?.focus();
  };

  /* Send message */
  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const sessionId = activeSession || generateId();
    if (!activeSession) setActiveSession(sessionId);

    const userMsg = { role: 'user', text, sessionId };
    setMessages(prev => [...prev, userMsg]);
    setAllHistory(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: text, sessionId });
      const botMsg = { role: 'bot', text: res.reply, sessionId };
      setMessages(prev => [...prev, botMsg]);
      setAllHistory(prev => [...prev, botMsg]);

      /* Update session list */
      setSessions(prev => {
        if (prev.some(s => s.sessionId === sessionId)) return prev;
        return [{ sessionId, title: text }, ...prev];
      });
    } catch (err) {
      const errMsg = { role: 'bot', text: `Sorry, something went wrong: ${err.message}`, sessionId };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar: Sessions */}
      <div className="chat-sidebar glass">
        <div className="chat-sidebar__header">
          <h3><MessageCircle size={18} /> Chats</h3>
          <button className="btn btn-sm btn-primary" onClick={newSession}>
            <Plus size={14} />
          </button>
        </div>

        {loadingSessions ? (
          <div style={{ padding: 12 }}><LoadingSkeleton variant="chat" count={4} /></div>
        ) : sessions.length === 0 ? (
          <div className="chat-sidebar__empty">
            <small>No conversations yet</small>
          </div>
        ) : (
          <div className="chat-sidebar__list">
            {sessions.map((s) => (
              <button
                key={s.sessionId}
                className={`chat-sidebar__item ${activeSession === s.sessionId ? 'chat-sidebar__item--active' : ''}`}
                onClick={() => selectSession(s.sessionId)}
              >
                <MessageCircle size={14} />
                <span className="truncate">{s.title || 'New chat'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="chat-main glass">
        {!activeSession && messages.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Start a conversation"
            description="Ask Cuddles anything about pet care, health, nutrition, or training."
            action={
              <button className="btn btn-primary" onClick={newSession}>
                <Plus size={16} /> New Chat
              </button>
            }
          />
        ) : (
          <>
            {/* Messages */}
            <div className="chat-messages">
              {/* Welcome message */}
              <div className="chat-bubble chat-bubble--bot">
                <div className="chat-bubble__avatar chat-bubble__avatar--bot">
                  <Bot size={16} />
                </div>
                <div className="chat-bubble__content">
                  <strong>Cuddles AI</strong>
                  <p>Hi! 🐾 I'm Cuddles, your pet health assistant. How can I help you today?</p>
                </div>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble chat-bubble--${msg.role === 'user' ? 'user' : 'bot'}`}>
                  <div className={`chat-bubble__avatar chat-bubble__avatar--${msg.role === 'user' ? 'user' : 'bot'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className="chat-bubble__content">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="chat-bubble chat-bubble--bot">
                  <div className="chat-bubble__avatar chat-bubble__avatar--bot">
                    <Bot size={14} />
                  </div>
                  <div className="chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input" onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                className="chat-input__field input-field"
                placeholder="Ask Cuddles anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={sending}
              />
              <button type="submit" className="btn btn-primary chat-input__send" disabled={sending || !input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
