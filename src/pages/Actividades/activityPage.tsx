import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaMapMarkerAlt, FaCity } from "react-icons/fa";

import { getUserByEmail } from "../../services/userService";
import { UserContext } from "../../context/UserContext";
import {
  Actividad,
  getAssistantsByActivity,
  fetchActividadById,
  fetchActividades,
  attendActivity,
  cancelAttendanceGrupo,
} from "../../services/actividadService";

import ActividadInfoCard from "./ActividadInfoCard";
import ModalInscripcion from "./ModalInscripcion";
import ActivityForum from "../../components/ActivityForum/ActivityForum";
import ExclusiveSubscriptionCard from "../../components/ExclusiveSubscriptionCard";

const formatearFecha = (fecha: string) => {
  const [a, m, d] = fecha.split("-");
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${a}`;
};

const ActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();

  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [grupoActividades, setGrupoActividades] = useState<Actividad[]>([]);
  const [yaInscrito, setYaInscrito] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { profile, reloadProfile } = useContext(UserContext);
  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) reloadProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!id) return;

    fetchActividadById(Number(id))
      .then(async (act) => {
        setActividad(act);

        const todas = await fetchActividades();
        const claveAgrupacion = act.id_actividad_base ?? act.id;
        const relacionadas = todas.filter(
          (a) =>
            a.id === claveAgrupacion || a.id_actividad_base === claveAgrupacion
        );

        setGrupoActividades(
          relacionadas.sort((a, b) => a.fecha.localeCompare(b.fecha))
        );
      })
      .catch((err) => console.error("Error al cargar actividad:", err));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.email || !actividad) return;
    getUserByEmail(user.email)
      .then((u) =>
        getAssistantsByActivity(actividad.id).then((list) =>
          setYaInscrito(
            list.some(
              (a: { id_usuario_asistente: number }) =>
                a.id_usuario_asistente === u.id
            )
          )
        )
      )
      .catch((err) => console.warn("No se pudo verificar inscripción:", err));
  }, [id, isAuthenticated, user, actividad]);

  const handleInscribirse = async () => {
    if (!isAuthenticated) {
      return loginWithRedirect({
        authorizationParams: {
          screen_hint: "login",
          ui_locales: "es",
          redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
        },
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
    if (!user?.email || !actividad || grupoActividades.length === 0) return;
    try {
      const token = await getAccessTokenSilently();
      const u = await getUserByEmail(user.email);

      for (const a of grupoActividades) {
        await attendActivity(a.id, u.id, token);
      }

      setYaInscrito(true);
    } catch (err: unknown) {
      console.error("Error al inscribirse:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Hubo un problema al inscribirse.";
      alert(errorMessage);
    }
  };

  const handleConfirmCancel = async () => {
    if (!user?.email || !actividad) return;
    try {
      const token = await getAccessTokenSilently();
      const u = await getUserByEmail(user.email);

      // Solo enviamos la actividad base (una sola), el backend resuelve el grupo
      await cancelAttendanceGrupo(actividad.id, u.id, token);

      setYaInscrito(false);
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Error al cancelar inscripción:", err);
      alert("No se pudo cancelar la inscripción.");
    }
  };

  if (!actividad) return <div className="p-4">Cargando actividad...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pt-20">
      <ActividadInfoCard
        nombre={actividad.nombre}
        descripcion={actividad.descripcion}
        imagen={actividad.imagen ?? ""}
        capacidad_total={actividad.capacidad_total}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modalidad */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-[1.2em] text-[#00495C] mb-4">
            Modalidad
          </h2>
          {actividad.modalidad === "presencial" ? (
            <div className="grid grid-cols-1 gap-4 text-gray-800">
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
          ) : (
            <div className="text-gray-800">
              <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#009982]" />
              <div>
                <h3 className="font-semibold">Link de acceso</h3>
                {profile?.rol === "socio" ? (
                <a
                  href={actividad.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {actividad.link}
                </a>
                ) : (
                <span className="text-gray-500 italic">
                  Solo disponible para socios
                </span>
                )}
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Fechas y horarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-[1.2em] text-[#00495C] mb-4">
            Fechas y Horarios
          </h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {grupoActividades.map((a, i) => (
              <li key={i}>
                {formatearFecha(a.fecha)} — {a.hora_inicio?.slice(0, 5)} a{" "}
                {a.hora_final?.slice(0, 5)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foro de Discusión */}
      <div className="bg-white rounded-lg shadow">
        <ActivityForum activityId={actividad.id} />
      </div>

      {profile?.rol === "socio" ? (
        <div className="bg-[#009982] text-white rounded-lg p-6 text-center">
          <h3 className="font-bold mb-2">¿Quieres participar?</h3>
          <p className="mb-4">
            Te inscribirás a todos los bloques de esta actividad.
          </p>
          {yaInscrito ? (
            <div className="flex flex-col items-center gap-3">
              <div className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold border border-[#009982]">
                Ya estás inscrito 😊
              </div>
              <p className="text-white text-center">
                ¿Quieres cancelar tu inscripción a todos los bloques? Puedes
                hacerlo abajo.
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
        <ExclusiveSubscriptionCard />
      )}

      {/* Modales */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className=" font-bold text-red-600 mb-4">
              ¿Cancelar inscripción?
            </h2>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que deseas cancelar tu inscripción a{" "}
              <strong>todos los bloques</strong> de esta actividad?
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
            <h2 className="text-[1.5em] font-bold text-[#009982] mb-4">
              ¿Confirmar inscripción?
            </h2>
            <p className="text-gray-700 mb-6">
              Te inscribirás a <strong>todos los bloques</strong> de esta
              actividad recurrente. ¿Deseas continuar?
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
        actividades={grupoActividades}
        yaInscrito={yaInscrito}
      />

    </div>
  );
};

export default ActivityPage;
