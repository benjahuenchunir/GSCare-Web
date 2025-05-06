import Navbar from './common/navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-12">
        <Outlet />
      </main>
    </div>
  );
}
