import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Player, PlayerAnswer, Question, Settings, Language } from '../types';
import { selectQuestions } from '../data/questions';
import { PLAYER_COLORS, PLAYER_KEYS } from '../types';

const DEFAULT_SETTINGS: Settings = {
  language: 'pt',
  theme: 'auto',
  palette: 'ocean',
  accentColor: '#0ea5e9',
  fontFamily: 'system',
  fontSize: 100,
  animationsEnabled: true,
  glassEnabled: true,
  aiEnabled: false,
  aiApiKey: '',
  aiModel: 'gemini-2.0-flash',
};

const QUESTION_TIME = 180; // 3 minutes in seconds

export function useGameState() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('geoquiz-settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [gameState, setGameState] = useState<GameState>({
    screen: 'start',
    players: [],
    currentQuestionIndex: 0,
    questions: [],
    timeLeft: QUESTION_TIME,
    isPaused: false,
    firstAnswerer: null,
    gameMode: 'classic',
    totalQuestions: 7,
  });

  const timerRef = useRef<number | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Save settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('geoquiz-settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Initialize game
  const startGame = useCallback((numPlayers: number, names: string[], mode: 'classic' | 'ai') => {
    const players: Player[] = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: names[i] || `Jogador ${i + 1}`,
      color: PLAYER_COLORS[i],
      keys: PLAYER_KEYS[i],
      score: 0,
      answers: [],
      blocked: false,
    }));

    const questions = selectQuestions(numPlayers);
    const totalQuestions = numPlayers * 7;

    setGameState({
      screen: 'game',
      players,
      currentQuestionIndex: 0,
      questions,
      timeLeft: QUESTION_TIME,
      isPaused: false,
      firstAnswerer: null,
      gameMode: mode,
      totalQuestions,
    });
    questionStartTimeRef.current = Date.now();
  }, []);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setGameState(prev => {
        if (prev.isPaused || prev.screen !== 'game') return prev;
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          // Time's up - move to explanation
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return { ...prev, timeLeft: 0, screen: 'explanation', isPaused: true };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeTimer = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  // Handle player answer
  const handleAnswer = useCallback((playerId: number, alternativeIndex: number) => {
    setGameState(prev => {
      if (prev.screen !== 'game' || prev.isPaused) return prev;
      
      const player = prev.players[playerId];
      if (!player || player.blocked) return prev;
      
      // Check if already answered
      const currentQ = prev.questions[prev.currentQuestionIndex];
      if (!currentQ) return prev;
      
      const alreadyAnswered = player.answers.some(a => a.questionId === currentQ.id);
      if (alreadyAnswered) return prev;

      const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000;
      const isCorrect = alternativeIndex === currentQ.correctIndex;
      
      const answer: PlayerAnswer = {
        questionId: currentQ.id,
        selectedIndex: alternativeIndex,
        timeSpent,
        correct: isCorrect,
        topic: currentQ.topic,
        difficulty: currentQ.difficulty,
      };

      const newPlayers = prev.players.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            score: isCorrect && prev.firstAnswerer === null ? p.score + 1 : p.score,
            answers: [...p.answers, answer],
            blocked: !isCorrect,
          };
        }
        return p;
      });

      const newFirstAnswerer = prev.firstAnswerer === null && isCorrect ? playerId : prev.firstAnswerer;
      
      // Check if all players answered or are blocked
      const allDone = newPlayers.every(p => 
        p.blocked || p.answers.some(a => a.questionId === currentQ.id)
      );

      if (allDone) {
        return {
          ...prev,
          players: newPlayers,
          firstAnswerer: newFirstAnswerer,
          screen: 'explanation',
          isPaused: true,
        };
      }

      return {
        ...prev,
        players: newPlayers,
        firstAnswerer: newFirstAnswerer,
      };
    });
  }, []);

  // Move to next question
  const nextQuestion = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, screen: 'final', isPaused: true };
      }
      questionStartTimeRef.current = Date.now();
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        timeLeft: QUESTION_TIME,
        isPaused: false,
        firstAnswerer: null,
        players: prev.players.map(p => ({ ...p, blocked: false })),
        screen: 'game',
      };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    stopTimer();
    setGameState({
      screen: 'start',
      players: [],
      currentQuestionIndex: 0,
      questions: [],
      timeLeft: QUESTION_TIME,
      isPaused: false,
      firstAnswerer: null,
      gameMode: 'classic',
      totalQuestions: 7,
    });
  }, [stopTimer]);

  // Cleanup
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return {
    gameState,
    settings,
    updateSettings,
    startGame,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    handleAnswer,
    nextQuestion,
    resetGame,
  };
}
