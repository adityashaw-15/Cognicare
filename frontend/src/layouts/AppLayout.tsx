import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  Brain,
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  HeartPulse,
  Home,
  LogOut,
  Mic,
  Settings,
  Users,
  Images,
  UserRoundSearch
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ThreeDButton } from '../components/ThreeDButton';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

const patientNav = [
  { to: '/patient', labelKey: 'home', icon: Home, end: true },
  { to: '/patient/games', labelKey: 'games', icon: Brain },
  { to: '/patient/memories', labelKey: 'memories', icon: Images },
  { to: '/patient/reminders', labelKey: 'reminders', icon: Bell },
  { to: '/patient/routine', labelKey: 'routine', icon: CalendarCheck },
  { to: '/patient/mood', labelKey: 'mood', icon: HeartPulse },
  { to: '/patient/progress', labelKey: 'progress', icon: ChartNoAxesColumnIncreasing },
  { to: '/patient/voice', labelKey: 'voice', icon: Mic },
  { to: '/patient/settings', labelKey: 'settings', icon: Settings }
];

const caregiverNav = [
  { to: '/caregiver', label: 'Overview', icon: Home, end: true },
  { to: '/caregiver/patients', label: 'Patients', icon: Users },
  { to: '/caregiver/activity', label: 'Activity', icon: Activity },
  { to: '/caregiver/memories', label: 'Memories', icon: Images },
  { to: '/caregiver/reminders', label: 'Reminders', icon: Bell },
  { to: '/caregiver/alerts', label: 'Alerts', icon: ClipboardList },
  { to: '/caregiver/reports', label: 'Reports', icon: ChartNoAxesColumnIncreasing },
  { to: '/caregiver/settings', label: 'Settings', icon: Settings }
];

const healthcareNav = [
  { to: '/healthcare', label: 'Patients', icon: UserRoundSearch, end: true },
  { to: '/healthcare/activity-trends', label: 'Activity Trends', icon: Activity },
  { to: '/healthcare/alerts', label: 'Alerts', icon: Bell },
  { to: '/healthcare/reports', label: 'Reports', icon: ChartNoAxesColumnIncreasing }
];

export function AppLayout() {
  const { account, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  if (!account) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const items = account.role === 'PATIENT' ? patientNav : account.role === 'CAREGIVER' ? caregiverNav : healthcareNav;

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-lockup">
          <img src="/assets/jarvis-icon.svg" alt="" />
          <div>
            <strong>CogniCare</strong>
            <span>Cognitive & Memory Assistance Platform</span>
          </div>
        </div>
        <nav>
          {items.map((item) => {
            const Icon = item.icon;
            const label = 'labelKey' in item ? t(item.labelKey) : item.label;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <Icon size={22} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
        <ThreeDButton
          variant="soft"
          icon={<LogOut size={18} />}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Switch Role
        </ThreeDButton>
      </aside>

      <main className="content-shell">
        <div className="topbar">
          <div>
            <p className="eyebrow">{account.label}</p>
            <strong>{account.displayName}</strong>
          </div>
          <StatusBadge />
        </div>
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const label = 'labelKey' in item ? t(item.labelKey) : item.label;
          return (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export function RoleHomeRedirect() {
  const { account } = useAuth();
  if (!account) {
    return <Navigate to="/login" replace />;
  }
  if (account.role === 'CAREGIVER') {
    return <Navigate to="/caregiver" replace />;
  }
  if (account.role === 'HEALTHCARE_WORKER') {
    return <Navigate to="/healthcare" replace />;
  }
  return <Navigate to="/patient" replace />;
}

