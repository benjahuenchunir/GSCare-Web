const API_URL = import.meta.env.VITE_API_URL;
import { User } from "./userService";
import { Producto } from "../pages/Admin/AdminProductsPage";
import type { Actividad } from "../pages/Admin/AdminActividadesPage";

export async function getAllUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return res.json();
}

export async function getAdminCount(resource: "usuarios" | "servicios" | "actividades" | "productos", token: string): Promise<number> {
  const res = await fetch(`${API_URL}/admin/${resource}/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener conteo de ${resource}`);
  }

  return res.json(); // devuelve un número
}

export async function getRecentUsers(token: string, limit = 5): Promise<User[]> {
  const res = await fetch(`${API_URL}/admin/usuarios?page=1&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener usuarios recientes");
  }

  const data = await res.json();
  return data.usuarios; // es un array de usuarios
}

export async function getRecentActivities(token: string, limit = 5): Promise<any[]> {
  const res = await fetch(`${API_URL}/admin/actividades?page=1&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener actividades recientes");
  }

  const data = await res.json();
  return data.actividades;
}

export async function getAllAdminUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/admin/usuarios?page=1&limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");

  const data = await res.json();
  return data.usuarios;
}

export async function getPaginatedAdminProductos(token: string, page = 1, limit = 10) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/productos?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener productos");

  return await res.json(); // { productos, total, page, limit }
}

export async function deleteProductoById(id: number, token: string): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el producto");
  }
}

export async function updateProductoById(producto: Producto, token: string) {
  const { id, createdAt, ...safeData } = producto; // Evitamos enviar campos no modificables

  const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(safeData),
  });

  if (!res.ok) throw new Error("Error al actualizar producto");

  return await res.json();
}

export async function aprobarProducto(id: number, token: string) {
  const res = await fetch(`${API_URL}/productos/${id}/aprobar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo aprobar el producto");
}

export async function rechazarProducto(id: number, token: string) {
  const res = await fetch(`${API_URL}/productos/${id}/rechazar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo rechazar el producto");
}

export async function getAdminActividades({ page = 1, limit = 10, token}: { page?: number, limit?: number, token?: string }) {
  const res = await fetch(`${API_URL}/admin/actividades?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar actividades");
  return await res.json(); // { total, page, limit, actividades: [] }
}

export async function deleteActividadById(id: number, token: string) {
  const res = await fetch(`${API_URL}/actividades/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo eliminar la actividad");
}

export const deleteActividadSerieByBaseId = async (idBase: number, token: string) => {
  const res = await fetch(`${API_URL}/actividades/base/${idBase}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo eliminar la serie de actividades.");
  }
};

export async function getAdminServicios({ page = 1, limit = 10, token}: { page?: number, limit?: number, token?: string }) {
  const res = await fetch(`${API_URL}/admin/servicios?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al cargar servicios");
  return await res.json();
}

export async function aprobarServicio(id: number, token: string) {
  const res = await fetch(`${API_URL}/servicios/${id}/aprobar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo aprobar el servicio");
}

export async function rechazarServicio(id: number, token: string) {
  const res = await fetch(`${API_URL}/servicios/${id}/rechazar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo rechazar el servicio");
}

export async function getAsistentesByActividadId(id: number, token: string) {
  const res = await fetch(`${API_URL}/asistentes/actividad/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

export async function deleteAsistencia({ actividadId, userId, token }: { actividadId: number, userId: number , token: string }) {
  return await fetch(`${API_URL}/asistentes/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
     },
    body: JSON.stringify({
      id_evento_a_asistir: actividadId,
      id_usuario_asistente: userId
    })
  });
}

export async function updateActividadSerie(idBase: number, updates: Partial<Actividad>, token: string) {
  // Obtener todas las actividades
  const res = await fetch(`${API_URL}/admin/actividades?page=1&limit=1000`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("No se pudieron obtener actividades");

  const data = await res.json();

  const actividadesDeLaSerie = data.actividades.filter(
    (a: any) => a.id === idBase || a.id_actividad_base === idBase
  );

  const patchableUpdates = { ...updates };
  delete patchableUpdates.id;
  delete patchableUpdates.status;
  delete patchableUpdates.id_actividad_base;

  // Aplicar PATCH a cada actividad individualmente
  await Promise.all(
    actividadesDeLaSerie.map((act: Actividad) =>
      fetch(`${API_URL}/actividades/${act.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patchableUpdates)
      })
    )
  );
}

export async function aprobarActividad(id: number, token: string) {
  const res = await fetch(`${API_URL}/actividades/${id}/aprobar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo aprobar la actividad");
  }
}

export async function rechazarActividad(id: number, token: string) {
  const res = await fetch(`${API_URL}/actividades/${id}/rechazar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo rechazar la actividad");
  }
}

export async function getCitasParaProveedor(proveedorId: number, token: string) {
  const res = await fetch(`${API_URL}/proveedores/${proveedorId}/citas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Error al obtener las citas del proveedor" }));
    throw new Error(errorData.message);
  }
  return await res.json();
}


export async function actividadTieneAsistenteConEmail(
  actividadId: number,
  email: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/asistentes/actividad/${actividadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn(`Error al consultar asistentes para actividad ${actividadId}:`, res.status);
      return false;
    }

    const data = await res.json();
    return data.some((a: any) => a.Usuario?.email?.toLowerCase() === email.toLowerCase());
  } catch (err) {
    console.error(`Error al buscar asistentes en actividad ${actividadId}:`, err);
    return false;
  }
}

// Actualizar un servicio
export const updateServicio = async (id: number, data: any, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar servicio");
  return res.json();
};

// --- Beneficios ---
export const getBeneficios = async (token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener beneficios");
  return res.json();
};

export const createBeneficio = async (data: { nombre: string; descripcion: string }, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear beneficio");
  return res.json();
};

export const deleteBeneficio = async (id: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar beneficio");
};

export const getBeneficiosForServicio = async (servicioId: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios/servicio/${servicioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener beneficios del servicio");
  return res.json();
};

export const addBeneficioToServicio = async (id_servicio: number, id_beneficio: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios/asociar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id_servicio, id_beneficio }),
  });
  if (!res.ok) throw new Error("Error al asociar beneficio");
  return res.json();
};

export const removeBeneficioFromServicio = async (id_servicio: number, id_beneficio: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios/desasociar`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id_servicio, id_beneficio }),
  });
  if (!res.ok) throw new Error("Error al desasociar beneficio");
};

// --- Bloques y Reseñas ---
export const getBloquesForServicio = async (servicioId: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${servicioId}/bloques`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener bloques");

  const data = await res.json();

  // Adaptar a lo que espera el frontend
  return data.map((b: any) => {
    const [fecha, hora_inicio] = b.start.split("T");
    const [, hora_termino] = b.end.split("T");

    return {
      id: b.id,
      fecha,
      hora_inicio,
      hora_termino,
      disponibilidad: b.extendedProps?.disponible ?? true,
      citas: [] // las agregas luego por separado si es necesario
    };
  });
};



export const getResenasForServicio = async (servicioId: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${servicioId}/resenas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener reseñas");
  return res.json();
};

// --- Gestión de Usuarios (por ID) ---
export async function getUserById(userId: number, token: string): Promise<{ id_usuario: number; email: string; [key: string]: any }> {
  const res = await fetch(`${API_URL}/usuarios/id/${userId}`, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Error al obtener usuario con id ${userId}`);
  return res.json();
}

// --- Gestión de Bloques Horarios ---
export const createBloque = async (servicioId: number, data: { fecha: string; hora_inicio: string; hora_termino: string }, token: string) => {
  const normalizeHora = (h: string) => h.length === 5 ? h + ":00" : h;

  const payload = {
    ...data,
    hora_inicio: normalizeHora(data.hora_inicio),
    hora_termino: normalizeHora(data.hora_termino),
  };

  const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${servicioId}/bloques`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({} as any));
    const message = errorData.error || errorData.message || "Error al crear el bloque horario";
    throw new Error(message);
  }

  return res.json();
};

export const updateBloque = async (servicioId: number, bloqueId: number, data: { fecha?: string; hora_inicio?: string; hora_termino?: string }, token: string) => {
  const normalizeHora = (h?: string) =>
    h && h.length === 5 ? h + ":00" : h;

  const payload = {
    ...data,
    hora_inicio: normalizeHora(data.hora_inicio),
    hora_termino: normalizeHora(data.hora_termino),
  };

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/servicios/${servicioId}/bloques/${bloqueId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({} as any));
    const message = errorData.error || errorData.message || "Error al crear el bloque horario";
    throw new Error(message);
  }
  return res.json();
};

export const deleteBloque = async (servicioId: number, bloqueId: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${servicioId}/bloques/${bloqueId}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar el bloque horario");
};

export const getCitaByBloque = async (bloqueId: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/citas/bloque/${bloqueId}`, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener cita por bloque");
  return (res.json());
};

// --- Gestión de Citas (desde Admin) ---
export const deleteCitaById = async (citaId: number, token: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/citas/${citaId}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar la cita");
};
