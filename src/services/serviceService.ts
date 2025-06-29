// src/services/serviceService.ts
const API_URL = import.meta.env.VITE_API_URL;

export interface Beneficio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface Servicio {
  id: number;
  id_servicio_base: number; 
  nombre: string;
  descripcion: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  hace_domicilio: boolean;
  comunas_a_las_que_hace_domicilio: string;
  beneficios: Beneficio[];
  dias_disponibles?: string;  // "0,1,2,3"
  hora_inicio?: string;       // "09:00:00"
  hora_termino?: string;      // "19:00:00"
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen?: string;
  id_usuario_creador?: number;
  status?: string;
}

export async function fetchServicios(): Promise<Servicio[]> {
  const res = await fetch(`${API_URL}/servicios`);
  if (!res.ok) throw new Error("Error fetching servicios");
  return await res.json();
}

// Trae sólo los beneficios de un servicio
export async function fetchBeneficiosPorServicio(id: number): Promise<Beneficio[]> {
  const res = await fetch(`${API_URL}/beneficios/servicio/${id}`);
  if (!res.ok) {
    // si no existen aún, devolvemos array vacío
    if (res.status === 404) return [];
    throw new Error("Error fetching beneficios");
  }
  return await res.json();
}

// Para poblar el filtro general de “beneficios”
export async function fetchBeneficios(): Promise<Beneficio[]> {
  const res = await fetch(`${API_URL}/beneficios`);
  if (!res.ok) throw new Error("Error fetching catálogo de beneficios");
  return await res.json();
}

// Obtiene el promedio de calificación de un servicio
export async function fetchPromedioPorServicio(id: number): Promise<{ promedio: number | undefined, total: number }> {
  try {
    const res = await fetch(`${API_URL}/servicios_ratings/servicio/${id}/promedio`);
    if (!res.ok) {
      // Si no hay endpoint de promedio, intentamos contar las reseñas
      const res2 = await fetch(`${API_URL}/servicios_ratings/servicio/${id}`);
      if (!res2.ok) return { promedio: undefined, total: 0 };
      const data2 = await res2.json();
      return { promedio: undefined, total: Array.isArray(data2) ? data2.length : 0 };
    }
    const data = await res.json();
    // Si el backend no da total, lo calculamos
    let total = data.total;
    if (total === undefined) {
      const res2 = await fetch(`${API_URL}/servicios_ratings/servicio/${id}`);
      if (!res2.ok) total = 0;
      else {
        const data2 = await res2.json();
        total = Array.isArray(data2) ? data2.length : 0;
      }
    }
    return {
      promedio: data.promedio !== undefined ? parseFloat(data.promedio) : undefined,
      total
    };
  } catch {
    return { promedio: undefined, total: 0 };
  }
}
