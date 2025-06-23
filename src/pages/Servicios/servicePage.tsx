import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Slider from "react-slick";

import ServicioInfoCard from "./ServicioInfoCard";
import ReviewCard from "./ReviewCard";
import BeneficiosBox from "./BeneficiosBox";
import DisponibilidadBox from "./DisponibilidadBox";
import AgendarBox from "./AgendarBox";
import ModalSelectorDeBloque from "../../components/Servicios/Citas/ModalSelectorDeBloque";
import ModalConfirmarCita from "../../components/Servicios/Citas/ModalConfirmarCita";
import ModalCancelarCita from "../../components/Servicios/Citas/ModalCancelarCita";
import ExclusiveSubscriptionCard from "../../components/ExclusiveSubscriptionCard";
import ReviewForm from "../../components/Servicios/Resenas/ReviewForm";
import ModalEliminarReseña from "../../components/Servicios/Resenas/ModalEliminarReseña";
import ModalReportarReseña from "../../components/Servicios/Resenas/ModalReportarReseña";

import { createCita, getUserSubscriptions, deleteCita } from "../../services/subscriptionService";
import { BloqueHorario } from "../../components/Servicios/Citas/SelectorDeBloque";
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
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const { profile, reloadProfile, loading: loadingProfile } = useContext(UserContext);

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [, setBloques] = useState<BloqueHorario[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<BloqueHorario | null>(null);
  const [citasDelServicio, setCitasDelServicio] = useState<{ id: number; bloque: BloqueHorario }[]>([]);
  const [loadingSub, setLoadingSub] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSelectBloqueModal, setShowSelectBloqueModal] = useState(false);
  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);
  const [, setShowRepeatModal] = useState(false);
  const [ratingStats, setRatingStats] = useState<{ promedio: string; total: number } | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const isSubscribed = citasDelServicio.length > 0;
  const reseñasRef = useRef<HTMLDivElement>(null);
  const [reviewToReport, setReviewToReport] = useState<Review | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);  

  useEffect(() => {
    if (isAuthenticated) reloadProfile();
  }, [isAuthenticated, reloadProfile]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}`)
      .then(res => setServicio(res.data))
      .catch(console.error);

    refreshReviews();

    axios.get(`${import.meta.env.VITE_API_URL}/beneficios/servicio/${id}`)
      .then(res => setBeneficios(res.data))
      .catch(() => {});

    axios.get(`${import.meta.env.VITE_API_URL}/servicios_ratings/servicio/${id}/promedio`)
      .then(res => setRatingStats(res.data))
      .catch(() => setRatingStats(null));

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

  const refreshReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/servicios_ratings/servicio/${id}`);
      setReviews(res.data);
      const promedioRes = await axios.get(`${import.meta.env.VITE_API_URL}/servicios_ratings/servicio/${id}/promedio`);
      setRatingStats(promedioRes.data);
    } catch (error: any) {
      // Si es 404, simplemente no hay reseñas, no es un error fatal
      if (error.response && error.response.status === 404) {
        setReviews([]);
        setRatingStats(null);
      } else {
        console.error("Error al actualizar reseñas", error);
      }
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({ appState: { returnTo: `/servicios/${id}` } });
      return;
    }
    setShowSelectBloqueModal(true);
  };

  const handleReportReview = async (reviewId: number, motivo: string) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reportes_contenido`,
        {
          tipo_contenido: "rating",
          id_contenido: reviewId,
          razon: motivo,
          
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Gracias por tu reporte. Será revisado pronto.");
    } catch (error) {
      console.error("Error al reportar la reseña:", error);
      alert("No se pudo enviar el reporte. Intenta más tarde.");
    } finally {
      setReviewToReport(null);
      setShowReportModal(false);
    }
  };


  const handleConfirmSubscribe = async () => {
    if (!profile?.id || !bloqueSeleccionado) return;
    setLoadingSub(true);

    const tempId = Date.now();
    const newCita = { id: tempId, bloque: bloqueSeleccionado };
    setCitasDelServicio(prev => [...prev, newCita]);
    setShowSubscribeConfirm(false);
    const token = await getAccessTokenSilently();

    try {
      await createCita(profile.id, bloqueSeleccionado.id, token);
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
      setShowRepeatModal(true);
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

  const userReview = reviews.find(r => r.Usuario.id === profile?.id);
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

      {/* Reseñas */}
      <div ref={reseñasRef} className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[1.2em] font-bold text-[#00495C]">Qué dicen nuestros clientes?</h2>
          {ratingStats && ratingStats.total > 0 ? (
            <div className="text-yellow-600 font-medium text-[1.5em]">
              ⭐ {ratingStats.promedio} · {ratingStats.total} opini{ratingStats.total !== 1 ? "ones" : "ón"}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              Aún no hay reseñas para este servicio.
            </div>
          )}

        </div>
        <Slider {...carouselSettings}>
          {reviewChunks.map((chunk, idx) => (
            <div key={idx} className="p-4">
              <div className="grid grid-cols-2 gap-6">
                {chunk.map(r => (
                  <ReviewCard
                    key={r.id}
                    nombre={r.Usuario.nombre}
                    review={r.review}
                    rating={r.rating}
                    createdAt={r.createdAt}
                    isOwner={profile?.id === r.Usuario.id}
                    onEdit={() => {
                      setEditingReview({...r});
                      setShowEditForm(true);
                    }}
                    onDelete={() => {
                      setReviewToDelete(r);
                      setShowDeleteModal(true);
                    }}
                    onReport={() => {
                      setReviewToReport(r);
                      setShowReportModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Formulario de reseña */}
      {isAuthenticated && profile?.rol === "socio" && !userReview && !showEditForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-[1.2em] font-bold text-[#00495C] mb-4">Deja tu reseña</h3>
          <ReviewForm
            servicioId={Number(id)}
            existingReview={editingReview ?? undefined}
            onReviewUpdated={() => {
              refreshReviews();
              setEditingReview(null);
              setShowEditForm(false);
              reseñasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      )}

      {showEditForm && editingReview && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-[1.2em] font-bold text-[#00495C] mb-4">Editar tu reseña</h3>
          <ReviewForm
            servicioId={Number(id)}
            existingReview={editingReview}
            onReviewUpdated={() => {
              refreshReviews();
              setEditingReview(null);
              setShowEditForm(false);
              reseñasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      )}
      {showDeleteModal && reviewToDelete && (
        <ModalEliminarReseña
          open={showDeleteModal}
          onClose={() => {
            setReviewToDelete(null);
            setShowDeleteModal(false);
          }}
          onConfirm={async () => {
            try {
              const token = await getAccessTokenSilently();
              await axios.delete(`${import.meta.env.VITE_API_URL}/servicios_ratings/${reviewToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              await refreshReviews();
            } catch {
              alert("Error al eliminar la reseña.");
            } finally {
              setReviewToDelete(null);
              setShowDeleteModal(false);
            }
          }}
        />
      )}

      {showReportModal && reviewToReport && (
        <ModalReportarReseña
          open={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReviewToReport(null);
          }}
          onSubmit={(motivo) => handleReportReview(reviewToReport.id, motivo)}
        />
      )}



      {/* AgendarBox */}
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
      ) : null}

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
            });
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
