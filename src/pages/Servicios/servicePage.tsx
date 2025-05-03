import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ServicioInfoCard from "./ServicioInfoCard";
import ReviewCard from "./ReviewCard";
import AgendarBox from "./AgendarBox";
import BeneficiosBox from "./BeneficiosBox";
import DisponibilidadBox from "./DisponibilidadBox";
import { Review } from "./types";
import Slider from "react-slick"; // Importa el slider
import { useAuth0 } from "@auth0/auth0-react";
import { isUserSubscribed, 
         subscribeToService, 
        unsubscribeFromService 
      } from "../../services/subscriptionService";
import { UserContext } from "../../context/UserContext";

interface Servicio {
  nombre: string;
  descripcion: string;
  categoria: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen: string;
  beneficios: string;
  dias_disponibles: number[];
  hora_inicio: string;
  hora_termino: string;
}

interface Beneficio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {isAuthenticated, loginWithRedirect } = useAuth0();
  const { profile, loading: loadingProfile } = useContext(UserContext);

  // Para datos del servicio
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);

  // Para subscripciones
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}`);
        setServicio(res.data);
      } catch (error) {
        console.error("Error al cargar el servicio:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/servicios_ratings/servicio/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.warn("Este servicio aún no tiene reviews.");
      }
    };

    const fetchBeneficios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/beneficios/servicio/${id}`);
        setBeneficios(res.data);
      } catch (error) {
        console.warn("Este servicio aún no tiene beneficios.");
      }
    };

    fetchServicio();
    fetchReviews();
    fetchBeneficios();
  }, [id]);

  const chunkedReviews = (reviews: Review[], chunkSize: number) => {
    const result: Review[][] = [];
    for (let i = 0; i < reviews.length; i += chunkSize) {
      result.push(reviews.slice(i + 0, i + chunkSize));
    }
    return result;
  };

  const chunks = chunkedReviews(reviews, 4); // Dividir las reseñas en bloques de 4

  const carouselSettings = {
    slidesToShow: 1, // Cada slide muestra un bloque de 4 reseñas
    slidesToScroll: 1,
    infinite: false,
    dots: true,
    arrows: true,
  };

  // 2.1 Check if user is subscribed
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

  // 2.2 Handler Suscribirse
  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({ appState: { returnTo: `/servicios/${id}` } });
      return;
    }
    if (profile?.id) {
      setLoadingSub(true);
      try {
        await subscribeToService(Number(id), profile.id);
        setIsSubscribed(true);
      } catch (e: any) {
        alert(e.message);
      } finally {
        setLoadingSub(false);
      }
    }
  };

  // 2.3 Handler Desuscribirse
  const handleUnsubscribe = async () => {
    if (profile?.id) {
      setLoadingSub(true);
      try {
        await unsubscribeFromService(Number(id), profile.id);
        setIsSubscribed(false);
      } catch (e: any) {
        alert(e.message);
      } finally {
        setLoadingSub(false);
      }
    }
  };

  if (!servicio) return <div className="p-4">Cargando servicio...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pt-20">
      <ServicioInfoCard
        nombre={servicio.nombre}
        descripcion={servicio.descripcion}
        imagen={servicio.imagen}
      />

      <BeneficiosBox beneficios={beneficios} />

      <DisponibilidadBox
        dias_disponibles={servicio.dias_disponibles}
        hora_inicio={servicio.hora_inicio}
        hora_termino={servicio.hora_termino}
      />

      {reviews.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-[#00495C] text-left">¿Qué dicen nuestros clientes?</h2>

          <Slider {...carouselSettings}>
            {chunks.map((chunk, index) => (
              <div key={index} className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {chunk.map((review) => (
                    <ReviewCard
                      key={review.id}
                      nombre={review.Usuario.nombre}
                      review={review.review}
                      rating={review.rating}
                      createdAt={review.createdAt}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      <div className="mt-8">
      <AgendarBox
        telefono={servicio.telefono_de_contacto}
        email={servicio.email_de_contacto}
        direccion={servicio.direccion_principal_del_prestador}
        isSubscribed={isSubscribed}
        loading={loadingSub}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
      />
      </div>
    </div>
  );
};

export default ServicePage;
