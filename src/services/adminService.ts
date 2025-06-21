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
