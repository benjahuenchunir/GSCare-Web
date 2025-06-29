import React, { JSX, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Props {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { profile, loading: profileLoading } = useContext(UserContext);
  const location = useLocation();

  if (authLoading || profileLoading) {
    return <p className="text-center mt-10">Cargando…</p>;
  }

  if (!isAuthenticated) {
    // Si no está logueado, redirige a /
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role && profile?.rol !== role) {
    // Si el rol no coincide, redirige a /user
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
