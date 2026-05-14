import './LoadingSkeleton.css';

export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className={`skeleton skeleton--${variant}`}>
      {variant === 'card' && (
        <>
          <div className="skeleton__line skeleton__line--lg" />
          <div className="skeleton__line skeleton__line--md" />
          <div className="skeleton__line skeleton__line--sm" />
        </>
      )}
      {variant === 'chat' && (
        <div className="skeleton__bubble" />
      )}
      {variant === 'stat' && (
        <>
          <div className="skeleton__circle" />
          <div className="skeleton__lines">
            <div className="skeleton__line skeleton__line--sm" />
            <div className="skeleton__line skeleton__line--xs" />
          </div>
        </>
      )}
    </div>
  ));
}
