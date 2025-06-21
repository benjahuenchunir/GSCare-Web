// src/components/AdminComponents/ActivityDatesModal.tsx
import { useEffect, useState, ChangeEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getAdminActividades,
  deleteActividadById,
  deleteActividadSerieByBaseId,
} from "../../services/adminService";

function formatDate(fecha: string): string {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-CL");
}

interface Actividad {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  id_actividad_base: number | null;
}

export default function ActivityDatesModal({
  baseId,
  onClose,
}: {
  baseId: number;
  onClose: () => void;
}) {
  const { getAccessTokenSilently } = useAuth0();
  const [fechas, setFechas] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_final: "",
  });

  const fetchFechas = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const res = await getAdminActividades({ page: 1, limit: 1000, token });

      const relacionadas = res.actividades.filter(
        (a: Actividad) => a.id === baseId || a.id_actividad_base === baseId
      );

      const ordenadas = relacionadas.sort((a: Actividad, b: Actividad) => a.fecha.localeCompare(b.fecha));
      // const ordenadas = relacionadas.sort((a: Actividad, b: Actividad) => a.id - b.id);
      setFechas(ordenadas);
    } catch (err) {
      console.error("Error al cargar fechas", err);
      setFechas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (actividad: Actividad) => {
    setEditingId(actividad.id);
    setEditForm({
      fecha: actividad.fecha.split("T")[0],
      hora_inicio: actividad.hora_inicio,
      hora_final: actividad.hora_final,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id: number) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/actividades/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error al actualizar la fecha' }));
        throw new Error(errorData.message || 'Error al actualizar la fecha');
      }

      await fetchFechas();
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar los cambios.");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta fecha de actividad?")) return;

    const isBase = id === baseId;
    const isLastDate = fechas.length === 1;

    try {
      const token = await getAccessTokenSilently();

      if (isBase) {
        const confirm = window.confirm("⚠️ Estás a punto de eliminar la actividad original.\nEsto eliminará TODAS las fechas de esta actividad recurrente. ¿Estás seguro?");
        if (!confirm) return;
        await deleteActividadSerieByBaseId(baseId, token);
      } else {
        await deleteActividadById(id, token);
      }

      if (isLastDate || isBase) {
        onClose(); // Cerramos el modal y que el padre recargue
      } else {
        setFechas(currentFechas => currentFechas.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la fecha.");
    }
  };

  useEffect(() => {
    fetchFechas();
  }, [baseId]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Fechas de la actividad</h2>
        {loading ? (
          <p>Cargando fechas…</p>
        ) : fechas.length === 0 ? (
          <p>No hay fechas disponibles.</p>
        ) : (
          <ul className="space-y-2 max-h overflow-y-auto">
            {fechas.map((f) => (
              <li key={f.id} className="flex justify-between items-center border rounded px-4 py-2 min-h-[54px]">
                {editingId === f.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input type="date" name="fecha" value={editForm.fecha} onChange={handleFormChange} className="border rounded px-2 py-1 text-sm w-36" />
                    <input
                      type="time"
                      name="hora_inicio"
                      value={editForm.hora_inicio?.slice(0, 5)} // <-- Esto elimina los segundos
                      onChange={handleFormChange}
                      className="border rounded px-1 py-1 text-sm w-24"
                    />
                    <input
                      type="time"
                      name="hora_final"
                      value={editForm.hora_final?.slice(0, 5)}
                      onChange={handleFormChange}
                      className="border rounded px-1 py-1 text-sm w-24"
                    />                    
                    <div className="ml-auto flex gap-3">
                      <button onClick={() => handleSave(f.id)} className="text-green-600 hover:text-green-800 text-sm font-semibold">Guardar</button>
                      <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>
                      {formatDate(f.fecha)} — {f.hora_inicio?.slice(0, 5)} a {f.hora_final?.slice(0, 5)}
                    </span>
                    <div className="space-x-4">
                      <button onClick={() => handleEdit(f)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Editar</button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
