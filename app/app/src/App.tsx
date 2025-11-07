import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/shared/Layout';
import Login from './components/auth/Login';

// Doctor components
import PatientList from './components/doctor/PatientList';
import PatientDetail from './components/doctor/PatientDetail';

// Patient components
import PatientDashboard from './components/patient/PatientDashboard';
import HealthDataView from './components/patient/HealthDataView';
import AppointmentHistory from './components/patient/AppointmentHistory';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'doctor' | 'patient' }> = ({
  children,
  allowedRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'doctor' ? '/doctor' : '/patient'} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to={isAuthenticated ? '/doctor' : '/login'} replace />
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <Layout>
              <PatientList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patient/:patientId"
        element={
          <ProtectedRoute allowedRole="doctor">
            <Layout>
              <PatientDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <Layout>
              <PatientDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/health"
        element={
          <ProtectedRoute allowedRole="patient">
            <Layout>
              <HealthDataView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRole="patient">
            <Layout>
              <AppointmentHistory />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
