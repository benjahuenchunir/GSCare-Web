import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActividades, Actividad as ActividadBase } from "../../services/actividadService";
import { Search, Filter, Check } from "lucide-react";

interface Actividad extends ActividadBase {
  status: string;
}

const formatearFecha = (fecha: string) => {
  const [a, m, d] = fecha.split("-");
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${a}`;
};

const ActividadesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchActividades()
      .then(data => {
        const aprobadas = (data as Actividad[]).filter(a => a.status === 'aprobada');
        setActividades(aprobadas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categoriasUnicas = Array.from(new Set(actividades.map(a => a.categoria)));

  const toggleCategoria = (categoria: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  const filtered = actividades
    .filter(a =>
      a.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .filter(a =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(a.categoria)
    );

  const agrupadas = filtered.reduce((map, actividad) => {
    const clave = actividad.id_actividad_base ?? actividad.id;
    if (!map[clave]) map[clave] = [];
    map[clave].push(actividad);
    return map;
  }, {} as Record<string, Actividad[]>);

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Buscador + Filtros */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-10 w-full">
              {/* Buscador */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Buscar actividades..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 text-[1.05em] font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62CBC9] text-gray-800"
                />
              </div>

              {/* Filtros */}
              {categoriasUnicas.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-[1em] font-bold text-gray-800">Filtrar por categoría</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {categoriasUnicas.map(cat => {
                      const selected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategoria(cat)}
                          className={`
                            flex items-center gap-2 px-4 py-2 text-[1rem] font-bold rounded-full border transition
                            ${selected
                              ? "bg-[#009982]/20 text-[#009982] border-[#009982]"
                              : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"}
                          `}
                        >
                          {selected && <Check className="w-4 h-4" />}
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {selectedCategories.length > 0 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-gray-700 text-[1em] underline underline-offset-4"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Lista agrupada */}
          {loading ? (
            <p className="text-center text-gray-600">Cargando actividades…</p>
          ) : Object.keys(agrupadas).length === 0 ? (
            <p className="text-center text-gray-600">No se encontraron actividades.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(agrupadas).map((grupo, i) => {
                const a = grupo[0];
                const id = (a.id_actividad_base ?? a.id).toString();
                const fechas = grupo.map(g => formatearFecha(g.fecha));
                const showAll = expandedCards[id] || false;
                const visibles = showAll ? fechas : fechas.slice(0, 3);
                const hayMas = fechas.length > 3;

                return (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="text-[1.5em] font-semibold text-[#009982] mb-2">{a.nombre}</h3>

                      <div className="space-y-2 mb-4">
                        <div className="bg-gray-50 rounded-md px-3 py-2 text-[1em] text-gray-800">
                          <p className="font-semibold mb-1">Fechas:</p>
                          <ul className="list-disc list-inside text-sm space-y-0.5">
                            {visibles.map((f, idx) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                          {hayMas && (
                            <button
                              onClick={() => toggleExpand(id)}
                              className="text-sm text-[#009982] font-medium hover:underline mt-1"
                            >
                              {showAll ? "Ver menos" : `+${fechas.length - 3} más`}
                            </button>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-md px-3 py-2 text-[1em] text-gray-800">
                          <span className="font-semibold">Modalidad: </span>{a.modalidad === "presencial" ? "Presencial" : "Online"}
                        </div>

                        {a.modalidad === "presencial" && (
                          <div className="bg-gray-50 rounded-md px-3 py-2 text-[1em] text-gray-800">
                            <span className="font-semibold">Comuna: </span>
                            {a.comuna}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center mt-auto pt-4">
                      <button
                        onClick={() => navigate(`/actividades/${a.id}`)}
                        className="bg-[#009982] hover:bg-[#006E5E] text-white font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982] transition"
                      >
                        Más información
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ActividadesListPage;
