import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchServicios,
  fetchBeneficios,
  fetchBeneficiosPorServicio,
  fetchPromedioPorServicio,
  Servicio,
  Beneficio
} from "../../services/serviceService";
import EmptyState from "../../common/EmptyState";
import { Search, Filter, Check, MapPin } from "lucide-react";

interface ServicioConRating extends Servicio {
  beneficios: Beneficio[];
  promedio_rating?: number;
  total_opiniones: number;
}

const ServicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<ServicioConRating[]>([]);
  const [beneficiosCat, setBeneficiosCat] = useState<Beneficio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficios().then(setBeneficiosCat).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchServicios()
      .then(async list => {
        const withExtras = await Promise.all(
          list.map(async s => {
            const beneficios = await fetchBeneficiosPorServicio(s.id);
            const { promedio, total } = await fetchPromedioPorServicio(s.id);
            return { ...s, beneficios, promedio_rating: promedio === null ? undefined : promedio, total_opiniones: total };
          })
        );

        setServicios(withExtras);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleBenefit = (id: number) =>
    setSelectedBenefits(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const clearFilters = () => {
    setSelectedBenefits([]);
  };

  // Filtrar servicios según búsqueda y filtros
  const filtrados = servicios
    .filter(s =>
      s.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .filter(s =>
      selectedBenefits.length === 0 || s.beneficios.some((b: any) => selectedBenefits.includes(b.id))
    );

  // Agrupar servicios filtrados por id_servicio_base para evitar duplicados
  const agrupadosMap = new Map();
  filtrados.forEach((servicio) => {
    if (!agrupadosMap.has(servicio.id_servicio_base)) {
      agrupadosMap.set(servicio.id_servicio_base, servicio);
    } else {
      const existente = agrupadosMap.get(servicio.id_servicio_base);
      // Conservar el de mayor rating, o mayor cantidad de opiniones si hay empate
      if ((servicio.promedio_rating ?? 0) > (existente.promedio_rating ?? 0)) {
        agrupadosMap.set(servicio.id_servicio_base, servicio);
      } else if ((servicio.promedio_rating ?? 0) === (existente.promedio_rating ?? 0)) {
        if ((servicio.total_opiniones ?? 0) > (existente.total_opiniones ?? 0)) {
          agrupadosMap.set(servicio.id_servicio_base, servicio);
        }
      }
    }
  });

  const serviciosFinal = Array.from(agrupadosMap.values())
    .sort((a, b) => {
      const aTieneRating = typeof a.promedio_rating === "number" && !isNaN(a.promedio_rating);
      const bTieneRating = typeof b.promedio_rating === "number" && !isNaN(b.promedio_rating);

      if (aTieneRating && !bTieneRating) return -1;
      if (!aTieneRating && bTieneRating) return 1;

      const ratingA = a.promedio_rating ?? 0;
      const ratingB = b.promedio_rating ?? 0;

      if (ratingB !== ratingA) return ratingB - ratingA;
      return (b.total_opiniones ?? 0) - (a.total_opiniones ?? 0);
    });

  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Buscador + Filtros */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-10 w-full">
            {/* Buscador */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-3 text-[1.05em] font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62CBC9]"
              />
            </div>

            {/* Filtros por beneficios */}
            {beneficiosCat.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-[1em] font-bold text-gray-700">Filtros</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {beneficiosCat.map(b => {
                    const selected = selectedBenefits.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBenefit(b.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 text-[1em] rounded-full border transition font-semibold
                          ${selected ? "bg-[#009982]/10 text-[#009982] border-[#009982]" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}
                      >
                        <Check className="w-4 h-4" />
                        {b.nombre}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {(selectedBenefits.length > 0) && (
              <div className="mt-4 text-center">
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-[1em] underline underline-offset-4"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Lista de servicios */}
          {loading ? (
            <p className="text-center text-gray-600">Cargando servicios…</p>
          ) : serviciosFinal.length === 0 ? (
            <EmptyState mensaje="No se encontraron servicios." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviciosFinal.map(servicio => {
                const comunas = servicio.comunas_a_las_que_hace_domicilio?.split(",").map((c: string) => c.trim()).filter(Boolean);

                return (
                  <div key={servicio.id} className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col h-full">
                    <div className="flex flex-col h-full">
                      <div className="absolute top-4 right-4 z-10">
                        {servicio.hace_domicilio && (
                          <span className="inline-flex items-center gap-1 bg-white/80 border border-[#009982] text-[#009982] text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                            <Check className="w-4 h-4" /> Hace a domicilio
                          </span>
                        )}
                      </div>
                      {/* Espacio para separar del título */}
                      <div className="h-7" />

                      <div className="flex-1 mb-4">
                        <h3 className="text-[1.3em] font-bold text-[#009982] mb-2">{servicio.nombre}</h3>

                        {typeof servicio.promedio_rating === "number" && !isNaN(servicio.promedio_rating) && (
                          <div className="flex items-center gap-1 mb-2 text-yellow-600 text-[1em] font-semibold">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i}>{i < Math.round(servicio.promedio_rating!) ? "⭐" : "☆"}</span>
                            ))}
                            {servicio.total_opiniones > 0 && (
                              <span className="ml-2 text-gray-700 text-[0.95em]">
                                ({servicio.total_opiniones} opini{servicio.total_opiniones === 1 ? "ón" : "ones"})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Mostrar comunas si hace domicilio, si no mostrar dirección */}
                        {servicio.hace_domicilio && comunas && comunas.length > 0 ? (
                          <div className="text-[1em] text-gray-800 font-medium mb-4">
                            <div className="flex items-center gap-2 text-[#CD3272] mb-1">
                              <MapPin className="w-5 h-5" />
                              <span className="text-gray-800 font-semibold">Comunas donde hace a domicilio:</span>
                            </div>
                            <p className="ml-6 text-[0.95em] font-normal text-gray-800">{comunas.join(", ")}</p>
                          </div>
                        ) : (
                          <div className="text-[1em] text-gray-800 font-medium mb-4">
                            <div className="flex items-center gap-2 text-[#CD3272] mb-1">
                              <MapPin className="w-5 h-5" />
                              <span className="text-gray-800 font-semibold">Dirección del servicio:</span>
                            </div>
                            <p className="ml-6 text-[0.95em] font-normal text-gray-800">{servicio.direccion_principal_del_prestador}</p>
                          </div>
                        )}

                        {servicio.beneficios.length > 0 && (
                          <ul className="flex flex-col gap-1 text-[1em] text-[#009982] font-medium mb-3 ml-1">
                            {servicio.beneficios.map((b: Beneficio) => (
                              <li key={b.id} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#009982]" /> {b.nombre}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => navigate(`/servicios/${servicio.id}`)}
                        className="w-full bg-[#009982] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                      >
                        Más información <span className="">→</span>
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

export default ServicesListPage;