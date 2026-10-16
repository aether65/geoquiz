import React, { useState } from 'react';
import { GameState, Language, Player } from '../types';
import { t } from '../data/i18n';
import { MathFigure } from './Figures';
import { IconClose, IconArrowLeft, IconArrowRight, IconSearch, IconBrain, IconTarget, IconCheck, IconClock, IconX, IconRobot, IconBook } from './Icons';

interface ErrorAnalysisProps {
  gameState: GameState;
  lang: Language;
  onClose: () => void;
}

type Diagnosis = 'notRemember' | 'confused' | 'calcError' | 'readError' | 'rushed' | 'noTime' | 'other';

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ gameState, lang, onClose }) => {
  const { players, questions } = gameState;
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [currentErrorIdx, setCurrentErrorIdx] = useState(0);
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis>>({});
  const [showConclusion, setShowConclusion] = useState(false);

  const player = players[selectedPlayer];
  const errors = player.answers.filter(a => !a.correct);
  const currentError = errors[currentErrorIdx];
  const question = currentError ? questions.find(q => q.id === currentError.questionId) : null;

  const detectCause = (answer: typeof currentError): string => {
    if (!answer) return '';
    if (answer.selectedIndex === null) return t('errorAnalysis.noTime', lang);
    if (answer.timeSpent < 10) return t('errorAnalysis.rushed', lang);
    if (answer.timeSpent > 170) return t('errorAnalysis.noTime', lang);
    return t('errorAnalysis.calcError', lang);
  };

  const setDiagnosis = (qId: string, diag: Diagnosis) => {
    setDiagnoses(prev => ({ ...prev, [qId]: diag }));
  };

  const allDiagnosed = errors.every(e => diagnoses[e.questionId]);

  const recoveryRate = errors.length > 0
    ? Math.round((errors.filter(e => diagnoses[e.questionId]).length / errors.length) * 100)
    : 100;

  if (errors.length === 0) {
    return (
      <div className="error-analysis-screen">
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:'8px'}}><IconCheck size={28} className="icon-correct" /></span>{t('final.noErrors', lang)}</h2>
          <button className="btn-primary" onClick={onClose} style={{ marginTop: '20px' }}>
            <IconArrowLeft size={18} />
            <span>{t('common.back', lang)}</span>
          </button>
        </div>
      </div>
    );
  }

  const diagnosisOptions: { key: Diagnosis; label: string }[] = [
    { key: 'notRemember', label: t('errorAnalysis.notRemember', lang) },
    { key: 'confused', label: t('errorAnalysis.confused', lang) },
    { key: 'calcError', label: t('errorAnalysis.calcError', lang) },
    { key: 'readError', label: t('errorAnalysis.readError', lang) },
    { key: 'rushed', label: t('errorAnalysis.rushed', lang) },
    { key: 'noTime', label: t('errorAnalysis.noTime', lang) },
    { key: 'other', label: t('errorAnalysis.other', lang) },
  ];

  return (
    <div className="error-analysis-screen">
      <div className="ea-header">
        <h2>
          <IconSearch size={24} />
          <span>{t('errorAnalysis.title', lang)}</span>
        </h2>
        <button className="btn-icon" onClick={onClose}>
          <IconClose size={18} />
        </button>
      </div>

      {/* Player selector */}
      {players.length > 1 && (
        <div className="ea-player-selector">
          {players.map((p, idx) => (
            <button
              key={p.id}
              className={`ea-player-btn ${selectedPlayer === idx ? 'active' : ''}`}
              style={{ borderColor: p.color, color: selectedPlayer === idx ? p.color : undefined }}
              onClick={() => { setSelectedPlayer(idx); setCurrentErrorIdx(0); }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {!showConclusion ? (
        <>
          {/* Error navigation */}
          <div className="ea-nav">
            {errors.map((err, idx) => (
              <button
                key={idx}
                className={`ea-nav-dot ${currentErrorIdx === idx ? 'active' : ''} ${diagnoses[err.questionId] ? 'diagnosed' : ''}`}
                onClick={() => setCurrentErrorIdx(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Current error */}
          {currentError && question && (
            <div className="ea-error-card glass-card">
              <h3>{t('game.question', lang)}: {question.text}</h3>
              
              {question.figureType !== 'none' && (
                <div className="ea-figure">
                  <MathFigure type={question.figureType} params={question.figureParams} />
                </div>
              )}

              <div className="ea-answers">
                <p>
                  <span className="ea-label">{t('explanation.yourAnswer', lang)}:</span>
                  <span className="ea-wrong">
                    {currentError.selectedIndex !== null
                      ? `${['A','B','C','D','E'][currentError.selectedIndex]} - ${question.alternatives[currentError.selectedIndex]}`
                      : t('explanation.noAnswer', lang)}
                  </span>
                </p>
                <p>
                  <span className="ea-label">{t('explanation.correctAnswer', lang)}:</span>
                  <span className="ea-correct">
                    {['A','B','C','D','E'][question.correctIndex]} - {question.alternatives[question.correctIndex]}
                  </span>
                </p>
                <p>
                  <span className="ea-label">{t('explanation.timeSpent', lang)}:</span>
                  <span><IconClock size={12} /> {currentError.timeSpent.toFixed(1)}{t('common.seconds', lang)}</span>
                </p>
              </div>

              {/* Diagnosis */}
              <div className="ea-diagnosis">
                <h4><IconBrain size={16} /> {t('errorAnalysis.diagnosis', lang)}</h4>
                <div className="ea-diagnosis-options">
                  {diagnosisOptions.map(opt => (
                    <button
                      key={opt.key}
                      className={`ea-diag-btn ${diagnoses[question.id] === opt.key ? 'active' : ''}`}
                      onClick={() => setDiagnosis(question.id, opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected cause */}
              <div className="ea-cause">
                <h4><IconTarget size={16} /> {t('errorAnalysis.cause', lang)}</h4>
                <p className="ea-cause-text"><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:'6px'}}><IconRobot size={14} /></span>{detectCause(currentError)}</p>
              </div>

              {/* Correction */}
              <div className="ea-correction">
                <h4><IconCheck size={16} /> {t('errorAnalysis.correction', lang)}</h4>
                <ol>
                  {question.explanation.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Navigation */}
              <div className="ea-actions">
                {currentErrorIdx > 0 && (
                  <button className="btn-secondary" onClick={() => setCurrentErrorIdx(prev => prev - 1)}>
                    <IconArrowLeft size={16} />
                    <span>{t('common.back', lang)}</span>
                  </button>
                )}
                {currentErrorIdx < errors.length - 1 ? (
                  <button className="btn-primary" onClick={() => setCurrentErrorIdx(prev => prev + 1)}>
                    <span>{t('explanation.next', lang)}</span>
                    <IconArrowRight size={16} />
                  </button>
                ) : allDiagnosed ? (
                  <button className="btn-primary" onClick={() => setShowConclusion(true)}>
                    <IconTarget size={16} />
                    <span>{t('errorAnalysis.conclusion', lang)}</span>
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Conclusion */
        <div className="ea-conclusion glass-card">
          <h3>
            <IconTarget size={20} />
            <span>{t('errorAnalysis.conclusion', lang)} — {player.name}</span>
          </h3>
          
          <div className="ea-conclusion-stats">
            <div className="ea-stat">
              <span className="ea-stat-value">{errors.length}</span>
              <span className="ea-stat-label">{t('final.wrong', lang)}</span>
            </div>
            <div className="ea-stat">
              <span className="ea-stat-value">{recoveryRate}%</span>
              <span className="ea-stat-label">{t('errorAnalysis.recovery', lang)}</span>
            </div>
          </div>

          {/* Error patterns */}
          <div className="ea-patterns">
            <h4>Padrões de erro:</h4>
            {Object.entries(
              errors.reduce((acc, err) => {
                const diag = diagnoses[err.questionId] || 'other';
                acc[diag] = (acc[diag] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([key, count]) => (
              <div key={key} className="ea-pattern-row">
                <span>{t(`errorAnalysis.${key}`, lang)}</span>
                <span className="ea-pattern-count">{count}×</span>
              </div>
            ))}
          </div>

          {/* Study plan */}
          <div className="ea-study-plan">
            <h4><IconBook size={16} /> {t('errorAnalysis.studyPlan', lang)}</h4>
            <ol>
              {errors.some(e => e.topic === 'tales') && (
                <li>Revisar o Teorema de Tales: proporções entre segmentos de retas paralelas cortadas por transversais.</li>
              )}
              {errors.some(e => e.topic === 'metrics') && (
                <li>Revisar as relações métricas: h²=m·n, b²=a·m, c²=a·n, a·h=b·c.</li>
              )}
              {errors.some(e => diagnoses[e.questionId] === 'calcError') && (
                <li>Praticar cálculos com raízes quadradas e equações do 2º grau.</li>
              )}
              {errors.some(e => diagnoses[e.questionId] === 'rushed') && (
                <li>Antes de responder, releia o enunciado e identifique os dados.</li>
              )}
              <li>Resolver 5 exercícios extras por dia sobre o assunto mais fraco.</li>
            </ol>
          </div>

          <div className="ea-final-actions">
            <button className="btn-primary" onClick={onClose}>
              <IconCheck size={18} />
              <span>{t('common.close', lang)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorAnalysis;
