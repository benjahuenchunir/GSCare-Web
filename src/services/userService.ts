
export interface User {
  id: number;
  nombre: string;
  email: string;
  fecha_de_nacimiento: string;
  region_de_residencia: string;
  comuna_de_residencia: string;
  direccion_particular: string;
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
  direccion_particular: string;
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

export async function updateUserProfile(data: User): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error updating user");
  return await res.json();
}
