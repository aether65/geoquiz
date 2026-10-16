import React, { useState } from 'react';
import { Language, PLAYER_COLORS, KEY_LABELS } from '../types';
import { t } from '../data/i18n';
import { IconPlay, IconSettings, IconUsers, IconBook, IconRobot } from './Icons';

interface StartScreenProps {
  lang: Language;
  aiEnabled: boolean;
  onStart: (numPlayers: number, names: string[], mode: 'classic' | 'ai') => void;
  onSettings: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ lang, aiEnabled, onStart, onSettings }) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [names, setNames] = useState(['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4']);
  const [gameMode, setGameMode] = useState<'classic' | 'ai'>('classic');

  const totalQuestions = numPlayers * 7;
  const talesCount = Math.ceil(totalQuestions / 2);
  const metricsCount = totalQuestions - talesCount;

  return (
    <div className="start-screen">
      {/* Logo */}
      <div className="logo-container">
        <svg viewBox="0 0 120 100" className="logo-svg" aria-label="GeoQuiz Logo">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon points="20,80 60,20 100,80" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" filter="url(#logoGlow)" />
          <polyline points="55,80 55,55 75,55" fill="none" stroke="url(#logoGrad)" strokeWidth="1.8" />
          <path d="M 70 30 Q 90 10 110 30" fill="none" stroke="url(#logoGrad)" strokeWidth="1.8" strokeDasharray="4,2" />
        </svg>
        <h1 className="logo-title">
          <span className="gradient-text">GeoQuiz</span>
        </h1>
        <p className="logo-subtitle">{t('app.subtitle', lang)}</p>
      </div>

      {/* Glass card */}
      <div className="glass-card start-card">
        {/* Player count */}
        <div className="form-section">
          <label className="form-label">
            <IconUsers size={16} />
            <span>{t('start.playerCount', lang)}</span>
          </label>
          <div className="player-selector">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                className={`player-btn ${numPlayers === n ? 'active' : ''}`}
                onClick={() => setNumPlayers(n)}
                style={numPlayers === n ? { background: PLAYER_COLORS[n - 1], color: 'white' } : {}}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Player names and keys */}
        <div className="players-list">
          {Array.from({ length: numPlayers }, (_, i) => (
            <div key={i} className="player-row">
              <div className="player-color" style={{ background: PLAYER_COLORS[i] }} />
              <input
                type="text"
                className="player-name-input"
                value={names[i]}
                onChange={e => {
                  const newNames = [...names];
                  newNames[i] = e.target.value;
                  setNames(newNames);
                }}
                placeholder={`${t('start.name', lang)} ${i + 1}`}
              />
              <span className="player-keys">{KEY_LABELS[i]}</span>
            </div>
          ))}
        </div>

        {/* Game mode */}
        <div className="form-section">
          <label className="form-label">{t('start.gameMode', lang)}</label>
          <div className="mode-selector">
            <button
              className={`mode-btn ${gameMode === 'classic' ? 'active' : ''}`}
              onClick={() => setGameMode('classic')}
            >
              <IconBook size={18} />
              <span>{t('start.classic', lang)}</span>
            </button>
            {aiEnabled && (
              <button
                className={`mode-btn ${gameMode === 'ai' ? 'active' : ''}`}
                onClick={() => setGameMode('ai')}
              >
                <IconRobot size={18} />
                <span>{t('start.ai', lang)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="game-summary">
          <div className="summary-item">
            <span className="summary-label">{t('start.totalQuestions', lang)}</span>
            <span className="summary-value">{totalQuestions}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('game.topic.tales', lang)}</span>
            <span className="summary-value">{talesCount}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('game.topic.metrics', lang)}</span>
            <span className="summary-value">{metricsCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="start-actions">
          <button className="btn-primary" onClick={() => onStart(numPlayers, names, gameMode)}>
            <IconPlay size={20} />
            <span>{t('start.start', lang)}</span>
          </button>
          <button className="btn-secondary btn-icon-only" onClick={onSettings}>
            <IconSettings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
