import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex items-center justify-between px-8 py-4 bg-white shadow-md">
      {/* Lado izquierdo: Logo + Nombre de la marca */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="text-2xl font-semibold text-gray-800">GSCare</span>
      </div>

      {/* Lado derecho: Enlaces + Botón */}
      <div className="flex items-center space-x-8">
        <a href="servicios" className="text-gray-700 hover:text-gray-1000 text-lg">
          Servicios
        </a>
        <a href="productos" className="text-gray-700 hover:text-gray-1000 text-lg">
          Productos
        </a>
        <a href="nosotros" className="text-gray-700 hover:text-gray-1000 text-lg">
          Nosotros
        </a>
        <a href="testimonios" className="text-gray-700 hover:text-gray-1000 text-lg">
          Testimonios
        </a>
        <button
          className="bg-[#009982] text-white font-bold px-5 py-2 rounded-md hover:bg-[#007f6d] transition duration-300"
        >
          Regístrate
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
