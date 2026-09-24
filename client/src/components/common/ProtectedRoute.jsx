import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-deep-brown/60 font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'ADMIN' || user.role === 'STAFF') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/maharaja-card" replace />;
  }

  return children;
}
