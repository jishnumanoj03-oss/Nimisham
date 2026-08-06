import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password/:token" element={<ResetPasswordPage />} />
              <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
            </Route>

            {/* Public Profiles (with AppLayout but accessible without auth) */}
            <Route element={<AppLayout />}>
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>

        {/* Global Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success)',
                secondary: 'var(--bg-elevated)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--error)',
                secondary: 'var(--bg-elevated)',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
