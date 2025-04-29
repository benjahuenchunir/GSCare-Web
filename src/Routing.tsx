import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

import LoginPage     from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AuthHandler from "./pages/AuthHandler";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";


export default function Routing() {
    return (
      <BrowserRouter>
        <Routes>
            {/* Rutas públicas  */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/auth-handler" element={<AuthHandler />} />
            <Route path="/app" element={<App />} />
  
            {/* Ruta protegida */}
            <Route path="/user" element={
                <ProtectedRoute>
                    <UserPage />
                </ProtectedRoute> } />

            <Route path="/complete-profile" element={
                 <ProtectedRoute>
                    <CompleteProfilePage />
                </ProtectedRoute> } />

            
        </Routes>
      </BrowserRouter>
    );
}
