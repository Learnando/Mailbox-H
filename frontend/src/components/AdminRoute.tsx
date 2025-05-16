import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react"; // ✅ Import ReactNode!

interface AdminRouteProps {
  children: ReactNode; // ✅ Use ReactNode instead of JSX.Element
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>; // ✅ Wrap children inside fragment
};

export default AdminRoute;
