import React, { useEffect, useCallback, useState } from 'react';
import { GameState, Player, Language } from '../types';
import { t } from '../data/i18n';
import { MathFigure } from './Figures';

interface GameScreenProps {
  gameState: GameState;
  lang: Language;
  onAnswer: (playerId: number, altIndex: number) => void;
  onPause: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, lang, onAnswer, onPause }) => {
  const { players, currentQuestionIndex, questions, timeLeft, isPaused } = gameState;
  const question = questions[currentQuestionIndex];
  const [feedback, setFeedback] = useState<{ playerId: number; correct: boolean; altIdx: number } | null>(null);

  if (!question) return null;

  // Keyboard handler with feedback
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isPaused) return;
    const key = e.key.toLowerCase();
    
    for (const player of players) {
      if (player.blocked) continue;
      const alreadyAnswered = player.answers.some(a => a.questionId === question.id);
      if (alreadyAnswered) continue;
      
      const idx = player.keys.indexOf(key);
      if (idx !== -1) {
        const isCorrect = idx === question.correctIndex;
        setFeedback({ playerId: player.id, correct: isCorrect, altIdx: idx });
        setTimeout(() => setFeedback(null), 600);
        onAnswer(player.id, idx);
        break;
      }
    }
  }, [players, isPaused, onAnswer, question]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const timerPercent = (timeLeft / 180) * 100;
  const timerColor = timeLeft > 60 ? 'var(--accent)' : timeLeft > 30 ? '#f59e0b' : '#ef4444';
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const totalQ = questions.length;

  return (
    <div className="game-screen">
      {/* Header */}
      <div className="game-header">
        <div className="game-progress">
          <span className="progress-text">
            {t('game.question', lang)} {currentQuestionIndex + 1} {t('game.of', lang)} {totalQ}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentQuestionIndex + 1) / totalQ) * 100}%` }} />
          </div>
        </div>

        <div className="game-meta">
          <span className={`topic-badge topic-${question.topic}`}>
            {question.topic === 'tales' ? t('game.topic.tales', lang) : t('game.topic.metrics', lang)}
          </span>
          <span className={`difficulty-badge diff-${question.difficulty}`}>
            {t(`game.difficulty.${question.difficulty}`, lang)}
          </span>
          {question.isGenerated && <span className="ai-badge">{t('game.ai.badge', lang)}</span>}
        </div>

        {/* Timer */}
        <div className="timer-container">
          <svg viewBox="0 0 100 100" className="timer-svg">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={timerColor}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - timerPercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="timer-ring"
            />
          </svg>
          <div className="timer-text" style={{ color: timerColor }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          {isPaused && <div className="timer-paused">{t('game.paused', lang)}</div>}
        </div>

        <button className="btn-icon" onClick={onPause} title={t('start.settings', lang)}>⚙️</button>
      </div>

      {/* Score bar */}
      <div className="score-bar">
        {players.map(player => (
          <div key={player.id} className={`score-pill ${player.blocked ? 'blocked' : ''}`} style={{ borderColor: player.color }}>
            <span className="score-name" style={{ color: player.color }}>{player.name}</span>
            <span className="score-value">{player.score} {t('game.score', lang)}</span>
            {player.blocked && <span className="blocked-badge">{t('game.blocked', lang)}</span>}
          </div>
        ))}
      </div>

      {/* Question content */}
      <div className="question-content">
        <div className="question-text">
          <p>{question.text}</p>
        </div>

        {question.figureType !== 'none' && (
          <div className="question-figure">
            <MathFigure type={question.figureType} params={question.figureParams} />
          </div>
        )}

        {/* Alternatives */}
        <div className="alternatives-grid">
          {question.alternatives.map((alt, idx) => (
            <div key={idx} className="alternative-card">
              <div className="alt-letter">{letters[idx]}</div>
              <div className="alt-text">{alt}</div>
              <div className="alt-keys">
                {players.map(player => (
                  <span
                    key={player.id}
                    className={`alt-key ${player.blocked ? 'disabled' : ''}`}
                    style={{ background: player.color + '30', color: player.color, borderColor: player.color }}
                    title={`${player.name}: ${player.keys[idx]}`}
                  >
                    {player.keys[idx].toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Touch buttons for mobile */}
        <div className="touch-buttons">
          {players.map(player => (
            <div key={player.id} className="touch-player">
              <span className="touch-player-name" style={{ color: player.color }}>{player.name}</span>
              <div className="touch-alts">
                {question.alternatives.map((_, idx) => (
                  <button
                    key={idx}
                    className={`touch-btn ${player.blocked ? 'disabled' : ''} ${
                      feedback?.playerId === player.id && feedback?.altIdx === idx
                        ? feedback.correct ? 'answer-correct' : 'answer-wrong'
                        : ''
                    }`}
                    style={{ background: player.blocked ? '#666' : player.color }}
                    onClick={() => {
                      if (!player.blocked && !isPaused) {
                        const isCorrect = idx === question.correctIndex;
                        setFeedback({ playerId: player.id, correct: isCorrect, altIdx: idx });
                        setTimeout(() => setFeedback(null), 600);
                        onAnswer(player.id, idx);
                      }
                    }}
                    disabled={player.blocked || isPaused}
                  >
                    {letters[idx]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
