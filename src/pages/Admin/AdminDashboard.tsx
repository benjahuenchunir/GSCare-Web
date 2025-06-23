import { useEffect, useState } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import { Calendar, Package, ShoppingBag, Users, Eye, ChevronRight } from "lucide-react";
import { getAdminCount, getRecentUsers, getRecentActivities } from "../../services/adminService";

const notifications = [
  { type: "Foro", by: "Juan Pérez", date: "2024-06-15", text: "Contenido inapropiado en discusión sobre servicios" },
  { type: "Reseña", by: "María Silva", date: "2024-06-15", text: "Reseña falsa sobre servicio de limpieza" },
  { type: "Foro", by: "Pedro García", date: "2024-06-14", text: "Spam en foro de actividades" },
  { type: "Reseña", by: "Laura Torres", date: "2024-06-14", text: "Lenguaje ofensivo en reseña de producto" },
];

export default function AdminDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [counts, setCounts] = useState({
    usuarios: 0,
    servicios: 0,
    actividades: 0,
    productos: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const uniqueByActividadBase = (activities: any[]): any[] => {
    const seen = new Set();
    const unique: any[] = [];

    for (const act of activities) {
      const baseId = act.id_actividad_base ?? act.id; // fallback si no existe
      if (!seen.has(baseId)) {
        seen.add(baseId);
        unique.push(act);
      }
      if (unique.length >= 5) break;
    }

    return unique;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();

        const [usuarios, servicios, actividades, productos, recent] = await Promise.all([
          getAdminCount("usuarios", token),
          getAdminCount("servicios", token),
          getAdminCount("actividades", token),
          getAdminCount("productos", token),
          getRecentUsers(token, 5)
        ]);

        const actsRaw = await getRecentActivities(token, 20); // trae más para asegurar unicidad
        const actsFiltered = uniqueByActividadBase(actsRaw);

        setCounts({ usuarios, servicios, actividades, productos });
        setRecentUsers(recent);
        setRecentActivities(actsFiltered);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);


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
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel general</h1>
        <p className="text-sm text-gray-600">Bienvenido, Admin</p>
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
          <QuickAction title="Ver usuarios" description="Gestionar usuarios registrados" color="#62CBC9" />
          <QuickAction title="Ir a reportes" description="Ver estadísticas detalladas" color="#FFC600" />
          <QuickAction title="Crear nuevo servicio" description="Agregar servicio al catálogo" color="#FF8D6B" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Registros recientes</h3>
              <p className="text-sm text-gray-600">Los usuarios más recientes</p>
            </div>
            <button className="text-[#62CBC9] hover:text-[#006881] flex items-center text-sm">
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
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        user.rol === "socio"
                          ? "bg-yellow-600/20 text-yellow-600"
                          : user.rol === "administrador" ? "bg-[#6B21A8]/20 text-[#6B21A8]"
                          : "bg-[#009982]/10 text-[#006881]"
                      }`}
                    >
                      {user.rol === "socio" ? "Socio" : user.rol === "administrador" ? "Administrador" : "General"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-between items-center mb-4 mt-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Actividades recientes</h3>
              <p className="text-sm text-gray-600">Últimas actividades creadas</p>
            </div>
            <button className="text-[#62CBC9] hover:text-[#006881] flex items-center text-sm">
              Ver todas <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 border-b">
              <tr>
                <th className="py-2">Título</th>
                <th>Categoría</th>
                <th>Comuna</th>
                <th>Fecha de creación</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{act.nombre || "Sin título"}</td>
                  <td>{act.categoria || "General"}</td>
                  <td>{act.comuna || "No especificada"}</td>
                  <td>{new Date(act.createdAt).toLocaleDateString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>


        <section className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notificaciones</h3>
          <p className="text-sm text-gray-600 mb-4">Contenido reportado por usuarios</p>
          <div className="space-y-4">
            {notifications.map((n, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      n.type === "Foro" ? "bg-[#62CBC9]/10 text-[#009982]" : "bg-[#FF8D6B]/10 text-[#FF4006]"
                    }`}
                  >
                    {n.type}
                  </span>
                  <span className="text-xs text-gray-500">{n.date}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Reportado por: {n.by}</p>
                <p className="text-sm text-gray-600">{n.text}</p>
                <button className="mt-3 inline-flex items-center gap-1 bg-[#62CBC9] hover:bg-[#006881] text-white text-sm px-3 py-1.5 rounded-md">
                  <Eye className="w-4 h-4" /> Revisar
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
      <div className={`rounded-lg p-2`} style={{ backgroundColor: color }}>
        <Users className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
