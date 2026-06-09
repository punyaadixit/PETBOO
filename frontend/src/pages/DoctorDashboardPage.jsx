import { useState, useEffect } from 'react';
import { Users, Calendar, IndianRupee, Clock, FileText, Check, PawPrint } from 'lucide-react';
import { api } from '../lib/api';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import './DoctorDashboardPage.css';

export default function DoctorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [selectedVet, setSelectedVet] = useState('vet-001');
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, [selectedVet]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/appointments/vet/${selectedVet}`);
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error('Failed to fetch vet appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr && a.status === 'upcoming');
  const upcomingCount = appointments.filter(a => a.status === 'upcoming').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const totalRevenue = completedCount * 800; // Mock calculation

  const handleSavePrescription = async () => {
    if (!prescriptionModal || !prescriptionText.trim()) return;
    setSaving(true);
    try {
      await api.patch(`/appointments/${prescriptionModal.id}/prescription`, {
        prescription: prescriptionText.trim(),
      });
      setPrescriptionModal(null);
      setPrescriptionText('');
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="doctor-dashboard">
        <div className="doctor-dashboard__stats">
          <LoadingSkeleton variant="stat" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <div className="doctor-dashboard__header">
        <div>
          <h2>Doctor Dashboard</h2>
          <p>Manage your appointments and patients</p>
        </div>
      </div>

      {/* Stats */}
      <div className="doctor-dashboard__stats">
        <StatCard icon={Calendar} label="Today" value={todayAppointments.length} linkText="Today's schedule" accent="blue" />
        <StatCard icon={Clock} label="Upcoming" value={upcomingCount} linkText="Pending appointments" accent="orange" />
        <StatCard icon={Users} label="Completed" value={completedCount} linkText="Total consultations" accent="green" />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue}`} linkText="Total earnings" accent="purple" />
      </div>

      {/* Today's Schedule */}
      <div className="doctor-dashboard__section">
        <h3>Today's Schedule</h3>
        {todayAppointments.length === 0 ? (
          <div className="doctor-dashboard__empty">
            <Calendar size={32} />
            <p>No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="doctor-dashboard__schedule">
            {todayAppointments.map(appt => (
              <div key={appt.id} className="schedule-item">
                <div className="schedule-item__time">{appt.time}</div>
                <div className="schedule-item__info">
                  <div className="schedule-item__pet">
                    <PawPrint size={14} />
                    <strong>{appt.pet?.name}</strong>
                    <span>{appt.pet?.breed}</span>
                  </div>
                  <div className="schedule-item__owner">
                    Owner: {appt.user?.name || 'Unknown'}
                  </div>
                  {appt.notes && <div className="schedule-item__notes">{appt.notes}</div>}
                </div>
                <div className="schedule-item__actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => { setPrescriptionModal(appt); setPrescriptionText(''); }}
                  >
                    <FileText size={14} /> Add Rx
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Appointments */}
      <div className="doctor-dashboard__section">
        <h3>All Appointments</h3>
        <div className="doctor-dashboard__table-wrapper">
          <table className="doctor-dashboard__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Pet</th>
                <th>Owner</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt.id} className={`row--${appt.status}`}>
                  <td>{new Date(appt.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td>{appt.time}</td>
                  <td><strong>{appt.pet?.name}</strong></td>
                  <td>{appt.user?.name || '—'}</td>
                  <td><span className={`badge badge--${appt.type === 'in-person' ? 'blue' : appt.type === 'video' ? 'purple' : 'green'}`}>{appt.type}</span></td>
                  <td><span className={`badge badge--${appt.status === 'upcoming' ? 'blue' : appt.status === 'completed' ? 'green' : 'red'}`}>{appt.status}</span></td>
                  <td>
                    {appt.status === 'upcoming' && (
                      <button className="btn btn-sm btn-secondary" onClick={() => { setPrescriptionModal(appt); setPrescriptionText(''); }}>
                        <FileText size={12} /> Rx
                      </button>
                    )}
                    {appt.status === 'completed' && appt.prescription && (
                      <span className="rx-done"><Check size={12} /> Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal */}
      <Modal open={!!prescriptionModal} onClose={() => setPrescriptionModal(null)} title="Write Prescription" width={480}>
        {prescriptionModal && (
          <div className="prescription-writer">
            <div className="prescription-writer__patient">
              <PawPrint size={16} />
              <strong>{prescriptionModal.pet?.name}</strong>
              <span>({prescriptionModal.pet?.breed})</span>
            </div>
            {prescriptionModal.notes && (
              <div className="prescription-writer__notes">
                <strong>Patient Notes:</strong> {prescriptionModal.notes}
              </div>
            )}
            <div className="input-group">
              <label>Prescription</label>
              <textarea
                className="input-field"
                rows={5}
                placeholder="Enter diagnosis, medications, dosage, and instructions..."
                value={prescriptionText}
                onChange={e => setPrescriptionText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
            <button className="btn btn-primary w-full" onClick={handleSavePrescription} disabled={saving || !prescriptionText.trim()}>
              {saving ? <div className="spinner" /> : <><Check size={16} /> Save Prescription</>}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
