import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Search, Plus } from "lucide-react";

interface Actividad {
  id: number;
  nombre: string;
  fecha: string;
  hora_inicio: string;
  hora_final?: string;
  status: string;
  id_actividad_base?: number | null;
}

type ActividadGrupo = {
  id_actividad_base: number;
  nombre: string;
  fechas: { id: number; fecha: string; hora_inicio: string; hora_final?: string; status: string }[];
  status: string;
};

type Props = {
  userId: number;
  setView: (v: "main" | "actividad" | "actividad_recurrente" | "producto" | "servicio" | null) => void;
};

export default function MyCreatedActivitiesSection({ userId, setView }: Props) {
  const [actividades, setActividades] = useState<ActividadGrupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // NUEVO: Estados para filtros
  const [estadoFiltro, setEstadoFiltro] = useState<string>(""); // "", "aprobada", "pendiente", "rechazada"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/actividades?id_creador_del_evento=${userId}`);
        if (!res.ok) throw new Error("Error al obtener actividades creadas");
        const data: Actividad[] = await res.json();

        const dataFiltrada = data.filter(act => (act as any).id_creador_del_evento === userId);

        const grupos: Record<number, ActividadGrupo> = {};
        for (const act of dataFiltrada) {
          const baseId = act.id_actividad_base ?? act.id;
          if (!grupos[baseId]) {
            grupos[baseId] = {
              id_actividad_base: baseId,
              nombre: act.nombre,
              fechas: [],
              status: act.status,
            };
          }
          grupos[baseId].fechas.push({
            id: act.id,
            fecha: act.fecha,
            hora_inicio: act.hora_inicio,
            hora_final: act.hora_final,
            status: act.status,
          });
        }

        const actividadesAgrupadas = Object.values(grupos).map(grupo => {
          const estados = grupo.fechas.map(f => f.status);
          let status = "aprobada";
          if (estados.includes("pendiente")) status = "pendiente";
          else if (estados.includes("rechazada")) status = "rechazada";
          return { ...grupo, status };
        });

        setActividades(actividadesAgrupadas);
      } catch (error) {
        console.error("Error al obtener actividades creadas:", error);
        setActividades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, [userId]);

  // Filtrado por nombre y estado (eliminado categoría)
  const actividadesFiltradas = actividades.filter(a => {
    const nombreMatch = a.nombre.toLowerCase().includes(search.toLowerCase());
    const estadoMatch = !estadoFiltro || a.status === estadoFiltro;
    // Eliminado: categoría
    return nombreMatch && estadoMatch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'aprobada':
        return 'bg-green-100 text-green-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'rechazada':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-lg p-6 w-full">
      <section className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[2em] font-bold flex items-center gap-2 text-primary">
              <CalendarDays className="w-6 h-6" /> Mis Actividades Creadas
            </h2>
          </div>
          <button
            onClick={() => setView("actividad")}
            className="bg-[#009982] text-white font-semibold px-4 py-2 rounded-lg  flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nueva Actividad
          </button>
        </div>

        {/* Buscador y filtros */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar actividades por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
            </div>
            {/* Filtro de Estado */}
            <div className="relative">
              <select
                value={estadoFiltro}
                onChange={e => setEstadoFiltro(e.target.value)}
                className="border px-3 py-2 rounded-md text-sm bg-white"
              >
                <option value="">Estado</option>
                <option value="aprobada">Aprobada</option>
                <option value="pendiente">Pendiente</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>
            {/* Eliminado: Filtro de Categoría */}
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl py-4 text-center shadow-sm">
              <p className="text-[1.5em] font-bold text-gray-900">{actividades.length}</p>
              <p className="text-[1em] text-gray-500">Total</p>
            </div>
            <div className="bg-white border rounded-xl py-4 text-center shadow-sm">
              <p className="text-[1.5em] font-bold text-green-600">
                {actividades.filter(a => a.status === "aprobada").length}
              </p>
              <p className="text-[1em] text-gray-500">Aprobadas</p>
            </div>
            <div className="bg-white border rounded-xl py-4 text-center shadow-sm">
              <p className="text-[1.5em] font-bold text-yellow-600">
                {actividades.filter(a => a.status === "pendiente").length}
              </p>
              <p className="text-[1em] text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-center text-gray-500">Cargando actividades…</p>
        ) : (
          actividadesFiltradas.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron actividades.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {actividadesFiltradas.map((grupo) => {
                const primeraFecha = grupo.fechas[0];
                return (
                  <li
                    key={grupo.id_actividad_base}
                    className="bg-white border rounded-xl shadow p-6 flex flex-col h-full min-w-0"
                    style={{ minWidth: 0 }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900">{grupo.nombre}</h3>
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-[1.1em] font-semibold ${getStatusStyle(grupo.status)}`}
                      >
                        {grupo.status.charAt(0).toUpperCase() + grupo.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-[1em] text-gray-600 mt-1">
                      {grupo.fechas.length > 1
                        ? `${grupo.fechas.length} sesiones (desde ${grupo.fechas[0].fecha})`
                        : "Actividad única"}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-[1em] text-gray-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {primeraFecha.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {primeraFecha.hora_inicio?.slice(0, 5)} – {primeraFecha.hora_final?.slice(0, 5)}
                      </span>
                    </div>

                    <div className="flex flex-1 items-end justify-end mt-4">
                      <button
                        onClick={() => navigate(`/actividades/${grupo.id_actividad_base}`)}
                        className="text-[1em] text-white bg-[#009982] hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </section>
    </div>
  );
}

