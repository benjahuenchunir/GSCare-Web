import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  marca: string;
  nombre_del_vendedor: string;
}

const ProductosListPage: React.FC = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/productos`)
      .then(res => setProductos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categoriasUnicas = Array.from(new Set(productos.map(p => p.categoria)));

  const toggleCategoria = (categoria: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  const filtrados = productos
    .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(p.categoria)
    );

  return (
    <main className="flex-1">
      <div className="px-10 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[2em] font-bold text-secondary1 text-center mb-6">Productos</h1>

          {/* Buscador */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Buscar productos…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-2/5 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#62CBC9]"
            />
          </div>

          {/* Filtros */}
          {categoriasUnicas.length > 0 && (
            <>
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2 px-2">
                <h2 className="text-lg font-semibold text-[#006881]">Filtrar por categoría:</h2>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[1em] font-medium text-white bg-[#009982] hover:bg-[#006E5E] px-4 py-2 rounded-full transition"
                  >
                    Limpiar filtros ✕
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10 px-2">
                {categoriasUnicas.map(cat => {
                  const selected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategoria(cat)}
                      className={`text-[1em] font-medium rounded-full border px-4 py-[6px] text-center transition
                        ${selected
                          ? "bg-[#62CBC9] text-white border-transparent"
                          : "bg-[#F5FCFB] text-[#006881] border-[#62CBC9]"}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Lista de productos */}
          {loading ? (
            <p className="text-center text-gray-600">Cargando productos…</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-gray-600">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map(p => (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex flex-col justify-between h-full"
                >
                  <div>
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-[1.5em] font-semibold text-[#009982] mb-2">
                      {p.nombre}
                    </h3>

                    <div className="space-y-2 text-[1em] mb-4">
                      <div className="bg-gray-50 rounded-md px-3 py-2 text-gray-800">
                        <span className="font-semibold">Marca:</span> {p.marca}
                      </div>
                      <div className="bg-gray-50 rounded-md px-3 py-2 text-gray-800">
                        <span className="font-semibold">Vendedor:</span> {p.nombre_del_vendedor}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-auto pt-4">
                    <button
                      onClick={() => navigate(`/productos/${p.id}`)}
                      className="bg-[#009982] hover:bg-[#006E5E] text-white font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982] transition"
                    >
                      Más información
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductosListPage;
