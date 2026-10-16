import React, { useState } from 'react';
import { GameState, Language } from '../types';
import { t } from '../data/i18n';
import { MathFigure } from './Figures';
import { IconCheck, IconX, IconClock, IconArrowRight, IconLightbulb, IconBook } from './Icons';

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
    { key: 'mainIdea', label: t('explanation.mainIdea', lang), icon: <IconBook size={14} /> },
    { key: 'formula', label: t('explanation.formula', lang), icon: <span style={{fontStyle:'italic',fontWeight:700}}>ƒ</span> },
    { key: 'steps', label: t('explanation.steps', lang), icon: <span>1.</span> },
    { key: 'verification', label: t('explanation.verification', lang), icon: <IconCheck size={14} /> },
    { key: 'wrongReasons', label: t('explanation.wrongReasons', lang), icon: <IconX size={14} /> },
    { key: 'tip', label: t('explanation.tip', lang), icon: <IconLightbulb size={14} /> },
  ];

  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  return (
    <div className="explanation-screen">
      <div className="explanation-header">
        <h2 className="explanation-title">
          <IconBook size={22} />
          <span>{t('explanation.title', lang)} — {t('game.question', lang)} {currentQuestionIndex + 1}</span>
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
              <span className="result-icon">
                {isCorrect ? <IconCheck size={18} className="icon-correct" /> : 
                 answer ? <IconX size={18} className="icon-wrong" /> : 
                 <IconClock size={18} className="icon-timeout" />}
              </span>
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
                  <IconClock size={12} />
                  {answer.timeSpent.toFixed(1)}{t('common.seconds', lang)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Correct answer highlight */}
      <div className="correct-answer-box">
        <IconCheck size={20} className="correct-icon" />
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
            {tab.icon}
            <span>{tab.label}</span>
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
            <p className="tip-text">
              <IconLightbulb size={16} className="tip-icon" />
              {question.explanation.tip}
            </p>
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="explanation-actions">
        <button className="btn-primary" onClick={onNext}>
          <span>{isLastQuestion ? t('final.title', lang) : t('explanation.next', lang)}</span>
          <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExplanationScreen;
