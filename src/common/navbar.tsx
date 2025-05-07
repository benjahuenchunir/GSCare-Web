// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo + marca */}
        <Link
          to={isAuthenticated ? "/user" : "/"}
          className="flex items-center space-x-2"
        >
          <img
            src="/assets/LogoSinTexto.png"
            alt="Logo GSCare"
            className="w-12 h-auto"
          />
          <span className="text-2xl font-semibold text-[#368990]">GSCare</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          {!isLoading && isAuthenticated && (
            <>
              <Link
                to="/user"
                className="text-gray-700 hover:text-gray-900 text-lg"
              >
                Ver mi perfil
              </Link>
              <Link
                to="/games"
                className="text-gray-700 hover:text-gray-900 text-lg"
              >
                Ver Juegos
              </Link>
            </>
          )}

          <Link
            to="/servicios"
            className="text-gray-700 hover:text-gray-900 text-lg"
          >
            Servicios
          </Link>
          <Link
            to="/productos"
            className="text-gray-700 hover:text-gray-900 text-lg"
          >
            Productos
          </Link>
          <Link
            to="/actividades"
            className="text-gray-700 hover:text-gray-900 text-lg"
          >
            Actividades
          </Link>

          {!isLoading &&
            (isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            ) : (
              <LoginButton />
            ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 hover:text-gray-900"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-4">
            {!isLoading && isAuthenticated && (
              <>
                <Link
                  to="/user"
                  className="block text-gray-700 hover:text-gray-900 text-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Ver mi perfil
                </Link>
                <Link
                  to="/games"
                  className="block text-gray-700 hover:text-gray-900 text-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Ver Juegos
                </Link>
              </>
            )}

            <Link
              to="/servicios"
              className="block text-gray-700 hover:text-gray-900 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              to="/productos"
              className="block text-gray-700 hover:text-gray-900 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/actividades"
              className="block text-gray-700 hover:text-gray-900 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Actividades
            </Link>

            {!isLoading &&
              (isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-500 text-white font-bold px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Cerrar sesión
                </button>
              ) : (
                <div onClick={() => setMenuOpen(false)}>
                  <LoginButton />
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
