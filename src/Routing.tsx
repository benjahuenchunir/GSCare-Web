import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

import Layout from "./Layout";
import LoginPage     from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AuthHandler from "./pages/AuthHandler";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserEditProfile from "./pages/UserEditInfo";
import ServicesListPage from "./pages/Servicios/ServicesListPage";
import ServicePage from "./pages/Servicios/servicePage";

export default function Routing() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Rutas públicas  */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/auth-handler" element={<AuthHandler />} />
                <Route path="/app" element={<App />} />
                <Route path="/servicios" element={<ServicesListPage />} />
                <Route path="/servicios/:id" element={<ServicePage />} />
    
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
            </Route>

            
        </Routes>
      </BrowserRouter>
    );
}