import React, { useState, useEffect } from 'react';

interface SplashProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <svg viewBox="0 0 120 100" className="splash-logo" aria-label="GeoQuiz">
          <defs>
            <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
          <polygon points="20,80 60,20 100,80" fill="none" stroke="url(#splashGrad)" strokeWidth="3" className="splash-triangle" />
          <polyline points="55,80 55,55 75,55" fill="none" stroke="url(#splashGrad)" strokeWidth="2" />
          <path d="M 70 30 Q 90 10 110 30" fill="none" stroke="url(#splashGrad)" strokeWidth="2" strokeDasharray="4,2" />
        </svg>
        <h1 className="splash-title">
          <span className="gradient-text">GeoQuiz</span>
        </h1>
        <p className="splash-subtitle">Quiz de Matemática • 9º Ano</p>
        <div className="splash-progress">
          <div className="splash-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
