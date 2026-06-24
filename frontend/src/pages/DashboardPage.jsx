import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, MessageCircle, ShoppingBag, Database, Plus, Sparkles, ArrowRight, Stethoscope, CalendarCheck, Scissors, Heart } from 'lucide-react';
import { api } from '../lib/api';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pets: 0, sessions: 0, products: 0, appointments: 0 });
  const [petsList, setPetsList] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'MORNING';
    if (hour < 18) return 'AFTERNOON';
    return 'EVENING';
  };

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [petsRes, sessionsRes, productsRes, apptCountRes] = await Promise.allSettled([
          api.get('/pets'),
          api.get('/ai/chat/sessions'),
          api.get('/products'),
          api.get('/appointments/count'),
        ]);

        const pets = petsRes.status === 'fulfilled' ? petsRes.value.pets || [] : [];
        const sessions = sessionsRes.status === 'fulfilled' ? sessionsRes.value.sessions || [] : [];
        const products = productsRes.status === 'fulfilled' ? productsRes.value.products || [] : [];
        const apptCount = apptCountRes.status === 'fulfilled' ? apptCountRes.value.count || 0 : 0;

        setStats({
          pets: pets.length,
          sessions: sessions.length,
          products: products.length,
          appointments: apptCount,
        });

        setPetsList(pets);
        if (pets.length > 0) {
          setSelectedPetId(pets[0].id);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!selectedPetId) {
      setDashboardData(null);
      return;
    }
    async function fetchPetDashboard() {
      setDashboardLoading(true);
      try {
        const data = await api.get(`/pets/${selectedPetId}/activities/dashboard-data`);
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching pet dashboard data:', err);
        setDashboardData(null);
      } finally {
        setDashboardLoading(false);
      }
    }
    fetchPetDashboard();
  }, [selectedPetId]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__stats">
          <LoadingSkeleton variant="stat" count={4} />
        </div>
        <div className="dashboard__grid">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </div>
    );
  }

  const renderActivityCard = () => {
    if (petsList.length === 0) {
      return (
        <div className="dashboard__card dashboard__card--activity">
          <div className="dashboard__card-header">
            <div>
              <h3>Pet Activity</h3>
              <p>How your pets are doing</p>
            </div>
          </div>
          <div className="dashboard__chart-empty-state">
            <svg viewBox="0 0 400 60" className="w-full h-full opacity-20">
              <path d="M0 30 L 400 30" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            <p className="empty-message">No pets added yet</p>
            <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate('/pets')}>
              <Plus size={14} /> Add Your First Pet
            </button>
          </div>
        </div>
      );
    }

    if (dashboardLoading) {
      return (
        <div className="dashboard__card dashboard__card--activity">
          <div className="dashboard__card-header">
            <div>
              <h3>Pet Activity</h3>
              <p>How your pet is doing</p>
            </div>
          </div>
          <div className="dashboard__card-loading">
            <div className="spinner" />
          </div>
        </div>
      );
    }

    const chartData = dashboardData?.chartData || [];
    const hasActivities = dashboardData?.hasActivities && chartData.some(d => d.value > 0);

    const width = 400;
    const height = 60;
    const maxVal = Math.max(...chartData.map(d => d.value), 30);
    const points = chartData.map((d, idx) => {
      const x = idx * (width / 6);
      const y = height - (d.value / maxVal) * (height - 20) - 10;
      return { x, y, day: d.day, val: d.value };
    });

    let pathD = '';
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    const fillD = pathD ? `${pathD} L ${width} ${height} L 0 ${height} Z` : '';

    return (
      <div className="dashboard__card dashboard__card--activity">
        <div className="dashboard__card-header">
          <div>
            <h3>Pet Activity</h3>
            <p>Weekly exercise metrics for {dashboardData?.petName || 'your pet'}</p>
          </div>
        </div>
        
        {!hasActivities ? (
          <div className="dashboard__chart-empty-state">
            <svg viewBox="0 0 400 60" className="w-full h-full opacity-20">
              <path d="M0 30 L 400 30" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            <p className="empty-message">No activity data available</p>
          </div>
        ) : (
          <div className="dashboard__chart-mockup">
            <div className="dashboard__chart-wrapper">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1={height - 10} x2={width} y2={height - 10} stroke="var(--border-light, #e0e0e0)" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="var(--border-light, #e0e0e0)" strokeWidth="1" strokeDasharray="4,4" opacity="0.1" />
                {fillD && <path d={fillD} fill="url(#chartGrad)" />}
                {pathD && <path d={pathD} fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                {points.map((p, idx) => (
                  <g key={idx} className="chart-dot-group">
                    <circle cx={p.x} cy={p.y} r="4" fill="var(--accent-green)" stroke="var(--bg-card)" strokeWidth="1.5" />
                    <title>{`${p.val} mins`}</title>
                  </g>
                ))}
              </svg>
              <div className="chart-labels">
                {chartData.map((d, idx) => (
                  <span key={idx}>{d.day}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHealthCard = () => {
    if (petsList.length === 0) {
      return (
        <div className="dashboard__card dashboard__card--health">
          <div className="dashboard__card-header">
            <div>
              <h3>Health Overview</h3>
              <p>Keep track of your pet's health</p>
            </div>
          </div>
          <div className="dashboard__health-empty-state">
            <div className="empty-icon-circle">
              <Heart size={28} className="text-tertiary" />
            </div>
            <p className="empty-message">No health data available yet.</p>
            <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate('/pets')}>
              <Plus size={14} /> Add Your First Pet
            </button>
          </div>
        </div>
      );
    }

    if (dashboardLoading) {
      return (
        <div className="dashboard__card dashboard__card--health">
          <div className="dashboard__card-header">
            <div>
              <h3>Health Overview</h3>
              <p>Keep track of your pet's health</p>
            </div>
          </div>
          <div className="dashboard__card-loading">
            <div className="spinner" />
          </div>
        </div>
      );
    }

    const hasHealthRecords = dashboardData?.hasHealthRecords;
    const score = dashboardData?.healthScore;
    const stats = dashboardData?.healthStats || {};

    const circumference = 251.3;
    const strokeDashoffset = score !== null ? (circumference - (score / 100) * circumference) : circumference;

    const getStatusClass = (status) => {
      if (status === 'Good') return 'green';
      if (status === 'Fair') return 'orange';
      if (status === 'Poor') return 'red';
      return 'grey';
    };

    const getStatusDotClass = (status) => {
      if (status === 'Good') return 'bg-green';
      if (status === 'Fair') return 'bg-orange';
      if (status === 'Poor') return 'bg-red';
      return 'bg-grey';
    };

    const getScoreLabel = (scoreVal) => {
      if (scoreVal === null) return 'No Data';
      if (scoreVal >= 80) return 'Good';
      if (scoreVal >= 50) return 'Fair';
      return 'Poor';
    };

    return (
      <div className="dashboard__card dashboard__card--health">
        <div className="dashboard__card-header">
          <div>
            <h3>Health Overview</h3>
            <p>Keep track of {dashboardData?.petName || 'your pet'}'s health</p>
          </div>
        </div>
        <div className="dashboard__health-content">
          <div className="dashboard__donut">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-light, #e2e8f0)" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke={score !== null ? "var(--accent-green)" : "#cbd5e1"} 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="dashboard__donut-text">
              <strong>{score !== null ? `${score}%` : '--'}</strong>
              <span>{getScoreLabel(score)}</span>
            </div>
          </div>

          {!hasHealthRecords || score === null ? (
            <div className="dashboard__health-empty-side">
              <p className="empty-message-inline">No health data available yet.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/pets/${selectedPetId}`)}>
                <Plus size={12} /> Add Health Record
              </button>
            </div>
          ) : (
            <div className="dashboard__health-stats">
              <div className="health-stat">
                <span className={`dot ${getStatusDotClass(stats.nutrition)}`}></span> 
                Nutrition 
                <span className={`status ${getStatusClass(stats.nutrition)}`}>{stats.nutrition || '--'}</span>
              </div>
              <div className="health-stat">
                <span className={`dot ${getStatusDotClass(stats.exercise)}`}></span> 
                Exercise 
                <span className={`status ${getStatusClass(stats.exercise)}`}>{stats.exercise || '--'}</span>
              </div>
              <div className="health-stat">
                <span className={`dot ${getStatusDotClass(stats.sleep)}`}></span> 
                Sleep 
                <span className={`status ${getStatusClass(stats.sleep)}`}>{stats.sleep || '--'}</span>
              </div>
              <div className="health-stat">
                <span className={`dot ${getStatusDotClass(stats.hydration)}`}></span> 
                Hydration 
                <span className={`status ${getStatusClass(stats.hydration)}`}>{stats.hydration || '--'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Custom Banner */}
      <div className="dashboard__custom-banner">
        <img src="/src/assets/pawcare-banner.png" alt="Pets Banner" className="dashboard__custom-banner-bg" />
        <div className="dashboard__custom-banner-content">
          <h1>G<span className="paw-text">🐾</span>OD<br/>{getGreeting()} GUYS</h1>
          <p>Have a pawsome day with your furry friends!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard__stats">
        <StatCard icon={PawPrint}       label="My Pets"       value={stats.pets}     linkText="View your pets" accent="green" rightImage="🐶" linkTo="/pets" />
        <StatCard icon={MessageCircle}  label="AI Sessions"   value={stats.sessions} linkText="Chats this week" accent="purple" linkTo="/chat" />
        <StatCard icon={ShoppingBag}    label="Orders"        value={stats.products} linkText="Recent Orders" accent="orange" rightImage="🛍️" linkTo="/shop" />
        <StatCard icon={CalendarCheck}   label="Upcoming Appts"value={stats.appointments} linkText="View Appointments" accent="blue" rightImage="🗓️" linkTo="/appointments" />
      </div>

      {/* Global Pet Selector Pill Bar */}
      {petsList.length > 0 && (
        <div className="dashboard__pet-selector">
          <span className="selector-label">Viewing analytics for:</span>
          <div className="pet-pills-container">
            {petsList.map(p => (
              <button
                key={p.id}
                className={`pet-select-pill ${selectedPetId === p.id ? 'active' : ''}`}
                onClick={() => setSelectedPetId(p.id)}
              >
                🐾 {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="dashboard__reference-grid">
        {/* Pet Activity Graph Card */}
        {renderActivityCard()}

        {/* Health Overview Card */}
        {renderHealthCard()}

        {/* Quick Actions */}
        <div className="dashboard__card dashboard__card--actions">
          <div className="dashboard__card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="dashboard__pill-actions">
            <button className="pill-action pill-action--green" onClick={() => navigate('/pets')}><PawPrint size={18}/> Book Vet Appointment</button>
            <button className="pill-action pill-action--orange" onClick={() => navigate('/shop')}><ShoppingBag size={18}/> Buy Pet Food</button>
            <button className="pill-action pill-action--purple" onClick={() => navigate('/chat')}><MessageCircle size={18}/>Chat with AI</button>
            <button className="pill-action pill-action--blue" onClick={() => navigate('/vets')}><Stethoscope size={18}/>Find a Veterinarian</button>
            <button className="pill-action pill-action--green" onClick={() => navigate('/grooming')}><Scissors size={18}/>Book Grooming</button>
            <button className="pill-action pill-action--pink" onClick={() => navigate('/chat')}><Database size={18}/>Emergency SOS</button>
          </div>
        </div>
      </div>
    </div>
  );
}
