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
  nombre: string;
  descripcion: string;
  categoria: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  hace_domicilio: boolean;
  comunas_a_las_que_hace_domicilio: string;
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen?: string;
  beneficios: Beneficio[];
}

export async function fetchServicios(): Promise<Servicio[]> {
  const res = await fetch(`${API_URL}/servicios`);
  if (!res.ok) throw new Error("Error fetching servicios");
  return await res.json();
}

// Nuevo: trae sólo los beneficios de un servicio
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
