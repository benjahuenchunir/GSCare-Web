import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import UserPage from "./pages/UserPage";

export default function Routing() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/user" element={<UserPage />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
