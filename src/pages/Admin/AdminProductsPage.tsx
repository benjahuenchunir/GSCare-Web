// src/pages/Admin/AdminProductsPage.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getPaginatedAdminProductos, deleteProductoById, aprobarProducto, rechazarProducto } from "../../services/adminService";
import { Pencil, Trash, Link as LinkIcon, Filter } from "lucide-react";
import ProductEditModal from "../../components/AdminComponents/ProductEditModal";

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  nombre_del_vendedor: string;
  link_al_producto: string;
  descripcion: string;
  imagen: string;
  createdAt: string;
  status: string;
}

export default function AdminProductsPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [allProductos, setAllProductos] = useState<Producto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  // Filtros
  const [searchNombre, setSearchNombre] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [marcaFilter, setMarcaFilter] = useState("");
  const [vendedorFilter, setVendedorFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getPaginatedAdminProductos(token, 1, 1000); // Fetch all
      setAllProductos(data.productos);
      setProductos(data.productos);
    } catch (err) {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []); // Fetch only once

  useEffect(() => {
    let temp = [...allProductos];

    if (searchNombre.trim()) {
      temp = temp.filter(p => p.nombre.toLowerCase().includes(searchNombre.toLowerCase()));
    }
    if (categoriaFilter.trim()) {
      temp = temp.filter(p => p.categoria.toLowerCase().includes(categoriaFilter.toLowerCase()));
    }
    if (marcaFilter.trim()) {
      temp = temp.filter(p => p.marca.toLowerCase().includes(marcaFilter.toLowerCase()));
    }
    if (vendedorFilter.trim()) {
      temp = temp.filter(p => p.nombre_del_vendedor.toLowerCase().includes(vendedorFilter.toLowerCase()));
    }
    if (estadoFilter) {
      temp = temp.filter(p => p.status === estadoFilter);
    }

    setProductos(temp);
    setPage(1); // Reset page on filter change
  }, [searchNombre, categoriaFilter, marcaFilter, vendedorFilter, estadoFilter, allProductos]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const token = await getAccessTokenSilently();
      await deleteProductoById(id, token);
      fetchProductos(); // Refrescar lista
    } catch (err) {
      alert("Error al eliminar producto");
      console.error(err);
    }
  };

  const handleChangeStatus = async (
    id: number,
    status: "aprobada" | "rechazada"
  ) => {
    if (
      !confirm(
        `¿Estás seguro de ${status === "aprobada" ? "aprobar" : "rechazar"} este producto?`
      )
    )
      return;

    try {
      const token = await getAccessTokenSilently();
      if (status === "aprobada") {
        await aprobarProducto(id, token);
      } else {
        await rechazarProducto(id, token);
      }
      await fetchProductos();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar el estado del producto");
    }
  };

  const paginatedProductos = productos.slice((page - 1) * limit, page * limit);
  const total = productos.length;

  if (loading) return <p className="p-6 text-center">Cargando productos…</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Productos</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          Filtros
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchNombre}
            onChange={e => setSearchNombre(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Buscar por categoría"
            value={categoriaFilter}
            onChange={e => setCategoriaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Buscar por marca"
            value={marcaFilter}
            onChange={e => setMarcaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Buscar por vendedor"
            value={vendedorFilter}
            onChange={e => setVendedorFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <select
            value={estadoFilter}
            onChange={e => setEstadoFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-700 flex items-center gap-3">
        <label>Productos por página:</label>
        <select
          value={limit}
          onChange={e => {
            setLimit(Number(e.target.value));
            setPage(1); // reiniciar al cambiar
          }}
          className="border rounded px-2 py-1"
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Marca</th>
              <th className="p-3">Vendedor</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Enlace</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProductos.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.categoria}</td>
                <td className="p-3">{p.marca}</td>
                <td className="p-3">{p.nombre_del_vendedor}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    p.status === "aprobada"
                      ? "bg-green-100 text-green-700"
                      : p.status === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <a href={p.link_al_producto} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" /> Ir
                  </a>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Pencil className="inline w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash className="inline w-4 h-4" />
                    </button>
                    {p.status === "pendiente" && (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleChangeStatus(p.id, "aprobada")}
                        >
                          Aprobar
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleChangeStatus(p.id, "rechazada")}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {p.status === "aprobada" && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleChangeStatus(p.id, "rechazada")}
                      >
                        Rechazar
                      </button>
                    )}
                    {p.status === "rechazada" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleChangeStatus(p.id, "aprobada")}
                      >
                        Aprobar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && !loading && (
          <p className="text-center p-4 text-gray-500">No hay productos que coincidan con los filtros.</p>
        )}
      </div>

      {/* Paginación */}
      {total > limit && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {page} de {Math.ceil(total / limit)}
          </span>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
      {selectedProduct && (
        <ProductEditModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={fetchProductos}
        />
      )}
    </div>
  );
  
}