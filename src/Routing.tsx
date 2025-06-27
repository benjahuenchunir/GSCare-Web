import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import Layout from "./Layout";
import AdminLayout from "./AdminLayout";
import AdminRoute from "./components/AdminRoute.tsx";
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
import ForumPage from "./pages/Actividades/ForumPage.tsx";
import ProductPage from "./pages/Productos/productosPage.tsx";
import ProductsListPage from "./pages/Productos/productosListPage.tsx";
import Agenda from "./pages/Agenda/Agenda.tsx";
import Page from "./pages/Test/page.tsx";
import PricingPage from "./pages/Usuarios/PricingPage.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsersPage from "./pages/Admin/AdminUsersPage.tsx";
import AdminProductsPage from "./pages/Admin/AdminProductsPage.tsx";
import AdminActividadesPage from "./pages/Admin/AdminActividadesPage.tsx";
import AdminServicesPage from "./pages/Admin/AdminServicesPage.tsx";
import AdminConfigPage from "./pages/Admin/AdminConfigPage.tsx";
import AdminReportReviewPage from "./pages/Admin/AdminReportReviewPage.tsx";
import ThreadCommentsPage from "./pages/Actividades/ThreadCommentsPage.tsx";

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              {" "}
              <AdminLayout />{" "}
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="reportes" element={<AdminReportReviewPage />} />
          <Route path="actividades" element={<AdminActividadesPage />} />
          <Route path="servicios" element={<AdminServicesPage />} />
          <Route path="configuracion" element={<AdminConfigPage />} />
        </Route>

        <Route path="/" element={<Layout />}>
          {/* Rutas públicas  */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth-handler" element={<AuthHandler />} />
          <Route path="/servicios" element={<ServicesListPage />} />
          <Route path="/servicios/:id" element={<ServicePage />} />
          <Route path="/actividades" element={<ActivitiesListPage />} />
          <Route path="/actividades/:id" element={<ActivityPage />} />
          <Route path="/actividades/:activityId/foro" element={<ForumPage />} />
          <Route
            path="/actividades/:activityId/foro/:threadId"
            element={<ThreadCommentsPage />}
          />
          <Route path="/productos" element={<ProductsListPage />} />
          <Route path="/productos/:id" element={<ProductPage />} />
          <Route path="/mi-agenda" element={<Agenda />} /> {/* Ruta de login */}
          <Route path="/test" element={<Page />} />
          {/* Ruta protegida */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <UserEditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GamesView />
              </ProtectedRoute>
            }
          />
          {/* Puedes limpiar estas rutas duplicadas */}
          <Route
            path="/actividades"
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
