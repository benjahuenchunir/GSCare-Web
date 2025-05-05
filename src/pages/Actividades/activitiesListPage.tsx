import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActividades, Actividad } from "../../services/actividadService";

const ActividadesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActividades()
      .then(setActividades)
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

  const filtered = actividades
    .filter(a =>
      a.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .filter(a =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(a.categoria)
    );

  return (
    <main className="flex-1 pt-10">
      <div className="px-10 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-secondary1 text-center mb-6">Actividades</h1>

          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Buscar actividades…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-2/5 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#62CBC9]"
            />
          </div>

          <div className="flex overflow-x-auto gap-2 py-2 mb-8 px-2">
            {categoriasUnicas.map(cat => {
              const selected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategoria(cat)}
                  className={`
                    whitespace-nowrap text-base font-medium rounded-full border transition
                    ${selected
                      ? "bg-[#62CBC9] text-white border-transparent"
                      : "bg-[#E0F5F5] text-[#006881] border-[#62CBC9]"}
                    px-4 py-2
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Cargando actividades…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-600">No se encontraron actividades.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(a => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/actividades/${a.id}`)}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-100 hover:border-2 hover:border-[#009982] border border-transparent transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <h3 className="text-2xl font-semibold text-[#009982] mb-2">{a.nombre}</h3>
                  <p className="text-gray-700 text-sm mb-2">{a.descripcion}</p>
                  <p className="text-gray-500 text-sm mb-1"><strong>Categoría:</strong> {a.categoria}</p>
                  <p className="text-gray-500 text-sm mb-1"><strong>Fecha:</strong> {new Date(a.fecha).toLocaleString()}</p>
                  <p className="text-gray-500 text-sm"><strong>Lugar:</strong> {a.lugar}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ActividadesListPage;
