import { Brain, CalendarCheck, HeartPulse, TrendingUp, CheckCircle, Award, Activity } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { StatCard } from '../components/StatCard';
import { useAppData } from '../context/AppDataContext';
import { difficultyLabel } from '../utils/personalization';

export function ProgressPage() {
  const { progress, gameResults, activities, reminders } = useAppData();
  const trend = gameResults.slice(0, 7).reverse();

  const reminderPercent = reminders.length ? Math.round((progress.remindersCompleted / reminders.length) * 100) : 0;
  const routinePercent = activities.length ? Math.round((progress.routineCompleted / activities.length) * 100) : 0;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Activity Insights & Well-Being"
        title="Progress & Activity Summary"
        description="Comprehensive summary of cognitive exercises, routine consistency, and mood check-ins."
      />

      <section className="stats-grid">
        <StatCard label="Cognitive Activity" value={`${progress.cognitiveActivity}%`} icon={<Brain size={26} />} helper={difficultyLabel(progress.difficultyLevel)} tone="blue" />
        <StatCard label="Routine Progress" value={`${progress.routineCompleted}/${progress.routineTotal}`} icon={<CalendarCheck size={26} />} helper="activities" tone="green" />
        <StatCard label="Reminders Done" value={`${progress.remindersCompleted}/${progress.remindersTotal}`} icon={<TrendingUp size={26} />} helper="scheduled" tone="orange" />
        <StatCard label="Well-Being Check" value={progress.mood} icon={<HeartPulse size={26} />} helper="daily mood" tone="purple" />
      </section>

      <section className="panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow" style={{ color: 'var(--primary-700)' }}>Cognitive Accuracy Trend</p>
            <h2 style={{ marginTop: '2px' }}>Exercise Performance Summary</h2>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>{progress.cognitiveActivity}%</span>
        </div>
        <ProgressBar value={progress.cognitiveActivity} />

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-end', gap: '16px', height: '160px', paddingTop: '20px' }}>
          {trend.map((result) => (
            <div key={result.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>{Math.round(result.accuracy)}%</span>
              <div style={{ width: '100%', height: `${Math.max(20, result.accuracy)}%`, background: 'linear-gradient(180deg, var(--primary-500), var(--primary-700))', borderRadius: '6px 6px 0 0' }} />
              <small style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>{result.gameName?.slice(0, 4) ?? 'Ex'}</small>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="panel">
          <div className="section-heading">
            <h2 style={{ fontSize: '1.25rem' }}>Reminder Adherence</h2>
            <span style={{ fontWeight: 800, color: 'var(--amber-600)' }}>{reminderPercent}%</span>
          </div>
          <ProgressBar value={reminderPercent} />
          <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--slate-600)' }}>{progress.remindersCompleted} of {reminders.length} reminders finished today.</p>
        </div>

        <div className="panel">
          <div className="section-heading">
            <h2 style={{ fontSize: '1.25rem' }}>Routine Step Completion</h2>
            <span style={{ fontWeight: 800, color: 'var(--emerald-600)' }}>{routinePercent}%</span>
          </div>
          <ProgressBar value={routinePercent} />
          <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--slate-600)' }}>{progress.routineCompleted} of {activities.length} routine steps completed today.</p>
        </div>
      </section>
    </div>
  );
}
