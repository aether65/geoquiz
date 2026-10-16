import React, { useRef, useCallback } from 'react';
import { GameState, Language } from '../types';
import { t } from '../data/i18n';

interface ReportProps {
  gameState: GameState;
  lang: Language;
  onClose: () => void;
}

const Report: React.FC<ReportProps> = ({ gameState, lang, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { players, questions } = gameState;
  const date = new Date().toISOString().split('T')[0];
  const maxScore = Math.max(...players.map(p => p.score));
  const winners = players.filter(p => p.score === maxScore);
  const isTie = winners.length > 1;

  const generateHTML = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${t('report.title', lang)} - ${date}</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; color: #1a1a2e; }
  h1 { color: #0ea5e9; border-bottom: 3px solid #0ea5e9; padding-bottom: 10px; }
  h2 { color: #334155; margin-top: 30px; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th, td { padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
  th { background: #f1f5f9; font-weight: 600; }
  .correct { color: #10b981; font-weight: bold; }
  .wrong { color: #ef4444; }
  .summary-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 15px 0; }
  @media print { @page { size: A4; margin: 15mm; } body { font-size: 11pt; } }
</style>
</head>
<body>
<h1>🎮 ${t('report.title', lang)}</h1>
<div class="summary-box">
  <p><strong>${t('report.date', lang)}:</strong> ${date}</p>
  <p><strong>${t('report.players', lang)}:</strong> ${players.map(p => p.name).join(', ')}</p>
  <p><strong>${t('final.winner', lang)}:</strong> ${isTie ? t('final.tie', lang) : winners.map(w => w.name).join(', ')}</p>
  <p><strong>${t('start.totalQuestions', lang)}:</strong> ${questions.length}</p>
</div>

<h2>${t('report.summary', lang)}</h2>
<table>
<tr><th>${t('start.name', lang)}</th><th>${t('final.correct', lang)}</th><th>${t('final.wrong', lang)}</th><th>${t('final.percentage', lang)}</th><th>${t('final.avgTime', lang)}</th></tr>
${players.map(p => {
  const correct = p.answers.filter(a => a.correct).length;
  const wrong = p.answers.filter(a => !a.correct).length;
  const pct = Math.round((correct / 7) * 100);
  const avgTime = (p.answers.reduce((s, a) => s + a.timeSpent, 0) / (p.answers.length || 1)).toFixed(1);
  return `<tr><td style="color:${p.color};font-weight:bold">${p.name}</td><td class="correct">${correct}</td><td class="wrong">${wrong}</td><td>${pct}%</td><td>${avgTime}s</td></tr>`;
}).join('')}
</table>

<h2>${t('report.details', lang)}</h2>
${questions.map((q, i) => `
<div style="margin:20px 0;padding:15px;border:1px solid #e2e8f0;border-radius:8px">
  <h3>${t('game.question', lang)} ${i + 1}: ${q.topic === 'tales' ? t('game.topic.tales', lang) : t('game.topic.metrics', lang)} (${t('game.difficulty.' + q.difficulty, lang)})</h3>
  <p>${q.text}</p>
  <p><strong>${t('explanation.correctAnswer', lang)}:</strong> ${['A','B','C','D','E'][q.correctIndex]} - ${q.alternatives[q.correctIndex]}</p>
  ${players.map(p => {
    const ans = p.answers.find(a => a.questionId === q.id);
    return `<p style="color:${p.color}">${p.name}: ${ans ? (ans.correct ? '✅' : '❌') + ' ' + (ans.selectedIndex !== null ? ['A','B','C','D','E'][ans.selectedIndex] : '⏭️') : '⏭️'} (${ans ? ans.timeSpent.toFixed(1) + 's' : '-'})</p>`;
  }).join('')}
  <details><summary>${t('explanation.title', lang)}</summary>
    <p><strong>${t('explanation.mainIdea', lang)}:</strong> ${q.explanation.mainIdea}</p>
    <p><strong>${t('explanation.formula', lang)}:</strong> ${q.explanation.formula}</p>
    <p><strong>${t('explanation.steps', lang)}:</strong></p>
    <ol>${q.explanation.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    <p><strong>${t('explanation.tip', lang)}:</strong> ${q.explanation.tip}</p>
  </details>
</div>
`).join('')}
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geoquiz-relatorio-${date}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [gameState, lang, date, players, questions, winners, isTie]);

  const generatePDF = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${t('report.title', lang)}</title>
<style>
  body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; }
  h1 { color: #0ea5e9; } table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
  th { background: #f0f0f0; }
  @page { size: A4; margin: 15mm; }
  @media print { body { font-size: 10pt; } }
</style></head><body>
<h1>${t('report.title', lang)} - ${date}</h1>
<p>${t('report.players', lang)}: ${players.map(p => p.name).join(', ')}</p>
<p>${t('final.winner', lang)}: ${isTie ? t('final.tie', lang) : winners.map(w => w.name).join(', ')}</p>
<table><tr><th>Jogador</th><th>Acertos</th><th>Erros</th><th>%</th></tr>
${players.map(p => {
  const correct = p.answers.filter(a => a.correct).length;
  return `<tr><td>${p.name}</td><td>${correct}</td><td>${7 - correct}</td><td>${Math.round(correct/7*100)}%</td></tr>`;
}).join('')}
</table></body></html>`;
    
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }, [gameState, lang, date, players, winners, isTie]);

  const generatePNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const padding = 60;
    const lineHeight = 40;
    
    // Calculate height
    const playerRows = players.length;
    const questionRows = Math.min(questions.length, 10);
    const height = 400 + playerRows * 80 + questionRows * 50;
    
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0c4a6e');
    gradient.addColorStop(1, '#164e63');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui';
    ctx.fillText('🎮 GeoQuiz - ' + t('report.title', lang), padding, 60);
    
    ctx.font = '18px system-ui';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${t('report.date', lang)}: ${date} | ${t('report.players', lang)}: ${players.map(p => p.name).join(', ')}`, padding, 100);
    
    // Winner
    ctx.font = 'bold 24px system-ui';
    ctx.fillStyle = '#fbbf24';
    const winnerText = isTie ? `🤝 ${t('final.tie', lang)}` : `🏆 ${t('final.winner', lang)}: ${winners.map(w => w.name).join(', ')}`;
    ctx.fillText(winnerText, padding, 150);
    
    // Player stats
    let y = 200;
    ctx.font = 'bold 16px system-ui';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`${t('start.name', lang)}`, padding, y);
    ctx.fillText(`${t('final.correct', lang)}`, padding + 250, y);
    ctx.fillText(`${t('final.percentage', lang)}`, padding + 400, y);
    ctx.fillText(`${t('final.avgTime', lang)}`, padding + 550, y);
    y += 10;
    
    // Draw line
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    y += 30;
    
    players.forEach(player => {
      const correct = player.answers.filter(a => a.correct).length;
      const pct = Math.round((correct / 7) * 100);
      const avgTime = (player.answers.reduce((s, a) => s + a.timeSpent, 0) / (player.answers.length || 1)).toFixed(1);
      
      // Bar background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(padding + 400, y - 15, 120, 20);
      // Bar fill
      ctx.fillStyle = player.color;
      ctx.fillRect(padding + 400, y - 15, 120 * pct / 100, 20);
      
      ctx.fillStyle = player.color;
      ctx.font = 'bold 16px system-ui';
      ctx.fillText(player.name, padding, y);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '16px system-ui';
      ctx.fillText(`${correct}/7`, padding + 250, y);
      ctx.fillText(`${pct}%`, padding + 540, y);
      ctx.fillText(`${avgTime}s`, padding + 700, y);
      
      y += 50;
    });

    // Download
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `geoquiz-resumo-${date}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [gameState, lang, date, players, winners, isTie]);

  return (
    <div className="report-screen">
      <div className="report-header">
        <h2>📊 {t('report.title', lang)}</h2>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>

      <div className="report-actions">
        <button className="btn-primary" onClick={generateHTML}>
          📄 {t('report.saveHtml', lang)}
        </button>
        <button className="btn-secondary" onClick={generatePDF}>
          🖨️ {t('report.savePdf', lang)}
        </button>
        <button className="btn-secondary" onClick={generatePNG}>
          🖼️ {t('report.savePng', lang)}
        </button>
      </div>

      {/* Preview */}
      <div className="report-preview glass-card">
        <h3>{t('report.summary', lang)}</h3>
        <p>{t('report.date', lang)}: {date}</p>
        <p>{t('report.players', lang)}: {players.map(p => p.name).join(', ')}</p>
        <p>{t('final.winner', lang)}: {isTie ? t('final.tie', lang) : winners.map(w => w.name).join(', ')}</p>
        
        <table className="report-table">
          <thead>
            <tr>
              <th>{t('start.name', lang)}</th>
              <th>{t('final.correct', lang)}</th>
              <th>{t('final.wrong', lang)}</th>
              <th>{t('final.percentage', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => {
              const correct = p.answers.filter(a => a.correct).length;
              return (
                <tr key={p.id}>
                  <td style={{ color: p.color, fontWeight: 'bold' }}>{p.name}</td>
                  <td className="correct-cell">{correct}</td>
                  <td className="wrong-cell">{7 - correct}</td>
                  <td>{Math.round((correct / 7) * 100)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="report-footer">
        <button className="btn-secondary" onClick={onClose}>
          {t('common.back', lang)}
        </button>
      </div>
    </div>
  );
};

export default Report;
