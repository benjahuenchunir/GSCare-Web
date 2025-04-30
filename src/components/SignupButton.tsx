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
      className="w-48 px-6 py-5 bg-secondary2 text-xl text-white font-semibold rounded-lg hover:bg-secondary1 transition"
    >
      Crear cuenta
    </button>
  );
};

export default SignupButton;
