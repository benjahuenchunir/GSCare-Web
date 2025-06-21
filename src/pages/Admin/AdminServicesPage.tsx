import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAdminServicios, aprobarServicio, rechazarServicio } from "../../services/adminService";

export interface Servicio {
  id: number;
  nombre: string;
  categoria: string;
  prestador_del_servicio: string;
  status: string;
}

export default function AdminServicesPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [allServicios, setAllServicios] = useState<Servicio[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchNombre, setSearchNombre] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAdminServicios({ token, limit: 1000 }); // Fetch all
      setAllServicios(data.servicios);
    } catch (err) {
      setError("Error al cargar los servicios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  useEffect(() => {
    let temp = [...allServicios];

    if (searchNombre.trim()) {
      temp = temp.filter(s => s.nombre.toLowerCase().includes(searchNombre.toLowerCase()));
    }
    if (categoriaFilter) {
      temp = temp.filter(s => s.categoria === categoriaFilter);
    }
    if (estadoFilter) {
      temp = temp.filter(s => s.status === estadoFilter);
    }

    setServicios(temp);
    setPage(1);
  }, [searchNombre, categoriaFilter, estadoFilter, allServicios]);

  const handleChangeStatus = async (
    id: number,
    status: "aprobada" | "rechazada"
  ) => {
    if (!confirm(`¿Estás seguro de ${status === "aprobada" ? "aprobar" : "rechazar"} este servicio?`)) return;
    try {
      const token = await getAccessTokenSilently();
      if (status === "aprobada") {
        await aprobarServicio(id, token);
      } else {
        await rechazarServicio(id, token);
      }
      await fetchServicios();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar el estado del servicio");
    }
  };

  const paginatedServicios = servicios.slice((page - 1) * limit, page * limit);
  const total = servicios.length;

  if (loading) return <p className="p-6 text-center">Cargando servicios…</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Servicios</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={e => setSearchNombre(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={categoriaFilter}
          onChange={e => setCategoriaFilter(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="">Todas las categorías</option>
          {Array.from(new Set(allServicios.map(s => s.categoria))).filter(Boolean).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
        </select>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm">Servicios por página:</label>
        <select
          value={limit}
          onChange={e => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
          className="border rounded px-3 py-1 bg-white"
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="text-left">Categoría</th>
              <th className="text-left">Prestador</th>
              <th className="text-left">Estado</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServicios.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{s.nombre}</td>
                <td>{s.categoria}</td>
                <td>{s.prestador_del_servicio}</td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    s.status === "aprobada"
                      ? "bg-green-100 text-green-700"
                      : s.status === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="space-x-2">
                  {s.status !== "aprobada" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleChangeStatus(s.id, "aprobada")}
                      >
                        Aprobar
                      </button>
                  )}
                  {s.status !== "rechazada" && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleChangeStatus(s.id, "rechazada")}
                      >
                        Rechazar
                      </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {servicios.length === 0 && !loading && (
          <p className="text-center text-sm text-gray-500 mt-4">No hay servicios que coincidan con los filtros.</p>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center text-sm">
        <span>
          Mostrando {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total} servicios
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
