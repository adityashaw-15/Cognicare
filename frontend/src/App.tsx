import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { AppDataProvider } from './context/AppDataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout, RoleHomeRedirect } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { GamesPage } from './pages/GamesPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { RemindersPage } from './pages/RemindersPage';
import { RoutinePage } from './pages/RoutinePage';
import { MoodPage } from './pages/MoodPage';
import { ProgressPage } from './pages/ProgressPage';
import { VoicePage } from './pages/VoicePage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <AppDataProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/patient" element={<AppLayout />}>
                  <Route index element={<PatientDashboard />} />
                  <Route path="games" element={<GamesPage />} />
                  <Route path="memories" element={<MemoriesPage />} />
                  <Route path="reminders" element={<RemindersPage />} />
                  <Route path="routine" element={<RoutinePage />} />
                  <Route path="mood" element={<MoodPage />} />
                  <Route path="progress" element={<ProgressPage />} />
                  <Route path="voice" element={<VoicePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="/caregiver" element={<AppLayout />}>
                  <Route index element={<PatientDashboard />} />
                  <Route path="patients" element={<PatientDashboard />} />
                  <Route path="activity" element={<RoutinePage />} />
                  <Route path="memories" element={<MemoriesPage />} />
                  <Route path="reminders" element={<RemindersPage />} />
                  <Route path="alerts" element={<ProgressPage />} />
                  <Route path="reports" element={<ProgressPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="/healthcare" element={<AppLayout />}>
                  <Route index element={<PatientDashboard />} />
                  <Route path="activity-trends" element={<ProgressPage />} />
                  <Route path="alerts" element={<ProgressPage />} />
                  <Route path="reports" element={<ProgressPage />} />
                </Route>

                <Route path="/" element={<RoleHomeRedirect />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AppDataProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
