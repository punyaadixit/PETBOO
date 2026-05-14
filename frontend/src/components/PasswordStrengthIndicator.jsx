import React, { useMemo } from 'react';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import './PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = useMemo(() => [
    { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { label: 'At least one uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'At least one lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { label: 'At least one number', test: (pw) => /[0-9]/.test(pw) },
    { label: 'At least one special character', test: (pw) => /[@$!%*?&]/.test(pw) },
  ], []);

  const metRequirements = requirements.filter(req => req.test(password));
  const strengthScore = metRequirements.length;

  const getStrengthInfo = () => {
    if (password.length === 0) return { label: 'Enter password', color: 'gray', icon: Shield };
    if (strengthScore <= 2) return { label: 'Weak', color: '#ef4444', icon: ShieldAlert };
    if (strengthScore <= 4) return { label: 'Medium', color: '#f59e0b', icon: Shield };
    return { label: 'Strong', color: '#10b981', icon: ShieldCheck };
  };

  const { label, color, icon: Icon } = getStrengthInfo();

  return (
    <div className="password-strength">
      <div className="password-strength__header">
        <div className="password-strength__label" style={{ color }}>
          <Icon size={14} />
          <span>{label}</span>
        </div>
        <div className="password-strength__meter">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className="password-strength__bar"
              style={{
                backgroundColor: step <= strengthScore ? color : 'var(--bg-secondary)',
                opacity: step <= strengthScore ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      <ul className="password-strength__requirements">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <li key={index} className={`requirement ${isMet ? 'met' : ''}`}>
              {isMet ? <Check size={12} className="icon met" /> : <X size={12} className="icon" />}
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
