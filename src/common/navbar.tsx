// src/components/Navbar.jsx
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaUserAlt } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth0();
  const { profile } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        {/* Sección Izquierda: Logo y condicionalmente Página Principal */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link
            to={isAuthenticated ? "/user" : "/"}
            className="flex items-center space-x-2"
          >
            <img
              src="/assets/LogoSinTexto.png"
              alt="Logo GSCare"
              className="w-12 h-auto"
            />
            <span className="text-[1.5em] font-semibold text-[#368990]">GSCare</span>
          </Link>

          {!isAuthenticated && (
            <div className="hidden md:block">
              <Link to="/" className="text-[1.1em] text-gray-700 hover:text-gray-900">
                Página Principal
              </Link>
            </div>
          )}

          {/* Badge condicional por rol */}
          {!isLoading && isAuthenticated && profile?.rol && (
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md ml-2 text-[#006881] text-[0.9em] font-semibold">
              {profile.rol === "socio" ? (
                <>
                  <FaCrown className="text-yellow-500 text-[1.4em]" />
                  <div className="flex flex-col leading-tight text-left">
                    <span className="text-yellow-700">Usuario</span>
                    <span className="text-yellow-700">Socio</span>
                  </div>
                </>
              ) : (
                <>
                  <FaUserAlt className="text-[#009982] text-[1.4em]" />
                  <div className="flex flex-col leading-tight text-left">
                    <span>Usuario</span>
                    <span>Gratuito</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex text-[1.1em] items-center space-x-6">
          {!isLoading && isAuthenticated && (
            <>
              <Link to="/user" className="text-gray-700 hover:text-gray-900">
                Ver mi perfil
              </Link>
              <Link to="/games" className="text-gray-700 hover:text-gray-900">
                Ver Juegos
              </Link>
              <Link to="/productos" className="text-gray-700 hover:text-gray-900">
                Productos
              </Link>
              <Link to="/servicios" className="text-gray-700 hover:text-gray-900">
                Servicios
              </Link>
              <Link to="/actividades" className="text-gray-700 hover:text-gray-900">
                Actividades
              </Link>
            </>
          )}

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
        <div className="md:hidden text-[1.1em] bg-white shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-4">
            {/* Añadir Página Principal al menú móvil si no está autenticado */}
            {!isAuthenticated && (
              <Link
                to="/"
                className="block text-gray-700 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Página Principal
              </Link>
            )}
            {!isLoading && isAuthenticated && (
              <>
                <Link
                  to="/user"
                  className="block text-gray-700 hover:text-gray-900 "
                  onClick={() => setMenuOpen(false)}
                >
                  Ver mi perfil
                </Link>
                <Link
                  to="/games"
                  className="block text-gray-700 hover:text-gray-900 "
                  onClick={() => setMenuOpen(false)}
                >
                  Ver Juegos
                </Link>
                <Link
                  to="/productos"
                  className="block text-gray-700 hover:text-gray-900 "
                  onClick={() => setMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  to="/servicios"
                  className="block text-gray-700 hover:text-gray-900 "
                  onClick={() => setMenuOpen(false)}
                >
                  Servicios
                </Link>
                <Link
                  to="/actividades"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Actividades
                </Link>
              </>
            )}

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
