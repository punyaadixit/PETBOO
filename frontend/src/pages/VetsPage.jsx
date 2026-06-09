import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Stethoscope, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import VetCard from '../components/VetCard';
import VetBookingModal from '../components/VetBookingModal';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import './VetsPage.css';

const SPECIALIZATIONS = [
  'All',
  'General Veterinary',
  'Orthopedic Surgery',
  'Dermatology',
  'Cardiology',
  'Dental Care',
  'Emergency & Critical Care',
  'Nutrition & Wellness',
  'Ophthalmology',
];

const CITIES = ['All', 'Durg', 'Bhilai', 'Raipur', 'Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata'];

export default function VetsPage() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Modals
  const [bookingVet, setBookingVet] = useState(null);
  const [profileVet, setProfileVet] = useState(null);
  const [profileReviews, setProfileReviews] = useState([]);

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const res = await api.get('/vets');
      setVets(res.vets || []);
    } catch (err) {
      console.error('Failed to fetch vets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVets = vets.filter(vet => {
    if (search && !vet.name.toLowerCase().includes(search.toLowerCase()) && !vet.specialization.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSpec !== 'All' && vet.specialization !== filterSpec) return false;
    if (filterCity !== 'All' && vet.city !== filterCity) return false;
    if (showAvailableOnly && !vet.isAvailable) return false;
    return true;
  });

  const openProfile = async (vet) => {
    setProfileVet(vet);
    try {
      const res = await api.get(`/vets/${vet.id}/reviews`);
      setProfileReviews(res.reviews || []);
    } catch {
      setProfileReviews([]);
    }
  };

  if (loading) {
    return (
      <div className="vets-page">
        <div className="vets-page__grid">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="vets-page">
      {/* Header */}
      <div className="vets-page__header">
        <div>
          <h2>Veterinarians</h2>
          <p>{filteredVets.length} doctor{filteredVets.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="vets-page__toolbar">
        <div className="vets-page__search">
          <Search size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(s => !s)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="vets-page__filters">
          <div className="vets-page__filter-group">
            <label><Stethoscope size={14} /> Specialization</label>
            <div className="vets-page__filter-pills">
              {SPECIALIZATIONS.map(spec => (
                <button
                  key={spec}
                  className={`filter-pill ${filterSpec === spec ? 'active' : ''}`}
                  onClick={() => setFilterSpec(spec)}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
          <div className="vets-page__filter-group">
            <label><MapPin size={14} /> City</label>
            <div className="vets-page__filter-pills">
              {CITIES.map(city => (
                <button
                  key={city}
                  className={`filter-pill ${filterCity === city ? 'active' : ''}`}
                  onClick={() => setFilterCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          <label className="vets-page__toggle">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={e => setShowAvailableOnly(e.target.checked)}
            />
            <span>Show available only</span>
          </label>
        </div>
      )}

      {/* Vet Grid */}
      {filteredVets.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No veterinarians found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="vets-page__grid">
          {filteredVets.map((vet, i) => (
            <VetCard
              key={vet.id}
              vet={vet}
              onViewProfile={openProfile}
              onBook={setBookingVet}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <VetBookingModal
        open={!!bookingVet}
        onClose={() => setBookingVet(null)}
        vet={bookingVet}
        onBooked={() => {
          setBookingVet(null);
          alert('Appointment booked successfully! Check your Appointments page.');
        }}
      />

      {/* Vet Profile Modal */}
      <Modal open={!!profileVet} onClose={() => setProfileVet(null)} title="Doctor Profile" width={560}>
        {profileVet && (
          <div className="vet-profile">
            <div className="vet-profile__header">
              <div className="vet-profile__avatar">
                {profileVet.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3>{profileVet.name}</h3>
                <p className="vet-profile__spec">{profileVet.specialization}</p>
                <div className="vet-profile__rating">
                  <StarRating rating={profileVet.rating} size={16} />
                  <span>{profileVet.rating} ({profileVet.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="vet-profile__details">
              <div className="vet-profile__detail">
                <strong>Clinic</strong>
                <span>{profileVet.clinic}</span>
              </div>
              <div className="vet-profile__detail">
                <strong>City</strong>
                <span>{profileVet.city}</span>
              </div>
              <div className="vet-profile__detail">
                <strong>Experience</strong>
                <span>{profileVet.experience} years</span>
              </div>
              <div className="vet-profile__detail">
                <strong>Fee</strong>
                <span>₹{profileVet.consultationFee}</span>
              </div>
              <div className="vet-profile__detail">
                <strong>Available</strong>
                <span>{profileVet.availableDays?.join(', ')} • {profileVet.availableTimeStart} - {profileVet.availableTimeEnd}</span>
              </div>
              <div className="vet-profile__detail">
                <strong>Phone</strong>
                <span>{profileVet.phone}</span>
              </div>
            </div>

            {/* Reviews */}
            <div className="vet-profile__reviews">
              <h4>Reviews ({profileReviews.length})</h4>
              {profileReviews.length === 0 ? (
                <p className="vet-profile__no-reviews">No reviews yet.</p>
              ) : (
                profileReviews.map(review => (
                  <div key={review.id} className="vet-profile__review">
                    <div className="vet-profile__review-header">
                      <StarRating rating={review.rating} size={12} />
                      <span className="vet-profile__review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                  </div>
                ))
              )}
            </div>

            <button className="btn btn-primary w-full" onClick={() => { setProfileVet(null); setBookingVet(profileVet); }}>
              Book Appointment
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
