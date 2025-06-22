import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../../../context/UserContext";
import { FaStar } from "react-icons/fa";
import ModalConfirmarPublicacion from "./ModalConfirmarPublicacion";
import leoProfanity from "leo-profanity";
import spanishBadWords from "../../../utils/spanishBadWords";

// Inicializar el filtro solo una vez


interface ReviewFormProps {
  servicioId: number;
  existingReview?: {
    id: number;
    rating: number;
    review: string;
  };
  onReviewUpdated: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  servicioId,
  existingReview,
  onReviewUpdated,
}) => {
// Inicializar el filtro de lenguaje inapropiado solo una vez
  leoProfanity.loadDictionary("es");
  leoProfanity.add(spanishBadWords);
  
  const { getAccessTokenSilently } = useAuth0();
  const { profile } = useContext(UserContext);

  const [rating, setRating] = useState<number>(existingReview?.rating ?? 1);
  const [review, setReview] = useState<string>(existingReview?.review ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [justRated, setJustRated] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [badWordsError, setBadWordsError] = useState("");

  const handleStarClick = (star: number) => {
    const newRating = rating === star ? 0 : star;
    setRating(newRating);
    setJustRated(newRating); // activa la animación
    setTimeout(() => setJustRated(null), 300); // la borra tras 300ms
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (existingReview && formRef.current) {
      const yOffset = -250;
      const y =
        formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBadWordsError("");
    leoProfanity.add("weon")
    console.log(leoProfanity.check(review));
    console.log(leoProfanity.badWordsUsed(review));
    if (leoProfanity.check(review)) {
      setBadWordsError("Tu comentario contiene lenguaje inapropiado. Por favor, edítalo.");
      return;
    }
    setShowConfirmModal(true); // siempre se confirma antes de publicar
  };

  const submitReview = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();

      if (existingReview) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/servicios_ratings/${existingReview.id}`,
          { rating, review },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        if (!profile?.id) {
          setError("No se pudo obtener el usuario.");
          setLoading(false);
          return;
        }
        await axios.post(
          `${import.meta.env.VITE_API_URL}/servicios_ratings`,
          {
            id_servicio: servicioId,
            id_usuario: profile.id,
            rating,
            review,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onReviewUpdated();
    } catch (err) {
      setError("Ocurrió un error al enviar la reseña.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[1em] font-bold text-gray-700">Calificación</label>
        <div className="flex mt-2 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="focus:outline-none"
              aria-label={`Dar ${star} estrella${star > 1 ? "s" : ""}`}
            >
              <FaStar
                size={28}
                className={`
                  transition-transform duration-200 transform
                  ${justRated === star ? "scale-125" : "hover:scale-125"}
                  ${(hoverRating ?? rating) >= star ? "text-[#FFC600]" : "text-gray-300"}
                  cursor-pointer
                `}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[1em] font-bold text-gray-700">Comentario</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Escribe tu experiencia con este servicio..."
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {badWordsError && (
        <div className="text-red-500  mb-2">{badWordsError}</div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[#009982] text-white px-4 py-2 rounded-md hover:bg-[#007f6d] transition-colors"
          disabled={loading}
        >
          {loading ? "Guardando..." : existingReview ? "Actualizar Reseña" : "Publicar Reseña"}
        </button>
      </div>

      <ModalConfirmarPublicacion
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={submitReview}
      />
    </form>
  );
};

export default ReviewForm;
