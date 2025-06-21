// src/components/AdminComponents/ActivityAttendeesModal.tsx
import { useEffect, useState } from "react";
import { getAsistentesByActividadId, deleteAsistencia } from "../../services/adminService";
import { useAuth0 } from "@auth0/auth0-react";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface Asistencia {
  id: number;
  id_usuario_asistente: number;
  Usuario: Usuario;
}

export default function ActivityAttendeesModal({
  actividadId,
  onClose,
}: {
  actividadId: number;
  onClose: () => void;
}) {
  const [attendees, setAttendees] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const data = await getAsistentesByActividadId(actividadId, token);
      if (Array.isArray(data)) {
        setAttendees(data);
      } else {
        setAttendees([]); // No hay asistentes, o es un objeto de error
      }
    } catch (err) {
      console.warn("Error al obtener asistentes", err);
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: number) => {
    if (!confirm("¿Eliminar la inscripción de este usuario?")) return;
    try {
      const token = await getAccessTokenSilently();
      await deleteAsistencia({ actividadId, userId, token });
      await fetchAttendees();
    } catch (err) {
      alert("Error al eliminar asistencia");
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [actividadId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Usuarios inscritos</h2>
        {loading ? (
          <p>Cargando…</p>
        ) : attendees.length === 0 ? (
          <p>No hay usuarios inscritos.</p>
        ) : (
          <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {attendees.map((a) => (
              <li key={a.id} className="flex justify-between items-center border-b py-2">
                <span>{a.Usuario.nombre} ({a.Usuario.email})</span>
                <button
                  onClick={() => handleRemove(a.id_usuario_asistente)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-600 hover:underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
