import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';
import { ThreeDButton } from '../ThreeDButton';
import { ProgressBar } from '../ProgressBar';
import { CognitiveGame, DailyActivity, GameMetrics, Memory } from '../../types/models';

interface GameRunnerProps {
  game: CognitiveGame;
  difficulty: number;
  memories: Memory[];
  activities: DailyActivity[];
  onComplete: (metrics: GameMetrics) => Promise<void>;
  onExit: () => void;
}

export function GameRunner({ game, difficulty, memories, activities, onComplete, onExit }: GameRunnerProps) {
  const [submitting, setSubmitting] = useState(false);

  const complete = async (metrics: GameMetrics) => {
    setSubmitting(true);
    try {
      await onComplete(metrics);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="game-runner">
      <div className="game-runner-top">
        <ThreeDButton variant="soft" icon={<ArrowLeft size={18} />} onClick={onExit}>
          Back to Games
        </ThreeDButton>
        <div>
          <p className="eyebrow">Let's exercise your memory</p>
          <h2>{game.name}</h2>
          <span className="difficulty-chip">Level {difficulty}</span>
        </div>
      </div>
      {game.type === 'MEMORY_MATCHING' && <MemoryMatchingGame difficulty={difficulty} disabled={submitting} onComplete={complete} />}
      {game.type === 'SEQUENCE_RECALL' && <SequenceRecallGame difficulty={difficulty} disabled={submitting} onComplete={complete} />}
      {game.type === 'PATTERN_RECOGNITION' && <PatternRecognitionGame disabled={submitting} onComplete={complete} />}
      {game.type === 'OBJECT_RECOGNITION' && <ObjectRecognitionGame memories={memories} disabled={submitting} onComplete={complete} />}
      {game.type === 'ROUTINE_RECALL' && <RoutineRecallGame activities={activities} disabled={submitting} onComplete={complete} />}
      {game.type === 'ATTENTION' && <AttentionGame difficulty={difficulty} disabled={submitting} onComplete={complete} />}
    </section>
  );
}

function MemoryMatchingGame({ difficulty, disabled, onComplete }: { difficulty: number; disabled: boolean; onComplete: (metrics: GameMetrics) => void }) {
  const start = useRef(Date.now());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [finished, setFinished] = useState(false);

  const cardSet = [
    { label: 'Morning Tea', icon: '☕' },
    { label: 'House Keys', icon: '🔑' },
    { label: 'Garden Flower', icon: '🌸' },
    { label: 'Family Photo', icon: '📷' },
    { label: 'Favorite Song', icon: '🎵' },
    { label: 'Warm Rice', icon: '🍚' }
  ];

  const cards = useMemo(() => {
    const selected = cardSet.slice(0, Math.min(6, difficulty + 2));
    return shuffle(selected.flatMap((item) => [item, item])).map((item, index) => ({ id: index, ...item }));
  }, [difficulty]);

  const choose = (index: number) => {
    if (disabled || finished || flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) {
      setAttempts((value) => value + 1);
      const isMatch = cards[next[0]].label === cards[next[1]].label;
      window.setTimeout(() => {
        if (isMatch) {
          const nextMatched = [...matched, ...next];
          setMatched(nextMatched);
          if (nextMatched.length === cards.length) {
            finish(Math.max(60, 100 - attempts * 4), attempts + 1, hints);
          }
        }
        setFlipped([]);
      }, 700);
    }
  };

  const finish = (score: number, totalAttempts: number, usedHints: number) => {
    if (finished) return;
    setFinished(true);
    const duration = Math.round((Date.now() - start.current) / 1000);
    onComplete({
      score,
      accuracy: Math.round((cards.length / 2 / Math.max(1, totalAttempts)) * 100),
      responseTimeSeconds: duration,
      attempts: totalAttempts,
      hintsUsed: usedHints,
      sessionDurationSeconds: duration
    });
  };

  return (
    <div className="game-stage">
      <div className="game-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="game-instruction">Tap pairs to match familiar objects.</p>
        <ThreeDButton variant="soft" icon={<Lightbulb size={18} />} onClick={() => setHints((value) => value + 1)}>
          Hint ({hints})
        </ThreeDButton>
      </div>

      <div className="cards-grid-3d">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(index);
          const isHinted = hints > 0;
          const showContent = isFlipped || isMatched || isHinted;

          return (
            <button
              key={card.id}
              className={`card-flip-3d ${showContent ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => choose(index)}
              disabled={disabled || isMatched}
            >
              <div className="card-flip-inner">
                <div className="card-front">
                  <span>🧠</span>
                </div>
                <div className="card-back">
                  <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{card.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SequenceRecallGame({ difficulty, disabled, onComplete }: { difficulty: number; disabled: boolean; onComplete: (metrics: GameMetrics) => void }) {
  const start = useRef(Date.now());
  const allColors = useMemo(() => [
    { name: 'Blue', color: '#2563eb', bg: '#eff6ff' },
    { name: 'Green', color: '#10b981', bg: '#ecfdf5' },
    { name: 'Gold', color: '#f59e0b', bg: '#fffbeb' },
    { name: 'Violet', color: '#8b5cf6', bg: '#f5f3ff' }
  ], []);

  const sequence = useMemo(() => {
    const names = ['Blue', 'Green', 'Gold', 'Violet', 'Blue', 'Gold'];
    return names.slice(0, difficulty + 2);
  }, [difficulty]);

  const [activeFlash, setActiveFlash] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [input, setInput] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(1);
  const [message, setMessage] = useState('Watch the lights flash, then tap the same order.');

  const playSequence = () => {
    setIsPlaying(true);
    setInput([]);
    setMessage('Watch carefully...');
    sequence.forEach((color, idx) => {
      setTimeout(() => {
        setActiveFlash(color);
      }, (idx + 1) * 800);

      setTimeout(() => {
        setActiveFlash(null);
        if (idx === sequence.length - 1) {
          setIsPlaying(false);
          setMessage('Your turn! Tap the colors in order.');
        }
      }, (idx + 1) * 800 + 500);
    });
  };

  const choose = (colorName: string) => {
    if (disabled || isPlaying) return;

    const next = [...input, colorName];
    if (sequence[next.length - 1] !== colorName) {
      setAttempts((value) => value + 1);
      setInput([]);
      setMessage('That was close! Watch again, then try once more.');
      playSequence();
      return;
    }

    setInput(next);
    if (next.length === sequence.length) {
      const duration = Math.round((Date.now() - start.current) / 1000);
      onComplete({
        score: Math.max(60, 104 - attempts * 8),
        accuracy: Math.round((sequence.length / (sequence.length + attempts - 1)) * 100),
        responseTimeSeconds: duration,
        attempts,
        hintsUsed: 0,
        sessionDurationSeconds: duration
      });
    }
  };

  return (
    <div className="game-stage" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <p className="game-instruction" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{message}</p>
      
      <ThreeDButton 
        variant="secondary" 
        icon={<RotateCcw size={18} />} 
        onClick={playSequence}
        disabled={isPlaying}
      >
        {isPlaying ? 'Flashing sequence...' : 'Play Light Sequence'}
      </ThreeDButton>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
        {allColors.map((item) => {
          const isFlashing = activeFlash === item.name;
          return (
            <button
              key={item.name}
              className={`sequence-flash-btn ${isFlashing ? 'active-flash' : ''}`}
              style={{
                background: isFlashing ? item.color : item.bg,
                color: isFlashing ? '#ffffff' : item.color,
                borderColor: item.color
              }}
              onClick={() => choose(item.name)}
              disabled={disabled || isPlaying}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {sequence.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: idx < input.length ? 'var(--emerald-500)' : 'var(--slate-200)',
              transition: 'background 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PatternRecognitionGame({ disabled, onComplete }: { disabled: boolean; onComplete: (metrics: GameMetrics) => void }) {
  const start = useRef(Date.now());
  const [attempts, setAttempts] = useState(1);
  const [message, setMessage] = useState('What comes next in this pattern?');
  
  const pattern = [
    { icon: '🔴', label: 'Circle' },
    { icon: '🟦', label: 'Square' },
    { icon: '🔴', label: 'Circle' },
    { icon: '🟦', label: 'Square' },
    { icon: '❓', label: '?' }
  ];
  const answer = 'Circle';

  const choices = [
    { icon: '🔴', label: 'Circle' },
    { icon: '🔺', label: 'Triangle' },
    { icon: '⭐', label: 'Star' },
    { icon: '🟦', label: 'Square' }
  ];

  const choose = (choiceLabel: string) => {
    if (disabled) return;
    if (choiceLabel !== answer) {
      setAttempts((value) => value + 1);
      setMessage('Look for the repeating shape (Circle ➔ Square) and try again.');
      return;
    }
    const duration = Math.round((Date.now() - start.current) / 1000);
    onComplete({
      score: Math.max(65, 100 - attempts * 7),
      accuracy: Math.round(100 / attempts),
      responseTimeSeconds: duration,
      attempts,
      hintsUsed: attempts > 1 ? 1 : 0,
      sessionDurationSeconds: duration
    });
  };

  return (
    <div className="game-stage" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p className="game-instruction" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{message}</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '24px', background: 'var(--slate-50)', borderRadius: 'var(--radius-xl)' }}>
        {pattern.map((item, index) => (
          <div key={index} style={{ fontSize: '2.5rem', padding: '12px 18px', background: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-subtle)' }}>
            {item.icon}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
        {choices.map((choice) => (
          <button
            key={choice.label}
            className="choice-card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px', fontSize: '1.1rem', fontWeight: 800 }}
            onClick={() => choose(choice.label)}
            disabled={disabled}
          >
            <span style={{ fontSize: '2rem' }}>{choice.icon}</span>
            <span>{choice.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ObjectRecognitionGame({ memories, disabled, onComplete }: { memories: Memory[]; disabled: boolean; onComplete: (metrics: GameMetrics) => void }) {
  const start = useRef(Date.now());
  const [attempts, setAttempts] = useState(1);
  const [message, setMessage] = useState("Who is in this familiar photo memory?");

  const fallbackMemory: Memory = {
    id: 'demo-photo-1',
    patientId: 'demo-p-1',
    personName: 'Ananya',
    relationship: 'Daughter',
    imageUrl: '/assets/family-photo.svg',
    promptSeed: 'Ananya is your loving daughter who visits every weekend.',
    updatedAt: new Date().toISOString()
  };

  const memory = memories[0] ?? fallbackMemory;
  const choices = useMemo(() => shuffle([memory.personName, 'Neighbor', 'Teacher', 'Doctor']), [memory.personName]);

  const choose = (choice: string) => {
    if (disabled) return;
    if (choice !== memory.personName) {
      setAttempts((value) => value + 1);
      setMessage(`Hint: ${memory.relationship ?? 'A loved family member'} is in this photo.`);
      return;
    }
    const duration = Math.round((Date.now() - start.current) / 1000);
    onComplete({
      score: Math.max(65, 100 - attempts * 6),
      accuracy: Math.round(100 / attempts),
      responseTimeSeconds: duration,
      attempts,
      hintsUsed: attempts > 1 ? 1 : 0,
      sessionDurationSeconds: duration
    });
  };

  return (
    <div className="game-stage" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div className="memory-frame-3d" style={{ maxWidth: '380px', width: '100%' }}>
        <img src={memory.imageUrl} alt="Familiar memory" style={{ height: '220px', objectFit: 'cover' }} />
      </div>
      <p className="game-instruction" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{message}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', maxWidth: '500px', width: '100%' }}>
        {choices.map((choice) => (
          <button key={choice} className="choice-card" style={{ padding: '16px', fontSize: '1.05rem', fontWeight: 800 }} onClick={() => choose(choice)} disabled={disabled}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

function RoutineRecallGame({ activities, disabled, onComplete }: { activities: DailyActivity[]; disabled: boolean; onComplete: (metrics: GameMetrics) => void }) {
  const start = useRef(Date.now());
  const [attempts, setAttempts] = useState(1);

  const fallbackPrompt = 'Morning Tea & Walk';
  const fallbackAnswer = 'Take Medication';

  const ordered = [...activities].sort((a, b) => a.time.localeCompare(b.time));
  const prompt = ordered[0]?.title ?? fallbackPrompt;
  const answer = ordered[1]?.title ?? fallbackAnswer;

  const [message, setMessage] = useState(`After ${prompt}, what activity comes next in your calm routine?`);

  const choices = useMemo(() => shuffle([answer, 'Evening Walk', 'Call Grandchildren', 'Read Newspaper']), [answer]);

  const choose = (choice: string) => {
    if (disabled) return;
    if (choice !== answer) {
      setAttempts((value) => value + 1);
      setMessage('Think back to your daily schedule and try again.');
      return;
    }
    const duration = Math.round((Date.now() - start.current) / 1000);
    onComplete({
      score: Math.max(60, 100 - attempts * 7),
      accuracy: Math.round(100 / attempts),
      responseTimeSeconds: duration,
      attempts,
      hintsUsed: attempts > 1 ? 1 : 0,
      sessionDurationSeconds: duration
    });
  };

  return (
    <div className="game-stage" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div style={{ padding: '20px 24px', background: 'var(--primary-50)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--primary-200)', maxWidth: '440px', width: '100%' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase' }}>Daily Routine Question</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '4px' }}>{message}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', maxWidth: '500px', width: '100%' }}>
        {choices.map((choice) => (
          <button key={choice} className="choice-card" style={{ padding: '16px', fontSize: '1rem', fontWeight: 800 }} onClick={() => choose(choice)} disabled={disabled}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

function AttentionGame({ difficulty, disabled, onComplete }: { difficulty: number; disabled: boolean; onComplete: (metrics: GameMetrics) => void }) {
  const start = useRef(Date.now());
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const target = Math.min(8, difficulty + 4);

  const cards = useMemo(() => shuffle([
    { label: 'Blue', color: '#2563eb' },
    { label: 'Green', color: '#10b981' },
    { label: 'Blue', color: '#2563eb' },
    { label: 'Gold', color: '#f59e0b' },
    { label: 'Blue', color: '#2563eb' },
    { label: 'Violet', color: '#8b5cf6' },
    { label: 'Blue', color: '#2563eb' },
    { label: 'Green', color: '#10b981' },
    { label: 'Gold', color: '#f59e0b' }
  ]), []);

  const choose = (item: { label: string; color: string }) => {
    if (disabled) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (item.label === 'Blue') {
      const nextHits = hits + 1;
      setHits(nextHits);
      if (nextHits >= target) {
        const duration = Math.round((Date.now() - start.current) / 1000);
        onComplete({
          score: Math.max(60, Math.round((nextHits / nextAttempts) * 100)),
          accuracy: Math.round((nextHits / nextAttempts) * 100),
          responseTimeSeconds: duration,
          attempts: nextAttempts,
          hintsUsed: 0,
          sessionDurationSeconds: duration
        });
      }
    }
  };

  return (
    <div className="game-stage" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        <p className="game-instruction" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Tap all 🎯 <strong>Blue</strong> targets! Hits: {hits} / {target}
        </p>
        <ProgressBar value={Math.round((hits / target) * 100)} label="Target hits progress" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '420px', width: '100%' }}>
        {cards.map((item, index) => (
          <button
            key={index}
            className="choice-card"
            style={{
              padding: '24px 16px',
              fontSize: '1.1rem',
              fontWeight: 800,
              background: item.color,
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={() => choose(item)}
            disabled={disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

