import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import UserPage from "./pages/UserPage";
import LoginPage     from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";


export default function Routing() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas  */}
          <Route path="/" element={<LoginPage />} />
            <Route path="/app" element={<App />} />
  
          {/* Ruta protegida */}
          <Route path="/user" element={
            <ProtectedRoute>
                <UserPage />
            </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );
}
