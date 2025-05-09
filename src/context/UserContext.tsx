// src/context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserByEmail, User } from "../services/userService";

interface UserContextValue {
  profile: User | null;
  loading: boolean;
  reloadProfile: () => Promise<void>;
}

export const UserContext = createContext<UserContextValue>({
  profile: null,
  loading: true,
  reloadProfile: async () => {}
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadProfile = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await getUserByEmail(user.email);
      setProfile(data);
    } catch (err) {
      console.error("Error al recargar perfil:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setProfile(null);
      setLoading(false);
      return;
    }
    reloadProfile();
  }, [isLoading, isAuthenticated, reloadProfile]);

  return (
    <UserContext.Provider value={{ profile, loading, reloadProfile }}>
      {children}
    </UserContext.Provider>
  );
};
