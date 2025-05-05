import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import Layout from "./Layout";
// import LoginPage     from "./pages/LoginPage";
import UserPage from "./pages/Usuarios/UserPage.tsx";
import AuthHandler from "./pages/Auth0/AuthHandler.tsx";
import CompleteProfilePage from "./pages/Auth0/CompleteProfilePage.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import UserEditProfile from "./pages/Usuarios/UserEditInfo.tsx";
import ServicesListPage from "./pages/Servicios/ServicesListPage";
import ServicePage from "./pages/Servicios/servicePage";
import GamesView from "./pages/GamesView.tsx";
import ActivityPage from "./pages/Actividades/activityPage.tsx";
import ActivitiesListPage from "./pages/Actividades/activitiesListPage.tsx";

export default function Routing() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Rutas públicas  */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth-handler" element={<AuthHandler />} />
                <Route path="/servicios" element={<ServicesListPage />} />
                <Route path="/servicios/:id" element={<ServicePage />} />
                <Route path="/actividades" element={<ActivitiesListPage />} />
                <Route path="/actividades/:id" element={<ActivityPage />} />
                {/* Ruta protegida */}
                <Route path="/user" element={
                    <ProtectedRoute>
                        <UserPage />
                    </ProtectedRoute> } />

                <Route path="/complete-profile" element={
                    <ProtectedRoute>
                        <CompleteProfilePage />
                    </ProtectedRoute> } />

                {/* ruta de editar perfil */}
                <Route path="/edit-profile" element={
                    <ProtectedRoute>
                        <UserEditProfile />
                    </ProtectedRoute> } />

                 {/* ruta para ver los juegos */}
                <Route path="/games" element={
                    <ProtectedRoute>
                        <GamesView />
                    </ProtectedRoute> } />

                <Route path="/actividades" element={
                    <ProtectedRoute>
                        <div className="w-full h-screen flex items-center justify-center">
                            <h1 className="text-[3rem] font-bold text-[#006881] w-full text-center m-0">Actividades</h1>
                        </div>
                    </ProtectedRoute> } />

                <Route path="/productos" element={
                    <ProtectedRoute>
                        <div className="w-full h-screen flex items-center justify-center">
                            <h1 className="text-[3rem] font-bold text-[#006881] w-full text-center m-0">Productos</h1>
                        </div>
                    </ProtectedRoute> } />
            </Route>


        </Routes>
      </BrowserRouter>
    );
}
