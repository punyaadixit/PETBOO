import { useState, useEffect } from 'react';
import { Calendar, Clock, Scissors, X, Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './BookingHistory.css';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelModal, setCancelModal] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/groomers/bookings/my-bookings');
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Failed to fetch grooming bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter(b => {
      const bookingDate = new Date(b.appointmentDate);
      const isPast = bookingDate < now;
      
      if (activeTab === 'upcoming') {
        return (b.status === 'pending' || b.status === 'confirmed') && !isPast;
      }
      if (activeTab === 'completed') {
        return b.status === 'completed' || ((b.status === 'confirmed' || b.status === 'pending') && isPast);
      }
      if (activeTab === 'cancelled') {
        return b.status === 'cancelled';
      }
      return true;
    });
  };

  const handleCancelBooking = async () => {
    if (!cancelModal) return;
    setIsCancelling(true);
    try {
      await api.patch(`/groomers/bookings/${cancelModal.id}/cancel`);
      await fetchBookings();
      setCancelModal(null);
    } catch (err) {
      alert(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const filtered = getFilteredBookings();

  if (loading) {
    return (
      <div className="bookings-page">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="bookings-page">
      {/* Header */}
      <div className="bookings-page__header">
        <div>
          <h2>My Grooming Bookings</h2>
          <p>{bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length} active sessions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/grooming')}>
          <Plus size={18} />
          Book Groomer
        </button>
      </div>

      {/* Tabs */}
      <div className="bookings-page__tabs">
        {TABS.map(tab => {
          const tabCount = bookings.filter(b => {
            const bookingDate = new Date(b.appointmentDate);
            const isPast = bookingDate < new Date();
            if (tab.key === 'upcoming') return (b.status === 'pending' || b.status === 'confirmed') && !isPast;
            if (tab.key === 'completed') return b.status === 'completed' || ((b.status === 'confirmed' || b.status === 'pending') && isPast);
            if (tab.key === 'cancelled') return b.status === 'cancelled';
            return false;
          }).length;

          return (
            <button
              key={tab.key}
              className={`bookings-page__tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="bookings-page__tab-count">{tabCount}</span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title={`No ${activeTab} grooming sessions`}
          description={activeTab === 'upcoming'
            ? 'Find a professional stylist for your pet to schedule a session.'
            : `You have no ${activeTab} grooming sessions.`}
          action={activeTab === 'upcoming' ? (
            <button className="btn btn-primary" onClick={() => navigate('/grooming')}>
              <Plus size={16} /> Find a Groomer
            </button>
          ) : undefined}
        />
      ) : (
        <div className="bookings-page__list">
          {filtered.map(booking => {
            const groomerName = booking.groomerName || booking.groomer?.name || 'Professional Groomer';
            const serviceTitle = booking.serviceTitle || booking.service?.title || 'Spa Treatment';
            const petName = booking.petName || booking.pet?.name || 'My Pet';
            const price = booking.price || booking.service?.price || '0';

            const bookingDate = new Date(booking.appointmentDate);
            const formattedDate = bookingDate.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            const formattedTime = bookingDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card__main">
                  <div className="booking-card__info">
                    <h3>{serviceTitle}</h3>
                    <div className="booking-card__subtitle">
                      with <strong>{groomerName}</strong> for <strong>{petName}</strong>
                    </div>
                  </div>
                  <span className={`booking-card__status booking-card__status--${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-card__details">
                  <div className="booking-card__detail-item">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="booking-card__detail-item">
                    <Clock size={14} />
                    <span>{formattedTime}</span>
                  </div>
                </div>

                {booking.notes && (
                  <div style={{
                    fontSize: '0.813rem',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginTop: '4px',
                    borderLeft: '3px solid var(--accent-green)'
                  }}>
                    <strong>Notes:</strong> {booking.notes}
                  </div>
                )}

                <div className="booking-card__actions">
                  <span className="booking-card__price">₹{price}</span>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && new Date(booking.appointmentDate) > new Date() && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      onClick={() => setCancelModal(booking)}
                    >
                      <X size={14} style={{ marginRight: 4 }} />
                      Cancel Session
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal open={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Grooming Session?" width={400}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
            Are you sure you want to cancel the <strong>{cancelModal?.serviceTitle || cancelModal?.service?.title || 'grooming'}</strong> session with <strong>{cancelModal?.groomerName || cancelModal?.groomer?.name}</strong>?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setCancelModal(null)}>Keep Booking</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleCancelBooking} disabled={isCancelling}>
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
