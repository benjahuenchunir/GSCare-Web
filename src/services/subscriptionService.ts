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
export async function isUserSubscribed(servicioId: number, usuarioId: number, token: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/servicios/${servicioId}/suscripciones`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
  if (!res.ok) throw new Error("Error al comprobar suscripción");
  const list: Suscripcion[] = await res.json();
  return list.some(s => s.id_usuario === usuarioId);
}

// 1.2 Suscribirse
export async function subscribeToService(servicioId: number, usuarioId: number, token: string): Promise<Suscripcion> {
  const res = await fetch(`${API_URL}/servicios/${servicioId}/suscribirse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
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
export async function unsubscribeFromService(servicioId: number, usuarioId: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/servicios/${servicioId}/desuscribirse`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
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
  const res = await fetch(
    `${API_URL}/usuarios/servicios?id_usuario=${usuarioId}`
  );
  if (!res.ok) throw new Error("Error al obtener servicios suscritos");
  return (await res.json()) as Servicio[];
}
