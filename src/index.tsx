import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Routing from "./Routing.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Routing />
	</StrictMode>
);
