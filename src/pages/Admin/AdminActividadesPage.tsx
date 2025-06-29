// src/pages/admin/AdminActividadesPage.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAdminActividades, deleteActividadSerieByBaseId } from "../../services/adminService";
import { Trash, Pencil, Filter } from "lucide-react";
import ActivityDatesModal from "../../components/AdminComponents/ActivityDatesModal";
import ActivityAttendeesModal from "../../components/AdminComponents/ActivityAttendeesModal";
import ActivityEditModal from "../../components/AdminComponents/ActivityEditModal";
import { aprobarActividad, rechazarActividad, actividadTieneAsistenteConEmail } from "../../services/adminService";

export interface Actividad {
  id: number;
  nombre: string;
  modalidad: string;
  categoria: string;
  comuna: string;
  link: string;
  capacidad_total: number;
  asistentes: number;
  status: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  lugar: string;
  descripcion: string;
  imagen: string;
  id_actividad_base: number;
}

export default function AdminActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const { getAccessTokenSilently } = useAuth0();

  const [datesModal, setDatesModal] = useState<number | null>(null);
  const [attendeesModal, setAttendeesModal] = useState<number | null>(null);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);

  const [search, setSearch] = useState("");
  const [modalidadFilter, setModalidadFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [comunaFilter, setComunaFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [sortBy, setSortBy] = useState(""); // "fecha" | "ocupacion_asc" | "ocupacion_desc"
  const [emailFilter, setEmailFilter] = useState("");


  const fetchActividades = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const res = await getAdminActividades({ page: 1, limit: 1000, token }); // obtenemos todas

      const today = new Date().toISOString().split("T")[0];
      const grouped: Record<number, any[]> = {};

      // Agrupar por id_actividad_base
      for (const act of res.actividades) {
        const base = act.id_actividad_base || act.id;
        if (!grouped[base]) grouped[base] = [];
        grouped[base].push(act);
      }

      // Filtrar solo próximas fechas por grupo
      let filtradas = Object.values(grouped)
        .map(group =>
          group
            .filter(a => a.fecha >= today)
            .sort((a, b) => a.fecha.localeCompare(b.fecha))[0] || group[0]
        )
        .filter(Boolean)
        .filter(a => a.nombre.toLowerCase().includes(search.toLowerCase()))
        .filter(a => !modalidadFilter || a.modalidad === modalidadFilter)
        .filter(a => !categoriaFilter || a.categoria === categoriaFilter)
        .filter(a => !comunaFilter || a.comuna === comunaFilter)
        .filter(a => !estadoFilter || a.status === estadoFilter);

      // Ordenamiento
      if (sortBy === "fecha") {
        filtradas.sort((a, b) => a.fecha.localeCompare(b.fecha));
      } else if (sortBy === "ocupacion_asc") {
        filtradas.sort((a, b) => {
          const occA = a.capacidad_total ? a.asistentes / a.capacidad_total : 0;
          const occB = b.capacidad_total ? b.asistentes / b.capacidad_total : 0;
          return occA - occB;
        });
      } else if (sortBy === "ocupacion_desc") {
        filtradas.sort((a, b) => {
          const occA = a.capacidad_total ? a.asistentes / a.capacidad_total : 0;
          const occB = b.capacidad_total ? b.asistentes / b.capacidad_total : 0;
          return occB - occA;
        });
      }

      if (emailFilter.trim()) {
        const email = emailFilter.trim().toLowerCase();
        const token = await getAccessTokenSilently();

        const actividadesConAsistentes = await Promise.all(
          filtradas.map(async (act) => {
            const tieneAsistente = await actividadTieneAsistenteConEmail(act.id, email, token);
            return tieneAsistente ? act : null;
          })
        );

        const filtradasPorEmail = actividadesConAsistentes.filter(Boolean) as Actividad[];
        setTotal(filtradasPorEmail.length);
        setActividades(filtradasPorEmail.slice((page - 1) * limit, page * limit));
      } else {
        setTotal(filtradas.length);
        setActividades(filtradas.slice((page - 1) * limit, page * limit));
      }
    } catch (err) {
      console.error("Error al cargar actividades", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchActividades();
  }, [
    page,
    limit,
    search,
    modalidadFilter,
    categoriaFilter,
    comunaFilter,
    estadoFilter,
    sortBy,
    emailFilter
  ]);

  const handleChangeStatus = async (
    baseId: number,
    status: "aprobada" | "rechazada"
  ) => {
    if (
      !confirm(
        `¿Estás seguro de ${status === "aprobada" ? "aprobar" : "rechazar"} esta actividad y todas sus fechas?`
      )
    )
      return;

    try {
      const token = await getAccessTokenSilently();

      // Obtener todas las actividades
      const res = await getAdminActividades({ page: 1, limit: 1000, token });
      const relacionadas = res.actividades.filter(
        (a: any) => a.id === baseId || a.id_actividad_base === baseId
      );

      await Promise.all(
        relacionadas.map((a: any) =>
          status === "aprobada"
            ? aprobarActividad(a.id, token)
            : rechazarActividad(a.id, token)
        )
      );

      await fetchActividades();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar el estado de las actividades");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Actividades</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          Filtros
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
            placeholder="Buscar por nombre"
          />
          <select
            value={modalidadFilter}
            onChange={e => setModalidadFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Todas las modalidades</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </select>
          <select
            value={categoriaFilter}
            onChange={e => setCategoriaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Todas las categorías</option>
            {Array.from(new Set(actividades.map(a => a.categoria))).filter(Boolean).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={comunaFilter}
            onChange={e => setComunaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Todas las comunas</option>
            {Array.from(new Set(actividades.map(a => a.comuna))).filter(Boolean).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={estadoFilter}
            onChange={e => setEstadoFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Ordenar por</option>
            <option value="fecha">Fecha más próxima</option>
            <option value="ocupacion_asc">Menor ocupación</option>
            <option value="ocupacion_desc">Mayor ocupación</option>
          </select>

          <input
            type="email"
            placeholder="Filtrar por email de usuario"
            value={emailFilter}
            onChange={e => setEmailFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-700 flex items-center gap-3">
        <label>Actividades por página:</label>
        <select
          value={limit}
          onChange={e => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Modalidad</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Ocupación</th>
              <th className="p-3">Capacidad</th>
              <th className="p-3">Asistentes</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{a.nombre}</td>
                <td className="p-3">{a.modalidad}</td>
                <td className="p-3">{a.categoria}</td>
                <td className="p-3">
                  {a.capacidad_total
                    ? `${Math.round((a.asistentes / a.capacidad_total) * 100)}%`
                    : "-"}
                </td>
                <td className="p-3">{a.capacidad_total ?? "-"}</td>
                <td className="p-3">
                  {a.asistentes ?? 0}
                  <button
                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                    onClick={() => setAttendeesModal(a.id)}
                  >
                    Ver
                  </button>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    a.status === "aprobada"
                      ? "bg-green-100 text-green-700"
                      : a.status === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      onClick={() => setDatesModal(a.id_actividad_base ?? a.id)}
                    >
                      Fechas
                    </button>
                    <button
                      onClick={() => setEditingActividad(a)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Pencil className="inline w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar serie"
                      onClick={async () => {
                        if (!window.confirm("¿Eliminar toda la actividad y sus fechas?")) return;
                        try {
                          const token = await getAccessTokenSilently();
                          await deleteActividadSerieByBaseId(a.id_actividad_base ?? a.id, token);
                          await fetchActividades(); // recarga después de eliminar
                        } catch (err) {
                          console.error(err);
                          alert("Error al eliminar la actividad");
                        }
                      }}
                    >
                      <Trash className="inline w-4 h-4" />
                    </button>
                    {a.status === "pendiente" && (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleChangeStatus(a.id_actividad_base ?? a.id, "aprobada")}
                        >
                          Aprobar
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleChangeStatus(a.id_actividad_base ?? a.id, "rechazada")}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {actividades.length === 0 && (
          <p className="text-center p-4 text-gray-500">No hay actividades para mostrar.</p>
        )}
      </div>

      {/* Paginación */}
      {total > limit && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {page} de {Math.ceil(total / limit)}
          </span>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modals */}
      {datesModal !== null && (
        <ActivityDatesModal baseId={datesModal} onClose={() => {
          setDatesModal(null);
          fetchActividades(); // recarga actividades si eliminó todas
        }} />
      )}
      {attendeesModal !== null && (
        <ActivityAttendeesModal actividadId={attendeesModal} onClose={() => setAttendeesModal(null)} />
      )}
      {editingActividad && (
        <ActivityEditModal
          actividad={editingActividad}
          onClose={() => setEditingActividad(null)}
          onUpdate={fetchActividades}
        />
      )}
    </div>
  );
}
