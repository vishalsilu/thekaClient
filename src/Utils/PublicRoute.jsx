import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useSelector((state) => state.auth);

  // While checking auth status, show nothing or a loader
  if (isLoading) return null;

  // If user is authenticated, redirect to home
  if (isAuthenticated || token) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, allow access to the public route
  return children;
};

export default PublicRoute;
