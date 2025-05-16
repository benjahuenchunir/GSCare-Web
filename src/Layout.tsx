import Navbar from './common/navbar';
import { Outlet } from 'react-router-dom';
import FontSizeToggle from '../src/components/FontSizeToggle'; // 👈 nuevo import

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 pt-12">
        <Outlet />
      </main>
      <FontSizeToggle /> {/* 👈 Aquí se renderiza el botón flotante */}
    </div>
  );
}
