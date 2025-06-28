// src/pages/PricingPage.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useContext } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../services/userService";
import { UserContext } from "../../context/UserContext";
import { getTestimoniosAprobados, Testimonio } from "../../firebase/testimoniosService";
import { getAllPlans, PlanData } from "../../firebase/plansService";
import TestimoniosCarousel from "../../components/TestimoniosCarousel";

export default function PricingPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const { profile, reloadProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [plans, setPlans] = useState<PlanData[]>([]);

  useEffect(() => {
    getTestimoniosAprobados().then(setTestimonios);
    getAllPlans().then(setPlans);
  }, []);

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

  return (
    <main className="bg-[#f3f4f6] flex flex-col items-center py-16 bg-gray-50 font-sans">
      <h1 className="text-[2em] font-bold text-primary mb-8">Mejora tu plan</h1>

      {/* Carrusel de testimonios */}
      <TestimoniosCarousel testimonios={testimonios} />

      {/* Sección de planes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-screen-xl px-20 w-full">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col justify-between h-full bg-white rounded-xl shadow-md border-4 ${
              plan.id === "socio" ? "border-[#009982]" : "border-gray-300"
            }`}
          >
            {/* Encabezado */}
            <div
              className={`p-6 rounded-t-lg text-center ${
                plan.id === "socio" ? "bg-[#009982] text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <h2 className="text-[1.8em] font-semibold">{plan.title}</h2>
              <p className="mt-2 text-[1.5em]">
                <span className="font-bold">{plan.price}</span> {plan.currency}
              </p>
            </div>

            {/* Características */}
            <ul className="p-6 space-y-4 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <FaLock className={`mt-1 ${plan.id === "socio" ? "text-[#009982]" : "text-gray-500"}`} />
                  <span className="text-[1.05em] text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="p-6 text-center">
              {profile?.rol !== "administrador" && profile?.rol !== "proveedor" && (
                <>
                  {plan.id === "socio" ? (
                    <button
                      onClick={handleSocioClick}
                      className="inline-block w-full text-[1.1em] font-semibold py-3 rounded-lg transition bg-[#009982] text-white hover:bg-[#007e6e]"
                    >
                      Hacerse Socio
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/user")}
                      className="inline-block w-full text-[1.1em] font-semibold py-3 rounded-lg transition bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                      Seguir Gratis
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
