import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      animation: 'fade-in 0.4s ease-out',
    }}>
      <div style={{
        width: 72,
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        marginBottom: 20,
        color: 'var(--text-tertiary)',
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', maxWidth: 320, marginBottom: action ? 20 : 0 }}>{description}</p>}
      {action}
    </div>
  );
}
