import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import './LoginPage.css';

export default function LoginPage() {
  const { signIn, signUp, enterDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <AnimatedBackground />

      <div className="login-card">
        {/* Logo */}
        <div className="login-card__logo">
          <div className="login-card__logo-icon">
            <Sparkles size={28} />
          </div>
          <h1 className="gradient-text">PetSphere</h1>
          <p>AI-Powered Pet Health Operating System</p>
        </div>

        {/* Form */}
        <form className="login-card__form" onSubmit={handleSubmit}>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

          {error && <div className="login-card__error">{error}</div>}

          {isSignUp && (
            <div className="input-group">
              <label htmlFor="login-name">Full Name</label>
              <div className="login-card__input-wrapper">
                <User size={16} className="login-card__input-icon" />
                <input
                  id="login-name"
                  type="text"
                  className="input-field login-card__input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="login-email">Email</label>
            <div className="login-card__input-wrapper">
              <Mail size={16} className="login-card__input-icon" />
              <input
                id="login-email"
                type="email"
                className="input-field login-card__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <div className="login-card__input-wrapper">
              <Lock size={16} className="login-card__input-icon" />
              <input
                id="login-password"
                type="password"
                className="input-field login-card__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {isSignUp && <PasswordStrengthIndicator password={password} />}
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <div className="spinner" /> : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="login-card__divider">
            <span>or</span>
          </div>

          {/* Demo Mode */}
          <button
            type="button"
            className="btn btn-secondary btn-lg w-full login-card__demo"
            onClick={() => { enterDemo(); navigate('/', { replace: true }); }}
          >
            <Zap size={18} />
            Enter Demo Mode
          </button>
        </form>

        <div className="login-card__footer">
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            type="button"
            className="login-card__toggle"
            onClick={() => { setIsSignUp(s => !s); setError(''); }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
