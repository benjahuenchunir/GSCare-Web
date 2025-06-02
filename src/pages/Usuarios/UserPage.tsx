import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { getUserByEmail, User, updateUserProfile } from "../../services/userService";

import { SubscribedServicesSection } from "../../components/UserPageComponents/SubscribedServicesSection";
//import { UpcomingActivitiesSection } from "../../components/UserPageComponents/UpcomingActivitiesSection";
import { UpcomingEventsSection }     from "../../components/UserPageComponents/UpcomingEventsSection";
import QuickAccessButton from "../../common/QuickAccessButton";
import SectionTitle from '../../common/SectionTitle';
import EmptyState from '../../common/EmptyState';

// Iconos SVG
import CalendarIcon from '../../assets/Calendar2.svg?react';
import HeadsetIcon from '../../assets/Support.svg?react';
import UserIcon from '../../assets/Person.svg?react';

import TokenTestButton from "../../components/TokenTestButton";


const UserPage: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(isAuthenticated);

  const consejos = [
    { text: 'Bebe agua cada 2 horas para mantenerte hidratado 💧' },
    { text: 'Camina al menos 20 minutos hoy para mantener tu salud activa 🚶‍♂️' },
    { text: 'Comparte una llamada con un ser querido para fortalecer tus lazos 📞' },
    { text: 'Recuerda tomar tus medicamentos a tiempo 💊' },
    { text: 'Dedica tiempo a tus pasatiempos favoritos para relajarte 🎨' },
    { text: 'Haz una lista de cosas que te hacen feliz y revísala hoy 😊' },
    { text: 'Practica la gratitud escribiendo 3 cosas por las que estás agradecido 🙏' },
    { text: 'Escucha música que te haga sentir bien y disfruta del momento 🎶' }
  ];

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      getUserByEmail(user.email)
        .then(existing => setProfile(existing))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  const handleUpgradeToSocio = async () => {
    if (!profile || !user?.email) return;
    try {
      const token = await getAccessTokenSilently();
      await updateUserProfile({ ...profile, rol: "socio" }, token);
      const updated = await getUserByEmail(user.email);
      setProfile(updated);
      alert("Ahora eres socio 🎉");
    } catch (err) {
      console.error("Error actualizando a socio:", err);
      alert("No se pudo cambiar a socio.");
    }
  };

  const handleDowngradeToGratis = async () => {
    if (!profile || !user?.email) return;
    try {
      const token = await getAccessTokenSilently();
      await updateUserProfile({ ...profile, rol: "gratis" }, token);
      const updated = await getUserByEmail(user.email);
      setProfile(updated);
      alert("Ahora eres usuario gratis 👤");
    } catch (err) {
      console.error("Error actualizando a gratis:", err);
      alert("No se pudo cambiar a gratis.");
    }
  };


  if (loading) return <p className="text-center mt-10">Cargando perfil…</p>;

  const userName = profile?.nombre || "Usuario";

  return (
    <main className="flex-1 pt-10">
      <div className="min-h-screen bg-gray-100">
        <div className="w-full px-6 py-8 space-y-8">
          <div className="flex justify-center mb-6">
            <h1 className="text-[2.5em] font-bold text-primary">Hola, {userName}!</h1>
          </div>

          {/* Botones rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <QuickAccessButton
              icon={<CalendarIcon className="w-8 h-8 text-primary" />}
              label="Mi agenda"
              onClick={() => navigate("/mi-agenda")}
            />
            <QuickAccessButton
              icon={<HeadsetIcon className="w-8 h-8 text-accent3" />}
              label="Soporte"
            />
            <QuickAccessButton
              icon={<UserIcon className="w-8 h-8 text-accent2" />}
              label="Mi perfil"
              onClick={() => navigate("/edit-profile")}
            />
          </div>


          {/* Actividades y Consejos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w">
            <div className="lg:col-span-2 space-y-4">
              <SectionTitle title="Siguientes Eventos" />
              {/* <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto space-y-4">
                <UpcomingActivitiesSection />
              </div> */}
              <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto space-y-4">
                <UpcomingEventsSection />
              </div>
            </div>

            {/* Consejos para hoy */}
            <div className="lg:col-span-1 space-y-4">
              <SectionTitle title="Consejos para hoy" />
              <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto flex flex-col justify-start space-y-3">
                {consejos.length === 0 ? (
                  <EmptyState mensaje="No hay consejos por el momento." />
                ) : (
                  consejos.map((c, i) => (
                    <div
                      key={i}
                      className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3"
                    >
                      <p className="text-[1.1em] font-medium text-gray-900">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Servicios activos */}
          <div className="space-y-4">
            <SectionTitle title="Mis servicios activos" />
            <div className="bg-white p-6 rounded-lg shadow">
              <SubscribedServicesSection />
            </div>
          </div>

          <TokenTestButton />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handleUpgradeToSocio}
              className="bg-accent text-black font-semibold px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-600 transition"
            >
              Cambiar a Socio (test)
            </button>

            <button
              onClick={handleDowngradeToGratis}
              className="bg-accent text-black font-semibold px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-600 transition"
            >
              Cambiar a Gratis (test)
            </button>
          </div>

          {profile?.rol === "gratis" && (
            <p className="text-yellow-700 font-medium">
              Eres usuario gratis.
            </p>
          )}

          {profile?.rol === "socio" && (
            <p className="text-green-700 font-medium">
              Eres socio!
            </p>
          )}


        </div>
      </div>
    </main>
  );
};

export default UserPage;
