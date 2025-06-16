import { useAuth0 } from "@auth0/auth0-react"
import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth0()
  const { profile } = useContext(UserContext)

  // Considera que el profile podría ser undefined en el primer render
  const profileLoading = profile === undefined;

  if (authLoading || profileLoading) {
    return <p className="text-center mt-10">Cargando…</p>
  }

  if (!isAuthenticated || profile?.rol !== "administrador") {
    return <Navigate to="/" />
  }

  return <>{children}</>
}
