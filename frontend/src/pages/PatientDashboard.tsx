import { Link } from 'react-router-dom';
import { Bell, Brain, CalendarCheck, HeartPulse, Images, Mic, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { StatCard } from '../components/StatCard';
import { ThreeDButton } from '../components/ThreeDButton';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { useAppData } from '../context/AppDataContext';
import { useI18n } from '../context/I18nContext';
import { difficultyLabel } from '../utils/personalization';

const cards = [
  { to: '/patient/games', title: 'Memory Game', icon: Brain, body: 'Personalized memory and focus activities.', color: 'var(--primary-50)', iconColor: 'var(--primary-600)' },
  { to: '/patient/routine', title: "Today's Routine", icon: CalendarCheck, body: 'Review today in calm, clear steps.', color: 'var(--emerald-50)', iconColor: 'var(--emerald-600)' },
  { to: '/patient/reminders', title: 'Reminders', icon: Bell, body: 'Medication, hydration, and appointments.', color: 'var(--amber-50)', iconColor: 'var(--amber-600)' },
  { to: '/patient/memories', title: 'My Memories', icon: Images, body: 'Familiar people, places, and life stories.', color: 'var(--purple-50)', iconColor: 'var(--purple-600)' },
  { to: '/patient/mood', title: 'Daily Mood', icon: HeartPulse, body: 'Check in with how you feel right now.', color: 'var(--rose-50)', iconColor: 'var(--rose-600)' },
  { to: '/patient/progress', title: 'Progress Insights', icon: TrendingUp, body: 'Gentle cognitive activity overview.', color: 'var(--primary-50)', iconColor: 'var(--primary-700)' }
];

export function PatientDashboard() {
  const { activePatient, progress, reminders, activities, online } = useAppData();
  const { t } = useI18n();
  const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="dashboard-layout">
      <div className="page-stack">
        <PageHeader
          eyebrow={today}
          title={`Good Morning, ${activePatient.name.split(' ')[0]}`}
          description={online ? 'CogniCare is active and synced with your caregiver.' : "You are in Local Mode. All your data is safely saved on this device."}
          action={
            <ThreeDButton 
              aria-label="Voice assistant" 
              icon={<Mic size={22} />} 
              onClick={() => document.getElementById('voice-assistant-panel')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voice Assistant
            </ThreeDButton>
          }
        />

        <section className="stats-grid" aria-label="Today's progress summary">
          <StatCard label="Cognitive Activity" value={`${progress.cognitiveActivity}%`} helper={difficultyLabel(progress.difficultyLevel)} icon={<Brain size={26} />} tone="blue" />
          <StatCard label="Routine Completed" value={`${progress.routineCompleted} / ${progress.routineTotal}`} helper="tasks finished" icon={<CalendarCheck size={26} />} tone="green" />
          <StatCard label="Reminders Done" value={`${progress.remindersCompleted} / ${progress.remindersTotal}`} helper="scheduled" icon={<Bell size={26} />} tone="orange" />
          <StatCard label="Well-Being Check" value={progress.mood} helper="daily mood" icon={<HeartPulse size={26} />} tone="purple" />
        </section>

        <section className="panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)', border: '1px solid var(--primary-100)' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Daily Recommendation
              </p>
              <h2 style={{ marginTop: '2px' }}>{t('recentActivity')}</h2>
            </div>
            <span className="difficulty-chip">Level {progress.difficultyLevel}</span>
          </div>
          <ProgressBar value={progress.cognitiveActivity} label="Cognitive activity progress" />
          <div className="recommendation" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', padding: '16px 20px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-subtle)' }}>
            <Sparkles color="var(--primary-600)" size={24} />
            <div>
              <strong style={{ display: 'block', color: 'var(--primary-800)', fontSize: '0.95rem' }}>CogniCare Recommendation</strong>
              <span style={{ color: 'var(--slate-700)', fontSize: '1.05rem', fontWeight: 600 }}>{progress.recommendation}</span>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link className="feature-card" to={card.to} key={card.to}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: card.color, color: card.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={28} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>{card.title}</h2>
                  <ArrowRight size={20} color="var(--slate-400)" />
                </div>
                <p>{card.body}</p>
              </Link>
            );
          })}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="panel">
            <div className="section-heading">
              <h2>Next Reminders</h2>
              <Link to="/patient/reminders" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.92rem' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', borderLeft: reminder.completed ? '4px solid var(--emerald-500)' : '4px solid var(--amber-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={18} color="var(--slate-500)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>{reminder.title}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{reminder.time}</span>
                    </div>
                  </div>
                  {reminder.completed ? (
                    <span style={{ color: 'var(--emerald-600)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Done
                    </span>
                  ) : (
                    <span style={{ background: 'var(--amber-50)', color: 'var(--amber-600)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem' }}>
                      {reminder.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-heading">
              <h2>Daily Schedule</h2>
              <Link to="/patient/routine" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.92rem' }}>Open Routine</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activities.slice(0, 4).map((activity) => (
                <div key={activity.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', borderLeft: activity.completed ? '4px solid var(--emerald-500)' : '4px solid var(--primary-500)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem' }}>{activity.title}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{activity.time}</span>
                  </div>
                  <span style={{ color: activity.completed ? 'var(--emerald-600)' : 'var(--primary-600)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {activity.completed ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id="voice-assistant-panel">
          <VoiceAssistant />
        </div>
      </div>

      <aside className="assist-panel">
        <div className="assist-card-3d">
          <div className="floating-orb-container">
            <div className="orb-3d-glowing">
              <Mic size={36} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>3D Voice Companion</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                Tap to speak with CogniCare anytime.
              </p>
            </div>
            <ThreeDButton 
              fullWidth 
              icon={<Sparkles size={18} />} 
              onClick={() => document.getElementById('voice-assistant-panel')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ask Voice Assistant
            </ThreeDButton>
          </div>
        </div>

        <div className="assist-card-3d" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--purple-50) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Images size={20} color="var(--purple-600)" />
            <strong style={{ fontSize: '1rem', color: 'var(--purple-900)' }}>Memory Spotlight</strong>
          </div>
          <div className="memory-frame-3d">
            <img src="/assets/family-photo.svg" alt="Familiar memory photo" />
          </div>
          <div style={{ marginTop: '12px' }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)', display: 'block' }}>Ananya & Grandchildren</strong>
            <span style={{ fontSize: '0.84rem', color: 'var(--purple-700)', fontWeight: 600 }}>Diwali Celebration, New Delhi</span>
          </div>
          <Link to="/patient/memories" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--purple-600)' }}>
            Explore Memory Album ➔
          </Link>
        </div>

        <div className="assist-card-3d" style={{ background: 'linear-gradient(135deg, var(--emerald-50) 0%, #ffffff 100%)', border: '1px solid var(--emerald-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="var(--emerald-600)" />
            <strong style={{ fontSize: '0.95rem', color: 'var(--emerald-900)' }}>Caregiver Daily Note</strong>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--emerald-950)', fontStyle: 'italic' }}>
            "Good morning Mom! Rahul checked in at 08:30 AM. Remember to take your morning walk after tea."
          </p>
        </div>
      </aside>
    </div>
  );
}
