import { useState, useEffect } from 'react';
import { Search, MapPin, Scissors, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import GroomerCard from '../components/GroomerCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import './GroomingMarketplace.css';

const CITIES = ['All', 'Durg', 'Bhilai', 'Raipur', 'Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata'];

export default function GroomingMarketplace() {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchGroomers();
  }, []);

  const fetchGroomers = async () => {
    try {
      const res = await api.get('/groomers');
      setGroomers(res.groomers || []);
    } catch (err) {
      console.error('Failed to fetch groomers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroomers = groomers.filter(groomer => {
    if (search && 
        !groomer.name.toLowerCase().includes(search.toLowerCase()) && 
        !groomer.bio.toLowerCase().includes(search.toLowerCase())
    ) return false;
    
    if (filterCity !== 'All' && groomer.city !== filterCity) return false;
    if (showAvailableOnly && !groomer.isAvailable) return false;
    if (minRating > 0 && groomer.rating < minRating) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="grooming-page">
        <div className="grooming-page__grid">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="grooming-page">
      {/* Header */}
      <div className="grooming-page__header">
        <div>
          <h2>Grooming Marketplace</h2>
          <p>{filteredGroomers.length} groomer{filteredGroomers.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grooming-page__toolbar">
        <div className="grooming-page__search">
          <Search size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name or bio..."
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
        <div className="grooming-page__filters">
          <div className="grooming-page__filter-group">
            <label><MapPin size={14} /> City</label>
            <div className="grooming-page__filter-pills">
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
          
          <div className="grooming-page__filter-group">
            <label><Sparkles size={14} /> Rating</label>
            <div className="grooming-page__filter-pills">
              {[
                { label: 'Any Rating', value: 0 },
                { label: '4.0+ Stars', value: 4.0 },
                { label: '4.5+ Stars', value: 4.5 },
              ].map(opt => (
                <button
                  key={opt.value}
                  className={`filter-pill ${minRating === opt.value ? 'active' : ''}`}
                  onClick={() => setMinRating(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="grooming-page__toggle">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={e => setShowAvailableOnly(e.target.checked)}
            />
            <span>Show available only</span>
          </label>
        </div>
      )}

      {/* Groomers Grid */}
      {filteredGroomers.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="No groomers found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grooming-page__grid">
          {filteredGroomers.map((groomer, i) => (
            <GroomerCard
              key={groomer.id}
              groomer={groomer}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
