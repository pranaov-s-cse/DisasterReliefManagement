import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { mockSocket } from './utils/mockSocket';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DisasterAlerts = lazy(() => import('./pages/DisasterAlerts'));
const ResourceManagement = lazy(() => import('./pages/ResourceManagement'));
const VolunteerManagement = lazy(() => import('./pages/VolunteerManagement'));
const GeospatialMapping = lazy(() => import('./pages/GeospatialMapping'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Initialize socket connection
  useEffect(() => {
    mockSocket.connect();
    
    return () => {
      mockSocket.disconnect();
    };
  }, []);

  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><LoadingSpinner size="large" /></div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alerts" element={<DisasterAlerts />} />
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="map" element={<GeospatialMapping />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin routes */}
          <Route path="admin">
            <Route path="resources" element={
              <AdminRoute>
                <ResourceManagement isAdmin={true} />
              </AdminRoute>
            } />
            <Route path="volunteers" element={
              <AdminRoute>
                <VolunteerManagement isAdmin={true} />
              </AdminRoute>
            } />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;