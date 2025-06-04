// src/components/UserPageComponents/QuickNavSection.tsx
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../common/SectionTitle";
import { FaGamepad, FaHandsHelping, FaCalendarAlt, FaShoppingCart } from "react-icons/fa";

export default function QuickNavSection() {
  const navigate = useNavigate();

  const options = [
    {
      label: "Servicios",
      icon: <FaHandsHelping className="text-[2em]" />,
      bg: "bg-[#C8E4E4] border-2 border-[#C8E4E4] hover:bg-[#BBDDDD] hover:border-[#5BAEAE]",
      text: "text-[#2F6060]",
      route: "/servicios",
    },
    {
      label: "Actividades",
      icon: <FaCalendarAlt className="text-[2em]" />,
      bg: "bg-[#eee0ff] border-2 border-[#eee0ff] hover:bg-[#e1d1f4] hover:border-[#b991e7]",
      text: "text-purple-800",
      route: "/actividades",
    },
    {
      label: "Productos",
      icon: <FaShoppingCart className="text-[2em]" />,
      bg: "bg-[#edcabd] border-2 border-[#edcabd] hover:bg-[#f3c9b9] hover:border-[#e5a58b]",
      text: "text-rose-800",
      route: "/productos",
    },
    {
      label: "Juegos",
      icon: <FaGamepad className="text-[2em]" />,
      bg: "bg-[#c6d8f0] border-2 border-[#c6d8f0] hover:bg-[#b0cbee] hover:border-[#5b92da]",
      text: "text-blue-800",
      route: "/games",
    },
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <SectionTitle title="¿Qué quieres hacer hoy?" />
      <div className="grid grid-cols-2 gap-4 flex-1">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => navigate(opt.route)}
            className={`w-full h-full rounded-lg shadow-md flex items-center justify-start gap-4 text-[1.1em] font-semibold transition p-6 ${opt.bg} ${opt.text}`}
            style={{ minHeight: "100px" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-left">
              <div className="mb-1 sm:mb-0">{opt.icon}</div>
              <div className="text-sm sm:text-base break-words">{opt.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
