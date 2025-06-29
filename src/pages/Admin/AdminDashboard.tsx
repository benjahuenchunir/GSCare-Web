import { useEffect, useState, useContext } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import { UserContext } from "../../context/UserContext";
import { Calendar, Package, ShoppingBag, Users, Eye, ChevronRight, Flag, TrendingUp, Star } from "lucide-react";
import { getAdminCount, getRecentUsers, getAdminActividades } from "../../services/adminService";
import ReporteModal from "../../components/AdminComponents/ReportReviewModal"; // Ajusta si la ruta cambia
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

export default function AdminDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [counts, setCounts] = useState({
    usuarios: 0,
    servicios: 0,
    actividades: 0,
    productos: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [topActivities, setTopActivities] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [reportesPendientes, setReportesPendientes] = useState<any[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<any>(null);
  const [errorReportes, setErrorReportes] = useState<string | null>(null);

  const { profile } = useContext(UserContext);  
  const navigate = useNavigate();

  const uniqueByActividadBase = (activities: any[]): any[] => {
    const seen = new Set();
    const unique: any[] = [];
    const today = new Date().toISOString().split("T")[0];

    const grouped: Record<number, any[]> = {};
    for (const act of activities) {
      const baseId = act.id_actividad_base ?? act.id;
      if (!grouped[baseId]) grouped[baseId] = [];
      grouped[baseId].push(act);
    }

    const latestPerGroup = Object.values(grouped).map(group => {
      const future = group.filter(a => a.fecha >= today);
      if (future.length > 0) {
        return future.sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
      }
      return group.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    });

    for (const act of latestPerGroup) {
      const baseId = act.id_actividad_base ?? act.id;
      if (!seen.has(baseId)) {
        seen.add(baseId);
        unique.push(act);
      }
    }

    return unique;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const apiUrl = import.meta.env.VITE_API_URL;

        const [usuarios, servicios, actividadesCount, productosCount, recent, activitiesData, productsData] = await Promise.all([
          getAdminCount("usuarios", token),
          getAdminCount("servicios", token),
          getAdminCount("actividades", token),
          getAdminCount("productos", token),
          getRecentUsers(token, 5),
          getAdminActividades({ page: 1, limit: 1000, token }),
          axios.get(`${apiUrl}/productos`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Calcular top 5 actividades por ocupación
        const allActivities = activitiesData.actividades;
        const uniqueActivities = uniqueByActividadBase(allActivities);
        const topActivities = uniqueActivities
          .filter((a: any) => a.capacidad_total > 0)
          .map((a: any) => ({
            ...a,
            porcentaje_ocupacion: (a.asistentes / a.capacidad_total) * 100,
          }))
          .sort((a: any, b: any) => b.porcentaje_ocupacion - a.porcentaje_ocupacion)
          .slice(0, 5);

        // Calcular top 5 productos por visitas
        // Corregido para manejar diferentes estructuras de respuesta de la API de productos
        const productsResponse = productsData.data;
        const allProducts = Array.isArray(productsResponse) 
          ? productsResponse 
          : productsResponse.productos || [];
          
        const topProducts = allProducts
          .filter((p: any) => p.visitas > 0)
          .sort((a: any, b: any) => b.visitas - a.visitas)
          .slice(0, 5);

        console.log(topActivities, topProducts);

        setCounts({ usuarios, servicios, actividades: actividadesCount, productos: productosCount });
        setRecentUsers(recent);
        setTopActivities(topActivities);
        setTopProducts(topProducts);

      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const token = await getAccessTokenSilently();
        // Usar VITE_API_URL para consistencia
        const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${apiUrl}/reportes_contenido`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let data;
        try {
          data = await res.json();
        } catch (err) {
          // Si la respuesta no es JSON, mostrar el texto plano para debug
          const text = await res.text();
          setErrorReportes(
            `No se pudo obtener los reportes: respuesta inválida del servidor.\n\nRespuesta: ${text.slice(0, 200)}...`
          );
          setReportesPendientes([]);
          return;
        }
        const pendientes = data.filter((r: any) => r.estado === "pendiente");
        setReportesPendientes(pendientes);
        setErrorReportes(null);
      } catch (error: any) {
        setErrorReportes("Error al obtener reportes: " + (error?.message || error));
        setReportesPendientes([]);
      }
    };

    fetchReportes();
  }, [getAccessTokenSilently]);

  const openModal = (reporte: any) => {
    setReporteSeleccionado(reporte);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setReporteSeleccionado(null);
  };

  const resolverReporte = async (estado: "descartado" | "revisado", eliminar: boolean) => {
    try {
      const token = await getAccessTokenSilently();
      await fetch(`${import.meta.env.VITE_API_URL}/reportes_contenido/${reporteSeleccionado.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado, eliminar_contenido: eliminar })
      });

      setReportesPendientes(prev => prev.filter(r => r.id !== reporteSeleccionado.id));
      cerrarModal();
    } catch (err) {
      console.error("Error actualizando reporte:", err);
    }
  };

  const dashboardStats = [
    {
      title: "Total usuarios registrados",
      value: counts.usuarios.toLocaleString(),
      icon: Users,
      color: "text-[#62CBC9]",
      bg: "bg-[#62CBC9]/10",
    },
    {
      title: "Servicios activos",
      value: counts.servicios.toString(),
      icon: Package,
      color: "text-[#FFC600]",
      bg: "bg-[#FFC600]/10",
    },
    {
      title: "Actividades creadas",
      value: counts.actividades.toString(),
      icon: Calendar,
      color: "text-[#FF8D6B]",
      bg: "bg-[#FF8D6B]/10",
    },
    {
      title: "Productos disponibles",
      value: counts.productos.toString(),
      icon: ShoppingBag,
      color: "text-[#009982]",
      bg: "bg-[#009982]/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <Helmet>
        <title>GSCare | Panel de Administración</title>
        <meta
          name="description"
          content="Panel de administración de GSCare. Gestiona usuarios, servicios, actividades, productos y reportes de contenido."
        />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel general</h1>
        <p className="text-sm text-gray-600">Bienvenido, {profile?.nombre}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Acciones rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction title="Ver usuarios" description="Gestionar usuarios registrados" color="#62CBC9" icon={Users} to="/admin/usuarios" />
          <QuickAction title="Ir a reportes" description="Ver contenido reportado" color="#FFC600" icon={Flag} to="/admin/reportes" />
          <QuickAction title="Crear nuevo servicio" description="Agregar servicio al catálogo" color="#FF8D6B" icon={Package} to="/admin/servicios" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          {/* Actividades con mayor ocupación */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Actividades con mayor ocupación</h3>
                <p className="text-sm text-gray-600">Top 5 actividades por cupos llenos</p>
              </div>
              <button onClick={() => navigate("/admin/actividades")} className="text-[#62CBC9] hover:text-[#006881] flex items-center text-sm">
                Ver todas <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <ul className="space-y-3">
              {topActivities.map((act) => (
                <li key={act.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <span className="font-medium text-gray-800">{act.nombre}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{act.porcentaje_ocupacion.toFixed(1)}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Productos más visitados */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Productos más visitados</h3>
                <p className="text-sm text-gray-600">Top 5 productos con mayor cantidad de visitas</p>
              </div>
              <button onClick={() => navigate("/admin/productos")} className="text-[#62CBC9] hover:text-[#006881] flex items-center text-sm">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <ul className="space-y-3">
              {topProducts.map((prod) => (
                <li key={prod.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <span className="font-medium text-gray-800">{prod.nombre}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{prod.visitas} visitas</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Últimos usuarios registrados */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Registros recientes</h3>
                <p className="text-sm text-gray-600">Los usuarios más recientes</p>
              </div>
              <button onClick={() => navigate("/admin/usuarios")} className="text-[#62CBC9] hover:text-[#006881] flex items-center text-sm">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600 border-b">
                <tr>
                  <th className="py-2">Nombre</th>
                  <th>Rol</th>
                  <th>Fecha de registro</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{user.nombre}</td>
                    <td>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        user.rol === "socio"
                          ? "bg-yellow-600/20 text-yellow-600"
                          : user.rol === "administrador" ? "bg-[#6B21A8]/20 text-[#6B21A8]"
                          : user.rol === "proveedor" ? "bg-green-200 text-green-800"
                          : "bg-[#009982]/10 text-[#006881]"
                      }`}>
                        {user.rol === "socio" ? "Socio" : user.rol === "administrador" ? "Administrador" : user.rol === "proveedor" ? "Proveedor" : "General"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("es-CL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes pendientes</h3>
          <p className="text-sm text-gray-600 mb-4">Contenido reportado por usuarios</p>
          {errorReportes && (
            <div className="text-red-600 text-sm mb-4">{errorReportes}</div>
          )}
          <div className="space-y-4">
            {reportesPendientes.slice(0, 5).map((n, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    n.tipo_contenido === "comentario" ? "bg-[#62CBC9]/10 text-[#009982]" : "bg-[#FF8D6B]/10 text-[#FF4006]"
                  }`}>
                    {n.tipo_contenido === "comentario" ? "Foro" : "Reseña"}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString("es-CL")}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Reportado por: {n.Usuario?.nombre}</p>
                <p className="text-sm text-gray-600">{n.razon}: {n.descripcion}</p>
                <button
                  onClick={() => openModal(n)}
                  className="mt-3 inline-flex items-center gap-1 bg-[#62CBC9] hover:bg-[#006881] text-white text-sm px-3 py-1.5 rounded-md"
                >
                  <Eye className="w-4 h-4" /> Revisar
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {modalAbierto && reporteSeleccionado && (
        <ReporteModal
          reporte={reporteSeleccionado}
          onClose={cerrarModal}
          onResolve={resolverReporte}
        />
      )}
    </div>
  );
}

function QuickAction({
  title,
  description,
  color,
  icon: Icon,
  to,
}: {
  title: string;
  description: string;
  color: string;
  icon: React.ElementType;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex flex-col text-left items-start gap-2 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
    >
      <div className={`rounded-lg p-2`} style={{ backgroundColor: color }}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}
