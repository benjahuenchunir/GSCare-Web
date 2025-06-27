import { useEffect, useState } from "react";
import { getAllNews, News } from "../../services/newsService";
import { ExternalLink } from "lucide-react";

export default function NewsListPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Cargando noticias...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Últimas Noticias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img
              src={item.imagen || "https://via.placeholder.com/400x200.png?text=Noticia"}
              alt={item.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-bold mb-2">{item.nombre}</h2>
              <p className="text-gray-700 mb-4 flex-grow">{item.resumen}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 self-start px-4 py-2 bg-[#009982] text-white rounded-md hover:bg-[#007c6b] transition-colors"
              >
                Leer más <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
      {news.length === 0 && !loading && (
        <p className="text-center text-gray-500">No hay noticias disponibles en este momento.</p>
      )}
    </div>
  );
}
