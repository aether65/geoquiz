import React, { useState } from 'react';
import { Settings as SettingsType, Language, ThemeMode, FontFamily } from '../types';
import { t, getLanguageName } from '../data/i18n';

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (settings: Partial<SettingsType>) => void;
  onClose: () => void;
  lang: Language;
}

const PALETTES = [
  { id: 'ocean', name: '🌊 Oceano', color: '#0ea5e9' },
  { id: 'forest', name: '🌲 Floresta', color: '#10b981' },
  { id: 'sunset', name: '🌅 Pôr do sol', color: '#f97316' },
  { id: 'violet', name: '💜 Violeta', color: '#8b5cf6' },
  { id: 'graphite', name: '⬛ Grafite', color: '#6b7280' },
  { id: 'rose', name: '🌹 Rosa', color: '#ec4899' },
];

const FONTS: { id: FontFamily; name: string }[] = [
  { id: 'system', name: 'Sistema' },
  { id: 'serif', name: 'Serifada' },
  { id: 'mono', name: 'Monoespaçada' },
  { id: 'rounded', name: 'Arredondada' },
  { id: 'readable', name: 'Alta legibilidade' },
];

const LANGUAGES: Language[] = ['pt', 'en', 'es', 'fr', 'it', 'ru', 'zh', 'ja'];

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onClose, lang }) => {
  const [activeSection, setActiveSection] = useState('language');
  const [aiTestResult, setAiTestResult] = useState<string | null>(null);

  const sections = [
    { id: 'language', label: t('settings.language', lang), icon: '🌐' },
    { id: 'appearance', label: t('settings.appearance', lang), icon: '🎨' },
    { id: 'text', label: t('settings.text', lang), icon: '🔤' },
    { id: 'animations', label: t('settings.animations', lang), icon: '✨' },
    { id: 'ai', label: t('settings.ai', lang), icon: '🤖' },
  ];

  const testAIConnection = async () => {
    if (!settings.aiApiKey) {
      setAiTestResult('❌ Chave não configurada');
      return;
    }
    try {
      setAiTestResult('⏳ Testando...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${settings.aiModel}:generateContent?key=${settings.aiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Diga "ok" se a conexão funciona.' }] }],
          }),
        }
      );
      if (response.ok) {
        setAiTestResult('✅ Conexão OK!');
      } else {
        const err = await response.json();
        setAiTestResult(`❌ Erro: ${err.error?.message || 'Chave inválida'}`);
      }
    } catch (e) {
      setAiTestResult('❌ Sem conexão com a internet');
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel glass-card" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ {t('settings.title', lang)}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          {/* Sidebar */}
          <div className="settings-sidebar">
            {sections.map(section => (
              <button
                key={section.id}
                className={`settings-nav-btn ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="settings-content">
            {activeSection === 'language' && (
              <div className="settings-section">
                <h3>{t('settings.language', lang)}</h3>
                <div className="language-grid">
                  {LANGUAGES.map(l => (
                    <button
                      key={l}
                      className={`lang-btn ${settings.language === l ? 'active' : ''}`}
                      onClick={() => onUpdate({ language: l })}
                    >
                      {getLanguageName(l)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="settings-section">
                <h3>{t('settings.theme', lang)}</h3>
                <div className="theme-selector">
                  {(['auto', 'light', 'dark'] as ThemeMode[]).map(theme => (
                    <button
                      key={theme}
                      className={`theme-btn ${settings.theme === theme ? 'active' : ''}`}
                      onClick={() => onUpdate({ theme })}
                    >
                      {theme === 'auto' ? '🔄' : theme === 'light' ? '☀️' : '🌙'}
                      {t(`settings.theme.${theme}`, lang)}
                    </button>
                  ))}
                </div>

                <h3>{t('settings.palette', lang)}</h3>
                <div className="palette-grid">
                  {PALETTES.map(p => (
                    <button
                      key={p.id}
                      className={`palette-btn ${settings.palette === p.id ? 'active' : ''}`}
                      onClick={() => onUpdate({ palette: p.id, accentColor: p.color })}
                      style={{ '--palette-color': p.color } as React.CSSProperties}
                    >
                      <span className="palette-dot" style={{ background: p.color }} />
                      {p.name}
                    </button>
                  ))}
                </div>

                <h3>{t('settings.accentColor', lang)}</h3>
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={e => onUpdate({ accentColor: e.target.value })}
                  className="color-picker"
                />

                <h3>{t('settings.glass', lang)}</h3>
                <button
                  className={`toggle-btn ${settings.glassEnabled ? 'active' : ''}`}
                  onClick={() => onUpdate({ glassEnabled: !settings.glassEnabled })}
                >
                  {settings.glassEnabled ? t('settings.on', lang) : t('settings.off', lang)}
                </button>
              </div>
            )}

            {activeSection === 'text' && (
              <div className="settings-section">
                <h3>{t('settings.font', lang)}</h3>
                <div className="font-grid">
                  {FONTS.map(f => (
                    <button
                      key={f.id}
                      className={`font-btn ${settings.fontFamily === f.id ? 'active' : ''}`}
                      onClick={() => onUpdate({ fontFamily: f.id })}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>

                <h3>{t('settings.fontSize', lang)}: {settings.fontSize}%</h3>
                <input
                  type="range"
                  min="90"
                  max="130"
                  value={settings.fontSize}
                  onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
                  className="size-slider"
                />
              </div>
            )}

            {activeSection === 'animations' && (
              <div className="settings-section">
                <h3>{t('settings.animations', lang)}</h3>
                <button
                  className={`toggle-btn ${settings.animationsEnabled ? 'active' : ''}`}
                  onClick={() => onUpdate({ animationsEnabled: !settings.animationsEnabled })}
                >
                  {settings.animationsEnabled ? t('settings.on', lang) : t('settings.off', lang)}
                </button>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="settings-section">
                <h3>{t('settings.ai', lang)}</h3>
                <button
                  className={`toggle-btn ${settings.aiEnabled ? 'active' : ''}`}
                  onClick={() => onUpdate({ aiEnabled: !settings.aiEnabled })}
                >
                  {settings.aiEnabled ? t('settings.on', lang) : t('settings.off', lang)}
                </button>

                {settings.aiEnabled && (
                  <>
                    <h3>{t('settings.aiKey', lang)}</h3>
                    <input
                      type="password"
                      className="settings-input"
                      value={settings.aiApiKey}
                      onChange={e => onUpdate({ aiApiKey: e.target.value })}
                      placeholder="AIza..."
                    />
                    <p className="settings-help">{t('settings.aiHelp', lang)}</p>

                    <h3>{t('settings.aiModel', lang)}</h3>
                    <input
                      type="text"
                      className="settings-input"
                      value={settings.aiModel}
                      onChange={e => onUpdate({ aiModel: e.target.value })}
                    />

                    <div className="ai-actions">
                      <button className="btn-secondary" onClick={testAIConnection}>
                        {t('settings.aiTest', lang)}
                      </button>
                      <button
                        className="btn-secondary btn-danger"
                        onClick={() => onUpdate({ aiApiKey: '' })}
                      >
                        {t('settings.aiClear', lang)}
                      </button>
                    </div>
                    {aiTestResult && <p className="ai-test-result">{aiTestResult}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-secondary" onClick={() => {
            onUpdate({
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
            });
          }}>
            {t('settings.reset', lang)}
          </button>
          <button className="btn-primary" onClick={onClose}>
            {t('settings.close', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
