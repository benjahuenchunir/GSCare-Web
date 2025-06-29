import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaIndustry, FaStore, FaExternalLinkAlt } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { registrarVisitaProducto } from "../../services/productoService";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/productos/${id}`
        );
        setProducto(res.data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleProductClick = async (productId: number) => {
    // No registrar visitas de administradores
    if (profile?.rol !== "administrador") {
      await registrarVisitaProducto(productId);
    }
    navigate(`/productos/${productId}`);
  };

  if (!producto) return <div className="p-4">Cargando producto...</div>;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="grid grid-cols-1 justify-center items-center lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Imagen */}
          <div className="flex items-center justify-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          {/* Columna derecha - Información */}
          <div className="space-y-6">
            {/* Título y descripción */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#00495C]">
                {producto.nombre}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {producto.descripcion}
              </p>
            </div>

            {/* Detalles del producto */}
            <div className="bg-gray-200 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-[#00495C]">
                Detalles del producto
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <FaIndustry className="text-[#009982] text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-semibold">{producto.marca}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <FaStore className="text-[#009982] text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Vendedor</p>
                    <p className="font-semibold">
                      {producto.nombre_del_vendedor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de compra */}
            <div className="bg-[#009982] text-white rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">
                ¿Te interesa este producto?
              </h3>
              <p className="mb-4">
                Haz clic en el botón para visitar el sitio de compra.
              </p>
              <a
                onClick={() => handleProductClick(Number(id))}
                href={producto.link_al_producto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#009982] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FaExternalLinkAlt />
                Ir al producto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
