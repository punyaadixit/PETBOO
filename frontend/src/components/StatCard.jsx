import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, linkText, accent = 'green', rightImage, linkTo }) {
  const valueRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (valueRef.current) {
      valueRef.current.classList.remove('stat-card__value--animate');
      void valueRef.current.offsetWidth; /* trigger reflow */
      valueRef.current.classList.add('stat-card__value--animate');
    }
  }, [value]);

  const handleLinkClick = () => {
    if (linkTo) navigate(linkTo);
  };

  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__top">
        <div className={`stat-card__icon-wrapper stat-card__icon-wrapper--${accent}`}>
          {Icon && <Icon size={20} />}
        </div>
        <div className="stat-card__info">
          <span className="stat-card__label">{label}</span>
          <span className="stat-card__value stat-card__value--animate" ref={valueRef}>
            {value ?? '—'}
          </span>
        </div>
        {rightImage && <div className="stat-card__right-image">{rightImage}</div>}
      </div>
      <div className="stat-card__bottom">
        <button className="stat-card__link" onClick={handleLinkClick}>
          {linkText} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
