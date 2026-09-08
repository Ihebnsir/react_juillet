import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const rolesToCheck = allowedRoles.length > 0 ? allowedRoles : requiredRole ? [requiredRole] : [];
  if (rolesToCheck.length > 0 && !rolesToCheck.includes(user?.role)) {
    const fallbackPath = user?.role === "centre" ? "/centre" : user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
