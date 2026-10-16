// GeoQuiz Types
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Topic = 'tales' | 'metrics';
export type GameScreen = 'start' | 'game' | 'explanation' | 'final' | 'report' | 'errorAnalysis';
export type ThemeMode = 'auto' | 'light' | 'dark';
export type Language = 'pt' | 'en' | 'es' | 'it' | 'fr' | 'ru' | 'zh' | 'ja';
export type FontFamily = 'system' | 'serif' | 'mono' | 'rounded' | 'readable';

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  text: string;
  figureType: 'tales' | 'triangle' | 'ladder' | 'shadow' | 'ramp' | 'tower' | 'none';
  figureParams?: Record<string, number>;
  alternatives: string[];
  correctIndex: number;
  explanation: {
    mainIdea: string;
    formula: string;
    steps: string[];
    verification: string;
    wrongReasons: string[];
    tip: string;
  };
  isGenerated?: boolean;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  keys: string[];
  score: number;
  answers: PlayerAnswer[];
  blocked: boolean;
}

export interface PlayerAnswer {
  questionId: string;
  selectedIndex: number | null;
  timeSpent: number;
  correct: boolean;
  topic: Topic;
  difficulty: Difficulty;
}

export interface GameState {
  screen: GameScreen;
  players: Player[];
  currentQuestionIndex: number;
  questions: Question[];
  timeLeft: number;
  isPaused: boolean;
  firstAnswerer: number | null;
  gameMode: 'classic' | 'ai';
  totalQuestions: number;
}

export interface Settings {
  language: Language;
  theme: ThemeMode;
  palette: string;
  accentColor: string;
  fontFamily: FontFamily;
  fontSize: number;
  animationsEnabled: boolean;
  glassEnabled: boolean;
  aiEnabled: boolean;
  aiApiKey: string;
  aiModel: string;
}

export interface ReportData {
  date: string;
  players: Player[];
  questions: Question[];
  winner: string | null;
  isTie: boolean;
  totalQuestions: number;
}

export const PLAYER_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
export const PLAYER_KEYS = [
  ['1', '2', '3', '4', '5'],
  ['q', 'w', 'e', 'r', 't'],
  ['a', 's', 'd', 'f', 'g'],
  ['z', 'x', 'c', 'v', 'b'],
];
export const KEY_LABELS = [
  ['1–5'],
  ['Q W E R T'],
  ['A S D F G'],
  ['Z X C V B'],
];
