import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import Routing from "./Routing.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Routing />
	</StrictMode>
);
