// src/pages/Admin/AdminProductsPage.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getPaginatedAdminProductos, deleteProductoById } from "../../services/adminService";
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
}

export default function AdminProductsPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  const fetchProductos = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getPaginatedAdminProductos(token, page, limit);
      setProductos(data.productos);
      setTotal(data.total);
    } catch (err) {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [page, limit]);

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

  if (loading) return <p className="p-6 text-center">Cargando productos…</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Productos</h1>

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
              <th>Categoría</th>
              <th>Marca</th>
              <th>Vendedor</th>
              <th>Enlace</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.marca}</td>
                <td>{p.nombre_del_vendedor}</td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
