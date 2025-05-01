// src/pages/AuthHandler.tsx
import React, { useEffect, useState } from "react";
import { useAuth0 }                   from "@auth0/auth0-react";
import { useNavigate }                from "react-router-dom";
import { getUserByEmail }             from "../../services/userService";

const AuthHandler: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // No logueado → vuelve a /
      navigate("/", { replace: true });
      return;
    }

    if (user?.email) {
      // Chequear existencia en tu API
      getUserByEmail(user.email)
        .then(() => {
          // Ya existe → a /user
          navigate("/user", { replace: true });
        })
        .catch((err: any) => {
          if (err.status === 404) {
            // No existe → a completar perfil
            navigate("/complete-profile", { replace: true });
          } else {
            setError("Error al verificar usuario");
          }
        });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) return <p className="text-center mt-10">Cargando…</p>;
  if (error)     return <p className="text-center mt-10 text-red-600">{error}</p>;
  return null; // No renderizamos nada
};

export default AuthHandler;
