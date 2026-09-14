import { useState } from 'react';
import { RefreshCw, Save, Globe, Sliders, Database, Check } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAppData } from '../context/AppDataContext';
import { useI18n } from '../context/I18nContext';
import { resetLocalDemoData } from '../database/db';
import { LanguageCode, languages } from '../i18n/translations';

export function SettingsPage() {
  const { activePatient, updatePatientPreferences, refreshData, forceSync, pendingCount } = useAppData();
  const { language, setLanguage } = useI18n();
  const [selected, setSelected] = useState<LanguageCode>(language);
  const [difficulty, setDifficulty] = useState(activePatient.difficultyLevel);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setLanguage(selected);
    await updatePatientPreferences(selected, difficulty);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const reset = async () => {
    await resetLocalDemoData();
    await refreshData();
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Preferences & Configuration"
        title="Settings & Local Data Management"
        description="Configure language preferences, cognitive exercise difficulty, and local database sync."
      />

      <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="var(--primary-600)" /> Language Preference
          </label>
          <select 
            value={selected} 
            onChange={(event) => setSelected(event.target.value as LanguageCode)}
            style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', background: '#ffffff' }}
          >
            {Object.entries(languages).map(([code, meta]) => (
              <option key={code} value={code}>
                {meta.label} - {meta.status}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} color="var(--purple-600)" /> Cognitive Exercise Tier
            </label>
            <span className="difficulty-chip">Tier Level {difficulty}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={difficulty} 
            onChange={(event) => setDifficulty(Number(event.target.value))}
            style={{ accentColor: 'var(--primary-600)', height: '8px', marginTop: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <ThreeDButton icon={<Save size={20} />} onClick={save}>
            Save Preferences
          </ThreeDButton>
          {saved && <span style={{ color: 'var(--emerald-600)', fontWeight: 800, fontSize: '0.95rem' }}>✓ Preferences Saved!</span>}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow" style={{ color: 'var(--amber-600)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={16} /> Local Storage & Sync
            </p>
            <h2>Database Synchronization</h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ThreeDButton variant="secondary" icon={<RefreshCw size={20} />} onClick={forceSync}>
            Sync Now ({pendingCount} pending)
          </ThreeDButton>
          <ThreeDButton variant="soft" icon={<RefreshCw size={20} />} onClick={reset}>
            Reset Local Demo Data
          </ThreeDButton>
        </div>
      </section>
    </div>
  );
}
