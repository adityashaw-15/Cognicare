import { useState } from 'react';
import { HeartPulse, Save, Smile, Meh, Frown, Sparkles, Heart } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAppData } from '../context/AppDataContext';

const moods = [
  { label: 'Calm & Happy', icon: Smile, color: 'var(--emerald-500)' },
  { label: 'Good', icon: Heart, color: 'var(--primary-500)' },
  { label: 'Neutral', icon: Meh, color: 'var(--amber-500)' },
  { label: 'Tired', icon: Frown, color: 'var(--purple-500)' },
  { label: 'Low', icon: HeartPulse, color: 'var(--rose-500)' }
];

export function MoodPage() {
  const { moodEntries, saveMood } = useAppData();
  const [selected, setSelected] = useState('Calm & Happy');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await saveMood(selected, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Daily Well-Being Check-in"
        title="How are you feeling today?"
        description="A supportive check-in to track emotional well-being and daily comfort."
      />

      <section className="panel">
        <p className="eyebrow" style={{ color: 'var(--primary-600)' }}>Select your current feeling</p>
        <div className="mood-grid" role="radiogroup" aria-label="Mood options">
          {moods.map((item) => {
            const Icon = item.icon;
            const isSelected = selected === item.label;
            return (
              <div
                key={item.label}
                className={`mood-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelected(item.label)}
                role="radio"
                aria-checked={isSelected}
              >
                <div style={{ color: isSelected ? item.color : 'var(--slate-400)', transition: 'transform 0.2s ease' }}>
                  <Icon size={36} />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-700)' }}>Optional note about your day</label>
          <textarea 
            value={note} 
            onChange={(event) => setNote(event.target.value)} 
            placeholder="Example: Had a pleasant conversation and morning tea in the garden." 
            style={{ width: '100%', minHeight: '100px', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThreeDButton icon={<Save size={20} />} onClick={handleSave}>
            Save Check-in
          </ThreeDButton>
          {saved && <span style={{ color: 'var(--emerald-600)', fontWeight: 800, fontSize: '0.95rem' }}>✓ Saved successfully!</span>}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent Check-in History</h2>
          <span style={{ fontWeight: 700, color: 'var(--slate-500)' }}>{moodEntries.length} entries recorded</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {moodEntries.slice(0, 7).map((entry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--purple-500)' }}>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--purple-700)' }}>{entry.mood}</strong>
                {entry.note && <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginTop: '2px' }}>{entry.note}</p>}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-500)' }}>{entry.entryDate}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
