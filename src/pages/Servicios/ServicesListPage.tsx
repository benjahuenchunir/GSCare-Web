// src/pages/ServicesListPage.tsx
import React, { useState, useEffect } from "react";
import { fetchServicios, fetchBeneficios, Servicio, Beneficio } from "../../services/serviceService";
import SectionTitle from "../../common/SectionTitle";
import EmptyState from "../../common/EmptyState";

const ServicesListPage: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargo catálogo de beneficios al montar
  useEffect(() => {
    fetchBeneficios()
      .then(setBeneficios)
      .catch(console.error);
  }, []);

  // Recargo servicios cada vez que cambia búsqueda o selección de beneficios
  useEffect(() => {
    setLoading(true);
    fetchServicios({ nombre: searchTerm, beneficios: selectedBenefits })
      .then((data) => {
        console.log("Servicios:", data); // <--- agrega esto
        setServicios(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm, selectedBenefits]);

  const toggleBenefit = (id: number) => {
    setSelectedBenefits((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="px-6 py-8">
      <SectionTitle title="Servicios" />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 border rounded px-4 py-2"
        />

        {/* Selector de beneficios */}
        <div className="flex flex-wrap gap-2">
          {beneficios.map((b) => (
            <button
              key={b.id}
              onClick={() => toggleBenefit(b.id)}
              className={`px-3 py-1 rounded-full border transition ${
                selectedBenefits.includes(b.id)
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {b.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de servicios */}
      {loading ? (
        <p>Cargando servicios…</p>
      ) : servicios.length === 0 ? (
        <EmptyState mensaje="No se encontraron servicios." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{s.nombre}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{s.descripcion}</p>

              {/* Beneficios como tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {Array.isArray(s.beneficios) ? (
                  s.beneficios.map((b) => (
                    <span key={b.id} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {b.nombre}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">Sin beneficios</span>
                )}
              </div>

              <p className="text-sm mb-1">
                <strong>Tel:</strong> {s.telefono_de_contacto}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {s.email_de_contacto}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesListPage;
