import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { Question } from './types';
import SplashScreen from './components/SplashScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ExplanationScreen from './components/ExplanationScreen';
import FinalScreen from './components/FinalScreen';
import Settings from './components/Settings';
import Report from './components/Report';
import ErrorAnalysis from './components/ErrorAnalysis';
import AIMode from './components/AIMode';
import './index.css';

function App() {
  const {
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
  } = useGameState();

  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showErrorAnalysis, setShowErrorAnalysis] = useState(false);
  const [showAILoading, setShowAILoading] = useState(false);
  const [aiPlayerCount, setAiPlayerCount] = useState(1);

  // Theme management
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    const applyTheme = (dark: boolean) => {
      root.classList.toggle('dark', dark);
      root.classList.toggle('light', !dark);
    };

    if (settings.theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(settings.theme === 'dark');
    }
  }, [settings.theme]);

  // Apply accent color
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', settings.accentColor);
    
    // Derive secondary color
    const hex = settings.accentColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const secondary = `rgb(${Math.min(255, r + 60)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 20)})`;
    root.style.setProperty('--accent-secondary', secondary);
  }, [settings.accentColor]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
  }, [settings.fontSize]);

  // Apply font family
  useEffect(() => {
    const fonts: Record<string, string> = {
      system: 'system-ui, -apple-system, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      mono: '"SF Mono", "Fira Code", monospace',
      rounded: '"Nunito", "Varela Round", system-ui, sans-serif',
      readable: '"Open Sans", "Segoe UI", system-ui, sans-serif',
    };
    document.documentElement.style.setProperty('--font-family', fonts[settings.fontFamily] || fonts.system);
  }, [settings.fontFamily]);

  // Apply animations class
  useEffect(() => {
    document.documentElement.classList.toggle('no-animations', !settings.animationsEnabled);
    document.documentElement.classList.toggle('no-glass', !settings.glassEnabled);
  }, [settings.animationsEnabled, settings.glassEnabled]);

  // Timer management
  useEffect(() => {
    if (gameState.screen === 'game' && !gameState.isPaused && !showSettings) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [gameState.screen, gameState.isPaused, showSettings]);

  // Handle game start with AI mode
  const handleStartGame = (numPlayers: number, names: string[], mode: 'classic' | 'ai') => {
    if (mode === 'ai' && settings.aiEnabled && settings.aiApiKey) {
      setAiPlayerCount(numPlayers);
      setAiPlayerNames(names);
      setShowAILoading(true);
    } else {
      startGame(numPlayers, names, mode);
    }
  };

  const [aiPlayerNames, setAiPlayerNames] = useState<string[]>([]);

  const handleAIComplete = (questions: Question[]) => {
    setShowAILoading(false);
    // Start game with AI-generated questions
    startGame(aiPlayerCount, aiPlayerNames, 'ai');
  };

  const handleAICancel = () => {
    setShowAILoading(false);
  };

  const handleAIError = (message: string) => {
    setShowAILoading(false);
    // Fallback to classic mode
    alert(`AI Error: ${message}\nFalling back to Classic mode.`);
    startGame(aiPlayerCount, aiPlayerNames, 'classic');
  };

  // Handle settings open during game (pause)
  const openSettings = () => {
    if (gameState.screen === 'game') {
      pauseTimer();
    }
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
    if (gameState.screen === 'game') {
      resumeTimer();
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="geoquiz-app">
      {/* Background effects */}
      <div className="bg-effects">
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
        <div className="bubble bubble-4" />
        <div className="bubble bubble-5" />
      </div>

      {/* Main content */}
      <main className="main-content">
        {gameState.screen === 'start' && (
          <StartScreen
            lang={settings.language}
            aiEnabled={settings.aiEnabled}
            onStart={handleStartGame}
            onSettings={openSettings}
          />
        )}

        {gameState.screen === 'game' && (
          <GameScreen
            gameState={gameState}
            lang={settings.language}
            onAnswer={handleAnswer}
            onPause={openSettings}
          />
        )}

        {gameState.screen === 'explanation' && (
          <ExplanationScreen
            gameState={gameState}
            lang={settings.language}
            onNext={nextQuestion}
          />
        )}

        {gameState.screen === 'final' && !showReport && !showErrorAnalysis && (
          <FinalScreen
            gameState={gameState}
            lang={settings.language}
            onPlayAgain={resetGame}
            onReport={() => setShowReport(true)}
            onErrorAnalysis={() => setShowErrorAnalysis(true)}
          />
        )}

        {showReport && (
          <Report
            gameState={gameState}
            lang={settings.language}
            onClose={() => setShowReport(false)}
          />
        )}

        {showErrorAnalysis && (
          <ErrorAnalysis
            gameState={gameState}
            lang={settings.language}
            onClose={() => setShowErrorAnalysis(false)}
          />
        )}
      </main>

      {/* Settings overlay */}
      {showSettings && (
        <Settings
          settings={settings}
          onUpdate={updateSettings}
          onClose={closeSettings}
          lang={settings.language}
        />
      )}

      {/* AI Loading */}
      {showAILoading && (
        <AIMode
          apiKey={settings.aiApiKey}
          model={settings.aiModel}
          lang={settings.language}
          totalQuestions={aiPlayerCount * 7}
          onComplete={handleAIComplete}
          onCancel={handleAICancel}
          onError={handleAIError}
        />
      )}
    </div>
  );
}

export default App;
