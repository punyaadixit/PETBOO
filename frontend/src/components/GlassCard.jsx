import './GlassCard.css';

export default function GlassCard({ children, className = '', hover = true, glow, onClick, style }) {
  return (
    <div
      className={`glass-card ${hover ? 'glass-card--hover' : ''} ${glow ? `glass-card--glow-${glow}` : ''} ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
