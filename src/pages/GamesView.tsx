import { useEffect, useState } from 'react'
import { getAllGames, Game } from '../firebase/gamesService'

export default function GamesView() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    getAllGames().then(setGames)
  }, [])

  return (
    <main className="flex-1 px-10 py-16 bg-gray-50 min-h-screen">
      <section className="flex flex-col items-center gap-20 bg-gray-50 min-h-screen">
        <h2 className="text-[2em] font-bold text-black w-full text-center">Juegos Disponibles</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-xl shadow-md overflow-hidden border flex flex-col items-center h-full">
<img src={game.image} alt={game.title} className="w-full h-48 object-contain" />
              <div className="p-5 flex flex-col flex-1 w-full text-center">
                <h3 className="text-[1.5em] font-semibold text-gray-800 mb-2">{game.title}</h3>
                <p className="text-[1em] text-gray-600 mb-4">{game.description}</p>
                <div className="mt-auto">
                  <a
                    href={game.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2 bg-[#009982] text-white rounded-lg hover:bg-[#007a66]"
                  >
                    Ir al Juego
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
