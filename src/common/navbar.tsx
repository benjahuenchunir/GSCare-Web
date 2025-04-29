import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth0();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex items-center justify-between px-8 py-4 bg-white shadow-md">
      {/* Logo + marca */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/assets/LogoSinTexto.png"
          alt="Logo GSCare"
          className="w-17 h-12"
        />
        <span className="text-2xl font-semibold text-secondary1">GSCare</span>
      </Link>

      {/* Enlaces + botón auth */}
      <div className="flex items-center space-x-8">
        <Link to="/servicios" className="text-gray-700 hover:text-gray-900 text-lg">
          Servicios
        </Link>
        <Link to="/productos" className="text-gray-700 hover:text-gray-900 text-lg">
          Productos
        </Link>
        <Link to="/nosotros" className="text-gray-700 hover:text-gray-900 text-lg">
          Nosotros
        </Link>
        <Link to="/testimonios" className="text-gray-700 hover:text-gray-900 text-lg">
          Testimonios
        </Link>

        {/* Si aún carga auth, no mostrar nada */}
        {!isLoading && (
          isAuthenticated
            ? <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="bg-red-500 text-white font-bold px-5 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Cerrar sesión
              </button>
            : <LoginButton />
        )}
      </div>
    </nav>
  );
}
