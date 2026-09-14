import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Stethoscope, UserRound, ShieldCheck, Zap, WifiOff } from 'lucide-react';
import { ThreeDButton } from '../components/ThreeDButton';
import { demoAccounts, DemoAccount, useAuth } from '../context/AuthContext';

const icons = {
  PATIENT: UserRound,
  CAREGIVER: HeartHandshake,
  HEALTHCARE_WORKER: Stethoscope,
  ADMIN: UserRound
};

export function LoginPage() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const continueAs = async (account: DemoAccount) => {
    setLoadingRole(account.role);
    const home = await loginAs(account);
    navigate(home);
  };

  return (
    <main className="login-shell">
      <section className="login-hero">
        <div className="brand-lockup large">
          <img src="/assets/jarvis-icon.svg" alt="CogniCare Logo" />
          <div>
            <strong>CogniCare</strong>
            <span>Cognitive & Memory Assistance Platform</span>
          </div>
        </div>
        <h1>Empowering everyday memory, calm routine, and caregiver connection.</h1>
        <p>
          A high-contrast, accessible cognitive companion built for offline reliability, routine reminders, personalized memory exercises, and caregiver monitoring.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <span style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <WifiOff size={16} /> Offline-First Architecture
          </span>
          <span style={{ background: 'var(--purple-50)', color: 'var(--purple-700)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} /> Instant Synced Data
          </span>
          <span style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> Privacy-First Design
          </span>
        </div>

        <div className="demo-note">Demo environment. CogniCare provides cognitive assistance and does not replace medical treatment.</div>
      </section>

      <section className="login-panel" aria-label="Demo role selector">
        <p className="eyebrow">Select your workspace</p>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>Choose a Demo Role to Begin</h2>
        
        <div className="role-grid">
          {demoAccounts.map((account) => {
            const Icon = icons[account.role];
            return (
              <article className="role-card" key={account.role}>
                <div className="role-card-icon"><Icon size={28} /></div>
                <h3>{account.label}</h3>
                <p>{account.description}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', background: 'var(--slate-50)', padding: '6px 10px', borderRadius: '6px' }}>
                  Demo Creds: <strong>{account.email}</strong>
                </div>
                <ThreeDButton 
                  onClick={() => continueAs(account)} 
                  disabled={loadingRole === account.role}
                  variant={account.role === 'PATIENT' ? 'primary' : account.role === 'CAREGIVER' ? 'secondary' : 'soft'}
                >
                  {loadingRole === account.role ? 'Opening Portal...' : `Continue as ${account.label}`}
                </ThreeDButton>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
