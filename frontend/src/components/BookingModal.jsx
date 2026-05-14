import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Phone, MessageCircle, MapPin, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { api } from '../lib/api';
import Modal from './Modal';
import './BookingModal.css';

const CONSULTATION_TYPES = [
  { value: 'in-person', label: 'In-Person', icon: MapPin, description: 'Visit the clinic' },
  { value: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face online' },
  { value: 'audio', label: 'Audio Call', icon: Phone, description: 'Phone consultation' },
  { value: 'chat', label: 'Chat', icon: MessageCircle, description: 'Text consultation' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export default function BookingModal({ open, onClose, vet, onBooked }) {
  const [step, setStep] = useState(1);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    petId: '',
    type: 'in-person',
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ petId: '', type: 'in-person', date: '', time: '', notes: '' });
      setLoading(true);
      api.get('/pets')
        .then(res => setPets(res.pets || []))
        .catch(() => setPets([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const today = new Date().toISOString().split('T')[0];

  const handleBook = async () => {
    setSaving(true);
    try {
      const res = await api.post('/appointments', {
        petId: form.petId,
        vetId: vet.id,
        date: form.date,
        time: form.time,
        type: form.type,
        notes: form.notes,
      });
      onBooked?.(res.appointment);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to book appointment');
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!form.petId;
    if (step === 2) return !!form.type;
    if (step === 3) return !!form.date && !!form.time;
    return true;
  };

  const selectedPet = pets.find(p => p.id === form.petId);

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment" width={520}>
      <div className="booking-modal">
        {/* Progress Steps */}
        <div className="booking-modal__steps">
          {['Select Pet', 'Type', 'Date & Time', 'Confirm'].map((label, i) => (
            <div key={i} className={`booking-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="booking-step__dot">
                {step > i + 1 ? <Check size={12} /> : i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Select Pet */}
        {step === 1 && (
          <div className="booking-modal__content">
            <h4>Which pet needs care?</h4>
            {loading ? (
              <div className="booking-modal__loading"><div className="spinner" /></div>
            ) : (
              <div className="booking-modal__pet-grid">
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    className={`booking-pet-option ${form.petId === pet.id ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, petId: pet.id }))}
                  >
                    <span className="booking-pet-option__emoji">🐾</span>
                    <strong>{pet.name}</strong>
                    <small>{pet.breed}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Consultation Type */}
        {step === 2 && (
          <div className="booking-modal__content">
            <h4>How would you like to consult?</h4>
            <div className="booking-modal__type-grid">
              {CONSULTATION_TYPES.map(ct => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.value}
                    className={`booking-type-option ${form.type === ct.value ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, type: ct.value }))}
                  >
                    <Icon size={22} />
                    <strong>{ct.label}</strong>
                    <small>{ct.description}</small>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="booking-modal__content">
            <h4>Pick a date and time</h4>
            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                className="input-field"
                min={today}
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="input-group" style={{ marginTop: 16 }}>
              <label>Available Time Slots</label>
              <div className="booking-modal__time-grid">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    className={`booking-time-slot ${form.time === slot ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, time: slot }))}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginTop: 16 }}>
              <label>Notes (optional)</label>
              <textarea
                className="input-field"
                placeholder="Describe the issue..."
                rows={2}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="booking-modal__content">
            <h4>Confirm Your Appointment</h4>
            <div className="booking-summary">
              <div className="booking-summary__row">
                <span>Pet</span>
                <strong>{selectedPet?.name} ({selectedPet?.breed})</strong>
              </div>
              <div className="booking-summary__row">
                <span>Doctor</span>
                <strong>{vet?.name}</strong>
              </div>
              <div className="booking-summary__row">
                <span>Clinic</span>
                <strong>{vet?.clinic}</strong>
              </div>
              <div className="booking-summary__row">
                <span>Type</span>
                <strong>{CONSULTATION_TYPES.find(ct => ct.value === form.type)?.label}</strong>
              </div>
              <div className="booking-summary__row">
                <span>Date</span>
                <strong>{new Date(form.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
              <div className="booking-summary__row">
                <span>Time</span>
                <strong>{form.time}</strong>
              </div>
              <div className="booking-summary__row">
                <span>Fee</span>
                <strong>₹{vet?.consultationFee}</strong>
              </div>
              {form.notes && (
                <div className="booking-summary__row">
                  <span>Notes</span>
                  <strong>{form.notes}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="booking-modal__nav">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 4 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleBook} disabled={saving}>
              {saving ? <div className="spinner" /> : <><Check size={16} /> Confirm Booking</>}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
