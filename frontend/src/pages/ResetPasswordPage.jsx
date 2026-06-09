import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { api } from '../lib/api';
import './LoginPage.css'; // Reuse cohesive card styling

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenError('Missing password reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
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

        {tokenError ? (
          /* Missing/Invalid Token View */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '50%' }}>
              <ShieldAlert size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Reset Link Error</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              {tokenError}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg w-full"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/login')}
            >
              Go to Login Page
            </button>
          </div>
        ) : success ? (
          /* Success View */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
            <div style={{ color: '#10b981', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '50%', animation: 'scale-in 0.4s var(--transition-bounce)' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Password Reset</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              Your password has been successfully updated! You can now sign in with your new credentials.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg w-full"
              style={{ marginTop: '0.5rem' }}
              onClick={() => navigate('/login')}
            >
              Sign In Now
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Reset Password Form */
          <form className="login-card__form" onSubmit={handleSubmit}>
            <h2>Create New Password</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '0.5rem', textAlign: 'center', lineHeight: 1.4 }}>
              Enter a strong, secure new password for your PetSphere account.
            </p>

            {error && <div className="login-card__error">{error}</div>}

            <div className="input-group">
              <label htmlFor="reset-password">New Password</label>
              <div className="login-card__input-wrapper">
                <Lock size={16} className="login-card__input-icon" />
                <input
                  id="reset-password"
                  type="password"
                  className="input-field login-card__input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="login-card__input-wrapper">
                <Lock size={16} className="login-card__input-icon" />
                <input
                  id="confirm-password"
                  type="password"
                  className="input-field login-card__input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <div className="spinner" /> : (
                <>
                  Update Password
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="login-card__footer" style={{ marginTop: 'var(--space-md)' }}>
              <button
                type="button"
                className="login-card__toggle"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
