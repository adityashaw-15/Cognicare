import { CheckCircle2, Circle, Sun, Coffee, Sunset, Moon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAppData } from '../context/AppDataContext';

export function RoutinePage() {
  const { activities, completeActivity } = useAppData();
  
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Calm Daily Routine"
        title="Today's Schedule & Steps"
        description="Simple, step-by-step daily guide to assist memory and routine stability."
      />
      <section className="timeline-list">
        {activities.map((activity) => (
          <article className={`timeline-item ${activity.completed ? 'completed' : ''}`} key={activity.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: activity.completed ? 'var(--emerald-50)' : 'var(--primary-50)', color: activity.completed ? 'var(--emerald-600)' : 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activity.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <div>
                <span className="timeline-time">{activity.time}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>{activity.title}</h3>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', background: 'var(--slate-100)', color: 'var(--slate-600)' }}>
                  {activity.category}
                </span>
              </div>
            </div>
            <ThreeDButton 
              variant={activity.completed ? 'soft' : 'primary'} 
              onClick={() => completeActivity(activity.id)} 
              disabled={activity.completed}
            >
              {activity.completed ? 'Completed' : 'Mark Step Complete'}
            </ThreeDButton>
          </article>
        ))}
      </section>
    </div>
  );
}
