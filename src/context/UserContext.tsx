import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserByEmail, User } from "../services/userService";

// Define la forma de tu contexto
interface UserContextValue {
  profile: User | null;
  loading: boolean;
}

// Crea el contexto con valores por defecto
export const UserContext = createContext<UserContextValue>({
  profile: null,
  loading: true
});

// Provider
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mientras Auth0 carga, mantenemos loading
    if (isLoading) return;

    // Si no está autenticado, no hay profile
    if (!isAuthenticated) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Si hay usuario Auth0, lo buscamos en tu API
    if (user?.email) {
      getUserByEmail(user.email)
        .then(setProfile)
        .catch(err => {
          console.error("Error al cargar perfil:", err);
          setProfile(null);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <UserContext.Provider value={{ profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};
