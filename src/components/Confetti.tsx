import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  colors?: string[];
}

const Confetti: React.FC<ConfettiProps> = ({ active, colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'] }) => {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        size: 6 + Math.random() * 8,
      }));
      setPieces(newPieces);
      
      const timeout = setTimeout(() => setPieces([]), 4000);
      return () => clearTimeout(timeout);
    } else {
      setPieces([]);
    }
  }, [active, colors]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
