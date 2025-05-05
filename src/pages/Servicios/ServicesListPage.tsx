// src/pages/ServicesListPage.tsx
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

  // Cargo catálogo de beneficios (filtro)
  useEffect(() => {
    fetchBeneficios().then(setBeneficiosCat).catch(console.error);
  }, []);

  // Cargo servicios + sus beneficios
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

  // Toggle selección de beneficio
  const toggleBenefit = (id: number) =>
    setSelectedBenefits(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  // Filtrado en cliente
  const displayed = servicios
    .filter(s =>
      s.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .filter(s =>
      selectedBenefits.length === 0
        ? true
        : s.beneficios.some(b => selectedBenefits.includes(b.id))
    );

  return (
    <main className="flex-1 ">
      <div className="px-10 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold text-secondary1 mb-4">Servicios disponibles</h1>
          </div>

          {/* Buscador centrado */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Buscar servicios…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-2/5 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#62CBC9]"
            />
          </div>

          {/* Filtros pastel */}
          <div className="flex overflow-x-auto gap-2 py-2 mb-8 px-2">
            {beneficiosCat.map(b => {
              const selected = selectedBenefits.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBenefit(b.id)}
                  className={`
                    whitespace-nowrap text-base font-medium rounded-full border transition
                    ${selected
                      ? "bg-[#62CBC9] text-white border-transparent"
                      : "bg-[#E0F5F5] text-[#006881] border-[#62CBC9]"}
                    px-4 py-2
                  `}
                >
                  {b.nombre}
                </button>
              );
            })}
          </div>

          {/* Lista de servicios */}
          {loading ? (
            <p className="text-center text-gray-600">Cargando servicios…</p>
          ) : displayed.length === 0 ? (
            <EmptyState mensaje="No se encontraron servicios." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(s => (
                <div
                  key={s.id}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-2xl font-semibold text-[#009982] mb-2">
                    {s.nombre}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {s.descripcion}
                  </p>

                  {/* Beneficios grandes */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.beneficios.length > 0 ? (
                      s.beneficios.map(b => (
                        <span
                          key={b.id}
                          className="bg-[#F5FCFB] text-[#006881] text-base px-3 py-1 rounded-lg"
                        >
                          {b.nombre}
                        </span>
                      ))
                    ) : (
                      <em className="text-gray-400 text-base">Sin beneficios</em>
                    )}
                  </div>

                  <p className="text-gray-800 font-medium mb-1">
                    Tel: <span className="font-normal">{s.telefono_de_contacto}</span>
                  </p>
                  <p className="text-gray-800 font-medium mb-10">
                    Email: <span className="font-normal">{s.email_de_contacto}</span>
                  </p>

                  {/* Botón “Más información” visible */}
                  <button
                    onClick={() => navigate(`/servicios/${s.id}`)}
                    className="absolute bottom-4 right-4 bg-[#009982] hover:bg-[#006E5E] text-white font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982]"
                  >
                    Más información
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ServicesListPage;
