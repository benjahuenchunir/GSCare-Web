import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaIndustry, FaStore, FaExternalLinkAlt } from "react-icons/fa";

interface Producto {
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  marca: string;
  nombre_del_vendedor: string;
  link_al_producto: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos/${id}`);
        setProducto(res.data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  if (!producto) return <div className="p-4">Cargando producto...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md mt-[1cm]">
      {/* Imagen a la derecha */}
      <div className="flex flex-col md:flex-row-reverse gap-6">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full md:w-1/2 h-auto object-cover rounded-lg border"
        />
        <div className="flex flex-col space-y-3 justify-center">
          <h1 className="text-[2em] leading-snug font-bold text-[#00495C]">{producto.nombre}</h1>
          <p className="text-[1em] text-gray-700">{producto.descripcion}</p>
        </div>
      </div>

      {/* Información del producto */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-[1.2em] font-bold text-[#00495C] mb-4">Detalles del producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div className="flex items-center gap-3">
            <FaIndustry className="text-[#009982]" />
            <p><span className="font-semibold">Marca:</span> {producto.marca}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaStore className="text-[#009982]" />
            <p><span className="font-semibold">Vendedor:</span> {producto.nombre_del_vendedor}</p>
          </div>
        </div>
      </div>

      {/* Enlace de compra */}
      <div className="bg-[#009982] text-white rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">¿Te interesa este producto?</h3>
        <p className="mb-4">Haz clic en el botón para visitar el sitio de compra.</p>
        <a
          href={producto.link_al_producto}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#009982] font-semibold px-6 py-2 rounded-lg hover:bg-gray-200"
        >
          <FaExternalLinkAlt />
          Ir al producto
        </a>
      </div>
    </div>
  );
};

export default ProductPage;
