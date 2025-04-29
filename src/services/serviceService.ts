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

/**
 * Trae todos los beneficios disponibles (catalog).
 */
export async function fetchBeneficios(): Promise<Beneficio[]> {
  const res = await fetch(`${API_URL}/beneficios`);
  if (!res.ok) throw new Error("Error fetching beneficios");
  return res.json();
}

/**
 * Trae servicios, opcionalmente filtrados por nombre y/o beneficios.
 * Se asume que la API acepta `?nombre=` y `?beneficios=1&beneficios=3…`
 */
export async function fetchServicios(params: {
  nombre?: string;
  beneficios?: number[];
}): Promise<Servicio[]> {
  const qs = new URLSearchParams();
  if (params.nombre) qs.append("nombre", params.nombre);
  if (params.beneficios?.length) {
    params.beneficios.forEach((id) => qs.append("beneficios", String(id)));
  }
  const res = await fetch(`${API_URL}/servicios?${qs.toString()}`);
  if (!res.ok) throw new Error("Error fetching servicios");
  return res.json();
}
