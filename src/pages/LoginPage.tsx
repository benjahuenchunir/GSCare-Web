import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";

const LoginPage: React.FC = () => {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <p className="text-center mt-10">Cargando…</p>;
  }

  if (isAuthenticated) {
    // Si ya está logueado, redirige a /user
    return <Navigate to="/auth-handler" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a GSCare</h1>

      {/* Botón de login */}
      <LoginButton />

      {/* Botón de signup */}
      <SignupButton />

      {/* Botón de logout visible solo por si queda sesión colgada */}
      <button
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default LoginPage;
