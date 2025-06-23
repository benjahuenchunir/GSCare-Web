// src/pages/Admin/AdminProductsPage.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getPaginatedAdminProductos, deleteProductoById, aprobarProducto, rechazarProducto } from "../../services/adminService";
import { Pencil, Trash, Link as LinkIcon } from "lucide-react";
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
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={e => setSearchNombre(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por categoría"
          value={categoriaFilter}
          onChange={e => setCategoriaFilter(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por marca"
          value={marcaFilter}
          onChange={e => setMarcaFilter(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por vendedor"
          value={vendedorFilter}
          onChange={e => setVendedorFilter(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
        </select>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm">Productos por página:</label>
        <select
          value={limit}
          onChange={e => {
            setPage(1); // reinicia al cambiar
            setLimit(Number(e.target.value));
          }}
          className="border rounded px-3 py-1 bg-white"
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="text-left">Categoría</th>
              <th className="text-left">Marca</th>
              <th className="text-left">Vendedor</th>
              <th className="text-left">Estado</th>
              <th className="text-left">Enlace</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProductos.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.marca}</td>
                <td>{p.nombre_del_vendedor}</td>
                <td>
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
                <td>
                  <a href={p.link_al_producto} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" /> Ir al producto
                  </a>
                </td>
                <td className="space-x-2">
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
                  {p.status !== "aprobada" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleChangeStatus(p.id, "aprobada")}
                      >
                        Aprobar
                      </button>
                  )}
                  {p.status !== "rechazada" && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleChangeStatus(p.id, "rechazada")}
                      >
                        Rechazar
                      </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && !loading && (
          <p className="text-center text-sm text-gray-500 mt-4">No hay productos que coincidan con los filtros.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center text-sm">
        <span>
          Mostrando {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total} productos
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
        {selectedProduct && (
          <ProductEditModal
            producto={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onUpdate={fetchProductos}
          />
        )}
      </div>
    </div>
  );
  
}
