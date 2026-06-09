import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { api } from '../lib/api';
import './LoginPage.css';

export default function LoginPage() {
  const { signIn, signUp, enterDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetLink, setDevResetLink] = useState('');

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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevResetLink('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(res.message || 'Password reset link sent successfully.');
      if (res.resetLink) {
        setDevResetLink(res.resetLink);
      }
    } catch (err) {
      setError(err.message || 'Failed to request password reset link.');
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

        {isForgotPassword ? (
          /* Forgot Password Form */
          <form className="login-card__form" onSubmit={handleForgotPasswordSubmit}>
            <h2>Reset Password</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '0.5rem', textAlign: 'center', lineHeight: 1.4 }}>
              Enter your email address and we will send you a secure link to reset your password.
            </p>

            {error && <div className="login-card__error">{error}</div>}
            {success && (
              <div className="login-card__success" style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                {success}
              </div>
            )}

            {devResetLink && (
              <div style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                textAlign: 'left',
              }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>👨‍💻 Developer Mode Reset Link:</strong>
                <a 
                  href={devResetLink.replace('http://localhost:5173', window.location.origin)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all', fontWeight: 600 }}
                >
                  Click here to reset password
                </a>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="forgot-email">Email</label>
              <div className="login-card__input-wrapper">
                <Mail size={16} className="login-card__input-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  className="input-field login-card__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <div className="spinner" /> : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="login-card__footer" style={{ marginTop: 'var(--space-md)' }}>
              <button
                type="button"
                className="login-card__toggle"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError('');
                  setSuccess('');
                  setDevResetLink('');
                }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          /* Sign In / Sign Up Form */
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="login-password" style={{ margin: 0 }}>Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="login-card__toggle"
                    style={{ fontSize: '0.8rem', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
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
        )}

        <div className="login-card__footer">
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            type="button"
            className="login-card__toggle"
            onClick={() => {
              setIsSignUp(s => !s);
              setError('');
              setIsForgotPassword(false);
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
