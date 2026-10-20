import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ICONS, icon, TRANSLATIONS, t,
  QUESTION_BANK, generateTalesQuestion, generateMetricQuestion,
  PLAYER_COLORS, PLAYER_KEYS, PALETTES, LANGUAGES,
  Question
} from './game-data';

// ==================== TYPES ====================
interface Player {
  id: number;
  name: string;
  color: string;
  score: number;
  keys: string[];
  blocked: boolean;
  answered: boolean;
  answerIndex: number | null;
  answerTime: number | null;
}

interface GameSettings {
  lang: string;
  theme: 'auto' | 'light' | 'dark';
  palette: string;
  accentColor: string;
  animations: boolean;
  glassEffects: boolean;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  highContrast: boolean;
  soundEnabled: boolean;
  volume: number;
  speechRate: number;
  timerSeconds: number;
  confirmBeforeSubmit: boolean;
  largeTargets: boolean;
  focusMode: boolean;
  readingRuler: boolean;
}

interface GameRecord {
  questionId: string;
  questionIndex: number;
  topic: string;
  difficulty: string;
  playerAnswers: {
    playerId: number;
    answer: number | null;
    correct: boolean;
    time: number;
  }[];
  correctIndex: number;
}

type Screen = 'welcome' | 'question' | 'explanation' | 'results' | 'errorAnalysis' | 'loading';

// ==================== SVG FIGURES ====================
function drawRightTriangle(params: { a: number; b: number; c: number }): React.ReactElement {
  const { a, b, c } = params;
  const scale = 12;
  const margin = 40;
  const width = c * scale + margin * 2;
  const height = b * scale + margin * 2;
  
  const x1 = margin;
  const y1 = height - margin;
  const x2 = margin + c * scale;
  const y2 = height - margin;
  const x3 = margin;
  const y3 = height - margin - b * scale;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '320px', overflow: 'visible' }} role="img" aria-label={`Triângulo retângulo com hipotenusa ${a}, catetos ${b} e ${c}`}>
      <polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Right angle marker */}
      <rect x={x1} y={y1 - 12} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Labels */}
      <text x={(x1 + x2) / 2} y={y1 + 20} textAnchor="middle" fontWeight="bold" fontSize="14" fill="currentColor">{c}</text>
      <text x={x1 - 16} y={(y1 + y3) / 2} textAnchor="middle" fontWeight="bold" fontSize="14" fill="currentColor">{b}</text>
      <text x={(x2 + x3) / 2 + 14} y={(y2 + y3) / 2} textAnchor="middle" fontWeight="bold" fontSize="14" fill="currentColor">{a}</text>
    </svg>
  );
}

function drawTales(params: { a: number; b: number; c: number; d: number }): React.ReactElement {
  const { a, b, c, d } = params;
  const scale = 15;
  const margin = 50;
  const totalHeight = (a + b) * scale + margin * 2;
  const width = 300;
  
  const lineX1 = margin + 40;
  const lineX2 = width - margin - 40;
  
  const y0 = margin;
  const y1 = margin + a * scale;
  const y2 = margin + (a + b) * scale;
  
  return (
    <svg viewBox={`0 0 ${width} ${totalHeight}`} style={{ maxWidth: '320px', overflow: 'visible' }} role="img" aria-label={`Retas paralelas com segmentos ${a}, ${b} e ${c}, ${d}`}>
      {/* Parallel lines */}
      <line x1={lineX1 - 20} y1={y0} x2={lineX2 + 20} y2={y0} stroke="currentColor" strokeWidth="2" />
      <line x1={lineX1 - 20} y1={y1} x2={lineX2 + 20} y2={y1} stroke="currentColor" strokeWidth="2" />
      <line x1={lineX1 - 20} y1={y2} x2={lineX2 + 20} y2={y2} stroke="currentColor" strokeWidth="2" />
      {/* Transversals */}
      <line x1={lineX1} y1={y0 - 10} x2={lineX1} y2={y2 + 10} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
      <line x1={lineX2} y1={y0 - 10} x2={lineX2} y2={y2 + 10} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Segment labels - left */}
      <text x={lineX1 - 20} y={(y0 + y1) / 2 + 4} textAnchor="end" fontWeight="bold" fontSize="14" fill="currentColor">{a}</text>
      <text x={lineX1 - 20} y={(y1 + y2) / 2 + 4} textAnchor="end" fontWeight="bold" fontSize="14" fill="currentColor">{b}</text>
      {/* Segment labels - right */}
      <text x={lineX2 + 20} y={(y0 + y1) / 2 + 4} textAnchor="start" fontWeight="bold" fontSize="14" fill="currentColor">{c}</text>
      <text x={lineX2 + 20} y={(y1 + y2) / 2 + 4} textAnchor="start" fontWeight="bold" fontSize="14" fill="currentColor">{d}</text>
      {/* Dimension lines */}
      <line x1={lineX1 - 8} y1={y0} x2={lineX1 - 8} y2={y1} stroke="currentColor" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <line x1={lineX1 - 8} y1={y1} x2={lineX1 - 8} y2={y2} stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function drawTriangleHeight(params: { a: number; b: number; c: number; h: number; m: number; n: number }): React.ReactElement {
  const scale = 10;
  const margin = 50;
  const width = params.a * scale + margin * 2;
  const height = params.b * scale + margin * 2;
  
  const x1 = margin;
  const y1 = height - margin;
  const x2 = margin + params.a * scale;
  const y2 = height - margin;
  
  // Calculate apex position
  const apexX = margin + params.m * scale;
  const apexY = margin;
  
  // Height foot
  const footX = apexX;
  const footY = y1;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '360px', overflow: 'visible' }} role="img" aria-label={`Triângulo retângulo com altura h=${params.h?.toFixed(1)}, projeções m=${params.m} e n=${params.n}`}>
      {/* Main triangle */}
      <polygon points={`${x1},${y1} ${x2},${y2} ${apexX},${apexY}`} fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Height */}
      <line x1={apexX} y1={apexY} x2={footX} y2={footY} stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Right angle at height */}
      <rect x={footX} y={footY - 10} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Right angle at base */}
      <rect x={x1} y={y1 - 12} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Labels */}
      <text x={(x1 + x2) / 2} y={y1 + 20} textAnchor="middle" fontWeight="bold" fontSize="14" fill="currentColor">a = {params.a}</text>
      <text x={(x1 + apexX) / 2 - 12} y={(y1 + apexY) / 2} textAnchor="end" fontWeight="bold" fontSize="13" fill="currentColor">b</text>
      <text x={(x2 + apexX) / 2 + 12} y={(y2 + apexY) / 2} textAnchor="start" fontWeight="bold" fontSize="13" fill="currentColor">c</text>
      <text x={apexX + 10} y={(apexY + footY) / 2} textAnchor="start" fontWeight="bold" fontSize="13" fill="currentColor">h = {params.h?.toFixed?.(1) || '?'}</text>
      <text x={(x1 + footX) / 2} y={y1 + 35} textAnchor="middle" fontSize="12" fill="currentColor">m = {params.m}</text>
      <text x={(footX + x2) / 2} y={y1 + 35} textAnchor="middle" fontSize="12" fill="currentColor">n = {params.n}</text>
    </svg>
  );
}

function drawShadow(params: { h1: number; s1: number; h2?: number; s2: number }): React.ReactElement {
  const scale = 12;
  const margin = 50;
  const width = Math.max(params.s1, params.s2) * scale + margin * 2 + 80;
  const height = Math.max(params.h1, params.h2 || 0) * scale + margin * 2;
  
  const ground = height - margin;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '360px', overflow: 'visible' }} role="img" aria-label={`Problema de sombras: objeto de ${params.h1} com sombra ${params.s1}`}>
      {/* Ground */}
      <line x1={margin - 10} y1={ground} x2={width - margin + 10} y2={ground} stroke="currentColor" strokeWidth="2" />
      {/* Object 1 (pole) */}
      <line x1={margin + 20} y1={ground} x2={margin + 20} y2={ground - params.h1 * scale} stroke="currentColor" strokeWidth="2.5" />
      {/* Shadow 1 */}
      <line x1={margin + 20} y1={ground} x2={margin + 20 + params.s1 * scale} y2={ground} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Sun ray */}
      <line x1={margin + 20} y1={ground - params.h1 * scale} x2={margin + 20 + params.s1 * scale} y2={ground} stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      {/* Object 2 */}
      <line x1={margin + 80} y1={ground} x2={margin + 80} y2={ground - (params.h2 || 0) * scale} stroke="currentColor" strokeWidth="2.5" />
      {/* Shadow 2 */}
      <line x1={margin + 80} y1={ground} x2={margin + 80 + params.s2 * scale} y2={ground} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Labels */}
      <text x={margin + 8} y={ground - (params.h1 * scale) / 2} textAnchor="end" fontWeight="bold" fontSize="13" fill="currentColor">{params.h1}</text>
      <text x={margin + 20 + (params.s1 * scale) / 2} y={ground + 18} textAnchor="middle" fontSize="12" fill="currentColor">{params.s1}</text>
      <text x={margin + 68} y={ground - ((params.h2 || 0) * scale) / 2} textAnchor="end" fontWeight="bold" fontSize="13" fill="currentColor">{params.h2 || '?'}</text>
      <text x={margin + 80 + (params.s2 * scale) / 2} y={ground + 18} textAnchor="middle" fontSize="12" fill="currentColor">{params.s2}</text>
      {/* Sun symbol */}
      <circle cx={margin + 20 + params.s1 * scale + 20} cy={margin + 10} r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x={margin + 20 + params.s1 * scale + 20} y={margin + 14} textAnchor="middle" fontSize="10" fill="currentColor">☀</text>
    </svg>
  );
}

function drawLadder(params: { a: number; b: number; c: number }): React.ReactElement {
  const scale = 14;
  const margin = 50;
  const width = params.c * scale + margin * 2;
  const height = params.b * scale + margin * 2;
  
  const ground = height - margin;
  const wallX = margin;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '300px', overflow: 'visible' }} role="img" aria-label={`Escada de ${params.a} apoiada a ${params.c} da parede, altura ${params.b}`}>
      {/* Wall */}
      <line x1={wallX} y1={margin - 10} x2={wallX} y2={ground + 10} stroke="currentColor" strokeWidth="3" />
      {/* Ground */}
      <line x1={wallX - 10} y1={ground} x2={width - margin + 10} y2={ground} stroke="currentColor" strokeWidth="2" />
      {/* Ladder */}
      <line x1={wallX} y1={ground - params.b * scale} x2={wallX + params.c * scale} y2={ground} stroke="currentColor" strokeWidth="3" />
      {/* Labels */}
      <text x={wallX + (params.c * scale) / 2 + 10} y={ground - (params.b * scale) / 2 - 5} textAnchor="start" fontWeight="bold" fontSize="14" fill="currentColor" transform={`rotate(${-Math.atan2(params.b * scale, params.c * scale) * 180 / Math.PI}, ${wallX + (params.c * scale) / 2 + 10}, ${ground - (params.b * scale) / 2 - 5})`}>{params.a}</text>
      <text x={wallX - 14} y={ground - (params.b * scale) / 2} textAnchor="end" fontWeight="bold" fontSize="13" fill="currentColor">{params.b}</text>
      <text x={wallX + (params.c * scale) / 2} y={ground + 18} textAnchor="middle" fontSize="13" fill="currentColor">{params.c}</text>
      {/* Right angle */}
      <rect x={wallX} y={ground - 10} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function QuestionFigure({ question }: { question: Question }) {
  const p = question.figureParams;
  switch (question.figureType) {
    case 'rightTriangle':
      return drawRightTriangle({ a: p.a, b: p.b, c: p.c });
    case 'tales':
      return drawTales({ a: p.a, b: p.b, c: p.c, d: p.d });
    case 'triangleHeight':
      return drawTriangleHeight({ a: p.a, b: p.b, c: p.c, h: p.h, m: p.m, n: p.n });
    case 'shadow':
      return drawShadow({ h1: p.h1, s1: p.s1, h2: p.h2, s2: p.s2 });
    case 'ladder':
      return drawLadder({ a: p.a, b: p.b, c: p.c });
    case 'ramp':
      return drawLadder({ a: p.a, b: p.b, c: p.c });
    default:
      return drawRightTriangle({ a: p.a || 5, b: p.b || 3, c: p.c || 4 });
  }
}

// ==================== MAIN APP ====================
export default function App() {
  // Settings state
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('geoquiz-settings');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return {
      lang: 'pt',
      theme: 'auto',
      palette: 'ocean',
      accentColor: '#3b82f6',
      animations: true,
      glassEffects: true,
      fontSize: 100,
      letterSpacing: 0,
      wordSpacing: 0,
      lineHeight: 1.5,
      highContrast: false,
      soundEnabled: false,
      volume: 50,
      speechRate: 1,
      timerSeconds: 180,
      confirmBeforeSubmit: false,
      largeTargets: false,
      focusMode: false,
      readingRuler: false,
    };
  });

  // Game state
  const [screen, setScreen] = useState<Screen>('welcome');
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([]);
  const [gameMode, setGameMode] = useState<'classic' | 'ai'>('classic');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isPaused, setIsPaused] = useState(false);
  const [explanationTab, setExplanationTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [profilesOpen, setProfilesOpen] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [rulerY, setRulerY] = useState(0);
  const [showRuler, setShowRuler] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeUpCallbackRef = useRef<() => void>(() => {});

  // Apply settings to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    let resolvedTheme = settings.theme;
    if (settings.theme === 'auto') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', resolvedTheme);
    
    // Animations
    root.setAttribute('data-animations', settings.animations ? 'on' : 'off');
    
    // Glass
    root.setAttribute('data-glass', settings.glassEffects ? 'on' : 'off');
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`;
    
    // Letter/word spacing
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    root.style.setProperty('--word-spacing', `${settings.wordSpacing}px`);
    root.style.setProperty('--line-height', `${settings.lineHeight}`);
    
    // Contrast
    root.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
    
    // Large targets
    root.setAttribute('data-large-targets', String(settings.largeTargets));
    
    // Focus mode
    root.setAttribute('data-focus-mode', String(settings.focusMode));
    
    // Palette
    const palette = PALETTES[settings.palette as keyof typeof PALETTES] || PALETTES.ocean;
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-accent', palette.accent);
    
    // Lang
    root.setAttribute('lang', settings.lang);
    
    // Save
    try {
      localStorage.setItem('geoquiz-settings', JSON.stringify(settings));
    } catch (e) { /* ignore */ }
  }, [settings]);

  // Theme change listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (settings.theme === 'auto') {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  // First visit check
  useEffect(() => {
    try {
      const visited = localStorage.getItem('geoquiz-visited');
      if (visited) setFirstVisit(false);
    } catch (e) { /* ignore */ }
  }, []);

  // Keep timeUp callback ref current
  useEffect(() => {
    timeUpCallbackRef.current = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      showExplanation();
    };
  });

  // Timer
  useEffect(() => {
    if (screen === 'question' && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            timeUpCallbackRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, isPaused]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'question') return;
      if (settingsOpen || reportOpen) return;
      
      const key = e.key.toUpperCase();
      
      players.forEach((player, pi) => {
        if (player.blocked || player.answered) return;
        const keyIndex = player.keys.indexOf(key);
        if (keyIndex !== -1) {
          handlePlayerAnswer(pi, keyIndex);
        }
      });
      
      if (e.key === 'Escape') {
        if (settingsOpen) setSettingsOpen(false);
        else if (reportOpen) setReportOpen(false);
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, players, settingsOpen, reportOpen]);

  // Reading ruler
  useEffect(() => {
    if (!settings.readingRuler) {
      setShowRuler(false);
      return;
    }
    const handler = (e: MouseEvent) => {
      setRulerY(e.clientY);
      setShowRuler(true);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [settings.readingRuler]);

  // Initialize players
  const initPlayers = useCallback((count: number) => {
    const newPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: `${t('player', settings.lang)} ${i + 1}`,
      color: PLAYER_COLORS[i],
      score: 0,
      keys: PLAYER_KEYS[i],
      blocked: false,
      answered: false,
      answerIndex: null,
      answerTime: null,
    }));
    setPlayers(newPlayers);
  }, [settings.lang]);

  // Initialize players on mount
  useEffect(() => {
    if (players.length === 0) {
      initPlayers(playerCount);
    }
  }, []);

  // Generate questions for the match
  const generateQuestions = useCallback(() => {
    const totalPerPlayer = 7;
    const totalQuestions = totalPerPlayer * playerCount;
    const talesCount = Math.ceil(totalQuestions / 2);
    const metricCount = totalQuestions - talesCount;
    
    const allQuestions: Question[] = [];
    
    // Get from bank first (sorted by difficulty)
    const bankTales = QUESTION_BANK.filter(q => q.topic === 'tales').sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2 };
      return order[a.difficulty] - order[b.difficulty];
    });
    const bankMetric = QUESTION_BANK.filter(q => q.topic === 'metric').sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2 };
      return order[a.difficulty] - order[b.difficulty];
    });
    
    // Add bank questions
    for (let i = 0; i < Math.min(talesCount, bankTales.length); i++) {
      allQuestions.push(bankTales[i]);
    }
    for (let i = 0; i < Math.min(metricCount, bankMetric.length); i++) {
      allQuestions.push(bankMetric[i]);
    }
    
    // Fill remaining with generated questions
    let genTales = talesCount - Math.min(talesCount, bankTales.length);
    let genMetric = metricCount - Math.min(metricCount, bankMetric.length);
    
    for (let i = 0; i < genTales; i++) {
      allQuestions.push(generateTalesQuestion(Date.now() + i));
    }
    for (let i = 0; i < genMetric; i++) {
      allQuestions.push(generateMetricQuestion(Date.now() + i + 1000));
    }
    
    // Sort by difficulty: easy first, then medium, then hard
    const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
    allQuestions.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    
    // Interleave topics
    const tales = allQuestions.filter(q => q.topic === 'tales');
    const metrics = allQuestions.filter(q => q.topic === 'metric');
    const interleaved: Question[] = [];
    const maxLen = Math.max(tales.length, metrics.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < tales.length) interleaved.push(tales[i]);
      if (i < metrics.length) interleaved.push(metrics[i]);
    }
    
    setQuestions(interleaved.slice(0, totalQuestions));
  }, [playerCount]);

  // Start game
  const startGame = () => {
    initPlayers(playerCount);
    generateQuestions();
    setCurrentQuestionIndex(0);
    setGameRecords([]);
    setTimeLeft(settings.timerSeconds);
    setScreen('question');
    startTimeRef.current = Date.now();
  };

  // Handle player answer
  const handlePlayerAnswer = (playerIndex: number, answerIndex: number) => {
    if (screen !== 'question') return;
    
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = { ...newPlayers[playerIndex] };
      
      if (player.blocked || player.answered) return prev;
      
      player.answered = true;
      player.answerIndex = answerIndex;
      player.answerTime = settings.timerSeconds - timeLeft;
      
      const currentQ = questions[currentQuestionIndex];
      const isCorrect = answerIndex === currentQ.correctIndex;
      
      if (isCorrect) {
        // First correct answer gets the point (multiplayer) or just gets it (solo)
        const alreadyCorrect = prev.some((p, i) => i !== playerIndex && p.answered && p.answerIndex === currentQ.correctIndex);
        if (!alreadyCorrect || playerCount === 1) {
          player.score += 1;
        }
      } else {
        // Wrong answer - block in multiplayer
        if (playerCount > 1) {
          player.blocked = true;
        }
      }
      
      newPlayers[playerIndex] = player;
      
      // Check if all players have answered or are blocked
      const allDone = newPlayers.every(p => p.answered || p.blocked);
      if (allDone) {
        setTimeout(() => showExplanation(), 500);
      }
      
      return newPlayers;
    });
  };

  // Show explanation
  const showExplanation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen('explanation');
    setExplanationTab(0);
    setIsPaused(true);
    
    // Record the question result
    const currentQ = questions[currentQuestionIndex];
    const record: GameRecord = {
      questionId: currentQ.id,
      questionIndex: currentQuestionIndex,
      topic: currentQ.topic,
      difficulty: currentQ.difficulty,
      correctIndex: currentQ.correctIndex,
      playerAnswers: players.map(p => ({
        playerId: p.id,
        answer: p.answerIndex,
        correct: p.answerIndex === currentQ.correctIndex,
        time: p.answerTime || settings.timerSeconds,
      })),
    };
    setGameRecords(prev => [...prev, record]);
  };

  // Next question
  const nextQuestion = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= questions.length) {
      setScreen('results');
      return;
    }
    
    setCurrentQuestionIndex(nextIdx);
    setTimeLeft(settings.timerSeconds);
    setIsPaused(false);
    setScreen('question');
    
    // Reset player states for new question
    setPlayers(prev => prev.map(p => ({
      ...p,
      blocked: false,
      answered: false,
      answerIndex: null,
      answerTime: null,
    })));
    
    startTimeRef.current = Date.now();
  };

  // Play again
  const playAgain = () => {
    setScreen('welcome');
    setGameRecords([]);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setFirstVisit(false);
    try { localStorage.setItem('geoquiz-visited', 'true'); } catch (e) { /* ignore */ }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Timer progress for SVG ring
  const timerProgress = settings.timerSeconds > 0 ? (timeLeft / settings.timerSeconds) : 0;
  const circumference = 2 * Math.PI * 35;
  const dashOffset = circumference * (1 - timerProgress);

  // Total questions
  const totalQuestions = playerCount * 7;

  // Export report function
  function exportReport(format: string) {
    const date = new Date().toISOString().split('T')[0];
    const lang = settings.lang;
    
    if (format === 'txt') {
      let txt = `GeoQuiz - ${t('report', lang)}\n`;
      txt += `${t('question', lang)}: ${date}\n\n`;
      txt += `=== ${t('score', lang).toUpperCase()} ===\n`;
      players.forEach(p => {
        txt += `${p.name}: ${p.score} ${t('points', lang)}\n`;
      });
      txt += `\n=== ${t('byTopic', lang)} ===\n`;
      ['tales', 'metric'].forEach(topic => {
        const topicQ = gameRecords.filter(r => r.topic === topic);
        const correct = topicQ.filter(r => r.playerAnswers[0]?.correct).length;
        txt += `${t(topic === 'tales' ? 'tales' : 'metricRelations', lang)}: ${correct}/${topicQ.length}\n`;
      });
      txt += `\n=== ${t('reviewPoints', lang)} ===\n`;
      gameRecords.filter(r => !r.playerAnswers[0]?.correct).forEach(r => {
        const q = questions[r.questionIndex];
        if (q) {
          txt += `- ${t('question', lang)} ${r.questionIndex + 1}: ${q.statement.substring(0, 80)}...\n`;
        }
      });
      
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `geoquiz-resumo-${date}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    if (format === 'html') {
      let html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><title>GeoQuiz - ${t('report', lang)}</title>`;
      html += `<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a2e}h1{color:#3b82f6}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f0f4f8}.correct{color:#22c55e}.incorrect{color:#ef4444}</style></head><body>`;
      html += `<h1>GeoQuiz - ${t('report', lang)}</h1>`;
      html += `<p>${date}</p>`;
      html += `<h2>${t('score', lang)}</h2><table><tr><th>${t('player', lang)}</th><th>${t('correct', lang)}</th><th>${t('incorrect', lang)}</th></tr>`;
      players.forEach(p => {
        const correct = gameRecords.filter(r => r.playerAnswers[p.id]?.correct).length;
        const wrong = questions.length - correct;
        html += `<tr><td>${p.name}</td><td class="correct">${correct}</td><td class="incorrect">${wrong}</td></tr>`;
      });
      html += `</table>`;
      html += `<h2>${t('details', lang)}</h2>`;
      gameRecords.forEach((r, i) => {
        const q = questions[r.questionIndex];
        if (q) {
          html += `<div style="margin:16px 0;padding:16px;border:1px solid #eee;border-radius:8px">`;
          html += `<h3>${t('question', lang)} ${i + 1} - ${t(q.topic === 'tales' ? 'tales' : 'metricRelations', lang)}</h3>`;
          html += `<p>${q.statement}</p>`;
          html += `<p><strong>${t('correctAnswer', lang)}:</strong> ${q.options[r.correctIndex]}</p>`;
          r.playerAnswers.forEach(pa => {
            const player = players[pa.playerId];
            const ans = pa.answer !== null ? q.options[pa.answer] : t('noAnswer', lang);
            html += `<p>${player?.name}: ${ans} ${pa.correct ? '✓' : '✗'}</p>`;
          });
          html += `</div>`;
        }
      });
      html += `</body></html>`;
      
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `geoquiz-relatorio-${date}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let html = `<html><head><title>GeoQuiz</title><style>@media print{@page{size:A4;margin:15mm}}body{font-family:system-ui;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px}</style></head><body>`;
        html += `<h1>GeoQuiz - ${t('report', lang)}</h1><p>${date}</p>`;
        html += `<table><tr><th>${t('player', lang)}</th><th>${t('correct', lang)}</th><th>${t('incorrect', lang)}</th></tr>`;
        players.forEach(p => {
          const correct = gameRecords.filter(r => r.playerAnswers[p.id]?.correct).length;
          html += `<tr><td>${p.name}</td><td>${correct}</td><td>${questions.length - correct}</td></tr>`;
        });
        html += `</table></body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    }
    
    if (format === 'png') {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 48px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GeoQuiz', canvas.width / 2, 60);
        ctx.fillStyle = '#666';
        ctx.font = '20px system-ui';
        ctx.fillText(date, canvas.width / 2, 90);
        ctx.font = 'bold 28px system-ui';
        ctx.fillStyle = '#1a1a2e';
        players.forEach((p, i) => {
          const y = 150 + i * 60;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(120, y, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1a1a2e';
          ctx.textAlign = 'left';
          ctx.fillText(`${p.name}: ${p.score} ${t('points', lang)}`, 150, y + 8);
        });
        const barY = 150 + players.length * 60 + 40;
        ctx.font = 'bold 22px system-ui';
        ctx.fillStyle = '#1a1a2e';
        ctx.textAlign = 'center';
        ctx.fillText(t('byTopic', lang), canvas.width / 2, barY);
        ['tales', 'metric'].forEach((topic, ti) => {
          const topicQ = gameRecords.filter(r => r.topic === topic);
          const correct = topicQ.filter(r => r.playerAnswers[0]?.correct).length;
          const total = topicQ.length || 1;
          const pct = correct / total;
          const bx = 200 + ti * 350;
          const by = barY + 30;
          const bw = 200;
          const bh = 30;
          ctx.fillStyle = '#e5e7eb';
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = topic === 'tales' ? '#3b82f6' : '#06b6d4';
          ctx.fillRect(bx, by, bw * pct, bh);
          ctx.fillStyle = '#1a1a2e';
          ctx.font = '16px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(`${t(topic === 'tales' ? 'tales' : 'metricRelations', lang)}: ${Math.round(pct * 100)}%`, bx + bw / 2, by + bh + 25);
        });
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `geoquiz-resumo-${date}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
    setReportOpen(false);
  }

  // ==================== RENDER ====================
  return (
    <>
      {/* Background */}
      <div className="geoquiz-bg" aria-hidden="true">
        <div className="bg-bubble" />
        <div className="bg-bubble" />
      </div>
      
      {/* Reading ruler */}
      {settings.readingRuler && (
        <div className="reading-ruler active" style={{ top: rulerY - 16 }} aria-hidden="true" />
      )}
      
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      
      <div className="app-container">
        {/* Header */}
        <header className="app-header glass" role="banner">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 40 40" aria-hidden="true">
              <polygon points="20,5 5,35 35,35" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="5" y="28" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="32" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="32" y1="6" x2="32" y2="18" stroke="currentColor" strokeWidth="1" />
              <line x1="26" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className="logo-text">GeoQuiz</span>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-icon"
              onClick={() => setSettingsOpen(true)}
              aria-label={t('settings', settings.lang)}
              title={t('settings', settings.lang)}
              dangerouslySetInnerHTML={{ __html: icon('gear', 20) }}
            />
            <button
              className="btn btn-icon"
              onClick={() => setProfilesOpen(true)}
              aria-label={t('accessibility', settings.lang)}
              title={t('accessibility', settings.lang)}
              dangerouslySetInnerHTML={{ __html: icon('accessibility', 20) }}
            />
          </div>
        </header>
        
        {/* Main content */}
        <main id="main-content" role="main">
          {/* Welcome Screen */}
          {screen === 'welcome' && (
            <div className="screen active welcome-screen">
              <h1 className="welcome-title">{t('title', settings.lang)}</h1>
              <p className="welcome-subtitle">{t('subtitle', settings.lang)}</p>
              
              {/* Player count */}
              <div className="player-setup">
                <h2 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
                  {t('selectPlayers', settings.lang)}
                </h2>
                <div className="player-count-selector" role="radiogroup" aria-label={t('players', settings.lang)}>
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      className={`player-count-btn ${playerCount === n ? 'active' : ''}`}
                      onClick={() => { setPlayerCount(n); initPlayers(n); }}
                      role="radio"
                      aria-checked={playerCount === n}
                      aria-label={`${n} ${t('players', settings.lang).toLowerCase()}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                
                {/* Player cards */}
                <div className="player-cards">
                  {Array.from({ length: playerCount }, (_, i) => (
                    <div key={i} className="player-card glass">
                      <div className="player-card-header">
                        <span className="player-color-dot" style={{ background: PLAYER_COLORS[i] }} />
                        <strong>{t('player', settings.lang)} {i + 1}</strong>
                      </div>
                      <input
                        className="player-name-input"
                        type="text"
                        value={players[i]?.name || `${t('player', settings.lang)} ${i + 1}`}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          if (newPlayers[i]) {
                            newPlayers[i] = { ...newPlayers[i], name: e.target.value };
                            setPlayers(newPlayers);
                          } else {
                            initPlayers(playerCount);
                            setTimeout(() => {
                              setPlayers(prev => {
                                const updated = [...prev];
                                if (updated[i]) updated[i] = { ...updated[i], name: e.target.value };
                                return updated;
                              });
                            }, 0);
                          }
                        }}
                        aria-label={`${t('player', settings.lang)} ${i + 1} - nome`}
                      />
                      <div className="player-keys" aria-label={`${t('keys', settings.lang)} - ${t('player', settings.lang)} ${i + 1}`}>
                        {PLAYER_KEYS[i].map((key, ki) => (
                          <span key={ki} className="key-badge" title={`${String.fromCharCode(65 + ki)} = ${key}`}>
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Game mode */}
                <h3 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                  {t('gameMode', settings.lang)}
                </h3>
                <div className="mode-selector">
                  <button
                    className={`mode-btn ${gameMode === 'classic' ? 'active' : ''}`}
                    onClick={() => setGameMode('classic')}
                    aria-pressed={gameMode === 'classic'}
                  >
                    <span dangerouslySetInnerHTML={{ __html: icon('book', 32) }} />
                    <span>{t('classic', settings.lang)}</span>
                  </button>
                  <button
                    className={`mode-btn ${gameMode === 'ai' ? 'active' : ''}`}
                    onClick={() => setGameMode('ai')}
                    aria-pressed={gameMode === 'ai'}
                  >
                    <span dangerouslySetInnerHTML={{ __html: icon('sparkle', 32) }} />
                    <span>{t('ai', settings.lang)}</span>
                  </button>
                </div>
                
                {/* Match summary */}
                <div className="match-summary glass">
                  <h3>{t('matchSummary', settings.lang)}</h3>
                  <div className="match-info">
                    <span className="match-info-item">
                      <span dangerouslySetInnerHTML={{ __html: icon('person', 16) }} />
                      {playerCount} {t('players', settings.lang).toLowerCase()}
                    </span>
                    <span className="match-info-item">
                      <span dangerouslySetInnerHTML={{ __html: icon('question', 16) }} />
                      {totalQuestions} {t('questionsPerPlayer', settings.lang)} ({playerCount} × 7)
                    </span>
                    <span className="match-info-item">
                      <span dangerouslySetInnerHTML={{ __html: icon('timer', 16) }} />
                      {formatTime(settings.timerSeconds)} / {t('question', settings.lang).toLowerCase()}
                    </span>
                  </div>
                </div>
                
                {/* Start button */}
                <button className="btn btn-primary btn-lg" onClick={startGame} style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                  <span dangerouslySetInnerHTML={{ __html: icon('play', 20) }} />
                  {t('start', settings.lang)}
                </button>
              </div>
            </div>
          )}
          
          {/* Question Screen */}
          {screen === 'question' && questions[currentQuestionIndex] && (
            <div className="screen active question-screen">
              {/* Question header */}
              <div className="question-header">
                <span className="question-progress">
                  {t('question', settings.lang)} {currentQuestionIndex + 1} {t('of', settings.lang)} {questions.length}
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <span className={`question-topic`}>
                    <span dangerouslySetInnerHTML={{ __html: icon(questions[currentQuestionIndex].topic === 'tales' ? 'parallels' : 'triangle', 14) }} />
                    {t(questions[currentQuestionIndex].topic === 'tales' ? 'tales' : 'metricRelations', settings.lang)}
                  </span>
                  <span className={`question-difficulty difficulty-${questions[currentQuestionIndex].difficulty}`}>
                    {t(questions[currentQuestionIndex].difficulty, settings.lang)}
                  </span>
                </div>
              </div>
              
              {/* Timer and Score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div className={`timer-container ${isPaused ? 'paused' : ''} ${timeLeft <= 30 ? 'warning' : ''}`}>
                  <div className="timer" role="timer" aria-label={`${t('timeLeft', settings.lang)}: ${formatTime(timeLeft)}`}>
                    <div className="timer-ring">
                      <svg viewBox="0 0 76 76">
                        <circle className="timer-bg" cx="38" cy="38" r="35" />
                        <circle
                          className="timer-progress"
                          cx="38" cy="38" r="35"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                        />
                      </svg>
                    </div>
                    <span className="timer-text">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                
                <div className="score-bar" role="status" aria-label={t('score', settings.lang)}>
                  {players.map((player, i) => (
                    <div
                      key={i}
                      className={`score-capsule ${player.blocked ? 'blocked' : ''}`}
                      style={{ '--player-color': player.color } as React.CSSProperties}
                    >
                      <span className="score-dot" style={{ background: player.color }} />
                      <span>{player.name}</span>
                      <strong>{player.score}</strong>
                    </div>
                  ))}
                </div>
                
                <button
                  className="btn btn-sm"
                  onClick={() => { setIsPaused(!isPaused); }}
                  aria-label={isPaused ? t('resume', settings.lang) : t('pause', settings.lang)}
                >
                  <span dangerouslySetInnerHTML={{ __html: icon(isPaused ? 'play' : 'pause', 16) }} />
                </button>
              </div>
              
              {/* Question content */}
              <div className="question-content">
                <div className="question-statement glass">
                  <p>{questions[currentQuestionIndex].statement}</p>
                </div>
                
                <div className="question-figure">
                  <QuestionFigure question={questions[currentQuestionIndex]} />
                </div>
                
                {/* Options */}
                <div className="options-grid" role="radiogroup" aria-label={t('question', settings.lang)}>
                  {questions[currentQuestionIndex].options.map((option, oi) => (
                    <button
                      key={oi}
                      className={`option-btn ${
                        players.some(p => p.answerIndex === oi && p.answered) 
                          ? (oi === questions[currentQuestionIndex].correctIndex ? 'correct' : 'incorrect')
                          : ''
                      }`}
                      onClick={() => {
                        if (playerCount === 1 && !players[0]?.answered) {
                          handlePlayerAnswer(0, oi);
                        }
                      }}
                      disabled={players.some(p => p.answered || p.blocked)}
                      role="radio"
                      aria-checked={players.some(p => p.answerIndex === oi)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                      <span className="option-text">{option}</span>
                      {playerCount === 1 && (
                        <span className="option-key">{PLAYER_KEYS[0][oi]}</span>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Multiplayer key hints */}
                {playerCount > 1 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
                    {players.map((player, pi) => (
                      <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-sm)', color: 'var(--surface-text-secondary)' }}>
                        <span className="score-dot" style={{ background: player.color, width: 8, height: 8 }} />
                        <span>{player.name}:</span>
                        {player.keys.map((k, ki) => (
                          <span key={ki} className="key-badge" style={{ width: 24, height: 24, fontSize: 10 }}>{k}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Explanation Screen */}
          {screen === 'explanation' && questions[currentQuestionIndex] && (
            <div className="screen active explanation-screen">
              <div className="explanation-header">
                <h2>{t('explanation', settings.lang)}</h2>
                <span className="question-progress">
                  {t('question', settings.lang)} {currentQuestionIndex + 1} {t('of', settings.lang)} {questions.length}
                </span>
              </div>
              
              {/* Tabs */}
              <div className="explanation-tabs" role="tablist">
                {[
                  { key: 'mainIdea', label: t('mainIdea', settings.lang) },
                  { key: 'formula', label: t('formula', settings.lang) },
                  { key: 'steps', label: t('stepByStep', settings.lang) },
                  { key: 'verification', label: t('verification', settings.lang) },
                  { key: 'whyWrong', label: t('whyWrong', settings.lang) },
                  { key: 'tip', label: t('tip', settings.lang) },
                ].map((tab, i) => (
                  <button
                    key={tab.key}
                    className={`explanation-tab ${explanationTab === i ? 'active' : ''}`}
                    onClick={() => setExplanationTab(i)}
                    role="tab"
                    aria-selected={explanationTab === i}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Tab content */}
              <div className="explanation-content glass" role="tabpanel">
                {explanationTab === 0 && (
                  <div>
                    <h4>{t('mainIdea', settings.lang)}</h4>
                    <p>{questions[currentQuestionIndex].explanation.mainIdea}</p>
                  </div>
                )}
                {explanationTab === 1 && (
                  <div>
                    <h4>{t('formula', settings.lang)}</h4>
                    <div className="formula-box">{questions[currentQuestionIndex].explanation.formula}</div>
                  </div>
                )}
                {explanationTab === 2 && (
                  <div>
                    <h4>{t('stepByStep', settings.lang)}</h4>
                    <ol>
                      {questions[currentQuestionIndex].explanation.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {explanationTab === 3 && (
                  <div>
                    <h4>{t('verification', settings.lang)}</h4>
                    <p>{questions[currentQuestionIndex].explanation.verification}</p>
                  </div>
                )}
                {explanationTab === 4 && (
                  <div>
                    <h4>{t('whyWrong', settings.lang)}</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {questions[currentQuestionIndex].explanation.whyWrong.map((reason, i) => (
                        <li key={i} style={{ marginBottom: 'var(--space-sm)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                          <span style={{ color: '#ef4444' }} dangerouslySetInnerHTML={{ __html: icon('x', 16) }} />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {explanationTab === 5 && (
                  <div>
                    <h4>{t('tip', settings.lang)}</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--color-primary)' }} dangerouslySetInnerHTML={{ __html: icon('lightbulb', 20) }} />
                      <p>{questions[currentQuestionIndex].explanation.tip}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Player answers summary */}
              <div className="player-answers-summary">
                {players.map((player, pi) => {
                  const isCorrect = player.answerIndex === questions[currentQuestionIndex].correctIndex;
                  const hasAnswer = player.answerIndex !== null;
                  return (
                    <div key={pi} className={`player-answer-item ${hasAnswer ? (isCorrect ? 'correct' : 'incorrect') : 'incorrect'}`}>
                      <span className="score-dot" style={{ background: player.color, width: 8, height: 8 }} />
                      <span>{player.name}:</span>
                      <span dangerouslySetInnerHTML={{ __html: icon(hasAnswer ? (isCorrect ? 'check' : 'x') : 'alert', 14) }} />
                      <span>{hasAnswer ? (isCorrect ? t('correct', settings.lang) : t('incorrect', settings.lang)) : t('noAnswer', settings.lang)}</span>
                      {player.answerTime !== null && (
                        <span style={{ fontSize: '11px', opacity: 0.7 }}>{player.answerTime}s</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Next button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
                <button className="btn btn-primary btn-lg" onClick={nextQuestion}>
                  {currentQuestionIndex + 1 >= questions.length ? t('report', settings.lang) : t('next', settings.lang)}
                  <span dangerouslySetInnerHTML={{ __html: icon('arrowRight', 18) }} />
                </button>
              </div>
            </div>
          )}
          
          {/* Results Screen */}
          {screen === 'results' && (
            <div className="screen active results-screen">
              <div className="results-winner glass">
                {playerCount === 1 ? (
                  <>
                    <div className="winner-icon" dangerouslySetInnerHTML={{ __html: icon('trophy', 64) }} />
                    <h2 className="winner-name">{t('yourScore', settings.lang)}</h2>
                    <p className="winner-score">
                      {players[0]?.score || 0} {t('correctOf', settings.lang)} {questions.length}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="winner-icon" dangerouslySetInnerHTML={{ __html: icon('trophy', 64) }} />
                    {(() => {
                      const maxScore = Math.max(...players.map(p => p.score));
                      const winners = players.filter(p => p.score === maxScore);
                      if (winners.length > 1) {
                        return (
                          <>
                            <h2 className="winner-name">{t('tie', settings.lang)}!</h2>
                            <p className="winner-score">{winners.map(w => w.name).join(', ')} - {maxScore} {t('points', settings.lang)}</p>
                          </>
                        );
                      }
                      return (
                        <>
                          <h2 className="winner-name">{t('winner', settings.lang)}: {winners[0].name}</h2>
                          <p className="winner-score">{maxScore} {t('points', settings.lang)}</p>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
              
              {/* Results table */}
              <table className="results-table glass" role="table">
                <thead>
                  <tr>
                    <th>{t('player', settings.lang)}</th>
                    <th>{t('correct', settings.lang)}</th>
                    <th>{t('incorrect', settings.lang)}</th>
                    <th>{t('noAnswer', settings.lang)}</th>
                    <th>{t('accuracy', settings.lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, i) => {
                    const correct = gameRecords.filter(r => r.playerAnswers[i]?.correct).length;
                    const answered = gameRecords.filter(r => r.playerAnswers[i]?.answer !== null).length;
                    const wrong = answered - correct;
                    const noAnswer = questions.length - answered;
                    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
                    return (
                      <tr key={i}>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                            <span className="score-dot" style={{ background: player.color, width: 10, height: 10 }} />
                            {player.name}
                          </span>
                        </td>
                        <td style={{ color: '#22c55e' }}>{correct}</td>
                        <td style={{ color: '#ef4444' }}>{wrong}</td>
                        <td>{noAnswer}</td>
                        <td>{accuracy}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Performance bars */}
              <div className="glass" style={{ padding: 'var(--space-lg)', width: '100%', maxWidth: '600px' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('byTopic', settings.lang)}</h3>
                <div className="bar-chart">
                  {['tales', 'metric'].map(topic => {
                    const topicQuestions = gameRecords.filter(r => r.topic === topic);
                    const topicCorrect = topicQuestions.filter(r => r.playerAnswers[0]?.correct).length;
                    const total = topicQuestions.length || 1;
                    const pct = Math.round((topicCorrect / total) * 100);
                    return (
                      <div className="bar-item" key={topic}>
                        <span className="bar-value">{pct}%</span>
                        <div className="bar" style={{ height: `${pct}%`, background: topic === 'tales' ? 'var(--color-primary)' : 'var(--color-secondary)' }} />
                        <span className="bar-label">{t(topic === 'tales' ? 'tales' : 'metricRelations', settings.lang)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Actions */}
              <div className="results-actions">
                <button className="btn btn-primary" onClick={() => setReportOpen(true)}>
                  <span dangerouslySetInnerHTML={{ __html: icon('download', 18) }} />
                  {t('report', settings.lang)}
                </button>
                <button className="btn" onClick={() => setScreen('errorAnalysis')}>
                  <span dangerouslySetInnerHTML={{ __html: icon('chart', 18) }} />
                  {t('analyzeErrors', settings.lang)}
                </button>
                <button className="btn" onClick={playAgain}>
                  <span dangerouslySetInnerHTML={{ __html: icon('restart', 18) }} />
                  {t('playAgain', settings.lang)}
                </button>
              </div>
            </div>
          )}
          
          {/* Error Analysis Screen */}
          {screen === 'errorAnalysis' && (
            <div className="screen active error-analysis-screen">
              <h2 style={{ textAlign: 'center' }}>{t('errorAnalysis', settings.lang)}</h2>
              
              {gameRecords.filter(r => !r.playerAnswers[0]?.correct).length === 0 ? (
                <div className="glass" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                  <span dangerouslySetInnerHTML={{ __html: icon('check', 48) }} style={{ color: '#22c55e' }} />
                  <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
                    {t('noErrors', settings.lang)}
                  </p>
                </div>
              ) : (
                <>
                  {gameRecords.filter(r => !r.playerAnswers[0]?.correct).map((record, idx) => {
                    const q = questions[record.questionIndex];
                    if (!q) return null;
                    return (
                      <div key={idx} className="glass" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
                        <h4>{t('question', settings.lang)} {record.questionIndex + 1}</h4>
                        <p style={{ margin: 'var(--space-sm) 0' }}>{q.statement}</p>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                          <span style={{ color: '#ef4444' }}>
                            {t('yourAnswer', settings.lang)}: {record.playerAnswers[0]?.answer !== null ? q.options[record.playerAnswers[0].answer!] : t('noAnswer', settings.lang)}
                          </span>
                          <span style={{ color: '#22c55e' }}>
                            {t('correctAnswer', settings.lang)}: {q.options[record.correctIndex]}
                          </span>
                        </div>
                        <div style={{ marginTop: 'var(--space-md)' }}>
                          <strong>{t('probableCause', settings.lang)}:</strong>
                          <p style={{ marginTop: 'var(--space-xs)', color: 'var(--surface-text-secondary)' }}>
                            {record.playerAnswers[0]?.answer === null 
                              ? t('ranOutOfTime', settings.lang)
                              : q.explanation.whyWrong[record.playerAnswers[0].answer!] || t('calculationError', settings.lang)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
                <button className="btn" onClick={() => setScreen('results')}>
                  <span dangerouslySetInnerHTML={{ __html: icon('arrowLeft', 18) }} />
                  {t('skip', settings.lang)}
                </button>
              </div>
            </div>
          )}
          
          {/* Loading Screen */}
          {screen === 'loading' && (
            <div className="screen active loading-screen">
              <div className="loading-spinner" />
              <p>{t('generating', settings.lang)}</p>
              <div className="loading-progress">
                <div className="loading-progress-bar" style={{ width: '50%' }} />
              </div>
              <button className="btn" onClick={() => setScreen('welcome')}>
                {t('cancel', settings.lang)}
              </button>
            </div>
          )}
        </main>
      </div>
      
      {/* Settings Panel */}
      <div className={`settings-overlay ${settingsOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setSettingsOpen(false); }}>
        <div className="settings-panel glass" role="dialog" aria-label={t('settings', settings.lang)}>
          <div className="settings-header">
            <h2>{t('settings', settings.lang)}</h2>
            <button className="btn btn-icon" onClick={() => setSettingsOpen(false)} aria-label={t('close', settings.lang)}>
              <span dangerouslySetInnerHTML={{ __html: icon('close', 20) }} />
            </button>
          </div>
          
          {/* Language */}
          <div className="settings-section">
            <h3>{t('language', settings.lang)}</h3>
            <div className="settings-row">
              <label>{t('language', settings.lang)}</label>
              <select value={settings.lang} onChange={(e) => setSettings(s => ({ ...s, lang: e.target.value }))}>
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Appearance */}
          <div className="settings-section">
            <h3>{t('appearance', settings.lang)}</h3>
            <div className="settings-row">
              <label>{t('theme', settings.lang)}</label>
              <div className="theme-selector">
                {(['auto', 'light', 'dark'] as const).map(th => (
                  <button
                    key={th}
                    className={`theme-btn ${settings.theme === th ? 'active' : ''}`}
                    onClick={() => setSettings(s => ({ ...s, theme: th }))}
                  >
                    {t(th, settings.lang)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="settings-row">
              <label>{t('palette', settings.lang)}</label>
              <div className="palette-grid" style={{ width: '100%' }}>
                {Object.entries(PALETTES).map(([key, pal]) => (
                  <button
                    key={key}
                    className={`palette-btn ${settings.palette === key ? 'active' : ''}`}
                    onClick={() => setSettings(s => ({ ...s, palette: key }))}
                  >
                    <div className="palette-preview">
                      <span style={{ background: pal.primary }} />
                      <span style={{ background: pal.secondary }} />
                      <span style={{ background: pal.accent }} />
                    </div>
                    <span>{t(key, settings.lang)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Accessibility */}
          <div className="settings-section">
            <h3>{t('accessibility', settings.lang)}</h3>
            
            <div className="settings-row">
              <label>{t('fontSize', settings.lang)}: {settings.fontSize}%</label>
              <input type="range" min="80" max="200" step="10" value={settings.fontSize}
                onChange={(e) => setSettings(s => ({ ...s, fontSize: Number(e.target.value) }))}
                style={{ width: '120px' }}
              />
            </div>
            
            <div className="settings-row">
              <label>{t('highContrast', settings.lang)}</label>
              <button
                className={`toggle ${settings.highContrast ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, highContrast: !s.highContrast }))}
                role="switch"
                aria-checked={settings.highContrast}
              />
            </div>
            
            <div className="settings-row">
              <label>{t('largeTargets', settings.lang)}</label>
              <button
                className={`toggle ${settings.largeTargets ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, largeTargets: !s.largeTargets }))}
                role="switch"
                aria-checked={settings.largeTargets}
              />
            </div>
            
            <div className="settings-row">
              <label>{t('readingRuler', settings.lang)}</label>
              <button
                className={`toggle ${settings.readingRuler ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, readingRuler: !s.readingRuler }))}
                role="switch"
                aria-checked={settings.readingRuler}
              />
            </div>
            
            <div className="settings-row">
              <label>{t('focusMode', settings.lang)}</label>
              <button
                className={`toggle ${settings.focusMode ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, focusMode: !s.focusMode }))}
                role="switch"
                aria-checked={settings.focusMode}
              />
            </div>
            
            <div className="settings-row">
              <label>{t('letterSpacing', settings.lang)}: {settings.letterSpacing}px</label>
              <input type="range" min="0" max="5" step="0.5" value={settings.letterSpacing}
                onChange={(e) => setSettings(s => ({ ...s, letterSpacing: Number(e.target.value) }))}
                style={{ width: '120px' }}
              />
            </div>
            
            <div className="settings-row">
              <label>{t('lineHeight', settings.lang)}: {settings.lineHeight}</label>
              <input type="range" min="1.2" max="2.5" step="0.1" value={settings.lineHeight}
                onChange={(e) => setSettings(s => ({ ...s, lineHeight: Number(e.target.value) }))}
                style={{ width: '120px' }}
              />
            </div>
          </div>
          
          {/* Animations */}
          <div className="settings-section">
            <h3>{t('animations', settings.lang)}</h3>
            <div className="settings-row">
              <label>{t('animations', settings.lang)}</label>
              <button
                className={`toggle ${settings.animations ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, animations: !s.animations }))}
                role="switch"
                aria-checked={settings.animations}
              />
            </div>
            <div className="settings-row">
              <label>{t('glassEffects', settings.lang)}</label>
              <button
                className={`toggle ${settings.glassEffects ? 'active' : ''}`}
                onClick={() => setSettings(s => ({ ...s, glassEffects: !s.glassEffects }))}
                role="switch"
                aria-checked={settings.glassEffects}
              />
            </div>
          </div>
          
          {/* Timer */}
          <div className="settings-section">
            <h3>{t('timer', settings.lang) !== 'timer' ? t('timer', settings.lang) : 'Tempo'}</h3>
            <div className="settings-row">
              <label>{t('question', settings.lang)}</label>
              <select value={settings.timerSeconds} onChange={(e) => setSettings(s => ({ ...s, timerSeconds: Number(e.target.value) }))}>
                <option value={180}>3 {t('minutes', settings.lang)}</option>
                <option value={270}>4:30 {t('minutes', settings.lang)}</option>
                <option value={360}>6 {t('minutes', settings.lang)}</option>
                <option value={9999}>{t('noLimit', settings.lang)}</option>
              </select>
            </div>
          </div>
          
          {/* Restore defaults */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
            <button className="btn" onClick={() => {
              setSettings({
                lang: 'pt', theme: 'auto', palette: 'ocean', accentColor: '#3b82f6',
                animations: true, glassEffects: true, fontSize: 100, letterSpacing: 0,
                wordSpacing: 0, lineHeight: 1.5, highContrast: false, soundEnabled: false,
                volume: 50, speechRate: 1, timerSeconds: 180, confirmBeforeSubmit: false,
                largeTargets: false, focusMode: false, readingRuler: false,
              });
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('restart', 16) }} />
              {t('restoreDefaults', settings.lang)}
            </button>
          </div>
        </div>
      </div>
      
      {/* Report Modal */}
      <div className={`report-modal ${reportOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setReportOpen(false); }}>
        <div className="report-content glass" role="dialog" aria-label={t('report', settings.lang)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2>{t('saveAs', settings.lang)}</h2>
            <button className="btn btn-icon" onClick={() => setReportOpen(false)} aria-label={t('close', settings.lang)}>
              <span dangerouslySetInnerHTML={{ __html: icon('close', 20) }} />
            </button>
          </div>
          
          <div className="report-options">
            <button className="report-option-btn" onClick={() => exportReport('html')}>
              <span dangerouslySetInnerHTML={{ __html: icon('document', 32) }} />
              <span>{t('html', settings.lang)}</span>
            </button>
            <button className="report-option-btn" onClick={() => exportReport('pdf')}>
              <span dangerouslySetInnerHTML={{ __html: icon('printer', 32) }} />
              <span>{t('pdf', settings.lang)}</span>
            </button>
            <button className="report-option-btn" onClick={() => exportReport('png')}>
              <span dangerouslySetInnerHTML={{ __html: icon('image', 32) }} />
              <span>{t('png', settings.lang)}</span>
            </button>
            <button className="report-option-btn" onClick={() => exportReport('txt')}>
              <span dangerouslySetInnerHTML={{ __html: icon('document', 32) }} />
              <span>{t('txt', settings.lang)}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Accessibility Profiles Dialog */}
      <div className={`profiles-dialog ${profilesOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setProfilesOpen(false); }}>
        <div className="profiles-content glass" role="dialog" aria-label={t('accessibility', settings.lang)}>
          <h2>{firstVisit ? t('welcome', settings.lang) : t('accessibility', settings.lang)}</h2>
          <p style={{ color: 'var(--surface-text-secondary)', marginTop: 'var(--space-sm)' }}>
            {t('accessibilityPrompt', settings.lang)}
          </p>
          
          <div className="profiles-grid">
            <button className="profile-btn" onClick={() => {
              setSettings(s => ({ ...s, fontSize: 120, letterSpacing: 1, lineHeight: 1.8 }));
              setProfilesOpen(false);
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('textAa', 24) }} />
              <span>{t('profileDyslexia', settings.lang)}</span>
            </button>
            <button className="profile-btn" onClick={() => {
              setSettings(s => ({ ...s, fontSize: 150, highContrast: true }));
              setProfilesOpen(false);
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('eye', 24) }} />
              <span>{t('profileLowVision', settings.lang)}</span>
            </button>
            <button className="profile-btn" onClick={() => {
              setSettings(s => ({ ...s, palette: 'graphite' }));
              setProfilesOpen(false);
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('palette', 24) }} />
              <span>{t('profileColorBlind', settings.lang)}</span>
            </button>
            <button className="profile-btn" onClick={() => {
              setSettings(s => ({ ...s, focusMode: true, animations: false }));
              setProfilesOpen(false);
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('eye', 24) }} />
              <span>{t('profileADHD', settings.lang)}</span>
            </button>
            <button className="profile-btn" onClick={() => {
              setSettings(s => ({ ...s, largeTargets: true }));
              setProfilesOpen(false);
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('touch', 24) }} />
              <span>{t('profileMotor', settings.lang)}</span>
            </button>
            <button className="profile-btn" onClick={() => {
              setSettings(s => ({ ...s, fontSize: 130 }));
              setProfilesOpen(false);
            }}>
              <span dangerouslySetInnerHTML={{ __html: icon('speakerOn', 24) }} />
              <span>{t('profileScreenReader', settings.lang)}</span>
            </button>
          </div>
          
          <button className="btn" onClick={() => setProfilesOpen(false)} style={{ marginTop: 'var(--space-md)' }}>
            {t('close', settings.lang)}
          </button>
        </div>
      </div>
      
      {/* Live region for screen readers */}
      <div aria-live="polite" className="sr-only" role="status">
        {screen === 'question' && `${t('question', settings.lang)} ${currentQuestionIndex + 1} ${t('of', settings.lang)} ${questions.length}. ${t('timeLeft', settings.lang)}: ${formatTime(timeLeft)}`}
        {screen === 'explanation' && t('explanation', settings.lang)}
        {screen === 'results' && t('score', settings.lang)}
      </div>
    </>
  );
}
