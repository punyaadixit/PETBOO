import React, { useState } from 'react';
import { Star, MapPin, Clock, X, CheckCircle2, Scissors } from 'lucide-react';
import BookingModal from './BookingModal';

const getAvatarGradient = (name) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'linear-gradient(135deg, #059669, #0d9488)', // Emerald to Teal
    'linear-gradient(135deg, #0ea5e9, #2563eb)', // Sky to Blue
    'linear-gradient(135deg, #8b5cf6, #d946ef)', // Violet to Fuchsia
    'linear-gradient(135deg, #f97316, #e11d48)', // Orange to Rose
    'linear-gradient(135deg, #10b981, #047857)', // Green to Dark Green
  ];
  return gradients[hash % gradients.length];
};

export default function GroomerCard({ groomer, style }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleBook = (service) => {
    setSelectedService(service);
    setIsDialogOpen(false);
    setIsBookingOpen(true);
  };

  const initials = groomer.name.split(' ').map(n => n[0]).join('');
  const avatarGradient = getAvatarGradient(groomer.name);

  return (
    <>
      {/* ── Groomer Card ── */}
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #d1fae5',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...style
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
      >
        {/* top accent bar */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg, #34d399, #0d9488, #06b6d4)' }} />

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Avatar */}
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '50%',
            background: avatarGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1.2rem',
            marginBottom: '1rem', boxShadow: '0 4px 12px rgba(5,150,105,0.2)',
            border: '2px solid #fff',
          }}>
            {initials}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.25rem' }}>{groomer.name}</h3>
          <p style={{ color: '#059669', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0 0 0.5rem' }}>
            <MapPin size={13} /> {groomer.location}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" /> {groomer.rating}
            </span>
            <span style={{ background: '#ecfdf5', color: '#065f46', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {groomer.experienceYears}+ Yrs
            </span>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem', flex: 1,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {groomer.bio}
          </p>

          <button
            onClick={() => setIsDialogOpen(true)}
            style={{
              width: '100%', padding: '0.65rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #059669, #0d9488)',
              color: '#fff', fontWeight: 700, fontSize: '0.875rem',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Scissors size={15} /> View Details &amp; Book
          </button>
        </div>
      </div>

      {/* ── Detail Dialog ── */}
      {isDialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(2, 15, 10, 0.75)',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #0a1628 0%, #0d2e1f 50%, #091a10 100%)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.2)',
            width: '100%', maxWidth: '520px',
            maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid rgba(52,211,153,0.25)',
          }}>

            {/* Header */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              background: 'linear-gradient(90deg, #0a1628, #0d2e1f)',
              borderBottom: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '1.5rem 1.5rem 0 0',
              padding: '1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                  background: avatarGradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '1.2rem',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.2)',
                  flexShrink: 0,
                  border: '2px solid rgba(52,211,153,0.4)',
                }}>
                  {initials}
                </div>
                <div>
                  <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{groomer.name}</h2>
                  <p style={{ color: '#34d399', fontSize: '0.85rem', margin: '0.3rem 0 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={13} /> {groomer.location}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsDialogOpen(false)} style={{
                background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)',
                color: '#6ee7b7', borderRadius: '50%', width: '2.2rem', height: '2.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s',
                flexShrink: 0,
              }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Rating', value: groomer.rating, icon: <Star size={16} fill="#fbbf24" color="#fbbf24" />, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
                  { label: 'Yrs Exp', value: `${groomer.experienceYears}+`, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
                  { label: 'Reviews', value: groomer.reviews?.length || 0, color: '#67e8f9', bg: 'rgba(103,232,249,0.12)', border: 'rgba(103,232,249,0.3)' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: stat.bg, border: `1px solid ${stat.border}`,
                    borderRadius: '0.85rem', padding: '0.85rem', textAlign: 'center',
                  }}>
                    <div style={{ color: stat.color, fontWeight: 800, fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      {stat.icon}{stat.value}
                    </div>
                    <div style={{ color: stat.color, fontSize: '0.7rem', marginTop: '0.25rem', opacity: 0.8 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div>
                <h3 style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> About
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '1rem', margin: 0 }}>
                  {groomer.bio}
                </p>
              </div>

              {/* Services */}
              <div>
                <h3 style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Scissors size={16} /> Services
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {groomer.services?.map(service => (
                    <div key={service.id} style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(52,211,153,0.2)',
                      borderRadius: '0.85rem', padding: '1rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#f1f5f9', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{service.title}</h4>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.35rem' }}>{service.description}</p>
                        <span style={{ color: '#475569', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={11} /> {service.durationMins} mins
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <span style={{ color: '#34d399', fontWeight: 800, fontSize: '1.1rem' }}>₹{service.price}</span>
                        <button onClick={() => handleBook(service)} style={{
                          background: 'linear-gradient(135deg, #059669, #0d9488)',
                          color: '#fff', border: 'none', borderRadius: '0.6rem',
                          padding: '0.35rem 0.9rem', fontSize: '0.78rem', fontWeight: 700,
                          cursor: 'pointer',
                        }}>Book</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {groomer.reviews?.length > 0 && (
                <div>
                  <h3 style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Star size={16} fill="#fbbf24" color="#fbbf24" /> Reviews
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {groomer.reviews.map(review => (
                      <div key={review.id} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '0.85rem', padding: '0.85rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>{review.userName}</span>
                          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Star size={12} fill="#fbbf24" color="#fbbf24" /> {review.rating}
                          </span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.83rem', margin: 0 }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        groomer={groomer}
        service={selectedService}
        onBooked={() => {
          setIsBookingOpen(false);
          alert('Grooming appointment booked successfully! Check your bookings history.');
        }}
      />
    </>
  );
}
