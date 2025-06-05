//src/pages/Usuarios/UserPage.tsx
import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { getUserByEmail, User, updateUserProfile } from "../../services/userService";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

import QuickAccessButton from "../../common/QuickAccessButton";
import SectionTitle from '../../common/SectionTitle';
import EmptyState from '../../common/EmptyState';

import { SubscribedServicesSection } from "../../components/UserPageComponents/SubscribedServicesSection";
import { UpcomingEventsSection }     from "../../components/UserPageComponents/UpcomingEventsSection";
import QuickNavSection from "../../components/UserPageComponents/QuickNavSection";
import RoleSwitcherButton from "../../components/RoleSwitcherButton";

// Iconos SVG
import CalendarIcon from '../../assets/Calendar2.svg?react';
import HeadsetIcon from '../../assets/Support.svg?react';
import UserIcon from '../../assets/Person.svg?react';

// import TokenTestButton from "../../components/TokenTestButton";

export default function UserPage() {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { profile, loading, reloadProfile } = useContext(UserContext);

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

  if (loading) {
    return <p className="text-center mt-10">Cargando perfil…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 px-6 text-center">
        <h1 className="text-[2em] font-bold text-primary mb-4">
          Debes iniciar sesión para ver esta página.
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-accent text-white font-semibold px-6 py-2 rounded hover:bg-accent-dark transition"
        >
          Ir a Página Principal
        </button>
      </div>
    );
  }

  // const handleUpgradeToSocio = async () => {
  //   if (!profile || !user?.email) return;
  //   try {
  //     const token = await getAccessTokenSilently();
  //     await updateUserProfile({ ...profile, rol: "socio" }, token);
  //     await reloadProfile();
  //     const updated = await getUserByEmail(user.email);
  //     setProfile(updated);
  //     alert("Ahora eres socio 🎉");
  //   } catch (err) {
  //     console.error("Error actualizando a socio:", err);
  //     alert("No se pudo cambiar a socio.");
  //   }
  // };

  // const handleDowngradeToGratis = async () => {
  //   if (!profile || !user?.email) return;
  //   try {
  //     const token = await getAccessTokenSilently();
  //     await updateUserProfile({ ...profile, rol: "gratis" }, token);
  //     await reloadProfile();
  //     const updated = await getUserByEmail(user.email);
  //     setProfile(updated);
  //     alert("Ahora eres usuario gratis 👤");
  //   } catch (err) {
  //     console.error("Error actualizando a gratis:", err);
  //     alert("No se pudo cambiar a gratis.");
  //   }
  // };

  const userName = profile?.nombre || "Usuario";
  const rol = profile?.rol || "gratis";

  return (
    <main className="flex-1 pt-10 pb-12 bg-gray-100">
      <div className="w-full px-6 py-8 space-y-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-[2.5em] font-bold text-primary">
            Hola, {userName}!
          </h1>
        </div>

        {/* === SI ES USUARIO GRATIS === */}
        {rol === "gratis" && (
          <>
            {/* Botones rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <QuickAccessButton
                icon={<CalendarIcon className="w-8 h-8 text-primary" />}
                label="Calendario"
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

            {/* QuickNav + Consejos en columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QuickNav reemplaza "Próximos eventos" */}
              <div className="lg:col-span-2 space-y-1">
                <QuickNavSection />
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
            
            <div className="bg-[#fef9e5] rounded-lg shadow p-6 mb-6 border-4 border-yellow-400 mx-auto w-full max-w-xl flex flex-col items-center text-center">
              <h2 className="text-[1.2em] font-bold text-yellow-700 mb-2">
                ¿Quieres acceder a más beneficios?
              </h2>
              <p className="text-gray-700 mb-4 text-[1em] leading-relaxed">
                Forma parte de una comunidad activa de personas mayores que comparten intereses, se apoyan mutuamente y 
                aprovechan todas las funcionalidades que GSCare tiene para ofrecer.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-500 transition"
              >
                Conocer beneficios de Socio
              </button>
            </div>

            
          </>
        )}

        {/* === SI ES USUARIO SOCIO === */}
        {rol === "socio" && (
          <>
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

            {/* Actividades y consejos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Próximos Eventos */}
              <div className="lg:col-span-2 space-y-4">
                <SectionTitle title="Próximos Eventos" />
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
                        <p className="text-[1.1em] font-medium text-gray-900">
                          {c.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Mis servicios activos */}
            <div className="space-y-4">
              <SectionTitle title="Mis servicios activos" />
              <div className="bg-white p-6 rounded-lg shadow">
                <SubscribedServicesSection />
              </div>
            </div>

            {/* Botón de cambio de rol (Socio → Gratis) */}
            <div className="flex justify-center mt-4">
              <RoleSwitcherButton
                profile={profile!}
                targetRole="gratis"
                label="Volver a Gratis"
                className="bg-yellow-400 text-black hover:bg-yellow-600"
              />
            </div>

            {/* Mensaje de agradecimiento */}
            <div className="mt-8 bg-green-50 border border-green-300 mx-auto w-full max-w-xl rounded-lg p-6 text-center">
              <h2 className="text-[1.8em] font-bold text-green-700 mb-4">
                ¡Gracias por ser socio!
              </h2>
              <p className="text-[1em] text-green-800">
                Explora tus <Link to="/servicios" className="underline">Servicios</Link>,{" "}
                <Link to="/actividades" className="underline">Actividades</Link> y revisa tu{" "}
                <Link to="/mi-agenda" className="underline">Agenda</Link>.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}