const API_URL = import.meta.env.VITE_API_URL;
import { Servicio } from "./serviceService"; 

export interface Suscripcion {
  id: number;
  id_usuario: number;
  id_servicio: number;
  createdAt: string;
  updatedAt: string;
  Usuario?: { id: number; nombre: string; email: string };
}

// 1.1 Comprobar si el usuario está suscrito a un servicio
export async function isUserSubscribed(
  servicioId: number,
  usuarioId: number
): Promise<boolean> {
  const res = await fetch(`${API_URL}/servicios/${servicioId}/suscripciones`);
  if (!res.ok) throw new Error("Error al comprobar suscripción");
  const list: Suscripcion[] = await res.json();
  return list.some(s => s.id_usuario === usuarioId);
}

// 1.2 Suscribirse
export async function subscribeToService(
  servicioId: number,
  usuarioId: number
): Promise<Suscripcion> {
  const res = await fetch(`${API_URL}/servicios/${servicioId}/suscribirse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: usuarioId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al suscribirse");
  }
  const body = await res.json();
  return body.suscripcion as Suscripcion;
}

// 1.3 Desuscribirse
export async function unsubscribeFromService(
  servicioId: number,
  usuarioId: number
): Promise<void> {
  const res = await fetch(`${API_URL}/servicios/${servicioId}/desuscribirse`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: usuarioId })
  });
  if (!(res.ok || res.status === 204)) {
    const err = await res.json();
    throw new Error(err.message || "Error al cancelar suscripción");
  }
}

// 1.4 Obtener suscripciones de un usuario
export async function getUserSubscriptions(
  usuarioId: number
): Promise<Servicio[]> {
  // 1. Trae todos los servicios
  const serviciosRes = await fetch(`${API_URL}/servicios`);
  if (!serviciosRes.ok) {
    throw new Error("Error fetching servicios");
  }
  const servicios: Servicio[] = await serviciosRes.json();

  // 2. Para cada servicio, pide sus suscripciones y filtra
  const results = await Promise.all(
    servicios.map(async (s) => {
      const susRes = await fetch(`${API_URL}/servicios/${s.id}/suscripciones`);
      if (!susRes.ok) return null;
      const sus: Suscripcion[] = await susRes.json();
      // si el usuario está en la lista, devolvemos este servicio
      if (sus.some(x => x.id_usuario === usuarioId)) {
        return s;
      }
      return null;
    })
  );

  // 3. Quitamos nulos y devolvemos sólo los suscritos
  return results.filter((s): s is Servicio => s !== null);
}
