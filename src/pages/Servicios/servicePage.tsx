import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Servicio {
  nombre: string;
  descripcion: string;
  categoria: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen: string;
}

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const navigate = useNavigate();

  // Simulación de autenticación. Reemplazá con lo real (por contexto, JWT, etc.)
  const isAuthenticated = false; // ← cambiar por el estado real en tu app

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}`);
        setServicio(res.data);
      } catch (error) {
        console.error("Error al cargar el servicio:", error);
      }
    };

    fetchServicio();
  }, [id]);

  if (!servicio) return <div className="p-4">Cargando servicio...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Info del Servicio */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start">
        <div className="flex-1 md:mr-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#006881" }}>{servicio.nombre}</h1>
          <p className="text-gray-700 mb-4">{servicio.descripcion}</p>

        </div>

        <div className="w-full md:w-72 mt-6 md:mt-0">
          <img
            src={servicio.imagen || "https://via.placeholder.com/300x200?text=Servicio"}
            alt={servicio.nombre}
            className="w-full h-auto rounded-md object-cover shadow-md"
          />
        </div>
      </div>

      {/* Cuadro de contacto/agendamiento */}
    <div className="bg-[#009982] shadow-inner rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold mb-4 text-white">¿Quieres agendar?</h2>

        {isAuthenticated ? (
          <div className="space-y-3 text-gray-700">
            <p><strong>Teléfono:</strong> {servicio.telefono_de_contacto}</p>
            <p><strong>Email:</strong> {servicio.email_de_contacto}</p>
            <p><strong>Dirección:</strong> {servicio.direccion_principal_del_prestador}</p>

            <button
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => alert("Aquí podrías abrir un modal de reserva o redirigir a otra página")}
            >
              Agenda tu visita
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-white">
            <p>Únete a nuestra comunidad para poder disfrutar de estos beneficios.</p>
            <button
              className="mt-6 px-5 py-2 bg-white text-[#009982] rounded-full border border-[#009982]"
              onClick={() => navigate("/login")}
            >
              Agenda tu visita
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
