import Puzzles from "../assets/imgs/puzzles.jpg";
import TarkusImage from "../assets/imgs/tarkus.jpg";
import WordSearchImage from "../assets/imgs/wordsearch.jpg";

const games = [
  {
    title: "Rompecabezas Clásico",
    description: "Ejercita tu mente con este rompecabezas en línea.",
    image: Puzzles,
    link: "https://www.jigsawplanet.com/",
  },
  {
    title: "Crucigramas y Pasatiempos - Tarkus",
    description: "Disfruta de crucigramas, autodefinidos y otros pasatiempos para ejercitar tu mente.",
    image: TarkusImage,
    link: "https://www.tarkus.info/",
  },
  {
    title: "Sopa de Letras - Razzle Puzzles",
    description: "Encuentra las palabras ocultas en la cuadrícula y mejora tu vocabulario mientras te diviertes.",
    image: WordSearchImage,
    link: "https://api.razzlepuzzles.com/wordsearch?locale=es",
  },
];

export default function GamesView() {
  return (
    <main className="flex-1  px-10 py-16 bg-gray-50 min-h-screen">
    <section className="flex flex-col items-center justify-center gap-20 bg-gray-50 min-h-screen">
      <h2 className="text-[2em] font-bold text-[#006881] w-full text-center m-0">Juegos Disponibles</h2>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
        {games.map((game, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden border flex flex-col items-center h-full"
          >
            <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
            <div className="p-5 flex flex-col flex-1 w-full text-center">
              <h3 className="text-[1.5em] font-semibold leading-snug text-gray-800 mb-2">{game.title}</h3>
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
  /</main>
  );

}
