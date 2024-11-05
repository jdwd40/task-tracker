import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TaskList } from './components/tasks/TaskList';
import { Timer } from './components/timer/Timer';
import { ReportsView } from './components/reports/ReportsView';
import { ProfileView } from './components/profile/ProfileView';
import { useAuthStore } from './store/authStore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <AuthLayout title="Welcome Back">
            <LoginForm />
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout title="Create Account">
            <SignupForm />
          </AuthLayout>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Timer />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/tasks"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TaskList />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ReportsView />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ProfileView />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;