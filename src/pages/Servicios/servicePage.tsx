import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Slider from "react-slick";

import ServicioInfoCard from "./ServicioInfoCard";
import ReviewCard from "./ReviewCard";
import BeneficiosBox from "./BeneficiosBox";
import DisponibilidadBox from "./DisponibilidadBox";
import AgendarBox from "./AgendarBox";
import ModalSelectorDeBloque from "../../components/Servicios/ModalSelectorDeBloque";
import ModalConfirmarCita from "../../components/Servicios/ModalConfirmarCita";
import { BloqueHorario } from "../../components/Servicios/SelectorDeBloque";
import { Review } from "./types";

import {
  isUserSubscribed,
  createCita,
  unsubscribeFromService
} from "../../services/subscriptionService";

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
  const { profile, loading: loadingProfile } = useContext(UserContext);

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [bloques, setBloques] = useState<BloqueHorario[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<BloqueHorario | null>(null);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSelectBloqueModal, setShowSelectBloqueModal] = useState(false);
  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}`)
      .then(res => setServicio(res.data))
      .catch(err => console.error("Error al cargar servicio:", err));

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
            disponible: b.extendedProps.disponible
          };
        });
        setBloques(parsed);
      });
  }, [id]);

  useEffect(() => {
    if (loadingProfile) return;
    if (isAuthenticated && profile?.id) {
      isUserSubscribed(Number(id), profile.id)
        .then(setIsSubscribed)
        .catch(console.error)
        .finally(() => setLoadingSub(false));
    } else {
      setLoadingSub(false);
    }
  }, [isAuthenticated, loadingProfile, profile, id]);

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
    try {
      await createCita(profile.id, bloqueSeleccionado.id); // ✅ solo 2 argumentos
      setIsSubscribed(true);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingSub(false);
      setShowSubscribeConfirm(false);
    }
  };

  const handleUnsubscribe = () => setShowConfirmModal(true);

  const handleConfirmCancel = async () => {
    if (!profile?.id) return;
    setLoadingSub(true);
    try {
      await unsubscribeFromService(Number(id), profile.id);
      setIsSubscribed(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingSub(false);
      setShowConfirmModal(false);
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

      <AgendarBox
        telefono={servicio.telefono_de_contacto}
        email={servicio.email_de_contacto}
        direccion={servicio.direccion_principal_del_prestador}
        isSubscribed={isSubscribed}
        loading={loadingSub}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
      />

      {showSelectBloqueModal && (
        <ModalSelectorDeBloque
          bloques={bloques}
          selectedId={bloqueSeleccionado?.id || null}
          onSelect={setBloqueSeleccionado}
          onClose={() => setShowSelectBloqueModal(false)}
          onContinue={() => {
            setShowSelectBloqueModal(false);
            setShowSubscribeConfirm(true);
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-[1.5em] font-bold text-red-600 mb-4">¿Cancelar suscripción?</h2>
            <p className="text-gray-700 mb-6">¿Estás seguro de que deseas cancelar tu suscripción a este servicio?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">No, mantener</button>
              <button onClick={handleConfirmCancel} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
