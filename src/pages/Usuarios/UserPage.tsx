import { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import {  PlusCircle, ShoppingCart } from "lucide-react";
import { addTestimonio } from "../../firebase/testimoniosService";
import { Helmet } from "react-helmet-async";

import QuickAccessButton from "../../common/QuickAccessButton";
import SectionTitle from "../../common/SectionTitle";

import RecommendedServices from "../../components/UserPageComponents/RecommendedServices";
import { SubscribedServicesSection } from "../../components/UserPageComponents/SubscribedServicesSection";
import { UpcomingEventsSection } from "../../components/UserPageComponents/UpcomingEventsSection";
import QuickNavSection from "../../components/UserPageComponents/QuickNavSection";
import RoleSwitcherButton from "../../components/RoleSwitcherButton";
import BenefitsCard from "../../components/UserPageComponents/BenefictsCard";
import PartnerHub from "../../components/PartnerHub/PartnerHub";
import MyCreatedActivitiesSection from "../../components/UserPageComponents/MyCreatedActivitiesSection";

// Iconos SVG
import CalendarIcon from '../../assets/Calendar2.svg?react';
import HeadsetIcon from '../../assets/Support.svg?react';
import UserIcon from '../../assets/Person.svg?react';
import { allConsejos } from "../../constants/consejos";
import ProposeServiceCard from "../../common/ProposeServiceCard";

export default function UserPage() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { profile, loading } = useContext(UserContext);
  const [testimonioTexto, setTestimonioTexto] = useState("");
  const [enviado, setEnviado] = useState(false);

  const [modalView, setModalView] = useState<
    "main" | "actividad" | "actividad_recurrente" | "producto" | "servicio" | null
  >(null);

  useEffect(() => {
    if (loading || !profile) return;

    if (profile.rol === 'administrador') {
      navigate('/admin', { replace: true });
    } else if (profile.rol === 'proveedor') {
      navigate('/proveedor', { replace: true });
    }
  }, [profile, loading, navigate]);

  function getDailyConsejos(consejos: { text: string }[], count = 4) {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    // Simple shuffle determinístico basado en la fecha
    let arr = consejos.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed + i * 31) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, count);
  }

  const consejos = getDailyConsejos(allConsejos, 4);

  if (loading || (profile && ['administrador', 'proveedor'].includes(profile.rol))) {
    return <p className="text-center mt-10">Cargando perfil…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 px-6 text-center">
        <h1 className="text-[2em] font-bold text-primary mb-4">Debes iniciar sesión para ver esta página.</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-accent text-white font-semibold px-6 py-2 rounded hover:bg-accent-dark transition"
        >
          Ir a Página Principal
        </button>
      </div>
    );
  }

  const userName = profile?.nombre || "Usuario";
  const rol = profile?.rol || "gratis";

  return (
    <main className="flex-1 pt-10 pb-12 bg-gray-100">
      <Helmet>
        <title>GSCare | Mi Perfil</title>
        <meta
          name="description"
          content="Accede a tu perfil de GSCare. Gestiona tus servicios, actividades, y descubre recomendaciones personalizadas para ti."
        />
      </Helmet>
      <div className="w-full px-6 py-8 space-y-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-[2.5em] font-bold text-primary">Hola, {userName}!</h1>
        </div>

        {/* === GRATIS === */}
        {rol === "gratis" && (
          <>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <QuickAccessButton icon={<CalendarIcon className="w-8 h-8 text-primary" />} label="Calendario" onClick={() => navigate("/mi-agenda")} />
              <QuickAccessButton icon={<HeadsetIcon className="w-8 h-8 text-accent3" />} label="Soporte" onClick={() => navigate("/soporte")} />
              <QuickAccessButton icon={<UserIcon className="w-8 h-8 text-accent2" />} label="Mi perfil" onClick={() => navigate("/edit-profile")} />
            </div>

            {/* Mensaje de promocion socio y proponer servicio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <BenefitsCard onClickCTA={() => navigate("/pricing")} />
              </div>
              <div className="md:col-span-1">
                <ProposeServiceCard />
              </div>
            </div>


            {/* QuickNav + Consejos en columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-1">
                <QuickNavSection />
              </div>
              <div className="lg:col-span-1 space-y-4">
                <SectionTitle title="Consejos para hoy" />
                <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto flex flex-col space-y-3">
                  {consejos.map((c, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                      <p className="text-[1.1em] font-medium text-gray-900">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* === SOCIO === */}
        {rol === "socio" && (
          <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-1">        
                <QuickAccessButton icon={<CalendarIcon className="w-8 h-8 text-primary" />} label="Mi agenda" onClick={() => navigate("/mi-agenda")} />
                <QuickAccessButton icon={<HeadsetIcon className="w-8 h-8 text-accent3" />} label="Soporte" onClick={() => navigate("/soporte")} />
                <QuickAccessButton icon={<UserIcon className="w-8 h-8 text-accent2" />} label="Mi perfil" onClick={() => navigate("/edit-profile")} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <QuickAccessButton
                  icon={<PlusCircle className="w-8 h-8 text-purple-600" />}
                  label="Proponer Actividad"
                  onClick={() => setModalView("actividad")}
                />
                <QuickAccessButton
                  icon={<ShoppingCart className="w-8 h-8 text-orange-500" />}
                  label="Proponer Producto"
                  onClick={() => setModalView("producto")}
                />
              </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <SectionTitle title="Próximos Eventos" />
                <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto space-y-4">
                  <UpcomingEventsSection />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-4">
                <SectionTitle title="Consejos para hoy" />
                <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto flex flex-col space-y-3">
                  {consejos.map((c, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                      <p className="text-[1.1em] font-medium text-gray-900">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle title="Mis servicios activos" />
              <div className="bg-white p-6 rounded-lg shadow">
                <SubscribedServicesSection />
              </div>
            </div>

            {/* Actividades recomendadas (solo socios) */}
            
            <div className="space-y-4">
              {profile && <MyCreatedActivitiesSection userId={profile.id} setView={setModalView} />}
             </div>

            <div className="flex justify-center mt-4">
              <RoleSwitcherButton
                profile={profile!}
                targetRole="gratis"
                label="Cancelar mi suscripción"
                className="bg-yellow-400 text-black hover:bg-yellow-600"
              />
            </div>

            <div className="mt-8 bg-green-50 border border-green-300 mx-auto max-w-xl rounded-lg p-6 text-center space-y-4">
              <h2 className="text-[1.8em] font-bold text-green-700">¡Gracias por ser socio!</h2>
              <p className="text-[1em] text-green-800">
                ¿Te ha gustado la experiencia? Comparte tu testimonio para que otros se animen a unirse.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!testimonioTexto) return;
                  await addTestimonio({
                    nombre: profile?.nombre ?? "Socio",
                    contenido: testimonioTexto,
                    userId: profile?.email ?? "",
                  });
                  setTestimonioTexto("");
                  setEnviado(true);
                }}
                className="space-y-3"
              >
                <textarea
                  className="w-full rounded-lg border p-3 resize-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  placeholder="Escribe tu testimonio aquí..."
                  value={testimonioTexto}
                  onChange={(e) => setTestimonioTexto(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                >
                  Enviar Testimonio
                </button>
              </form>

              {enviado && <p className="text-green-700 font-medium">¡Gracias por tu testimonio! 🎉</p>}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full mx-4 p-6 rounded-2xl shadow-lg">
            <PartnerHub view={modalView} setView={setModalView} inline />
          </div>
        </div>
      )}
    </main>
  );
}