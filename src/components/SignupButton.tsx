// src/components/SignupButton.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignupButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: { 
            screen_hint: "signup",
            ui_locales: "es",
            redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
          }
        })
      }
      className="w-48  py-5 bg-secondary2 text-[1em] text-white font-semibold rounded-lg hover:bg-secondary2/90 transition flex justify-center items-center"
    >
      Crear cuenta
    </button>
  );
};

export default SignupButton;
