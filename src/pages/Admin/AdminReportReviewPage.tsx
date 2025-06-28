import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ReporteModal from "../../components/AdminComponents/ReportReviewModal";
import { Search, Filter, Eye } from "lucide-react";

type Reporte = {
  id: number;
  tipo_contenido: "comentario" | "rating";
  razon: string;
  descripcion: string;
  estado: "pendiente" | "revisado" | "descartado";
  createdAt: string;
  Usuario?: { nombre: string };
  Comentario?: { contenido: string };
  Rating?: { review: string; rating: number; id_servicio: number };
  id_servicio?: number;
};

export default function ReportesAdminPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [reporteActivo, setReporteActivo] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [motivoFiltro, setMotivoFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    fetchReportes();
    const interval = setInterval(fetchReportes, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchReportes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reportes_contenido`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReportes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("Error al obtener reportes: " + (err.message || err));
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (estado: "revisado" | "descartado", eliminar: boolean) => {
    if (!reporteActivo) return;
    try {
      const token = await getAccessTokenSilently();
      await fetch(`${import.meta.env.VITE_API_URL}/reportes_contenido/${reporteActivo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado, eliminar_contenido: eliminar }),
      });
      setReporteActivo(null);
      fetchReportes();
    } catch (err: any) {
      setError("Error al actualizar reporte: " + (err.message || err));
    }
  };

  const reportesFiltrados = reportes.filter((r) => {
    const matchEstado = estadoFiltro === "todos" || r.estado === estadoFiltro;
    const matchTipo = tipoFiltro === "todos" || r.tipo_contenido === tipoFiltro;
    const matchMotivo = motivoFiltro === "todos" || r.razon.toLowerCase().includes(motivoFiltro.toLowerCase());
    const matchTexto =
      busqueda === "" ||
      r.Usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.Comentario?.contenido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.Rating?.review?.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchTipo && matchMotivo && matchTexto;
  });

const itemsPorPagina = 50; // Cambia el valor a 50 para mostrar 50 reportes por página
const totalPaginas = Math.ceil(reportesFiltrados.length / itemsPorPagina);
const reportesPaginados = reportesFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Vista de Reportes</h1>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Avanzados
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
            value={estadoFiltro}
            onChange={(e) => {
              setEstadoFiltro(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="revisado">Revisado</option>
            <option value="descartado">Descartado</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
            value={tipoFiltro}
            onChange={(e) => {
              setTipoFiltro(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="todos">Reseñas y comentarios</option>
            <option value="comentario">Comentarios</option>
            <option value="rating">Reseñas</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
            value={motivoFiltro}
            onChange={(e) => {
              setMotivoFiltro(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos los motivos</option>
            <option value="ofensivo">Contenido ofensivo o inapropiado</option>
            <option value="spam">Spam</option>
            <option value="falsa">Falsa reseña o engañosa</option>
            <option value="relevante">No relevante o fuera de tema</option>
            <option value='derechos'>Violación de derechos de autor</option>
            <option value="privacidad">Violación de privacidad</option>
            <option value="discriminacion">Discriminación o acoso</option>
            <option value="contenido">Contenido ilegal o peligroso</option>
            <option value="otro">Otro</option>
          </select>

          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
              placeholder="Buscar por usuario o contenido..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
            <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-6 text-gray-500">Cargando reportes...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Tipo</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Contenido</th>
                <th className="p-3">Motivo</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportesPaginados.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.tipo_contenido === "rating" ? "Reseña" : "Comentario"}</td>
                  <td className="p-3">{r.Usuario?.nombre || "Desconocido"}</td>
                  <td className="p-3">
                    {r.tipo_contenido === "rating"
                      ? `${r.Rating?.review ?? "—"} ${r.Rating?.rating ? `⭐ ${r.Rating.rating}/5` : ""}`
                      : r.Comentario?.contenido || "—"}
                  </td>
                  <td className="p-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{r.razon}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.estado === "revisado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td className="p-3">{new Date(r.createdAt).toLocaleString("es-CL")}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setReporteActivo(r)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
              {reportesPaginados.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No hay reportes que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
            disabled={paginaActual === 1}
          >
            ◀ Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
            disabled={paginaActual === totalPaginas}
          >
            Siguiente ▶
          </button>
        </div>
      )}

      {/* Modal */}
      {reporteActivo && (
        <ReporteModal
          reporte={reporteActivo}
          onClose={() => setReporteActivo(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}
