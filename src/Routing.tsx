import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout"; // nuevo
import App from "./App";
import ServicePage from "./pages/Servicios/servicePage";

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/servicios/:id" element={<ServicePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
