const API_URL = import.meta.env.VITE_API_URL;

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string; // Ahora es string
  fecha: string;
  lugar: string;
}

export async function fetchActividades(): Promise<Actividad[]> {
  const res = await fetch(`${API_URL}/actividades`);
  if (!res.ok) throw new Error("Error al obtener las actividades");
  return await res.json();
}
