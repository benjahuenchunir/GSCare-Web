import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Slider from "react-slick";

import ServicioInfoCard from "./ServicioInfoCard";
import ReviewCard from "./ReviewCard";
import BeneficiosBox from "./BeneficiosBox";
import DisponibilidadBox from "./DisponibilidadBox";
import AgendarBox from "./AgendarBox";
import ModalSelectorDeBloque from "../../components/Servicios/ModalSelectorDeBloque";
import ModalConfirmarCita from "../../components/Servicios/ModalConfirmarCita";
import ModalCancelarCita from "../../components/Servicios/ModalCancelarCita";
import ExclusiveSubscriptionCard from "../../components/ExclusiveSubscriptionCard";

import { createCita, getUserSubscriptions, deleteCita } from "../../services/subscriptionService";
import { BloqueHorario } from "../../components/Servicios/SelectorDeBloque";
import { Review } from "./types";
import { UserContext } from "../../context/UserContext";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen: string;
  dias_disponibles: number[];
  hora_inicio: string;
  hora_termino: string;
}

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { profile, reloadProfile, loading: loadingProfile } = useContext(UserContext);

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [bloques, setBloques] = useState<BloqueHorario[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<BloqueHorario | null>(null);
  const [citasDelServicio, setCitasDelServicio] = useState<{ id: number; bloque: BloqueHorario }[]>([]);
  const [loadingSub, setLoadingSub] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSelectBloqueModal, setShowSelectBloqueModal] = useState(false);
  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);

  const isSubscribed = citasDelServicio.length > 0;

  console.log(bloques, showRepeatModal)
  useEffect(() => {
    if (isAuthenticated) reloadProfile();
  }, [isAuthenticated, reloadProfile]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}`)
      .then(res => setServicio(res.data))
      .catch(console.error);

    axios.get(`${import.meta.env.VITE_API_URL}/servicios_ratings/servicio/${id}`)
      .then(res => setReviews(res.data))
      .catch(() => {});

    axios.get(`${import.meta.env.VITE_API_URL}/beneficios/servicio/${id}`)
      .then(res => setBeneficios(res.data))
      .catch(() => {});

    axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}/bloques`)
      .then(res => {
        const parsed = res.data.map((b: any) => {
          const start = new Date(b.start);
          const end = new Date(b.end);
          const dia = start.toLocaleDateString("es-ES", { weekday: "long" });
          return {
            id: b.id,
            dia: dia.charAt(0).toUpperCase() + dia.slice(1),
            inicio: start.toTimeString().slice(0, 5),
            fin: end.toTimeString().slice(0, 5),
            disponible: b.extendedProps?.disponible ?? true
          };
        });
        setBloques(parsed);
      });
  }, [id]);

  useEffect(() => {
    if (!id || !profile?.id || loadingProfile) return;
    getUserSubscriptions(profile.id)
      .then(citas => {
        const citasServicio = citas.filter((c: any) => c.id_servicio === Number(id));
        const parsed = citasServicio.map((c: any) => {
          const start = new Date(c.start);
          const end = new Date(c.end);
          const dia = start.toLocaleDateString("es-ES", { weekday: "long" });
          return {
            id: c.id,
            bloque: {
              id: c.id_bloque,
              dia: dia.charAt(0).toUpperCase() + dia.slice(1),
              inicio: start.toTimeString().slice(0, 5),
              fin: end.toTimeString().slice(0, 5),
              disponible: c.extendedProps?.disponible ?? true
            }
          };
        });
        setCitasDelServicio(parsed);
      })
      .catch(console.error)
      .finally(() => setLoadingSub(false));
  }, [id, profile, loadingProfile]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({ appState: { returnTo: `/servicios/${id}` } });
      return;
    }
    setShowSelectBloqueModal(true);
  };

  const handleConfirmSubscribe = async () => {
    if (!profile?.id || !bloqueSeleccionado) return;
    setLoadingSub(true);

    const tempId = Date.now();
    const newCita = { id: tempId, bloque: bloqueSeleccionado };
    setCitasDelServicio(prev => [...prev, newCita]);
    setShowSubscribeConfirm(false);

    try {
      await createCita(profile.id, bloqueSeleccionado.id);
      const citas = await getUserSubscriptions(profile.id);
      const citasServicio = citas.filter((c: any) => c.id_servicio === Number(id));
      const parsed = citasServicio.map((c: any) => {
        const start = new Date(c.start);
        const end = new Date(c.end);
        const dia = start.toLocaleDateString("es-ES", { weekday: "long" });
        return {
          id: c.id,
          bloque: {
            id: c.id_bloque,
            dia: dia.charAt(0).toUpperCase() + dia.slice(1),
            inicio: start.toTimeString().slice(0, 5),
            fin: end.toTimeString().slice(0, 5),
            disponible: c.extendedProps?.disponible ?? true
          }
        };
      });
      setCitasDelServicio(parsed);
      setShowRepeatModal(true); // <-- Mostrar modal de repetir
    } catch (e: any) {
      setCitasDelServicio(prev => prev.filter(c => c.id !== tempId));
      alert(e.message);
    } finally {
      setLoadingSub(false);
    }
  };

  const handleCancelCita = async (citaId: number) => {
    if (!profile?.id) return;
    setLoadingSub(true);

    const prevCitas = [...citasDelServicio];
    setCitasDelServicio(prev => prev.filter(c => c.id !== citaId));
    setShowConfirmModal(false);

    try {
      await deleteCita(profile.id, citaId);
    } catch (e: any) {
      setCitasDelServicio(prevCitas);
      alert(e.message);
    } finally {
      setLoadingSub(false);
    }
  };

  const chunkedReviews = (arr: Review[], size: number) => {
    const chunks: Review[][] = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
  };

  const reviewChunks = chunkedReviews(reviews, 4);
  const carouselSettings = { slidesToShow: 1, slidesToScroll: 1, infinite: false, dots: true, arrows: true };

  if (!servicio) return <div className="p-4">Cargando servicio...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pt-20">
      <ServicioInfoCard nombre={servicio.nombre} descripcion={servicio.descripcion} imagen={servicio.imagen} />
      <BeneficiosBox beneficios={beneficios} />
      <DisponibilidadBox dias_disponibles={servicio.dias_disponibles} hora_inicio={servicio.hora_inicio} hora_termino={servicio.hora_termino} />

      {reviews.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-[1.2em] font-bold mb-4 text-[#00495C]">¿Qué dicen nuestros clientes?</h2>
          <Slider {...carouselSettings}>
            {reviewChunks.map((chunk, idx) => (
              <div key={idx} className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {chunk.map(r => (
                    <ReviewCard key={r.id} nombre={r.Usuario.nombre} review={r.review} rating={r.rating} createdAt={r.createdAt} />
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
      
      {isAuthenticated ? (
        profile?.rol === "socio" ? (
          <AgendarBox
            telefono={servicio.telefono_de_contacto}
            email={servicio.email_de_contacto}
            direccion={servicio.direccion_principal_del_prestador}
            isSubscribed={isSubscribed}
            loading={loadingSub}
            onSubscribe={handleSubscribe}
            onUnsubscribe={() => setShowConfirmModal(true)}
          />
        ) : (
          <ExclusiveSubscriptionCard />

        )
      ) : (
        <div>
        </div>
      )}

      {showSelectBloqueModal && (
        <ModalSelectorDeBloque
          onClose={() => setShowSelectBloqueModal(false)}
          onContinue={(bloque) => {
            setBloqueSeleccionado({
              id: bloque.id,
              dia: bloque.fecha.toLocaleDateString("es-ES", { weekday: "long" }),
              inicio: bloque.inicio.slice(11, 16),
              fin: bloque.fin.slice(11, 16),
              disponible: true,
            })
            setShowSelectBloqueModal(false)
            setShowSubscribeConfirm(true)
          }}
        />
      )}




      {showSubscribeConfirm && bloqueSeleccionado && (
        <ModalConfirmarCita
          bloque={bloqueSeleccionado}
          onCancel={() => setShowSubscribeConfirm(false)}
          onConfirm={handleConfirmSubscribe}
        />
      )}

      {showConfirmModal && (
        <ModalCancelarCita
          citas={citasDelServicio}
          onCancelCita={handleCancelCita}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default ServicePage;
