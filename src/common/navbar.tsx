import { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaCrown } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth0();
  const { profile } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homePath =
    profile?.rol === "administrador"
      ? "/admin"
      : profile?.rol === "proveedor"
      ? "/proveedor"
      : isAuthenticated
      ? "/user"
      : "/";

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 bg-white transition-all duration-300  ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className=" flex flex-wrap items-center justify-between px-4 md:px-8 py-3 gap-y-2">
        {/* Logo */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to={homePath} className="flex items-center space-x-2">
            <img src="/assets/LogoSinTexto.png" alt="Logo GSCare" className="w-12 h-auto" />
            <span className="text-[1.5em] font-semibold text-[#368990]">GSCare</span>
          </Link>

          {!isAuthenticated && (
            <div className="hidden lg:block">
              <NavLink
          to="/"
          className={({ isActive }) =>
            `text-[1.05em] font-medium tracking-wide transition-colors px-4 py-2 rounded-full ${
              isActive
                ? "bg-[#E0F8F4] text-[#009982]"
                : "text-gray-700 hover:text-[#006881] hover:bg-gray-100"
            }`
          }
              >
          Página Principal
              </NavLink>
            </div>
          )}

          {!isLoading && isAuthenticated && (profile?.rol === "socio" || profile?.rol === "proveedor") && (
            <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md ml-2 text-[0.9em] font-semibold">
              {profile.rol === "socio" ? (
                <FaCrown className="text-yellow-500 text-[1.4em]" />
              ) : (
                <span className="text-green-500 text-[1.4em]">✓</span>
              )}
              <div className={`flex flex-col leading-tight text-left ${
                profile.rol === "socio" ? "text-yellow-700" : "text-green-800"
              }`}>
                <span>Usuario</span>
                <span>{profile.rol === "socio" ? "Socio" : "Proveedor"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center space-x-2">
          {!isLoading && isAuthenticated && (
            <>
              {(profile?.rol === "administrador"
                ? [
                    { to: "/admin", label: "Administración" },
                    { to: "/mi-agenda", label: "Mi Agenda" },
                    { to: "/noticias", label: "Noticias" },
                    { to: "/games", label: "Ver Juegos" },
                    { to: "/productos", label: "Productos" },
                    { to: "/servicios", label: "Servicios" },
                    { to: "/actividades", label: "Actividades" },
                  ]
                : profile?.rol === "proveedor"
                ? [
                    { to: "/proveedor", label: "Mi Perfil" },
                    { to: "/mi-agenda", label: "Mi Agenda" },
                    { to: "/servicios", label: "Servicios" },
                    { to: "/actividades", label: "Actividades" },
                  ]
                : [
                    { to: "/user", label: "Ver mi perfil" },
                    { to: "/mi-agenda", label: "Mi Agenda" },
                    { to: "/noticias", label: "Noticias" },
                    { to: "/games", label: "Ver Juegos" },
                    { to: "/productos", label: "Productos" },
                    { to: "/servicios", label: "Servicios" },
                    { to: "/actividades", label: "Actividades" },
                  ]
              ).map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `transition-all px-4 py-2 rounded-full font-medium tracking-wide ${
                      isActive
                        ? "bg-[#E0F8F4] text-[#009982]"
                        : "text-gray-700 hover:text-[#006881] hover:bg-gray-100"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </>
          )}

          {!isLoading && isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-[#EF4444] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#DC2626] transition-colors whitespace-nowrap"
            >
              Cerrar sesión
            </button>
          )}
          {!isLoading && !isAuthenticated && (
            <LoginButton />
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-700 hover:text-gray-900"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden text-[1.05em] bg-white shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-4">
            {!isAuthenticated && (
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block font-medium px-3 py-2 rounded-full transition-all ${
                    isActive
                      ? "bg-[#E0F8F4] text-[#009982]"
                      : "text-gray-700 hover:text-[#006881] hover:bg-gray-100"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Página Principal
              </NavLink>
            )}

            {!isLoading && isAuthenticated && (
              <>
                {[
                  profile?.rol === "administrador"
                    ? { to: "/admin", label: "Administración" }
                    : { to: "/user", label: "Ver mi perfil" },
                  { to: "/user/mi-agenda", label: "Mi Agenda" },
                  { to: "/games", label: "Ver Juegos" },
                  { to: "/productos", label: "Productos" },
                  { to: "/servicios", label: "Servicios" },
                  { to: "/actividades", label: "Actividades" },
                ].map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `block font-medium px-3 py-2 rounded-full transition-all ${
                        isActive
                          ? "bg-[#E0F8F4] text-[#009982]"
                          : "text-gray-700 hover:text-[#006881] hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </>
            )}

            {!isLoading &&
              (isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left bg-[#EF4444] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#DC2626] transition-colors"
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
