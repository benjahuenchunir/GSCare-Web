import {
  Home,
  Users,
  Package,
  Calendar,
  ShoppingBag,
  Gamepad2,
  Newspaper,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  Pencil,
  ArrowUpRight,
  MessageSquareQuote,
} from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"

const navItems = [
  { label: "Dashboard", icon: Home, to: "/admin" },
  { label: "Usuarios", icon: Users, to: "/admin/usuarios" },
  { label: "Servicios", icon: Package, to: "/admin/servicios" },
  { label: "Actividades", icon: Calendar, to: "/admin/actividades" },
  { label: "Productos", icon: ShoppingBag, to: "/admin/productos" },
  { label: "Juegos", icon: Gamepad2, to: "/admin/juegos" },
  { label: "Noticias", icon: Newspaper, to: "/admin/noticias" },
  { label: "Reportes", icon: BarChart3, to: "/admin/reportes" },
  { label: "Planes y Testimonios", icon: MessageSquareQuote, to: "/admin/testimonios" },
  { label: "Configuración", icon: Settings, to: "/admin/configuracion" },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth0()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col md:sticky md:top-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center gap-3 justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#006881] text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin</h2>
              <p className="text-sm text-gray-500">Panel de control</p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-[#62CBC9] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom buttons */}
        <div className="border-t border-gray-200 p-4 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <ArrowUpRight className="w-5 h-5" />
            Ir a GSCare
          </button>
          <button
            onClick={() => navigate("/edit-profile?from=admin")}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Pencil className="w-5 h-5" />
            Editar perfil
          </button>
          <button
            onClick={() =>
              logout({
                logoutParams: { returnTo: window.location.origin },
              })
            }
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Admin</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
