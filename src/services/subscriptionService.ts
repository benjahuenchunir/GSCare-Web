import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Verifica si el usuario ya tiene una cita asociada a este servicio
export const isUserSubscribed = async (servicioId: number, userId: number): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/usuarios/usuarios/${userId}/citas`);
    return res.data.some((cita: any) => cita.servicioId === servicioId);
  } catch (error) {
    console.error("Error verificando suscripción:", error);
    return false;
  }
};

// ✅ Crea una cita (el nuevo flujo de suscripción)
export const createCita = async (userId: number, bloqueHorarioId: number): Promise<void> => {
  try {
    await axios.post(`${API_URL}/citas`, {
      id_usuario: userId,
      id_bloque: bloqueHorarioId
    });
  } catch (error: any) {
    console.error("Error al agendar cita:", error.response?.data || error.message);
    throw new Error("No se pudo agendar la cita. Intenta nuevamente.");
  }
};

// ✅ Elimina la suscripción/cita
export const unsubscribeFromService = async (servicioId: number, userId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/usuarios/usuarios/${userId}/servicios/${servicioId}`);
  } catch (error: any) {
    throw new Error("Error al cancelar la suscripción.");
  }
};

// (opcional) ✅ Obtener todas las citas de un usuario
export const getUserSubscriptions = async (userId: number): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_URL}/usuarios/${userId}/citas`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener citas del usuario:", error);
    return [];
  }
};
