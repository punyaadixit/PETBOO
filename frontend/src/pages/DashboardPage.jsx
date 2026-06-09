import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, MessageCircle, ShoppingBag, Database, Plus, Sparkles, ArrowRight, Stethoscope, CalendarCheck, Scissors } from 'lucide-react';
import { api } from '../lib/api';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pets: 0, sessions: 0, products: 0, appointments: 0 });
  const [recentPets, setRecentPets] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
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
        const [petsRes, sessionsRes, productsRes, historyRes, apptCountRes] = await Promise.allSettled([
          api.get('/pets'),
          api.get('/ai/chat/sessions'),
          api.get('/products'),
          api.get('/ai/chat/history'),
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
        setRecentPets(pets.slice(0, 4));
        setRecentSessions(sessions.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

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

      {/* Stats */}
      <div className="dashboard__stats">
        <StatCard icon={PawPrint}       label="My Pets"       value={stats.pets}     linkText="View your pets" accent="green" rightImage="🐶" linkTo="/pets" />
        <StatCard icon={MessageCircle}  label="AI Sessions"   value={stats.sessions} linkText="Chats this week" accent="purple" linkTo="/chat" />
        <StatCard icon={ShoppingBag}    label="Orders"        value={stats.products} linkText="Recent Orders" accent="orange" rightImage="🛍️" linkTo="/shop" />
        <StatCard icon={CalendarCheck}   label="Upcoming Appts"value={stats.appointments} linkText="View Appointments" accent="blue" rightImage="🗓️" linkTo="/appointments" />
      </div>

      {/* Grid */}
      <div className="dashboard__reference-grid">
        {/* Pet Activity */}
        <div className="dashboard__card dashboard__card--activity">
          <div className="dashboard__card-header">
            <div>
              <h3>Pet Activity</h3>
              <p>How your pets are doing</p>
            </div>
            <div className="dashboard__legend">
              <span className="legend-item"><span className="legend-dot bg-green"></span> Buddy</span>
              <span className="legend-item"><span className="legend-dot bg-purple"></span> Milo</span>
            </div>
          </div>
          {/* Mock Chart using SVG */}
          <div className="dashboard__chart-mockup">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              <path d="M0 120 Q 50 80, 100 100 T 200 60 T 300 90 T 400 30" fill="none" stroke="var(--accent-green)" strokeWidth="3" />
              <path d="M0 140 Q 50 110, 100 130 T 200 100 T 300 120 T 400 80" fill="none" stroke="var(--accent-purple)" strokeWidth="3" />
              <circle cx="100" cy="100" r="4" fill="var(--accent-green)" />
              <circle cx="200" cy="60" r="4" fill="var(--accent-green)" />
              <circle cx="300" cy="90" r="4" fill="var(--accent-green)" />
              <circle cx="100" cy="130" r="4" fill="var(--accent-purple)" />
              <circle cx="200" cy="100" r="4" fill="var(--accent-purple)" />
              <circle cx="300" cy="120" r="4" fill="var(--accent-purple)" />
            </svg>
            <div className="chart-labels">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="dashboard__card dashboard__card--health">
          <div className="dashboard__card-header">
            <div>
              <h3>Health Overview</h3>
              <p>Keep track of your pet's health</p>
            </div>
          </div>
          <div className="dashboard__health-content">
            <div className="dashboard__donut">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-green)" strokeWidth="8" strokeDasharray="210" strokeDashoffset="40" strokeLinecap="round" />
              </svg>
              <div className="dashboard__donut-text">
                <strong>85%</strong>
                <span>Good</span>
              </div>
            </div>
            <div className="dashboard__health-stats">
              <div className="health-stat"><span className="dot bg-green"></span> Nutrition <span className="status green">Good</span></div>
              <div className="health-stat"><span className="dot bg-green"></span> Exercise <span className="status green">Good</span></div>
              <div className="health-stat"><span className="dot bg-orange"></span> Sleep <span className="status orange">Fair</span></div>
              <div className="health-stat"><span className="dot bg-green"></span> Hydration <span className="status green">Good</span></div>
            </div>
          </div>
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
