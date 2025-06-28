// src/components/TestimoniosCarousel.tsx
import { Testimonio } from "../firebase/testimoniosService";
import { useState, useRef, useEffect } from "react";

interface Props {
  testimonios: Testimonio[];
}

export default function TestimoniosCarousel({ testimonios }: Props) {
  const [current, setCurrent] = useState(0);
  const itemsPerPage = 4;

  const handlePrev = () => {
    setCurrent((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setCurrent((prev) =>
      Math.min(prev + itemsPerPage, Math.max(0, testimonios.length - itemsPerPage))
    );
  };

  // Lógica de arrastre
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeaveOrUp = () => {
    if (!carouselRef.current) return;
    isDragging.current = false;
    carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Multiplicador para mayor sensibilidad
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    if (carouselRef.current) {
      const totalWidth = carouselRef.current.scrollWidth;
      const visibleWidth = carouselRef.current.clientWidth;
      const maxScroll = totalWidth - visibleWidth;
      const targetScroll = (maxScroll / (testimonios.length - itemsPerPage)) * current;
      carouselRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [current, testimonios.length]);

  return (
    <section className="w-full max-w-screen-xl px-6 mb-10">
      <h2 className="text-center font-semibold text-gray-600 mb-6" style={{ fontSize: "1.5em" }}>Lo que dicen nuestros socios</h2>
      <div className="relative flex flex-col items-center">
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className="grid grid-flow-col auto-cols-[calc(100%/1-12px)] sm:auto-cols-[calc(100%/2-12px)] lg:auto-cols-[calc(100%/4-12px)] gap-4 w-full overflow-x-hidden cursor-grab"
        >
          {testimonios.map((t) => (
            <blockquote key={t.id} className="bg-white border-4 border-[#009982] shadow-md rounded-xl p-4 select-none">
              <p className="text-gray-800 italic mb-2">“{t.contenido}”</p>
              <footer className="text-gray-600 text-right" style={{ fontSize: "0.875em" }}>— {t.nombre}</footer>
            </blockquote>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={handlePrev} disabled={current === 0} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50" style={{ fontSize: "0.875em" }}>← Anterior</button>
          <button onClick={handleNext} disabled={current + itemsPerPage >= testimonios.length} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50" style={{ fontSize: "0.875em" }}>Siguiente →</button>
        </div>
      </div>
    </section>
  );
}
