import { Star } from 'lucide-react';
import './StarRating.css';

export default function StarRating({ rating = 0, max = 5, size = 16, interactive = false, onChange }) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    const filled = i <= Math.floor(rating);
    const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.3;

    stars.push(
      <button
        key={i}
        type="button"
        className={`star-rating__star ${filled ? 'filled' : ''} ${half ? 'half' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive ? () => onChange?.(i) : undefined}
        disabled={!interactive}
        title={interactive ? `${i} star${i > 1 ? 's' : ''}` : undefined}
      >
        <Star size={size} fill={filled || half ? 'currentColor' : 'none'} />
      </button>
    );
  }

  return <div className="star-rating">{stars}</div>;
}
