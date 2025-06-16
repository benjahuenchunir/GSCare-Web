const API_URL = import.meta.env.VITE_API_URL;

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  lugar: string;
  comuna: string;
  imagen: string | null;
  modalidad: "presencial" | "online";
  link: string | null;
  id_foro_actividad?: number | null;
  id_actividad_base?: number | null;
  id_creador_del_evento: number;
  createdAt: string;
  updatedAt: string;
}

export interface Asistente {
  id_evento_a_asistir: number;
  id_usuario_asistente: number;
}

// 1. Lista todas las actividades
export async function fetchActividades(): Promise<Actividad[]> {
  const res = await fetch(`${API_URL}/actividades`);
  if (!res.ok) throw new Error("Error al obtener las actividades");
  return await res.json();
}

// 2. Trae una actividad por ID
export async function fetchActividadById(id: number): Promise<Actividad> {
  const res = await fetch(`${API_URL}/actividades/${id}`);
  if (!res.ok) throw new Error("Error al obtener la actividad");
  return await res.json();
}

// 3. Obtener actividades a las que el usuario asiste
export async function getUserActivities(
  usuarioId: number
): Promise<Actividad[]> {
  const res = await fetch(
    `${API_URL}/usuarios/actividades?id_usuario=${usuarioId}`
  );
  if (!res.ok) throw new Error("Error al obtener actividades del usuario");
  return (await res.json()) as Actividad[];
}

// 4. Obtener lista de asistentes de una actividad
export async function getAssistantsByActivity(activityId: number) {
  try {
    const res = await fetch(`${API_URL}/asistentes/actividad/${activityId}`);
    if (!res.ok) {
      console.warn(
        "No se pudieron obtener los asistentes, asumiendo lista vacía"
      );
      return [];
    }
    return await res.json();
  } catch (error) {
    console.warn("Error al obtener asistentes:", error);
    return [];
  }
}

// 5. Inscribir (asistir) a una actividad
export async function attendActivity(
  actividadId: number,
  usuarioId: number,
  token: string
): Promise<Asistente> {
  const res = await fetch(`${API_URL}/asistentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_evento_a_asistir: actividadId,
      id_usuario_asistente: usuarioId,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al inscribirse");
  }
  return await res.json();
}

// 6. Cancelar asistencia individual
export async function cancelAttendance(
  actividadId: number,
  usuarioId: number,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/asistentes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_evento_a_asistir: actividadId,
      id_usuario_asistente: usuarioId,
    }),
  });
  if (!(res.ok || res.status === 204)) {
    const err = await res.json();
    throw new Error(err.message || "Error al cancelar inscripción");
  }
}

// 7. ✅ Cancelar todas las actividades relacionadas a una actividad base
export async function cancelAttendanceGrupo(
  actividadId: number,
  usuarioId: number,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/asistentes/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_evento_a_asistir: actividadId,
      id_usuario_asistente: usuarioId,
    }),
  });

  if (!(res.ok || res.status === 204)) {
    const err = await res.json();
    throw new Error(err.message || "Error al cancelar inscripción múltiple");
  }
}
