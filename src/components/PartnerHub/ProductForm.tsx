import React, { ChangeEvent, FormEvent } from "react";

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
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 text-lg max-h-[70vh] overflow-y-auto"
  >
    <h2 className="text-2xl font-bold mb-2">Agregar Producto</h2>
    <label className="text-left font-semibold" htmlFor="nombre_producto">
      Nombre del producto
    </label>
    <input
      id="nombre_producto"
      name="nombre"
      value={producto.nombre}
      onChange={onChange}
      placeholder="Nombre del producto"
      className="border p-2 rounded"
    />
    <label className="text-left font-semibold" htmlFor="descripcion_producto">
      Descripción del producto
    </label>
    <textarea
      id="descripcion_producto"
      name="descripcion"
      value={producto.descripcion}
      onChange={onChange}
      placeholder="Descripción del producto"
      className="border p-2 rounded"
      rows={2}
    />
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="categoria_producto">
          Categoría
        </label>
        <input
          id="categoria_producto"
          name="categoria"
          value={producto.categoria}
          onChange={onChange}
          placeholder="Categoría"
          className="border p-2 rounded"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="marca_producto">
          Marca
        </label>
        <input
          id="marca_producto"
          name="marca"
          value={producto.marca}
          onChange={onChange}
          placeholder="Marca"
          className="border p-2 rounded"
        />
      </div>
    </div>
    <label className="text-left font-semibold" htmlFor="vendedor_producto">
      Nombre del vendedor
    </label>
    <input
      id="vendedor_producto"
      name="nombre_del_vendedor"
      value={producto.nombre_del_vendedor}
      onChange={onChange}
      placeholder="Nombre del vendedor"
      className="border p-2 rounded"
    />
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="link_producto">
          Link al producto
        </label>
        <input
          id="link_producto"
          name="link_al_producto"
          value={producto.link_al_producto}
          onChange={onChange}
          placeholder="Link al producto"
          className="border p-2 rounded"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="imagen_producto">
          URL de imagen (opcional)
        </label>
        <input
          id="imagen_producto"
          name="imagen"
          value={producto.imagen}
          onChange={onChange}
          placeholder="URL de imagen (opcional)"
          className="border p-2 rounded"
        />
      </div>
    </div>
    {error && <div className="text-red-500 mt-2">{error}</div>}
    {success && <div className="text-green-600 mt-2">{success}</div>}
    <div className="flex gap-2 mt-2">
      <button
        type="submit"
        className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar"}
      </button>
      <button
        type="button"
        className="flex-1 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        onClick={onCancel}
      >
        Volver
      </button>
    </div>
    </form>
  );
}
