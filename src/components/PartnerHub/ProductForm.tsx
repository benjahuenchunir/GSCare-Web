import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import ModalConfirmarPublicacion from "../Servicios/Resenas/ModalConfirmarPublicacion";

export interface ProductoForm {
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  nombre_del_vendedor: string;
  link_al_producto: string;
  imagen: string;
}

interface Props {
  producto: ProductoForm;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
  success: string;
  onCancel: () => void;
}

export default function ProductForm({
  producto,
  onChange,
  onSubmit,
  loading,
  error,
  success,
  onCancel,
}: Props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  useEffect(() => {
    if (producto.imagen && producto.imagen.startsWith('http')) {
      setPreviewUrl(producto.imagen);
    } else {
      setPreviewUrl(null);
    }
  }, [producto.imagen]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-md p-6 space-y-6 max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#00495C]">Sugerir un Producto</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col space-y-5 min-w-0"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del producto</label>
              <input
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej: Zapatillas de casa"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={producto.descripcion}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Descripción detallada del producto"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  value={producto.categoria}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ej: Calzado"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={producto.marca}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ej: ComfortStep"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del vendedor</label>
              <input
                type="text"
                name="nombre_del_vendedor"
                value={producto.nombre_del_vendedor}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej: Tienda del Abuelo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link al producto</label>
              <input
                type="url"
                name="link_al_producto"
                value={producto.link_al_producto}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://ejemplo.com/producto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL de Imagen (opcional)</label>
              <input
                type="text"
                name="imagen"
                value={producto.imagen || ""}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Vista previa" className="max-h-40 rounded-lg" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="bg-[#FF4D4F] hover:bg-[#d32f2f] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#009982] hover:bg-[#007b6d] text-white rounded-lg font-semibold text-lg transition px-6 py-3"
                disabled={loading}
              >
                {loading ? "Sugiriendo..." : "Sugerir Producto"}
              </button>
            </div>
          </form>

          {/* Vista previa */}
          <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-inner p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#00495C] mb-4 text-center">Vista previa del producto</h2>

            <div className="flex flex-col-reverse md:flex-row items-stretch gap-6">
              <div className="flex-1 flex flex-col justify-start text-center md:text-left pt-4">
                <h1 className="font-poppins font-bold text-[1.8em] text-[#006881] leading-snug mb-4">
                  {producto.nombre || <span className="text-gray-400">[Nombre del producto]</span>}
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  {producto.descripcion || <span className="text-gray-400">[Descripción]</span>}
                </p>
              </div>
              {previewUrl && (
                <div className="flex-1 flex justify-center">
                  <img
                    src={previewUrl}
                    alt={`Imagen de ${producto.nombre}`}
                    className="self-center max-h-[250px] w-auto rounded-xl object-contain"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-[#00495C] mb-2">Detalles</h3>
                <p><strong>Marca:</strong> {producto.marca || <span className="text-gray-400">[Marca]</span>}</p>
                <p><strong>Vendedor:</strong> {producto.nombre_del_vendedor || <span className="text-gray-400">[Vendedor]</span>}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-[#00495C] mb-2">Enlace</h3>
                <a href={producto.link_al_producto || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {producto.link_al_producto || <span className="text-gray-400">[Link al producto]</span>}
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-800 font-medium">
                  Categoría: {producto.categoria || "[Categoría]"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalConfirmarPublicacion
          open={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            onSubmit(new Event("submit") as any);
          }}
          titulo="¿Confirmar sugerencia de producto?"
          mensaje="Estás a punto de sugerir un producto, que será revisado por nuestros administradores. Una vez aprobado, será visible para otros usuarios."
        />
      </div>
    </div>
  );
}