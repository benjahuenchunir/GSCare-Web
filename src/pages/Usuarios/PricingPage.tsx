// src/pages/PricingPage.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useContext , JSX } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../services/userService";
import { UserContext } from "../../context/UserContext";

interface Plan {
  name: string;
  price: string;
  currency: string;
  features: (string | JSX.Element)[];
  featured: boolean;
}

export default function PricingPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const { profile, reloadProfile } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSocioClick = async () => {
    if (!user?.email || !profile) return;
    try {
      const token = await getAccessTokenSilently();
      await updateUserProfile({ ...profile, rol: "socio" }, token);
      await reloadProfile();
      const confirmed = window.confirm("🎉 ¡Te has convertido en socio!\n\nPresiona OK para volver a tu perfil.");
      if (confirmed) navigate("/user");
    } catch (err) {
      console.error("Error al cambiar a socio:", err);
      alert("Ocurrió un error. Intenta nuevamente.");
    }
  };

  const plans: Plan[] = [
    {
      name: "Gratis",
      price: "0",
      currency: "CLP/mes",
      features: [
        "Explorar servicios, actividades y productos",
        "Acceso a juegos públicos",
        "Lectura de consejos y artículos generales",
        "Editar perfil y datos personales"
      ],
      featured: false
    },
    {
      name: "Socio",
      price: "14.990",
      currency: "CLP/mes",
      features: [
        "Todo lo que incluye el plan Gratis",
        <span key="movil"><strong>Acceso a la aplicación móvil</strong></span>,
        "Suscribirte a servicios profesionales",
        "Agendar y crear actividades",
        "Proponer productos para la comunidad",
        "Acceso a foros y actividades privadas",
        "Agenda personal con tus próximos eventos",
        "Recomendaciones personalizadas de servicios y actividades",
        "Recordatorios de tus próximos eventos",
        "Acceso rápido a tus suscripciones",
        "Y mucho más…"
      ],
      featured: true
    }
  ];

  return (
    <main className="bg-[#f3f4f6] flex flex-col items-center py-16 bg-gray-50">
      <h1 className="text-[1.5em] font-bold text-primary mb-8">Mejora tu plan</h1>
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-lg px-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex-1 bg-white rounded-xl shadow-md border-4 ${
              plan.featured ? "border-yellow-400" : "border-gray-300"
            }`}
          >
            {/* Encabezado */}
            <div
              className={`p-6 rounded-t-lg text-center ${
                plan.featured
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <h2 className="text-[1.8em] font-semibold">{plan.name}</h2>
              <p className="mt-2 text-[1.5em]">
                <span className="font-bold">{plan.price}</span> {plan.currency}
              </p>
            </div>

            {/* Características */}
            <ul className="p-6 space-y-4">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <FaLock className={`mt-1 ${plan.featured ? "text-yellow-500" : "text-gray-500"}`} />
                  <span className="text-[1.05em] text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="p-6 text-center">
              {plan.featured ? (
                <button
                  onClick={handleSocioClick}
                  className="inline-block w-full text-[1.1em] font-semibold py-3 rounded transition bg-yellow-500 text-black hover:bg-yellow-600"
                >
                  Hacerse Socio
                </button>
              ) : (
                <button
                  onClick={() => navigate("/user")}
                  className="inline-block w-full text-[1.1em] font-semibold py-3 rounded transition bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Seguir Gratis
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
