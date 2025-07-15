import { type JSX} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
