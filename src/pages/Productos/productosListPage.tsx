import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Filter, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  marca: string;
  nombre_del_vendedor: string;
  status: string;
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
      .then(res => {
        const aprobados = res.data.filter((p: Producto) => p.status === 'aprobada');
        setProductos(aprobados);
      })
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
      <Helmet>
        <title>GSCare | Productos para el Bienestar</title>
        <meta
          name="description"
          content="Descubre productos seleccionados para el cuidado y bienestar de adultos mayores. Encuentra todo lo que necesitas en un solo lugar."
        />
      </Helmet>
      <div className="px-6 md:px-10 py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Buscador + Filtros */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-10 w-full">
              {/* Buscador */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
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
                            flex items-center gap-2 px-4 py-2 text-[1em] font-semibold rounded-full border transition
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
                    <div className="mt-5 text-center">
                      <button
                        onClick={clearFilters}
                        className="text-gray-600 hover:text-gray-800 text-[1em] font-bold underline underline-offset-4"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>

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

                    <div className="space-y-2 text-[1.05rem] mb-4">
                      <div className="bg-gray-50 rounded-md px-3 py-2 text-gray-800 font-medium">
                        <span className="font-semibold">Marca:</span> {p.marca}
                      </div>
                      <div className="bg-gray-50 rounded-md px-3 py-2 text-gray-800 font-medium">
                        <span className="font-semibold">Vendedor:</span> {p.nombre_del_vendedor}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-auto pt-4">
                    <button
                      onClick={() => navigate(`/productos/${p.id}`)}
                      className="bg-[#009982] hover:bg-[#006E5E] text-white font-semibold text-[1rem] px-5 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009982] transition"
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
