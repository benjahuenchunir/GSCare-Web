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
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">{newsItem ? "Editar Noticia" : "Crear Noticia"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="modal-input" required />
          <textarea placeholder="Resumen" value={form.resumen} onChange={(e) => setForm({ ...form, resumen: e.target.value })} className="modal-input" rows={3} required />
          <input type="text" placeholder="URL de Imagen (opcional)" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} className="modal-input" />
          <input type="text" placeholder="Link a la noticia" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="modal-input" required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="proveedor" checked={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.checked })} />
            <label htmlFor="proveedor">Es de un proveedor externo</label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#009982] text-white hover:bg-[#007c6b]">{newsItem ? "Guardar Cambios" : "Crear"}</button>
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
    <div className="p-6 max-w-6xl mx-auto font-sans">
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
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Resumen</th>
                <th className="p-3 text-left">Proveedor</th>
                <th className="p-3 text-left">Link</th>
                <th className="p-3 text-left">Acciones</th>
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
