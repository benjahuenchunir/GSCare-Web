// src/components/SessionManager.tsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function SessionManager() {
  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await getAccessTokenSilently();
      } catch (error) {
        console.warn("Token expirado, cerrando sesión...");
        logout({ logoutParams: { returnTo: window.location.origin } });
      }
    }, 30000); // cada 30 segundos

    return () => clearInterval(interval);
  }, [getAccessTokenSilently, logout]);

  return null;
}
