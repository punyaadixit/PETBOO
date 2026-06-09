import { useEffect, useState } from 'react';
import { Sparkles, PawPrint } from 'lucide-react';
import './AnimatedBackground.css';

const PARTICLE_COUNT = 15;

export default function AnimatedBackground() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? 'sparkle' : 'paw'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="animated-bg" aria-hidden="true">
      {particles.map(p => (
        <div 
          key={p.id}
          className="animated-bg__particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        >
          {p.type === 'sparkle' ? (
            <Sparkles size={p.size} className="animated-bg__icon animated-bg__icon--sparkle" />
          ) : (
            <PawPrint size={p.size} className="animated-bg__icon animated-bg__icon--paw" />
          )}
        </div>
      ))}
    </div>
  );
}
