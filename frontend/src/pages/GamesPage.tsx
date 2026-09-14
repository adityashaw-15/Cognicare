import { useState } from 'react';
import { Brain, CheckCircle2, Play, Trophy, Sparkles, Award } from 'lucide-react';
import { GameRunner } from '../components/games/GameRunner';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAppData } from '../context/AppDataContext';
import { CognitiveGame, GameResult } from '../types/models';
import { difficultyLabel } from '../utils/personalization';

export function GamesPage() {
  const { games, activePatient, memories, activities, recordGameResult, gameResults, progress } = useAppData();
  const [selected, setSelected] = useState<CognitiveGame | null>(null);
  const [latestResult, setLatestResult] = useState<GameResult | null>(null);

  if (selected) {
    return (
      <div className="page-stack">
        <GameRunner
          game={selected}
          difficulty={activePatient.difficultyLevel}
          memories={memories}
          activities={activities}
          onExit={() => setSelected(null)}
          onComplete={async (metrics) => {
            const result = await recordGameResult(selected, metrics);
            setLatestResult(result);
            setSelected(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Cognitive Exercises"
        title="Personalized Memory Activities"
        description="Encouraging, gentle brain exercises adapted to your comfortable pace. Saved offline automatically."
      />

      {latestResult && (
        <section className="celebration-box">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald-500)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={36} />
          </div>
          <h2>Great Job! Activity Complete</h2>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--emerald-700)' }}>
            Score {latestResult.score} · Accuracy {latestResult.accuracy}% · Time {latestResult.responseTimeSeconds}s
          </p>
          <p style={{ color: 'var(--slate-600)', maxWidth: '600px' }}>{latestResult.summary}</p>
        </section>
      )}

      <section className="panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--purple-50) 100%)', border: '1px solid var(--purple-200)' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow" style={{ color: 'var(--purple-700)' }}>Adaptive Cognitive Level</p>
            <h2 style={{ marginTop: '2px' }}>Current Activity Tier: {difficultyLabel(activePatient.difficultyLevel)}</h2>
          </div>
          <span className="difficulty-chip" style={{ background: 'var(--purple-500)', color: '#ffffff' }}>
            {progress.cognitiveActivity}% Goal Met
          </span>
        </div>
        <ProgressBar value={progress.cognitiveActivity} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
        {games.map((game) => (
          <article className="feature-card" key={game.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Brain size={28} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{game.name}</h2>
              <p style={{ marginTop: '8px', color: 'var(--slate-600)', fontSize: '0.95rem' }}>{game.description}</p>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--purple-700)', background: 'var(--purple-50)', padding: '4px 10px', borderRadius: '12px', width: 'fit-content' }}>
                <Sparkles size={14} /> Tier: {difficultyLabel(game.suggestedDifficulty)}
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <ThreeDButton icon={<Play size={18} />} onClick={() => setSelected(game)} fullWidth>
                Play Activity
              </ThreeDButton>
            </div>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent Activity Performance</h2>
          <span style={{ fontWeight: 700, color: 'var(--slate-500)' }}>{gameResults.length} sessions logged</span>
        </div>
        
        {gameResults.length === 0 ? (
          <p style={{ color: 'var(--slate-500)', fontStyle: 'italic', padding: '20px 0' }}>Complete your first memory activity above to view performance trends here!</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '180px', paddingTop: '20px', borderBottom: '2px solid var(--slate-100)' }}>
            {gameResults.slice(0, 7).map((result) => (
              <div key={result.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)' }}>{result.score}</span>
                <div style={{ width: '100%', height: `${Math.max(25, result.score)}%`, background: 'linear-gradient(180deg, var(--primary-500), var(--primary-700))', borderRadius: '8px 8px 0 0' }} />
                <small style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', textAlign: 'center' }}>
                  {result.gameName?.split(' ')[0] ?? 'Game'}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
