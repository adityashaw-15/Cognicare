import { FormEvent, useState } from 'react';
import { Images, Plus, Sparkles, Heart, MapPin, Volume2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAppData } from '../context/AppDataContext';
import { Memory } from '../types/models';

const initialForm = {
  personName: '',
  relationship: '',
  placeName: '',
  eventName: '',
  favoriteObject: '',
  favoriteFood: '',
  favoriteSong: '',
  note: ''
};

export function MemoriesPage() {
  const { memories, addMemory, activePatient } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [question, setQuestion] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.personName.trim()) {
      return;
    }
    const memory: Omit<Memory, 'id' | 'updatedAt'> = {
      patientId: activePatient.id,
      categoryName: 'Familiar Memories',
      personName: form.personName.trim(),
      relationship: form.relationship.trim(),
      placeName: form.placeName.trim(),
      eventName: form.eventName.trim(),
      favoriteObject: form.favoriteObject.trim(),
      favoriteFood: form.favoriteFood.trim(),
      favoriteSong: form.favoriteSong.trim(),
      imageUrl: '/assets/family-photo.svg',
      note: form.note.trim(),
      promptSeed: buildQuestion(form)
    };
    await addMemory(memory);
    setQuestion(memory.promptSeed ?? null);
    setForm(initialForm);
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Personalized Memory Album"
        title="Familiar Memories & Stories"
        description="Familiar faces, cherishable places, favorite songs, and life events. CogniCare uses these for gentle recall."
      />

      {question && (
        <section className="celebration-box" style={{ background: 'linear-gradient(135deg, var(--purple-50), var(--primary-50))', border: '2px solid var(--purple-500)', textAlign: 'left', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--purple-500)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <p className="eyebrow" style={{ color: 'var(--purple-700)' }}>CogniCare Gentle Prompt</p>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--purple-900)' }}>{question}</h2>
            </div>
          </div>
        </section>
      )}

      <section className="memory-grid">
        {memories.map((memory) => (
          <article className="memory-card" key={memory.id}>
            <img src={memory.imageUrl || '/assets/family-photo.svg'} alt={memory.personName} />
            <div className="memory-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{memory.personName}</h3>
                <span className="memory-relation-tag">{memory.relationship || 'Family'}</span>
              </div>

              {memory.placeName && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-600)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <MapPin size={16} color="var(--primary-600)" /> {memory.placeName}
                </p>
              )}

              {memory.note && <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>{memory.note}</p>}

              <ThreeDButton 
                variant="soft" 
                icon={<Volume2 size={18} />} 
                onClick={() => setQuestion(memory.promptSeed ?? buildQuestion(memory))}
                style={{ marginTop: '8px' }}
              >
                Recall Question
              </ThreeDButton>
            </div>
          </article>
        ))}
      </section>

      {memories.length === 0 && (
        <EmptyState title="No familiar memories added yet" body="Caregivers can add familiar photos, people, and stories below." />
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Caregiver Entry</p>
            <h2>Add a New Memory Seed</h2>
          </div>
        </div>
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {Object.entries(form).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-700)' }}>{labelFor(key)}</label>
              <input
                value={value}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                placeholder={placeholderFor(key)}
                style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}
              />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <ThreeDButton icon={<Plus size={20} />} type="submit">
              Save Memory Seed
            </ThreeDButton>
          </div>
        </form>
      </section>
    </div>
  );
}

function buildQuestion(memory: Pick<Memory, 'personName' | 'relationship' | 'placeName' | 'eventName'>) {
  if (memory.relationship) {
    return `Who is ${memory.personName}, and how are they connected with you?`;
  }
  if (memory.placeName) {
    return `Which favorite memory is connected with ${memory.placeName}?`;
  }
  return `Which familiar memory is connected with ${memory.personName}?`;
}

function labelFor(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}

function placeholderFor(key: string) {
  const hints: Record<string, string> = {
    personName: 'Example: Ananya',
    relationship: 'Example: Daughter',
    placeName: 'Example: Darjeeling',
    eventName: 'Example: Family trip',
    favoriteObject: 'Example: Blue shawl',
    favoriteFood: 'Example: Pitha',
    favoriteSong: 'Example: Old Hindi classics',
    note: 'Short familiar memory note'
  };
  return hints[key] ?? '';
}
