import React from 'react';
import { GameState, Language, Player } from '../types';
import { t } from '../data/i18n';
import Confetti from './Confetti';
import { IconTrophy, IconRefresh, IconChart, IconSearch, IconSkip, IconHandshake, IconCheck } from './Icons';

interface FinalScreenProps {
  gameState: GameState;
  lang: Language;
  onPlayAgain: () => void;
  onReport: () => void;
  onErrorAnalysis: () => void;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ gameState, lang, onPlayAgain, onReport, onErrorAnalysis }) => {
  const { players, questions } = gameState;
  
  // Calculate results
  const maxScore = Math.max(...players.map(p => p.score));
  const winners = players.filter(p => p.score === maxScore);
  const isTie = winners.length > 1;
  const isSolo = players.length === 1;

  const getPlayerStats = (player: Player) => {
    const correct = player.answers.filter(a => a.correct).length;
    const wrong = player.answers.filter(a => !a.correct && a.selectedIndex !== null).length;
    const unanswered = 7 - player.answers.length;
    const total = player.answers.length || 1;
    const percentage = Math.round((correct / 7) * 100);
    const avgTime = player.answers.reduce((sum, a) => sum + a.timeSpent, 0) / total;
    return { correct, wrong, unanswered, percentage, avgTime };
  };

  const hasErrors = players.some(p => p.answers.some(a => !a.correct));

  return (
    <div className="final-screen">
      <Confetti active={!isSolo} colors={players.map(p => p.color)} />
      <div className="final-header">
        <h1 className="final-title">
          <IconTrophy size={32} className="trophy-icon" />
          <span>{t('final.title', lang)}</span>
        </h1>
      </div>

      {/* Winner section */}
      <div className="winner-section glass-card">
        {isSolo ? (
          <div className="solo-result">
            <div className="solo-score">
              <span className="score-big">{players[0].score}</span>
              <span className="score-of">/ 7</span>
            </div>
            <p className="solo-message">{t('final.yourScore', lang)}: {players[0].score} {t('game.of', lang)} 7</p>
          </div>
        ) : isTie ? (
          <div className="tie-result">
            <h2 className="tie-text">
              <IconHandshake size={28} className="inline-icon" />
              <span>{t('final.tie', lang)}</span>
            </h2>
            <div className="tie-players">
              {winners.map(w => (
                <span key={w.id} className="tie-player" style={{ color: w.color }}>{w.name}</span>
              ))}
            </div>
            <p className="tie-score">{maxScore} {t('game.score', lang)}</p>
          </div>
        ) : (
          <div className="winner-result">
            <h2 className="winner-text">
              <IconTrophy size={28} className="inline-icon" />
              <span>{t('final.winner', lang)}</span>
            </h2>
            <div className="winner-name" style={{ color: winners[0].color }}>
              {winners[0].name}
            </div>
            <p className="winner-score">{winners[0].score} {t('game.score', lang)}</p>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <div className="scoreboard glass-card">
        <h3 className="scoreboard-title">
          <IconChart size={18} className="inline-icon" />
          <span>{t('report.summary', lang)}</span>
        </h3>
        <div className="scoreboard-table">
          <div className="sb-header">
            <span>{t('start.name', lang)}</span>
            <span>{t('final.correct', lang)}</span>
            <span>{t('final.wrong', lang)}</span>
            <span>{t('final.unanswered', lang)}</span>
            <span>{t('final.percentage', lang)}</span>
            <span>{t('final.avgTime', lang)}</span>
          </div>
          {players.map(player => {
            const stats = getPlayerStats(player);
            return (
              <div key={player.id} className="sb-row" style={{ borderLeftColor: player.color }}>
                <span className="sb-name" style={{ color: player.color }}>{player.name}</span>
                <span className="sb-correct">{stats.correct}</span>
                <span className="sb-wrong">{stats.wrong}</span>
                <span className="sb-unanswered">{stats.unanswered}</span>
                <span className="sb-percentage">{stats.percentage}%</span>
                <span className="sb-time">{stats.avgTime.toFixed(1)}{t('common.seconds', lang)}</span>
              </div>
            );
          })}
        </div>

        {/* Performance bars */}
        <div className="performance-bars">
          {players.map(player => {
            const stats = getPlayerStats(player);
            return (
              <div key={player.id} className="perf-bar-row">
                <span className="perf-name" style={{ color: player.color }}>{player.name}</span>
                <div className="perf-bar-container">
                  <div
                    className="perf-bar-fill"
                    style={{
                      width: `${stats.percentage}%`,
                      background: `linear-gradient(90deg, ${player.color}, ${player.color}88)`,
                    }}
                  />
                </div>
                <span className="perf-value">{stats.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic breakdown */}
      <div className="topic-breakdown glass-card">
        <h3 className="breakdown-title">{t('report.performance', lang)} por assunto</h3>
        {players.map(player => {
          const talesAnswers = player.answers.filter(a => a.topic === 'tales');
          const metricsAnswers = player.answers.filter(a => a.topic === 'metrics');
          const talesCorrect = talesAnswers.filter(a => a.correct).length;
          const metricsCorrect = metricsAnswers.filter(a => a.correct).length;
          
          return (
            <div key={player.id} className="breakdown-row">
              <span className="breakdown-name" style={{ color: player.color }}>{player.name}</span>
              <div className="breakdown-bars">
                <div className="breakdown-bar-group">
                  <span className="bar-label">{t('game.topic.tales', lang)}</span>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{
                        width: `${talesAnswers.length ? (talesCorrect / talesAnswers.length) * 100 : 0}%`,
                        background: player.color,
                      }}
                    />
                  </div>
                  <span className="bar-value">{talesCorrect}/{talesAnswers.length}</span>
                </div>
                <div className="breakdown-bar-group">
                  <span className="bar-label">{t('game.topic.metrics', lang)}</span>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{
                        width: `${metricsAnswers.length ? (metricsCorrect / metricsAnswers.length) * 100 : 0}%`,
                        background: player.color,
                      }}
                    />
                  </div>
                  <span className="bar-value">{metricsCorrect}/{metricsAnswers.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="final-actions">
        <button className="btn-primary" onClick={onPlayAgain}>
          <IconRefresh size={18} />
          <span>{t('final.playAgain', lang)}</span>
        </button>
        <button className="btn-secondary" onClick={onReport}>
          <IconChart size={18} />
          <span>{t('final.report', lang)}</span>
        </button>
        {hasErrors && (
          <button className="btn-secondary" onClick={onErrorAnalysis}>
            <IconSearch size={18} />
            <span>{t('final.errorAnalysis', lang)}</span>
          </button>
        )}
        {!hasErrors && (
          <p className="no-errors-msg"><span style={{display:'inline-flex',verticalAlign:'middle',marginRight:'6px'}}><IconCheck size={18} className="icon-correct" /></span>{t('final.noErrors', lang)}</p>
        )}
      </div>
    </div>
  );
};

export default FinalScreen;
