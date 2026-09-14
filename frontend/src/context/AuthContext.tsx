import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { jarvisApi } from '../api/client';
import { DEFAULT_CAREGIVER_ID, DEFAULT_PATIENT_ID, DEFAULT_WORKER_ID, Role } from '../types/models';

export interface DemoAccount {
  role: Role;
  label: string;
  email: string;
  password: string;
  description: string;
  home: string;
  patientId?: string;
  caregiverId?: string;
  workerId?: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    role: 'PATIENT',
    label: 'Elderly Patient',
    email: 'patient@cognicare.demo',
    password: 'demo123',
    description: 'Large, calm dashboard for routine assistance and activities.',
    home: '/patient',
    patientId: DEFAULT_PATIENT_ID
  },
  {
    role: 'CAREGIVER',
    label: 'Caregiver',
    email: 'caregiver@cognicare.demo',
    password: 'demo123',
    description: 'Monitor reminders, memories, progress, and assistance alerts.',
    home: '/caregiver',
    caregiverId: DEFAULT_CAREGIVER_ID,
    patientId: DEFAULT_PATIENT_ID
  },
  {
    role: 'HEALTHCARE_WORKER',
    label: 'Healthcare Worker',
    email: 'worker@cognicare.demo',
    password: 'demo123',
    description: 'Review observed activity trends and conservative reports.',
    home: '/healthcare',
    workerId: DEFAULT_WORKER_ID,
    patientId: DEFAULT_PATIENT_ID
  }
];

interface AuthState extends DemoAccount {
  token: string;
  displayName: string;
}

interface AuthContextValue {
  account: AuthState | null;
  loginAs: (account: DemoAccount) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AuthState | null>(() => {
    const stored = localStorage.getItem('cognicare-auth');
    return stored ? (JSON.parse(stored) as AuthState) : null;
  });

  const value = useMemo<AuthContextValue>(() => {
    const loginAs = async (selected: DemoAccount) => {
      let token = `local-${selected.role.toLowerCase()}`;
      let displayName = selected.role === 'PATIENT' ? 'Anjali Sharma' : selected.role === 'CAREGIVER' ? 'Rahul Sharma' : 'Dr. Meera Iyer';
      try {
        const response = await jarvisApi.login(selected.email, selected.password, selected.role) as {
          token?: string;
          displayName?: string;
          patientId?: string;
          caregiverId?: string;
          workerId?: string;
        };
        token = response.token ?? token;
        displayName = response.displayName ?? displayName;
        selected = {
          ...selected,
          patientId: response.patientId ?? selected.patientId,
          caregiverId: response.caregiverId ?? selected.caregiverId,
          workerId: response.workerId ?? selected.workerId
        };
      } catch {
        token = `offline-${selected.role.toLowerCase()}`;
      }
      const next: AuthState = { ...selected, token, displayName };
      localStorage.setItem('cognicare-auth', JSON.stringify(next));
      setAccount(next);
      return selected.home;
    };

    const logout = () => {
      localStorage.removeItem('cognicare-auth');
      setAccount(null);
    };

    return { account, loginAs, logout };
  }, [account]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

