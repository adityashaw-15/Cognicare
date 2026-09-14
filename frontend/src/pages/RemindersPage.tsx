import { Bell, Check, Clock3, SkipForward, Pill, Droplet, Utensils, Calendar } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAppData } from '../context/AppDataContext';

const categoryIcons: Record<string, typeof Pill> = {
  MEDICATION: Pill,
  HYDRATION: Droplet,
  MEAL: Utensils,
  APPOINTMENT: Calendar
};

export function RemindersPage() {
  const { reminders, completeReminder } = useAppData();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Routine & Medication Assistance"
        title="Today's Reminders"
        description="Medication, hydration, meals, and appointments. Actioned tasks update offline instantly."
      />

      <section className="timeline-list">
        {reminders.map((reminder) => {
          const CategoryIcon = categoryIcons[reminder.category] ?? Bell;
          return (
            <article className={`timeline-item ${reminder.completed ? 'completed' : ''}`} key={reminder.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: reminder.completed ? 'var(--emerald-50)' : 'var(--amber-50)', color: reminder.completed ? 'var(--emerald-600)' : 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="timeline-time">{reminder.time}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', background: 'var(--slate-100)', color: 'var(--slate-600)' }}>
                      {reminder.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>{reminder.title}</h3>
                  <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>{reminder.description}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!reminder.completed ? (
                  <>
                    <ThreeDButton icon={<Check size={18} />} onClick={() => completeReminder(reminder.id, 'DONE')}>
                      Done
                    </ThreeDButton>
                    <ThreeDButton variant="soft" icon={<Clock3 size={18} />} onClick={() => completeReminder(reminder.id, 'SNOOZE')}>
                      Snooze
                    </ThreeDButton>
                  </>
                ) : (
                  <span style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)', padding: '8px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={18} /> Completed
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {reminders.length === 0 && <EmptyState title="No reminders set" body="Scheduled reminders will appear here." />}
    </div>
  );
}
