import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllNews, createNews, updateNews, deleteNews, News, NewsCreation } from "../../services/newsService";
import { Pencil, Trash, Plus, ExternalLink } from "lucide-react";

const NewsModal = ({
  isOpen,
  onClose,
  onSubmit,
  newsItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewsCreation) => void;
  newsItem: News | null;
}) => {
  const [form, setForm] = useState<NewsCreation>({
    nombre: "",
    resumen: "",
    proveedor: false,
    imagen: "",
    link: "",
  });

  useEffect(() => {
    if (newsItem) {
      setForm({
        nombre: newsItem.nombre,
        resumen: newsItem.resumen,
        proveedor: newsItem.proveedor,
        imagen: newsItem.imagen || "",
        link: newsItem.link,
      });
    } else {
      setForm({ nombre: "", resumen: "", proveedor: false, imagen: "", link: "" });
    }
  }, [newsItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{newsItem ? "Editar Noticia" : "Crear Noticia"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" placeholder="Título de la noticia" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
            <textarea placeholder="Un breve resumen de la noticia" value={form.resumen} onChange={(e) => setForm({ ...form, resumen: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none" rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (opcional)</label>
            <input type="text" placeholder="https://ejemplo.com/imagen.png" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link a la noticia</label>
            <input type="text" placeholder="https://ejemplo.com/noticia-completa" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none" required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="proveedor" checked={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#009982] focus:ring-[#009982]" />
            <label htmlFor="proveedor" className="text-sm text-gray-700">Es de un proveedor externo</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#009982] text-white hover:bg-[#007c6b] font-semibold text-sm transition">{newsItem ? "Guardar Cambios" : "Crear Noticia"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las noticias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleModalSubmit = async (data: NewsCreation) => {
    try {
      const token = await getAccessTokenSilently();
      if (editingNews) {
        await updateNews(editingNews.id, data, token);
      } else {
        await createNews(data, token);
      }
      setIsModalOpen(false);
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la noticia.");
    }
  };

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      try {
        const token = await getAccessTokenSilently();
        await deleteNews(id, token);
        fetchNews();
      } catch (error) {
        console.error(error);
        alert("Error al eliminar la noticia.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Administración de Noticias</h1>
        <button onClick={() => { setEditingNews(null); setIsModalOpen(true); }} className="bg-[#009982] hover:bg-[#007c6b] text-white px-4 py-2 rounded-md font-semibold shadow-sm flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Noticia
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Resumen</th>
                <th className="p-3">Proveedor</th>
                <th className="p-3">Link</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold">{item.nombre}</td>
                  <td className="p-3 max-w-sm truncate">{item.resumen}</td>
                  <td className="p-3">{item.proveedor ? "Sí" : "No"}</td>
                  <td className="p-3">
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> Ver
                    </a>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(item)} title="Editar" className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} title="Eliminar" className="text-red-600 hover:text-red-800"><Trash className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">No hay noticias para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        newsItem={editingNews}
      />
    </div>
  );
}
