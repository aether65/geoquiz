import React, { useState } from 'react';
import { GameState, Language } from '../types';
import { t } from '../data/i18n';
import { MathFigure } from './Figures';

interface ExplanationScreenProps {
  gameState: GameState;
  lang: Language;
  onNext: () => void;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ gameState, lang, onNext }) => {
  const { players, currentQuestionIndex, questions } = gameState;
  const question = questions[currentQuestionIndex];
  const [activeTab, setActiveTab] = useState(0);

  if (!question) return null;

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const tabs = [
    { key: 'mainIdea', label: t('explanation.mainIdea', lang) },
    { key: 'formula', label: t('explanation.formula', lang) },
    { key: 'steps', label: t('explanation.steps', lang) },
    { key: 'verification', label: t('explanation.verification', lang) },
    { key: 'wrongReasons', label: t('explanation.wrongReasons', lang) },
    { key: 'tip', label: t('explanation.tip', lang) },
  ];

  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  return (
    <div className="explanation-screen">
      <div className="explanation-header">
        <h2 className="explanation-title">
          📖 {t('explanation.title', lang)} — {t('game.question', lang)} {currentQuestionIndex + 1}
        </h2>
      </div>

      {/* Question recap */}
      <div className="explanation-recap glass-card-sm">
        <p className="recap-text">{question.text}</p>
        {question.figureType !== 'none' && (
          <div className="recap-figure">
            <MathFigure type={question.figureType} params={question.figureParams} />
          </div>
        )}
      </div>

      {/* Player results */}
      <div className="player-results">
        {players.map(player => {
          const answer = player.answers.find(a => a.questionId === question.id);
          const isCorrect = answer?.correct;
          const selectedIndex = answer?.selectedIndex;
          
          return (
            <div key={player.id} className="player-result" style={{ borderColor: player.color }}>
              <span className="result-name" style={{ color: player.color }}>{player.name}</span>
              <span className="result-icon">{isCorrect ? '✅' : answer ? '❌' : '⏭️'}</span>
              <span className="result-answer">
                {answer ? (
                  <>
                    {letters[selectedIndex!]}: {question.alternatives[selectedIndex!]}
                    {isCorrect && <span className="correct-badge">{t('explanation.correct', lang)}</span>}
                  </>
                ) : (
                  t('explanation.noAnswer', lang)
                )}
              </span>
              {answer && (
                <span className="result-time">
                  {t('explanation.timeSpent', lang)}: {answer.timeSpent.toFixed(1)}{t('common.seconds', lang)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Correct answer highlight */}
      <div className="correct-answer-box">
        <span className="correct-label">{t('explanation.correctAnswer', lang)}:</span>
        <span className="correct-value">
          {letters[question.correctIndex]} — {question.alternatives[question.correctIndex]}
        </span>
      </div>

      {/* Explanation tabs */}
      <div className="explanation-tabs">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="explanation-content glass-card-sm">
        {activeTab === 0 && (
          <div className="exp-section">
            <p>{question.explanation.mainIdea}</p>
          </div>
        )}
        {activeTab === 1 && (
          <div className="exp-section">
            <p className="formula-text">{question.explanation.formula}</p>
          </div>
        )}
        {activeTab === 2 && (
          <div className="exp-section">
            <ol className="steps-list">
              {question.explanation.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {activeTab === 3 && (
          <div className="exp-section">
            <p>{question.explanation.verification}</p>
          </div>
        )}
        {activeTab === 4 && (
          <div className="exp-section">
            <ul className="wrong-reasons-list">
              {question.explanation.wrongReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 5 && (
          <div className="exp-section">
            <p className="tip-text">💡 {question.explanation.tip}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="explanation-actions">
        <button className="btn-primary" onClick={onNext}>
          {isLastQuestion ? '🏁 ' + t('final.title', lang) : '➡️ ' + t('explanation.next', lang)}
        </button>
      </div>
    </div>
  );
};

export default ExplanationScreen;
