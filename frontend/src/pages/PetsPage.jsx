import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, PawPrint, Weight, Calendar } from 'lucide-react';
import { api } from '../lib/api';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './PetsPage.css';

const EMPTY_PET = { name: '', breed: '', age: '', weight: '' };

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PET);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPets = async () => {
    try {
      const res = await api.get('/pets');
      setPets(res.pets || []);
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPets(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_PET);
    setModalOpen(true);
  };

  const openEdit = (pet) => {
    setEditing(pet);
    setForm({ name: pet.name, breed: pet.breed, age: String(pet.age), weight: String(pet.weight) });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        breed: form.breed,
        age: Number(form.age),
        weight: Number(form.weight),
      };
      if (editing) {
        await api.put(`/pets/${editing.id}`, payload);
      } else {
        await api.post('/pets', payload);
      }
      setModalOpen(false);
      fetchPets();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pets/${id}`);
      setPets(prev => prev.filter(p => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="pets-page">
        <div className="pets-page__grid">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="pets-page">
      {/* Header */}
      <div className="pets-page__header">
        <div>
          <h2>My Pets</h2>
          <p>{pets.length} {pets.length === 1 ? 'pet' : 'pets'} registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} />
          Add Pet
        </button>
      </div>

      {/* Pet Grid */}
      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Add your first furry friend to get started with personalized care."
          action={
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} /> Add Your First Pet
            </button>
          }
        />
      ) : (
        <div className="pets-page__grid">
          {pets.map((pet, i) => (
            <GlassCard
              key={pet.id}
              className="pet-card"
              glow="teal"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="pet-card__avatar">🐾</div>
              <div className="pet-card__info">
                <h3 className="pet-card__name">{pet.name}</h3>
                <span className="badge badge-teal">{pet.breed}</span>
                <div className="pet-card__stats">
                  <div className="pet-card__stat">
                    <Calendar size={13} />
                    <span>{pet.age} years</span>
                  </div>
                  <div className="pet-card__stat">
                    <Weight size={13} />
                    <span>{pet.weight} kg</span>
                  </div>
                </div>
              </div>
              <div className="pet-card__actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(pet)} title="Edit">
                  <Edit3 size={14} />
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(pet.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Pet' : 'Add New Pet'}>
        <form className="pet-form" onSubmit={handleSave}>
          <div className="input-group">
            <label>Name</label>
            <input className="input-field" placeholder="e.g. Buddy" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="input-group">
            <label>Breed</label>
            <input className="input-field" placeholder="e.g. Golden Retriever" value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} required />
          </div>
          <div className="pet-form__row">
            <div className="input-group">
              <label>Age (years)</label>
              <input className="input-field" type="number" min="0" step="1" placeholder="3" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label>Weight (kg)</label>
              <input className="input-field" type="number" min="0" step="0.1" placeholder="12.5" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? <div className="spinner" /> : (editing ? 'Save Changes' : 'Add Pet')}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Pet?" width={380}>
        <p style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          This action cannot be undone. The pet will be permanently removed.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteId)}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
