import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, MessageCircle, ShoppingBag, Database, Plus, Sparkles, ArrowRight, Stethoscope, CalendarCheck, Scissors, Heart, TrendingUp, Info } from 'lucide-react';
import { api } from '../lib/api';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './DashboardPage.css';

// Fallback virtual demo pets when user has no registered pets
const DEMO_PETS = [
  { id: 'demo-buddy', name: 'Buddy', breed: 'Golden Retriever', age: 3, weight: 30.5, isDemo: true },
  { id: 'demo-milo', name: 'Milo', breed: 'Persian Cat', age: 2, weight: 4.2, isDemo: true },
  { id: 'demo-luna', name: 'Luna', breed: 'Labrador', age: 5, weight: 28.0, isDemo: true }
];

// Helper to calculate dynamic pet health/activity stats deterministically
const getPetDynamicData = (pet) => {
  const name = pet.name || 'Pet';
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Base activity level: dogs active more, cats active less
  const isCat = pet.breed?.toLowerCase().includes('cat') || pet.breed?.toLowerCase().includes('persian') || pet.breed?.toLowerCase().includes('siamese');
  const baseActivity = isCat ? 30 : 65;
  const weightFactor = pet.weight ? Math.min(pet.weight / 15, 2.5) : 1.2;

  // Generate 7 days of active minutes (Mon - Sun)
  const activity = Array.from({ length: 7 }, (_, i) => {
    const daySeed = (hash + i * 23) % 45;
    return Math.round(baseActivity + daySeed * weightFactor);
  });

  // Target activity (breed average target)
  const targetActivity = Array.from({ length: 7 }, (_, i) => {
    const daySeed = (hash + i * 31) % 25;
    return Math.round(baseActivity * 1.05 + daySeed);
  });

  // Calculate health metrics (range: 75% to 98%)
  const healthScore = 75 + (hash % 24);

  const nutritionScore = 80 + ((hash + 7) % 19);
  const exerciseScore = 70 + ((hash + 13) % 29);
  const sleepScore = 72 + ((hash + 19) % 27);
  const hydrationScore = 82 + ((hash + 29) % 17);

  const getStatusLabel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'green', val: score };
    if (score >= 80) return { label: 'Good', color: 'green', val: score };
    if (score >= 70) return { label: 'Fair', color: 'orange', val: score };
    return { label: 'Needs Care', color: 'red', val: score };
  };

  const nutrition = getStatusLabel(nutritionScore);
  const exercise = getStatusLabel(exerciseScore);
  const sleep = getStatusLabel(sleepScore);
  const hydration = getStatusLabel(hydrationScore);

  // Dynamic AI health advice from Cuddles
  let aiTip = '';
  if (exercise.label === 'Needs Care' || exercise.label === 'Fair') {
    aiTip = `${name}'s active minutes are lower than breed average. Add a 15-minute daily fetch session to improve joint mobility.`;
  } else if (sleep.label === 'Fair' || sleep.label === 'Needs Care') {
    aiTip = `${name} showed slight restlessness last night. Avoid heavy meals before sleep and ensure a quiet bedding area.`;
  } else if (nutrition.label === 'Fair' || nutrition.label === 'Needs Care') {
    aiTip = `Consider adding fresh pumpkin or boiled chicken to ${name}'s kibble to boost fiber and digestion metrics.`;
  } else if (hydration.label === 'Fair') {
    aiTip = `Provide access to fresh water or introduce wet food elements. ${name}'s hydration level is slightly below target.`;
  } else {
    aiTip = `${name} is in peak physical health! Keep up the current diet and high-activity routine.`;
  }

  // Calculate weekly stats
  const totalActiveMins = activity.reduce((a, b) => a + b, 0);
  const dailyAverage = Math.round(totalActiveMins / 7);
  const statusString = totalActiveMins >= targetActivity.reduce((a,b)=>a+b,0) ? 'On Track' : 'Needs Activity';

  return {
    activity,
    targetActivity,
    healthScore,
    nutrition,
    exercise,
    sleep,
    hydration,
    aiTip,
    totalActiveMins,
    dailyAverage,
    statusString
  };
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pets: 0, sessions: 0, products: 0, appointments: 0 });
  const [recentPets, setRecentPets] = useState([]);
  const [activePetId, setActivePetId] = useState(null);
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

        const fetchedPets = petsRes.status === 'fulfilled' ? petsRes.value.pets || [] : [];
        const sessions = sessionsRes.status === 'fulfilled' ? sessionsRes.value.sessions || [] : [];
        const products = productsRes.status === 'fulfilled' ? productsRes.value.products || [] : [];
        const apptCount = apptCountRes.status === 'fulfilled' ? apptCountRes.value.count || 0 : 0;

        setStats({
          pets: fetchedPets.length,
          sessions: sessions.length,
          products: products.length,
          appointments: apptCount,
        });

        const activePetsList = fetchedPets.length > 0 ? fetchedPets : DEMO_PETS;
        setRecentPets(activePetsList);
        setActivePetId(activePetsList[0]?.id || null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const activePet = recentPets.find(p => p.id === activePetId) || recentPets[0];
  const petData = activePet ? getPetDynamicData(activePet) : null;

  // Dynamic SVG Bezier-Curve generation
  const buildSvgPath = (values) => {
    if (!values || values.length === 0) return { path: '', points: [] };
    
    // Map active minutes (0 to 150) to SVG Y coordinates (160 to 20)
    const points = values.map((val, idx) => {
      const x = (idx * 400) / 6;
      const y = 160 - (Math.min(val, 150) / 150) * 140;
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return { path: d, points };
  };

  const activeCurve = petData ? buildSvgPath(petData.activity) : null;
  const targetCurve = petData ? buildSvgPath(petData.targetActivity) : null;

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

      {/* Stats Cards */}
      <div className="dashboard__stats">
        <StatCard icon={PawPrint}       label="My Pets"       value={stats.pets}     linkText="View your pets" accent="green" rightImage="🐶" linkTo="/pets" />
        <StatCard icon={MessageCircle}  label="AI Sessions"   value={stats.sessions} linkText="Chats this week" accent="purple" linkTo="/chat" />
        <StatCard icon={ShoppingBag}    label="Orders"        value={stats.products} linkText="Recent Orders" accent="orange" rightImage="🛍️" linkTo="/shop" />
        <StatCard icon={CalendarCheck}   label="Upcoming Appts"value={stats.appointments} linkText="View Appointments" accent="blue" rightImage="🗓️" linkTo="/appointments" />
      </div>

      {/* Active Pet Selector Tab Row */}
      {recentPets.length > 0 && (
        <div className="dashboard__pet-selector">
          <div className="selector-header">
            <Heart size={16} className="heart-icon" />
            <span>Active Pet Profile:</span>
          </div>
          <div className="pet-selector-scroll">
            {recentPets.map(pet => (
              <button
                key={pet.id}
                className={`pet-selector-btn ${activePetId === pet.id ? 'active' : ''} ${pet.isDemo ? 'demo' : ''}`}
                onClick={() => setActivePetId(pet.id)}
              >
                <span className="pet-btn-emoji">
                  {pet.breed?.toLowerCase().includes('cat') ? '🐱' : '🐶'}
                </span>
                <span className="pet-btn-name">{pet.name}</span>
                {pet.isDemo && <span className="demo-badge">Demo</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="dashboard__reference-grid">
        {/* Pet Activity */}
        <div className="dashboard__card dashboard__card--activity">
          <div className="dashboard__card-header">
            <div>
              <h3>Pet Activity</h3>
              <p>Weekly active play and exercise minutes</p>
            </div>
            {activePet && (
              <div className="dashboard__legend">
                <span className="legend-item">
                  <span className="legend-dot bg-green"></span>
                  {activePet.name}
                </span>
                <span className="legend-item">
                  <span className="legend-dot bg-gray"></span>
                  Breed Target
                </span>
              </div>
            )}
          </div>

          {/* SVG Dynamic Chart */}
          <div className="dashboard__chart-container">
            {petData && activeCurve && targetCurve && (
              <>
                <svg viewBox="0 0 400 180" className="dashboard__svg-chart" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                  <line x1="0" y1="95" x2="400" y2="95" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                  <line x1="0" y1="160" x2="400" y2="160" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />

                  {/* Target Curve */}
                  <path d={targetCurve.path} fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5" strokeDasharray="5,5" opacity="0.6" />
                  
                  {/* Active Curve */}
                  <path d={activeCurve.path} fill="none" stroke="var(--accent-green)" strokeWidth="4" strokeLinecap="round" />

                  {/* Curve Markers */}
                  {activeCurve.points.map((p, idx) => (
                    <circle key={`act-${idx}`} cx={p.x} cy={p.y} r="5.5" fill="var(--accent-green)" stroke="#fff" strokeWidth="2.5" />
                  ))}
                  {targetCurve.points.map((p, idx) => (
                    <circle key={`tgt-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="var(--text-tertiary)" opacity="0.8" />
                  ))}
                </svg>
                <div className="chart-labels">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </>
            )}
          </div>

          {/* Symmetrical Metric Summary Row */}
          {petData && (
            <div className="dashboard__activity-metrics">
              <div className="metric-box">
                <span className="metric-label">TOTAL ACTIVE</span>
                <span className="metric-value">{petData.totalActiveMins} min</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">DAILY AVERAGE</span>
                <span className="metric-value">{petData.dailyAverage} min/day</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">WEEKLY GOAL</span>
                <span className={`metric-badge ${petData.statusString === 'On Track' ? 'success' : 'warning'}`}>
                  {petData.statusString}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Health Overview */}
        <div className="dashboard__card dashboard__card--health">
          <div className="dashboard__card-header">
            <div>
              <h3>Health Overview</h3>
              <p>Comprehensive vital score</p>
            </div>
          </div>
          
          {petData && (
            <div className="dashboard__health-content-vertical">
              {/* Donut Chart (Expanded) */}
              <div className="dashboard__donut-container">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="41" fill="none" stroke="var(--border-color)" strokeWidth="7" opacity="0.3" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="41" 
                    fill="none" 
                    stroke="var(--accent-green)" 
                    strokeWidth="7.5" 
                    strokeDasharray="257.6" 
                    strokeDashoffset={257.6 - (257.6 * petData.healthScore) / 100} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="dashboard__donut-text-center">
                  <strong>{petData.healthScore}%</strong>
                  <span>Vital Score</span>
                </div>
              </div>

              {/* Grid-based Health Stats */}
              <div className="dashboard__health-grid">
                <div className="health-grid-item">
                  <span className="health-dot bg-green"></span>
                  <div className="health-info">
                    <span className="name">Nutrition</span>
                    <span className={`status ${petData.nutrition.color}`}>{petData.nutrition.label}</span>
                  </div>
                </div>
                <div className="health-grid-item">
                  <span className={`health-dot bg-${petData.exercise.color}`}></span>
                  <div className="health-info">
                    <span className="name">Exercise</span>
                    <span className={`status ${petData.exercise.color}`}>{petData.exercise.label}</span>
                  </div>
                </div>
                <div className="health-grid-item">
                  <span className={`health-dot bg-${petData.sleep.color}`}></span>
                  <div className="health-info">
                    <span className="name">Sleep</span>
                    <span className={`status ${petData.sleep.color}`}>{petData.sleep.label}</span>
                  </div>
                </div>
                <div className="health-grid-item">
                  <span className={`health-dot bg-${petData.hydration.color}`}></span>
                  <div className="health-info">
                    <span className="name">Hydration</span>
                    <span className={`status ${petData.hydration.color}`}>{petData.hydration.label}</span>
                  </div>
                </div>
              </div>

              {/* Cuddles AI Tip Widget */}
              <div className="dashboard__ai-advice-card">
                <div className="advice-header">
                  <Sparkles size={14} className="sparkle-icon" />
                  <span>CUDDLES AI RECOMMENDATION</span>
                </div>
                <p className="advice-text">{petData.aiTip}</p>
              </div>
            </div>
          )}
        </div>

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

