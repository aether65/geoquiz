import React, { useState, useEffect, useCallback } from 'react';
import { Language, Question, Topic, Difficulty } from '../types';
import { t } from '../data/i18n';
import { IconRobot } from './Icons';

interface AIModeProps {
  apiKey: string;
  model: string;
  lang: Language;
  totalQuestions: number;
  onComplete: (questions: Question[]) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

const AI_LOADING_MESSAGES = {
  pt: ['Gerando questões únicas...', 'Criando problemas originais...', 'Validando respostas...'],
  en: ['Generating unique questions...', 'Creating original problems...', 'Validating answers...'],
  es: ['Generando preguntas únicas...', 'Creando problemas originales...', 'Validando respuestas...'],
  fr: ['Génération de questions uniques...', 'Création de problèmes originaux...', 'Validation des réponses...'],
  it: ['Generazione di domande uniche...', 'Creazione di problemi originali...', 'Convalida delle risposte...'],
  ru: ['Генерация уникальных вопросов...', 'Создание оригинальных задач...', 'Проверка ответов...'],
  zh: ['正在生成独特题目...', '创建原创问题...', '验证答案...'],
  ja: ['ユニークな問題を生成中...', 'オリジナル問題を作成中...', '回答を検証中...'],
};

const AIMode: React.FC<AIModeProps> = ({ apiKey, model, lang, totalQuestions, onComplete, onCancel, onError }) => {
  const [progress, setProgress] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  const messages = AI_LOADING_MESSAGES[lang] || AI_LOADING_MESSAGES.pt;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const generateQuestions = useCallback(async () => {
    if (!apiKey) {
      onError('API key not configured');
      return;
    }

    try {
      const talesCount = Math.ceil(totalQuestions / 2);
      const metricsCount = totalQuestions - talesCount;
      const allQuestions: Question[] = [];

      // Generate Tales questions
      const talesPrompt = `Generate ${talesCount} math questions about Thales' Theorem (proportionality with parallel lines cut by transversals) for 9th grade students. 
Difficulty progression: ${Math.ceil(talesCount/3)} easy, ${Math.ceil(talesCount/3)} medium, ${Math.ceil(talesCount/3)} hard.
Language: ${lang}.
Each question must have:
- A real-world context (shadows, buildings, parallel streets, etc.)
- 5 alternatives (A-E) with only one correct
- The correct answer index (0-4)
- A 6-part explanation: mainIdea, formula, steps (array), verification, wrongReasons (array of 4), tip
- figureType: "tales"
- figureParams with numeric values

Return JSON array with this exact structure:
[{
  "topic": "tales",
  "difficulty": "easy|medium|hard",
  "text": "question text",
  "figureType": "tales",
  "figureParams": {"a": number, "b": number, "c": number, "d": number},
  "alternatives": ["opt A", "opt B", "opt C", "opt D", "opt E"],
  "correctIndex": number,
  "explanation": {
    "mainIdea": "...",
    "formula": "...",
    "steps": ["1. ...", "2. ..."],
    "verification": "...",
    "wrongReasons": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "tip": "..."
  }
}]`;

      const metricsPrompt = `Generate ${metricsCount} math questions about Metric Relations in right triangles (Pythagorean theorem: a²=b²+c², h²=m·n, b²=a·m, c²=a·n, a·h=b·c) for 9th grade students.
Difficulty progression: ${Math.ceil(metricsCount/3)} easy, ${Math.ceil(metricsCount/3)} medium, ${Math.ceil(metricsCount/3)} hard.
Language: ${lang}.
Each question must have:
- A real-world context (ladders, towers, cables, ramps, etc.)
- 5 alternatives (A-E) with only one correct
- The correct answer index (0-4)
- A 6-part explanation: mainIdea, formula, steps (array), verification, wrongReasons (array of 4), tip
- figureType: "triangle" or "ladder"
- figureParams with numeric values

Return JSON array with this exact structure:
[{
  "topic": "metrics",
  "difficulty": "easy|medium|hard",
  "text": "question text",
  "figureType": "triangle|ladder",
  "figureParams": {"a": number, "b": number, "c": number},
  "alternatives": ["opt A", "opt B", "opt C", "opt D", "opt E"],
  "correctIndex": number,
  "explanation": {
    "mainIdea": "...",
    "formula": "...",
    "steps": ["1. ...", "2. ..."],
    "verification": "...",
    "wrongReasons": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "tip": "..."
  }
}]`;

      // Fetch Tales questions
      setProgress(20);
      const talesResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: talesPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.8,
            }
          }),
        }
      );

      if (!talesResponse.ok) {
        const err = await talesResponse.json();
        throw new Error(err.error?.message || 'API error');
      }

      const talesData = await talesResponse.json();
      const talesText = talesData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (talesText) {
        const talesQuestions = JSON.parse(talesText);
        allQuestions.push(...talesQuestions.map((q: any, i: number) => ({
          ...q,
          id: `ai-tales-${Date.now()}-${i}`,
          isGenerated: true,
        })));
      }

      setProgress(60);

      // Fetch Metrics questions
      const metricsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: metricsPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.8,
            }
          }),
        }
      );

      if (!metricsResponse.ok) {
        const err = await metricsResponse.json();
        throw new Error(err.error?.message || 'API error');
      }

      const metricsData = await metricsResponse.json();
      const metricsText = metricsData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (metricsText) {
        const metricsQuestions = JSON.parse(metricsText);
        allQuestions.push(...metricsQuestions.map((q: any, i: number) => ({
          ...q,
          id: `ai-metrics-${Date.now()}-${i}`,
          isGenerated: true,
        })));
      }

      setProgress(90);

      // Validate and sort
      const validQuestions = allQuestions.filter(q => 
        q.alternatives && 
        q.alternatives.length === 5 && 
        q.correctIndex >= 0 && 
        q.correctIndex < 5 &&
        q.explanation
      );

      // Sort by difficulty
      const diffOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
      validQuestions.sort((a: Question, b: Question) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);

      setProgress(100);
      setStatus('success');
      
      setTimeout(() => {
        onComplete(validQuestions.slice(0, totalQuestions));
      }, 500);

    } catch (error: any) {
      setStatus('error');
      onError(error.message || 'Failed to generate questions');
    }
  }, [apiKey, model, lang, totalQuestions, onComplete, onError]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  return (
    <div className="ai-loading-screen">
      <div className="glass-card ai-loading-card">
        <div className="ai-loading-icon">
          <IconRobot size={56} />
        </div>
        <h2 className="ai-loading-title">{messages[messageIdx]}</h2>
        <p className="ai-loading-progress">
          {Math.round(progress)}% — {progress < 50 
            ? `${Math.ceil(totalQuestions / 2)} ${t('game.topic.tales', lang)}`
            : progress < 90 
              ? `${Math.floor(totalQuestions / 2)} ${t('game.topic.metrics', lang)}`
              : t('common.loading', lang)
          }
        </p>
        <div className="ai-progress-bar">
          <div className="ai-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        {status === 'error' && (
          <p className="ai-error-msg">Erro na conexão com IA. Verifique sua chave e tente novamente.</p>
        )}
        <button className="btn-secondary" onClick={onCancel} style={{ marginTop: '16px' }}>
          {t('common.cancel', lang)}
        </button>
      </div>
    </div>
  );
};

export default AIMode;
