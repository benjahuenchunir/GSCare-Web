export interface News {
  id: number;
  nombre: string;
  resumen: string;
  proveedor: boolean;
  imagen?: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsCreation = Omit<News, "id" | "createdAt" | "updatedAt">;

const API_URL = `${import.meta.env.VITE_API_URL}/noticias`;

// Obtener todas las noticias
export const getAllNews = async (): Promise<News[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener las noticias");
  }
  return response.json();
};

// Crear una noticia (requiere token)
export const createNews = async (news: NewsCreation, token: string): Promise<News> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(news),
  });
  if (!response.ok) {
    throw new Error("Error al crear la noticia");
  }
  return response.json();
};

// Actualizar una noticia (requiere token)
export const updateNews = async (id: number, news: Partial<NewsCreation>, token: string): Promise<News> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(news),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar la noticia");
  }
  return response.json();
};

// Eliminar una noticia (requiere token)
export const deleteNews = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la noticia");
  }
};
