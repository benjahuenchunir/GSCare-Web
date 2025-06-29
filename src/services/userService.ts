export interface User {
  id: number;
  nombre: string;
  email: string;
  fecha_de_nacimiento: string;
  region_de_residencia: string;
  comuna_de_residencia: string;
  rol: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getUserByEmail(email: string): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/email/${email}`);
  if (res.ok) return await res.json();
  if (res.status === 404) {
    const err: any = new Error("Not Found");
    err.status = 404;
    throw err;
  }
  throw new Error("Error fetching user");
}

export async function createUser(data: {
  nombre: string;
  email: string;
  fecha_de_nacimiento: string;
  region_de_residencia: string;
  comuna_de_residencia: string;
}): Promise<User> {
  console.log("Creando usuario con:", data); // Debugging
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error creating user");
  return await res.json();
}

export async function updateUserProfile(data: User, token: string): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error updating user");
  return await res.json();
}

export async function deleteCurrentUser(token: string, dbUserId: number): Promise<void> {
  const authRes = await fetch(`${API_URL}/auth/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!authRes.ok) {
    throw new Error("Error deleting user from Auth0");
  }

  const dbRes = await fetch(`${API_URL}/usuarios/${dbUserId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!dbRes.ok) {
    throw new Error("Error deleting user from database");
  }
}

export async function deleteUserById(id: number, token: string): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el usuario");
  }
}

export async function getUserById(id: number): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/id/${id}`);
  if (res.ok) return await res.json();
  if (res.status === 404) {
    const err: any = new Error("Not Found");
    err.status = 404;
    throw err;
  }
  throw new Error("Error fetching user by ID");
}