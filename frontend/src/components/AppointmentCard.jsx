import { Calendar, Clock, Video, Phone, MessageCircle, MapPin, FileText, X } from 'lucide-react';
import './AppointmentCard.css';

const TYPE_CONFIG = {
  'in-person': { icon: MapPin, label: 'In-Person', color: 'blue' },
  'video': { icon: Video, label: 'Video Call', color: 'purple' },
  'audio': { icon: Phone, label: 'Audio Call', color: 'teal' },
  'chat': { icon: MessageCircle, label: 'Chat', color: 'green' },
};

const STATUS_CONFIG = {
  'upcoming': { label: 'Upcoming', color: 'blue' },
  'completed': { label: 'Completed', color: 'green' },
  'cancelled': { label: 'Cancelled', color: 'red' },
};

export default function AppointmentCard({ appointment, onCancel, onReschedule, onJoin, onViewPrescription }) {
  const { vet, pet, date, time, type, status, prescription } = appointment;
  const typeInfo = TYPE_CONFIG[type] || TYPE_CONFIG['in-person'];
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG['upcoming'];
  const TypeIcon = typeInfo.icon;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className={`appointment-card appointment-card--${status}`}>
      <div className="appointment-card__top">
        <div className="appointment-card__pet-avatar">🐾</div>
        <div className="appointment-card__info">
          <h4 className="appointment-card__pet-name">{pet?.name || 'Unknown Pet'}</h4>
          <p className="appointment-card__vet-name">with {vet?.name || 'Unknown Vet'}</p>
          <span className="appointment-card__clinic">{vet?.clinic}</span>
        </div>
        <div className="appointment-card__badges">
          <span className={`badge badge--${statusInfo.color}`}>{statusInfo.label}</span>
          <span className={`badge badge--${typeInfo.color} badge--outline`}>
            <TypeIcon size={12} />
            {typeInfo.label}
          </span>
        </div>
      </div>

      <div className="appointment-card__middle">
        <div className="appointment-card__datetime">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <div className="appointment-card__datetime">
          <Clock size={14} />
          <span>{time}</span>
        </div>
        {appointment.notes && (
          <div className="appointment-card__notes">
            <FileText size={14} />
            <span>{appointment.notes}</span>
          </div>
        )}
      </div>

      <div className="appointment-card__actions">
        {status === 'upcoming' && (
          <>
            {(type === 'video' || type === 'audio' || type === 'chat') && (
              <button className="btn btn-sm btn-primary" onClick={() => onJoin?.(appointment)}>
                <TypeIcon size={14} />
                Join {typeInfo.label}
              </button>
            )}
            <button className="btn btn-sm btn-secondary" onClick={() => onReschedule?.(appointment)}>
              Reschedule
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => onCancel?.(appointment)}>
              <X size={14} />
              Cancel
            </button>
          </>
        )}
        {status === 'completed' && prescription && (
          <button className="btn btn-sm btn-secondary" onClick={() => onViewPrescription?.(appointment)}>
            <FileText size={14} />
            View Prescription
          </button>
        )}
      </div>
    </div>
  );
}
