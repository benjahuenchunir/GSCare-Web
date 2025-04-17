import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ServicePage from "./pages/Servicios/servicePage";

export default function Routing() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/servicios/:id" element={<ServicePage />} />
                    </Routes>
            </BrowserRouter>
        </>
    )
}
