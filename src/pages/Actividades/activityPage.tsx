import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ModalInscripcion from "./ModalInscripcion";
import { useAuth0 } from "@auth0/auth0-react";
import { FaMapMarkerAlt, FaCity, FaCalendarAlt, FaClock } from "react-icons/fa";
import { getUserByEmail } from "../../services/userService";
import ActividadInfoCard from "./ActividadInfoCard";

interface Actividad {
  nombre: string;
  descripcion: string;
  lugar: string;
  comuna: string;
  fecha: string;
  hora: string;
  imagen: string;
  categoria: string;
  id_creador_del_evento: number;
}

const ActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [yaInscrito, setYaInscrito] = useState(false);
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/actividades/${id}`);
        setActividad(res.data);
      } catch (error) {
        console.error("Error al cargar la actividad:", error);
      }
    };

    const checkInscripcion = async () => {
      try {
        if (!user?.email) return;
        const usuario = await getUserByEmail(user.email);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/asistentes/actividad/${id}`);
        const asistencia = res.data.find((a: any) => a.id_usuario_asistente === usuario.id);

        if (asistencia) {
          setYaInscrito(true);
        }
      } catch (error) {
        console.warn("No se pudo verificar inscripción previa:", error);
      }
    };

    fetchActividad();

    if (isAuthenticated && user?.email) {
      checkInscripcion();
    }
  }, [id, isAuthenticated, user?.email]);

  const handleInscribirse = async () => {
    if (!actividad || !user) return;

    try {
      if (!user.email) throw new Error("Email no disponible en el objeto de usuario");
      const usuario = await getUserByEmail(user.email);

      if (yaInscrito) {
        setModalVisible(true);
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/asistentes`, {
        id_evento_a_asistir: Number(id),
        id_usuario_asistente: usuario.id,
      });
      setModalVisible(true);
      setYaInscrito(true);
    } catch (error) {
      console.error("Error al inscribirse:", error);
      alert("Hubo un problema al intentar inscribirse.");
    }
  };

  const handleConfirmCancel = async () => {
    if (!user?.email || !id) return;

    try {
      const usuario = await getUserByEmail(user.email);
      await axios.delete(`${import.meta.env.VITE_API_URL}/asistentes`, {
        data: {
          id_evento_a_asistir: Number(id),
          id_usuario_asistente: usuario.id,
        },
      });

      setYaInscrito(false);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error al cancelar inscripción:", error);
      alert("No se pudo cancelar la inscripción.");
    }
  };

  if (!actividad) return <div className="p-4">Cargando actividad...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md mt-[1cm]">
      <ActividadInfoCard
        nombre={actividad.nombre}
        descripcion={actividad.descripcion}
        imagen={actividad.imagen}
      />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-[#00495C] mb-4">Información del lugar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-[#009982] text-3xl" />
            <div>
              <h3 className="font-semibold">Lugar</h3>
              <p>{actividad.lugar}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaCity className="text-[#009982] text-3xl" />
            <div>
              <h3 className="font-semibold">Comuna</h3>
              <p>{actividad.comuna}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-[#00495C] mb-4">Información de la hora</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div className="flex items-start gap-3">
            <FaCalendarAlt className="text-[#009982] text-3xl" />
            <div>
              <h3 className="font-semibold">Fecha</h3>
              <p>{new Date(actividad.fecha).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaClock className="text-[#009982] text-3xl" />
            <div>
              <h3 className="font-semibold">Hora</h3>
              <p>{actividad.hora.slice(0, 5)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#009982] text-white rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">¿Quieres participar?</h3>
        <p className="mb-4">Únete a esta actividad para mejorar tu bienestar y conectar con otros.</p>
        <div className="flex flex-col items-center gap-3 sm:flex-col sm:justify-center">
          {yaInscrito ? (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold border border-[#009982]">
                Ya estás inscrito 😊
              </div>
              <p className="text-white text-sm">
                ¿Quieres cancelar tu inscripción? Puedes hacerlo presionando el botón de abajo.
              </p>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="py-2 px-6 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 border border-red-300"
              >
                Cancelar inscripción
              </button>
            </div>
          ) : (
            <button
              className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold hover:bg-gray-200"
              onClick={() => {
                if (!isAuthenticated) {
                  loginWithRedirect({
                    authorizationParams: {
                      screen_hint: "login",
                      ui_locales: "es",
                      redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
                    },
                  });
                  return;
                }
                handleInscribirse();
              }}
            >
              Suscribirse
            </button>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">¿Cancelar inscripción?</h2>
            <p className="text-gray-700 mb-4">¿Estás seguro de que deseas cancelar tu inscripción a esta actividad?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                No, mantener
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalInscripcion
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actividad={actividad}
        yaInscrito={yaInscrito}
      />
    </div>
  );
};

export default ActivityPage;
