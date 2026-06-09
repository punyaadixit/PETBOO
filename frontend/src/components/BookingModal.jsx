import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, PawPrint, FileText, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

export default function BookingModal({ isOpen, onClose, groomer, service, onBooked }) {
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState('');
  const [petName, setPetName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/pets')
        .then(res => {
          const list = res.pets || [];
          setPets(list);
          if (list.length > 0) setPetId(list[0].id);
        })
        .catch(() => setPets([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reset = () => {
    setDate('');
    setTime('');
    setNotes('');
    setPetId('');
    setPetName('');
    setIsSuccess(false);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const selectedPetId = petId || null;
      const combinedDate = date + 'T' + time;

      const payload = {
        groomerId: groomer?.id,
        petId: selectedPetId,
        serviceId: service?.id,
        appointmentDate: combinedDate,
        notes: notes || `Grooming appointment for ${petName || pets.find(p => p.id === petId)?.name || 'N/A'}`
      };

      await api.post('/groomers/bookings', payload);
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
        onBooked?.();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#fff', borderRadius: '1.5rem',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        width: '100%', maxWidth: 480,
        overflow: 'hidden',
        animation: 'zoomIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>Book Grooming Session</h2>
            {groomer && (
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '0.25rem 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} /> {groomer.name} • {service?.title}
              </p>
            )}
          </div>
          <button onClick={handleClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
          }}>
            <X size={17} />
          </button>
        </div>

        {isSuccess ? (
          /* ── Success ── */
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem', boxShadow: '0 8px 20px rgba(16,185,129,0.3)',
            }}>
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.25rem', margin: '0 0 0.5rem' }}>Session Booked! 🎉</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Your appointment with <strong>{groomer?.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong> is confirmed.
            </p>
            <p style={{ color: '#059669', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.85rem' }}>
              A confirmation email has been dispatched.
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Service pricing card */}
            {service && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#065f46', fontSize: '0.875rem' }}>{service.title} ({service.durationMins} mins)</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>₹{service.price}</span>
              </div>
            )}

            {/* Pet selection */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>
                <PawPrint size={13} style={{ display: 'inline', marginRight: 4 }} /> Select Pet
              </label>
              {pets.length > 0 ? (
                <select
                  value={petId}
                  onChange={e => setPetId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff' }}
                >
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type="text"
                  placeholder="Enter your pet's name"
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              )}
            </div>

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>
                  <CalendarIcon size={13} style={{ display: 'inline', marginRight: 4 }} /> Date
                </label>
                <input
                  required type="date" value={date} min={today}
                  onChange={e => setDate(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>
                  <Clock size={13} style={{ display: 'inline', marginRight: 4 }} /> Time
                </label>
                <input
                  required type="time" value={time}
                  onChange={e => setTime(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>
                <FileText size={13} style={{ display: 'inline', marginRight: 4 }} /> Special Notes (optional)
              </label>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="E.g. sensitive skin, afraid of blow dryers..."
                rows={3}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', background: '#fef2f2', padding: '0.6rem 1rem', borderRadius: '0.65rem', margin: 0 }}>{error}</p>
            )}

            <button type="submit" disabled={isSubmitting} style={{
              width: '100%', padding: '0.85rem', borderRadius: '0.85rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.95rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              {isSubmitting ? 'Booking...' : 'Confirm Session'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
