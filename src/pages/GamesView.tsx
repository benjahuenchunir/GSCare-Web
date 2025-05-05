import Puzzles from "../assets/imgs/puzzles.jpg";

const games = [
	{
		title: "Rompecabezas Clásico",
		description: "Ejercita tu mente con este rompecabezas en línea.",
		image: Puzzles,
		link: "https://www.jigsawplanet.com/",
	}
];

export default function GamesView() {
	return (
		<section className="flex flex-col items-center justify-center gap-20 bg-gray-50 min-h-screen">
			<h2 className="text-[3rem] font-bold text-[#006881] w-full text-center m-0">Juegos Disponibles</h2>
			<div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
				{games.map((game, index) => (
					<div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border flex flex-col items-center">
						<img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
						<div className="p-5 text-center">
							<h3 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h3>
							<p className="text-sm text-gray-600 mb-4">{game.description}</p>
							<a
								href={game.link}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
							>
								Ir al Juego
							</a>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
