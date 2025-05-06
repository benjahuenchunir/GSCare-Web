import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaMapMarkerAlt, FaCity, FaCalendarAlt, FaClock } from "react-icons/fa";

import { getUserByEmail } from "../../services/userService";
import {
  Actividad,
  getAssistantsByActivity,
  fetchActividadById,
  attendActivity,
  cancelAttendance
} from "../../services/actividadService";

import ActividadInfoCard from "./ActividadInfoCard";
import ModalInscripcion from "./ModalInscripcion";

const ActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [yaInscrito, setYaInscrito] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 1. Carga la actividad
  useEffect(() => {
    fetchActividadById(Number(id))
      .then(setActividad)
      .catch(err => console.error("Error al cargar la actividad:", err));
  }, [id]);

  // 2. Chequea si el usuario ya está inscrito
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    getUserByEmail(user.email)
      .then(u =>
        getAssistantsByActivity(Number(id)).then(list =>
          setYaInscrito(list.some(a => a.id_usuario_asistente === u.id))
        )
      )
      .catch(err => console.warn("No se pudo verificar inscripción:", err));
  }, [id, isAuthenticated, user]);

  // 3. Handler para inscribirse
  const handleInscribirse = async () => {
    if (!isAuthenticated) {
      return loginWithRedirect({
        authorizationParams: {
          screen_hint: "login",
          ui_locales: "es",
          redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
        }
      });
    }
    if (!user?.email || !actividad) return;
    try {
      const u = await getUserByEmail(user.email);
      if (yaInscrito) {
        setModalVisible(true);
        return;
      }
      await attendActivity(actividad.id, u.id);
      setYaInscrito(true);
      setModalVisible(true);
    } catch (err: any) {
      console.error("Error al inscribirse:", err);
      alert(err.message || "Hubo un problema al inscribirse.");
    }
  };

  // 4. Handler para cancelar
  const handleConfirmCancel = async () => {
    if (!user?.email || !actividad) return;
    try {
      const u = await getUserByEmail(user.email);
      await cancelAttendance(actividad.id, u.id);
      setYaInscrito(false);
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Error al cancelar inscripción:", err);
      alert("No se pudo cancelar la inscripción.");
    }
  };

  if (!actividad) return <div className="p-4">Cargando actividad...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md mt-16">
      <ActividadInfoCard
        nombre={actividad.nombre}
        descripcion={actividad.descripcion}
        imagen={actividad.imagen ?? ""}
      />

      {/* Lugar */}
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

      {/* Fecha y hora */}
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

      {/* Acción de inscripción */}
      <div className="bg-[#009982] text-white rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">¿Quieres participar?</h3>
        <p className="mb-4">Únete a esta actividad para mejorar tu bienestar y conectar con otros.</p>
        {yaInscrito ? (
          <div className="flex flex-col items-center gap-3">
            <div className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold border border-[#009982]">
              Ya estás inscrito 😊
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="py-2 px-6 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 border border-red-300"
            >
              Cancelar inscripción
            </button>
          </div>
        ) : (
          <button
            onClick={handleInscribirse}
            className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold hover:bg-gray-200"
          >
            Suscribirse
          </button>
        )}
      </div>

      {/* Modal confirmación cancelación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">¿Cancelar inscripción?</h2>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que deseas cancelar tu inscripción a esta actividad?
            </p>
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

      {/* Modal de éxito */}
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