import { MapPin, Clock, Stethoscope, IndianRupee, Navigation } from 'lucide-react';
import StarRating from './StarRating';
import './VetCard.css';

export default function VetCard({ vet, distance, onViewProfile, onBook, style }) {
  const initials = vet.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');

  return (
    <div className="vet-card glass-card" style={style}>
      {/* Distance Badge */}
      {distance !== null && distance !== undefined && (
        <div className="vet-card__distance-badge">
          <Navigation size={11} />
          <span>{distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance} km`}</span>
        </div>
      )}

      <div className="vet-card__header">
        <div className="vet-card__avatar">
          {vet.imageUrl ? (
            <img src={vet.imageUrl} alt={vet.name} />
          ) : (
            <span>{initials}</span>
          )}
          <span className={`vet-card__status ${vet.isAvailable ? 'available' : 'unavailable'}`} />
        </div>
        <div className="vet-card__info">
          <h3 className="vet-card__name">{vet.name}</h3>
          <span className="vet-card__spec">
            <Stethoscope size={13} />
            {vet.specialization}
          </span>
        </div>
      </div>

      <div className="vet-card__details">
        <div className="vet-card__detail">
          <MapPin size={14} />
          <span>{vet.clinic}, {vet.city}</span>
        </div>
        <div className="vet-card__detail">
          <Clock size={14} />
          <span>{vet.experience} yrs experience</span>
        </div>
        <div className="vet-card__detail">
          <IndianRupee size={14} />
          <span>₹{vet.consultationFee} / consultation</span>
        </div>
      </div>

      <div className="vet-card__footer">
        <div className="vet-card__rating">
          <StarRating rating={vet.rating} size={14} />
          <span className="vet-card__rating-text">
            {vet.rating} ({vet.reviewCount})
          </span>
        </div>
        <div className="vet-card__actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onViewProfile?.(vet)}>
            Profile
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onBook?.(vet)}
            disabled={!vet.isAvailable}
          >
            {vet.isAvailable ? 'Book' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
