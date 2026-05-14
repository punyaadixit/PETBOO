import { useState, useEffect } from 'react';
import { CalendarCheck, Plus, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './AppointmentsPage.css';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = appointments.filter(a => a.status === activeTab);

  const handleCancel = async () => {
    if (!cancelModal) return;
    try {
      await api.patch(`/appointments/${cancelModal.id}/cancel`);
      fetchAppointments();
      setCancelModal(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoin = (appointment) => {
    navigate(`/consultation/${appointment.id}`);
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="appointments-page__header">
        <div>
          <h2>My Appointments</h2>
          <p>{appointments.filter(a => a.status === 'upcoming').length} upcoming</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/vets')}>
          <Plus size={18} />
          Book New
        </button>
      </div>

      {/* Tabs */}
      <div className="appointments-page__tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`appointments-page__tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="appointments-page__tab-count">
              {appointments.filter(a => a.status === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Appointment List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={`No ${activeTab} appointments`}
          description={activeTab === 'upcoming'
            ? 'Book an appointment with a veterinarian to get started.'
            : `You have no ${activeTab} appointments.`}
          action={activeTab === 'upcoming' ? (
            <button className="btn btn-primary" onClick={() => navigate('/vets')}>
              <Plus size={16} /> Find a Veterinarian
            </button>
          ) : undefined}
        />
      ) : (
        <div className="appointments-page__list">
          {filtered.map((appt, i) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onCancel={setCancelModal}
              onReschedule={() => navigate('/vets')}
              onJoin={handleJoin}
              onViewPrescription={setPrescriptionModal}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal open={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Appointment?" width={400}>
        <p style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Are you sure you want to cancel the appointment with <strong>{cancelModal?.vet?.name}</strong> for <strong>{cancelModal?.pet?.name}</strong>?
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setCancelModal(null)}>Keep</button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleCancel}>
            <X size={14} /> Cancel Appointment
          </button>
        </div>
      </Modal>

      {/* Prescription Modal */}
      <Modal open={!!prescriptionModal} onClose={() => setPrescriptionModal(null)} title="Prescription" width={480}>
        {prescriptionModal && (
          <div className="prescription-view">
            <div className="prescription-view__header">
              <FileText size={20} />
              <div>
                <strong>{prescriptionModal.vet?.name}</strong>
                <p>{new Date(prescriptionModal.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="prescription-view__content">
              {prescriptionModal.prescription}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
