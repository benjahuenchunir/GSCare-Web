// src/components/RoleSwitcherButton.tsx
import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserProfile, User } from "../services/userService"; // ← importa el tipo User también
import { UserContext } from "../context/UserContext";

interface RoleSwitcherButtonProps {
  profile: User;
  targetRole: "socio" | "gratis";
  label: string;
  className?: string;
}

export default function RoleSwitcherButton({
  profile,
  targetRole,
  label,
  className,
}: RoleSwitcherButtonProps) {
  const { getAccessTokenSilently } = useAuth0();
  const { reloadProfile } = useContext(UserContext);

  const handleClick = async () => {
    if (!profile || !profile.email) return;
    try {
      const token = await getAccessTokenSilently();
      await updateUserProfile({ ...profile, rol: targetRole }, token);
      await reloadProfile(); // Forzamos recarga del perfil en el contexto
      if (targetRole === "socio") {
        alert("Ahora eres socio 🎉");
      }
    } catch (err) {
      console.error("Error cambiando rol:", err);
      alert("No se pudo actualizar el rol.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`font-semibold px-4 py-2 rounded transition ${className}`}
    >
      {label}
    </button>
  );
}
