import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchServicios,
  fetchBeneficios,
  fetchBeneficiosPorServicio,
  Servicio,
  Beneficio
} from "../../services/serviceService";
import EmptyState from "../../common/EmptyState";

const ServicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<(Servicio & { beneficios: Beneficio[] })[]>([]);
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
        const withB = await Promise.all(
          list.map(async s => ({
            ...s,
            beneficios: await fetchBeneficiosPorServicio(s.id)
          }))
        );
        setServicios(withB);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleBenefit = (id: number) =>
    setSelectedBenefits(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const clearFilters = () => setSelectedBenefits([]);

  const displayed = servicios
    .filter(s =>
      s.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .filter(s =>
      selectedBenefits.length === 0
        ? true
        : s.beneficios.some(b => selectedBenefits.includes(b.id))
    );

  const agrupados = displayed.reduce((map, servicio) => {
    const clave = servicio.id_servicio_base ?? servicio.id; // Usa id si no hay base
    if (!map[clave]) map[clave] = [];
    map[clave].push(servicio);
    return map;
  }, {} as Record<string, (Servicio & { beneficios: Beneficio[] })[]>);


  return (
    <main className="flex-1">
      <div className="px-10 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-6">
            <h1 className="text-[2em] font-bold text-secondary1 mb-4">Servicios</h1>
          </div>

          {/* Buscador */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Buscar servicios…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-2/5 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#62CBC9]"
            />
          </div>

          {/* Filtros */}
          {beneficiosCat.length > 0 && (
            <>
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2 px-2">
                <h2 className="text-lg font-semibold text-[#006881]">Filtrar por beneficios:</h2>
                {selectedBenefits.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[1em] font-medium text-white bg-[#009982] hover:bg-[#006E5E] px-4 py-2 rounded-full transition"
                  >
                    Limpiar filtros ✕
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10 px-2">
                {beneficiosCat.map(b => {
                  const selected = selectedBenefits.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleBenefit(b.id)}
                      className={`text-[1em] font-medium rounded-full border px-4 py-[6px] text-center transition
                        ${selected
                          ? "bg-[#62CBC9] text-white border-transparent"
                          : "bg-[#F5FCFB] text-[#006881] border-[#62CBC9]"}`}
                    >
                      {b.nombre}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Lista de servicios */}
          {loading ? (
            <p className="text-center text-gray-600">Cargando servicios…</p>
          ) : displayed.length === 0 ? (
            <EmptyState mensaje="No se encontraron servicios." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(agrupados).map((grupo) => {
                // Usamos el primero del grupo para mostrar info general
                const s = grupo[0];
                const comunas = s.comunas_a_las_que_hace_domicilio
                  ?.split(",")
                  .map(c => c.trim())
                  .filter(Boolean);

                return (
                  <div
                    key={s.id}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="text-[1.5em] font-semibold text-[#009982] mb-2">
                        {s.nombre}
                      </h3>

                      <p className="text-gray-700 text-[1em] mb-2">
                        {s.descripcion}
                      </p>

                      {comunas && comunas.length > 0 && (
                        <div className="text-[0.95em] text-gray-800 font-medium mb-4">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-[#CD3272]">📍</span>
                            <span>Comunas donde se ofrece:</span>
                          </span>
                          <p className="mt-1 ml-5 text-[0.95em] font-normal text-gray-800">
                            {comunas.join(", ")}
                          </p>
                        </div>
                      )}

                      {s.beneficios.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {s.beneficios.map(b => (
                            <span
                              key={b.id}
                              className="bg-[#F5FCFB] text-[#006881] text-[1em] px-3 py-1 rounded-md"
                            >
                              {b.nombre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mt-auto pt-4">
                      <button
                        onClick={() => navigate(`/servicios/${s.id}`)}
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

export default ServicesListPage;
