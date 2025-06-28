const API_URL = import.meta.env.VITE_API_URL;

export const getRecommendationsForUser = async (userId: number): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}/recommend/${userId}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al obtener recomendaciones");
    }
    return await res.json();
  } catch (err) {
    console.error("Error en getRecommendationsForUser:", err);
    throw err;
  }
};
