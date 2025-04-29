import { useState } from "react";
import "./styles/App.css";
import "./styles/index.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>

		<h1 className="text-6xl font-bold text-blue-500">Vite + React</h1>
		<button
			onClick={() => setCount((count) => count + 1)}
			className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
			> 
			count is {count}
		</button>

		<p className="read-the-docs">
			Click on the Vite and React logos to learn more
		</p>
	  	</>
	);
}

export default App;
