import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaMapMarkerAlt, FaCity, FaCalendarAlt, FaClock } from "react-icons/fa";

import { getUserByEmail } from "../../services/userService";
import { UserContext } from "../../context/UserContext";
import {
  Actividad,
  getAssistantsByActivity,
  fetchActividadById,
  attendActivity,
  cancelAttendance
} from "../../services/actividadService";

import ActividadInfoCard from "./ActividadInfoCard";
import ModalInscripcion from "./ModalInscripcion";

// Función para formatear fecha YYYY-MM-DD a "15 de mayo de 2025"
const formatearFecha = (fecha: string) => {
  const [a, m, d] = fecha.split("-");
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${a}`;
};

const ActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [yaInscrito, setYaInscrito] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { profile, reloadProfile } = useContext(UserContext);

  useEffect(() => {
    if (isAuthenticated) {
      reloadProfile(); // 🔁 para asegurar que el rol esté actualizado
    }
  }, [isAuthenticated]);

  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);

  useEffect(() => {
    fetchActividadById(Number(id))
      .then(setActividad)
      .catch(err => console.error("Error al cargar la actividad:", err));
  }, [id]);

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

    if (yaInscrito) {
      setModalVisible(true);
      return;
    }

    setShowSubscribeConfirm(true);
  };

  const handleConfirmInscribirse = async () => {
    setShowSubscribeConfirm(false);
    if (!user?.email || !actividad) return;
    try {
      const token = await getAccessTokenSilently();
      const u = await getUserByEmail(user.email);
      await attendActivity(actividad.id, u.id, token);
      setYaInscrito(true);
      setModalVisible(true);
    } catch (err: any) {
      console.error("Error al inscribirse:", err);
      alert(err.message || "Hubo un problema al inscribirse.");
    }
  };

  const handleConfirmCancel = async () => {
    if (!user?.email || !actividad) return;
    try {
      const token = await getAccessTokenSilently();
      const u = await getUserByEmail(user.email);
      await cancelAttendance(actividad.id, u.id, token);
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
        <h2 className="font-bold text-[1.2em] text-[#00495C] mb-4">Información del lugar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-[#009982]" />
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
        <h2 className="font-bold text-[1.2em] text-[#00495C] mb-4">Información de la hora</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div className="flex items-start gap-3">
            <FaCalendarAlt className="text-[#009982]" />
            <div>
              <h3 className="font-semibold">Fecha</h3>
              <p>{formatearFecha(actividad.fecha)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaClock className="text-[#009982]" />
            <div>
              <h3 className="font-semibold">Hora</h3>
              <p>{actividad.hora.slice(0, 5)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acción de inscripción */}
      {profile?.rol === "socio" ? (
        <div className="bg-[#009982] text-white rounded-lg p-6 text-center">
          <h3 className="font-bold mb-2">¿Quieres participar?</h3>
          <p className="mb-4">Únete a esta actividad para mejorar tu bienestar y conectar con otros.</p>
          {yaInscrito ? (
            <div className="flex flex-col items-center gap-3">
              <div className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold border border-[#009982]">
                Ya estás inscrito 😊
              </div>
              <p className="text-white text-center">
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
              onClick={handleInscribirse}
              className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold hover:bg-gray-200"
            >
              Suscribirse
            </button>
          )}
        </div>
      ) : (
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold">Actividad exclusiva para socios</h3>
          <p className="mt-2">Hazte socio para poder participar en nuestras actividades exclusivas.</p>
          <button
            onClick={() => {
              window.location.href = "/user"; // o redirección a botón de hacerse socio
            }}
            className="mt-4 px-6 py-2 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500"
          >
            Hacerse socio
          </button>
        </div>
      )}


      {/* Modal confirmación cancelación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className=" font-bold text-red-600 mb-4">¿Cancelar inscripción?</h2>
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

      {showSubscribeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-[1.5em] font-bold text-[#009982] mb-4">¿Confirmar inscripción?</h2>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas inscribirte en esta actividad?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSubscribeConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No, cancelar
              </button>
              <button
                onClick={handleConfirmInscribirse}
                className="px-4 py-2 bg-[#009982] text-white rounded hover:bg-[#007f6e]"
              >
                Sí, inscribirme
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
