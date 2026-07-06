import { useSelector } from'react-redux';
import { Navigate, useLocation } from'react-router-dom';

const ProtectedRoute = ({ children }) => {
 const { isAuthenticated, isLoading,token  } = useSelector((state) => state.auth);

 const location = useLocation();

 // While checking if user is logged in, show nothing or a loader
 if (isLoading) return null; 

 if (!isAuthenticated && !token) {
 // Redirect to login, but save the current location so we can redirect back after login
 return <Navigate to="/login" state={{ from: location }} replace />;
 }

 return children;
};

export default ProtectedRoute;