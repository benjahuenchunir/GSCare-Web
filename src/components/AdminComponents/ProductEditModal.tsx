// src/components/AdminComponents/ProductEditModal.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateProductoById } from "../../services/adminService";
import { Producto } from "../../pages/Admin/AdminProductsPage";

export default function ProductEditModal({
  producto,
  onClose,
  onUpdate,
}: {
  producto: Producto;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { getAccessTokenSilently } = useAuth0();
  const [form, setForm] = useState<Producto>(producto);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(producto);
  }, [producto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      await updateProductoById(form, token);
      onUpdate();
      onClose();
    } catch (err) {
      alert("Error al actualizar producto");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Editar producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Vista previa de la imagen */}
          {form.imagen && /^https?:\/\/.+\..+/.test(form.imagen) && (
            <div className="text-center">
              <img
                src={form.imagen}
                alt="Vista previa del producto"
                className="max-h-40 mx-auto rounded-md border"
              />
              <p className="text-xs text-gray-500 mt-1">Vista previa de la imagen</p>
            </div>
          )}

          <input
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="URL de la imagen"
          />

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Nombre"
          />
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción"
          />
          <input
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Categoría"
          />
          <input
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Marca"
          />
          <input
            name="nombre_del_vendedor"
            value={form.nombre_del_vendedor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Vendedor"
          />
          <input
            name="link_al_producto"
            value={form.link_al_producto}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Link al producto"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#62CBC9] text-white rounded hover:bg-[#009982]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
