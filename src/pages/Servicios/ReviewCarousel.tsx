// ReviewCarousel.tsx
import React from "react";
import ReviewCard from "./ReviewCard";
import { Review } from "./types";

interface Props {
  reviews: Review[];
  carouselIndex: number;
  onNext: () => void;
  onPrev: () => void;
  reviewsPerPage: number;
}

const ReviewCarousel: React.FC<Props> = ({ reviews, carouselIndex, onNext, onPrev, reviewsPerPage }) => {
  const start = carouselIndex * reviewsPerPage;
  const end = start + reviewsPerPage;
  const currentSlide = reviews.slice(start, end);

  console.log("currentSlide:", currentSlide.map(r => r.id));


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentSlide.map((review) => (
          <ReviewCard
            key={review.id}
            nombre={review.Usuario.nombre}
            review={review.review}
            rating={review.rating}
            createdAt={review.createdAt}
          />
        ))}
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={onPrev}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition"
        >
          ← Anterior
        </button>
        <button
          onClick={onNext}
          className="bg-[#006881] hover:bg-[#00536a] text-white px-4 py-2 rounded-xl transition"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default ReviewCarousel;
