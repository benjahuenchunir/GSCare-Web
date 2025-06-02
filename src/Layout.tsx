import Navbar from './common/navbar';
import { Outlet } from 'react-router-dom';
import FontSizeToggle from '../src/components/FontSizeToggle'; // 👈 nuevo import
import PartnerHub from './components/PartnerHub/PartnerHub';
import { useAuth0 } from '@auth0/auth0-react';
export default function Layout() {
  const { isAuthenticated } = useAuth0();
  const role = "socio";

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 pt-12">
        <Outlet />
      </main>
      {isAuthenticated && role === "socio" && (
        <PartnerHub />
      )}
      <FontSizeToggle />
    </div>
  );
}
