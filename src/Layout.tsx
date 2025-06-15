import Navbar from "./common/navbar";
import { Outlet } from "react-router-dom";
import FontSizeToggle from "../src/components/FontSizeToggle";
import PartnerHub from "./components/PartnerHub/PartnerHub";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

export default function Layout() {
  const { isAuthenticated } = useAuth0();
  const { profile } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 pt-12 ">
        <Outlet />
      </main>
      {isAuthenticated && profile?.rol === "socio" && <PartnerHub />}
      <FontSizeToggle />
    </div>
  );
}
