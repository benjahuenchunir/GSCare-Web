const API_URL = import.meta.env.VITE_API_URL;
import { User } from "./userService";
import { Producto } from "../pages/Admin/AdminProductsPage";

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

