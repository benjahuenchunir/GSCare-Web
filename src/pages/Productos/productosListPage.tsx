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
          <h1 className="text-3xl font-bold text-secondary1 text-center mb-6">Productos para Adultos Mayores</h1>

          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Buscar productos…"
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
            <p className="text-center text-gray-600">Cargando productos…</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-gray-600">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/productos/${p.id}`)}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-100 hover:border-2 hover:border-[#009982] border border-transparent transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <img src={p.imagen} alt={p.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                  <h3 className="text-xl font-semibold text-[#009982] mb-1">{p.nombre}</h3>
                  <p className="text-gray-700 text-sm mb-2">{p.descripcion}</p>
                  <p className="text-gray-500 text-sm"><strong>Marca:</strong> {p.marca}</p>
                  <p className="text-gray-500 text-sm"><strong>Vendedor:</strong> {p.nombre_del_vendedor}</p>
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
