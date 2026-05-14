import { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { api } from '../lib/api';
import GlassCard from '../components/GlassCard';
import './AdminPage.css';

export default function AdminPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/admin/knowledge', { text: text.trim() });
      setStatus('success');
      setMessage('Knowledge document ingested successfully! The RAG system can now use this context.');
      setText('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to ingest document.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2><Shield size={22} /> Admin Panel</h2>
        <p>Manage the Cuddles AI knowledge base by ingesting new documents.</p>
      </div>

      <div className="admin-page__grid">
        {/* Ingestion Form */}
        <GlassCard className="admin-card" glow="purple">
          <div className="admin-card__header">
            <div className="admin-card__icon">
              <Upload size={20} />
            </div>
            <div>
              <h3>Ingest Knowledge</h3>
              <small>Add text to the AI knowledge base for RAG retrieval</small>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Knowledge Content</label>
              <textarea
                className="input-field admin-form__textarea"
                placeholder="Paste pet care knowledge, vet guidelines, company policies, product info, or any text you want Cuddles AI to learn…"
                value={text}
                onChange={e => setText(e.target.value)}
                required
              />
            </div>
            <div className="admin-form__footer">
              <span className="admin-form__char-count">{text.length} characters</span>
              <button type="submit" className="btn btn-primary" disabled={submitting || !text.trim()}>
                {submitting ? <div className="spinner" /> : (
                  <>
                    <Upload size={16} /> Ingest Document
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Status Toast */}
          {status && (
            <div className={`admin-toast admin-toast--${status}`}>
              {status === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span>{message}</span>
            </div>
          )}
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="admin-info" glow="teal">
          <div className="admin-card__header">
            <div className="admin-card__icon admin-card__icon--teal">
              <BookOpen size={20} />
            </div>
            <div>
              <h3>How RAG Works</h3>
              <small>Retrieval-Augmented Generation pipeline</small>
            </div>
          </div>
          <div className="admin-info__steps">
            <div className="admin-info__step">
              <span className="admin-info__step-num">1</span>
              <div>
                <strong>Ingest</strong>
                <p>Text is converted to a 384-dim vector using MiniLM-L6-v2</p>
              </div>
            </div>
            <div className="admin-info__step">
              <span className="admin-info__step-num">2</span>
              <div>
                <strong>Store</strong>
                <p>Vector is stored in PostgreSQL with pgvector extension</p>
              </div>
            </div>
            <div className="admin-info__step">
              <span className="admin-info__step-num">3</span>
              <div>
                <strong>Retrieve</strong>
                <p>User queries are matched against stored vectors by cosine similarity</p>
              </div>
            </div>
            <div className="admin-info__step">
              <span className="admin-info__step-num">4</span>
              <div>
                <strong>Generate</strong>
                <p>Top-2 results are injected into the system prompt for Groq LLM</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
