import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const isUserSubscribed = async (servicioId: number, userId: number): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/usuarios/usuarios/${userId}/citas`);
    return res.data.some((cita: any) => cita.id_servicio === servicioId);
  } catch (error) {
    console.error("Error verificando suscripción:", error);
    return false;
  }
};

export const createCita = async (userId: number, bloqueHorarioId: number, token: string): Promise<void> => {
  try {
    const res = await axios.post(`${API_URL}/citas`, { 
      id_usuario: userId,
      id_bloque: bloqueHorarioId 
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"}
      }
    );
    console.log("Cita creada exitosamente", res.data);
  } catch (error: any) {
    console.error("Error al agendar cita:", error.response?.data || error.message);
    throw new Error("No se pudo agendar la cita. Intenta nuevamente.");
  }
  return;
};

export const deleteCita = async (userId: number, citaId: number): Promise<void> => {
  axios.delete(`${API_URL}/usuarios/usuarios/${userId}/citas/${citaId}`)
    .then(() => {
      console.log("Cita eliminada exitosamente");
    })
    .catch((error: any) => {
      console.error("Error al cancelar la cita:", error.response?.data || error.message);
      throw new Error("No se pudo cancelar la cita.");
    });
  return;
};

export const getUserSubscriptions = async (userId: number): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_URL}/usuarios/usuarios/${userId}/citas`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener citas del usuario:", error);
    return [];
  }
};

export const getServiciosConCitas = async (userId: number): Promise<any[]> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${userId}/servicios-con-citas`);
    if (!res.ok) throw new Error("Error al obtener servicios con citas");
    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};