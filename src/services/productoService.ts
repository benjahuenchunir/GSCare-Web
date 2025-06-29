import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function registrarVisitaProducto(id: number) {
  try {
    await axios.patch(`${API_URL}/productos/visitar/${id}`);
  } catch (error) {
    console.error("Error al registrar la visita del producto:", error);
    // No lanzamos un error para no interrumpir la navegación del usuario
  }
}
