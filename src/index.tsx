import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routing from "./Routing.tsx";
import "./styles/index.css";
import "./styles/fonts.css"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Routing />
	</StrictMode>
);
