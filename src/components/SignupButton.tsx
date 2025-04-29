import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignupButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: { screen_hint: "signup" }
        })
      }
      className="w-48 mt-4 px-6 py-3 bg-secondary2 text-white font-semibold rounded-lg hover:bg-secondary1 transition"
    >
      Crear cuenta
    </button>
  );
};

export default SignupButton;