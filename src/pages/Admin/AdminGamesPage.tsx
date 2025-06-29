import { useEffect, useState } from "react";
import { getAllGames, addGame, updateGame, deleteGame, Game } from "../../firebase/gamesService";
import { Pencil, Trash, Plus, ExternalLink } from "lucide-react";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [form, setForm] = useState<Omit<Game, "id">>({
    title: "",
    description: "",
    image: "",
    link: "",
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    const data = await getAllGames();
    setGames(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.link) return alert("Completa al menos el título y link");

    if (editingGame) {
      await updateGame(editingGame.id!, form);
    } else {
      await addGame(form);
    }
    setForm({ title: "", description: "", image: "", link: "" });
    setEditingGame(null);
    fetchGames();
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setForm({ title: game.title, description: game.description, image: game.image, link: game.link });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este juego?")) {
      await deleteGame(id);
      fetchGames();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Administración de Juegos</h1>

      {/* Formulario */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-4">
        <h2 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingGame ? "Editar Juego" : "Agregar Nuevo Juego"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="URL de la Imagen"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Link del Juego"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
        </div>
        <div className="flex gap-4 items-center mt-4">
          <button
            onClick={handleSubmit}
            className="bg-[#009982] hover:bg-[#007c6b] text-white px-4 py-2 rounded-md font-semibold shadow-sm"
          >
            {editingGame ? "Guardar Cambios" : "Agregar Juego"}
          </button>
          {editingGame && (
            <button
              onClick={() => {
                setEditingGame(null);
                setForm({ title: "", description: "", image: "", link: "" });
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando juegos...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Título</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Link</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {g.image ? (
                      <img src={g.image} alt={g.title} className="w-24 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">Sin imagen</span>
                    )}
                  </td>
                  <td className="p-3">{g.title}</td>
                  <td className="p-3">{g.description}</td>
                  <td className="p-3">
                    <a href={g.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      Ver juego
                    </a>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(g)} title="Editar" className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(g.id!)} title="Eliminar" className="text-red-600 hover:text-red-800">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {games.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No hay juegos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}