import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ServicioInfoCard from "./ServicioInfoCard";
import ReviewCard from "./ReviewCard";
import AgendarBox from "./AgendarBox";
import { Review } from "./types";
import Slider from "react-slick"; // Importa el slider

interface Servicio {
  nombre: string;
  descripcion: string;
  categoria: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen: string;
}

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const isAuthenticated = false;

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

    fetchServicio();
    fetchReviews();
  }, [id]);

  const chunkedReviews = (reviews: Review[], chunkSize: number) => {
    const result: Review[][] = [];
    for (let i = 0; i < reviews.length; i += chunkSize) {
      result.push(reviews.slice(i, i + chunkSize));
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

  if (!servicio) return <div className="p-4">Cargando servicio...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <ServicioInfoCard
        nombre={servicio.nombre}
        descripcion={servicio.descripcion}
        imagen={servicio.imagen}
      />

      {reviews.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#006881]">¿Qué dicen nuestros clientes?</h2>

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
                    />
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
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default ServicePage;
