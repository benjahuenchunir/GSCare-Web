import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect(
        {
          authorizationParams: { ui_locales: "es" }
        }
      )}
      className="w-48 px-6 py-3 bg-primary1 text-white font-semibold rounded-lg hover:bg-primary2 transition"
    >
      Iniciar sesión
    </button>
  );
};

export default LoginButton;