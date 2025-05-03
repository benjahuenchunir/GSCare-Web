// src/components/UserPageComponents/SubscribedServicesSection.tsx
import React, { useContext, useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import { getUserSubscriptions } from "../../services/subscriptionService";
import { fetchBeneficios, fetchBeneficiosPorServicio } from "../../services/serviceService";
import { UserContext } from "../../context/UserContext";
import SectionTitle from "../../common/SectionTitle";
import EmptyState from "../../common/EmptyState";


interface Servicio {
  id: number;
  nombre: string;
  beneficios: { id: number; nombre: string }[];
}

export const SubscribedServicesSection: React.FC = () => {
  const { profile } = useContext(UserContext)!;
  const navigate = useNavigate();
  const sliderRef = useRef<Slider>(null);

  const [services, setServices] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [allBenefits, setAllBenefits] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<number[]>([]);
  const [showBenefitFilter, setShowBenefitFilter] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carga catálogo de beneficios
  useEffect(() => {
    fetchBeneficios().then(setAllBenefits).catch(console.error);
  }, []);

  // Carga servicios suscritos
  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);
    getUserSubscriptions(profile.id)
      .then(async (servs: Servicio[]) => {
        const list = await Promise.all(
          servs.map(async svc => {
            const bs = await fetchBeneficiosPorServicio(svc.id);
            return { ...svc, beneficios: bs };
          })
        );
        setServices(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile]);
  
  // Filtrado
  const filtered = services
    .filter(s => s.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(s =>
      selectedBenefits.length === 0
        ? true
        : s.beneficios.some(b => selectedBenefits.includes(b.id))
    );

  // Empaquetar en slides de 4 (2×2)
  const slides: Servicio[][] = [];
  for (let i = 0; i < filtered.length; i += 4) {
    slides.push(filtered.slice(i, i + 4));
  }

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    dots: false,
    arrows: false,
    afterChange: (index: number) => setCurrentSlide(index)
  };

  return (
    <div className="w-full flex gap-6">
      {/* Sidebar filtros */}
      <div className="w-1/5 bg-[#E0F5F5] p-4 rounded-lg shadow flex flex-col h-[450px]">
        <SectionTitle title="Filtros" />
        <input
          type="text"
          placeholder="Buscar servicio…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full border border-[#62CBC9] rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#62CBC9]"
        />
        <button
          onClick={() => setShowBenefitFilter(v => !v)}
          className="w-full flex justify-between items-center mt-2 text-[#006881] font-medium"
        >
          Beneficios <span>{showBenefitFilter ? "▾" : "▸"}</span>
        </button>
        {showBenefitFilter && (
          <div className="flex flex-wrap gap-2 mt-2 overflow-y-auto grow">
            {allBenefits.map(b => {
              const sel = selectedBenefits.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() =>
                    setSelectedBenefits(prev =>
                      sel ? prev.filter(x => x !== b.id) : [...prev, b.id]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition
                    ${sel
                      ? "bg-[#62CBC9] text-white border-transparent"
                      : "bg-white text-[#006881] border-[#62CBC9]"}
                  `}
                >
                  {b.nombre}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Carrusel con grid 2x2 */}
      <div className="w-4/5">
        {loading ? (
          <p className="text-center py-10">Cargando servicios…</p>
        ) : filtered.length === 0 ? (
          <EmptyState mensaje="No tienes servicios suscritos." />
        ) : (
          <>
            <Slider ref={sliderRef} {...settings}>
              {slides.map((group, idx) => (
                <div key={idx} className="p-1">
                  <div className="grid grid-cols-2 gap-4">
                    {group.map(svc => (
                      <div
                        key={svc.id}
                        className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center text-center gap-3 border border-[#62CBC9] h-full"
                      >
                        <h3 className="text-xl font-bold text-[#009982]">{svc.nombre}</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                          {svc.beneficios.map(b => (
                            <span
                              key={b.id}
                              className="bg-[#F5FCFB] text-[#006881] text-sm px-3 py-1 rounded-full border border-[#62CBC9]"
                            >
                              {b.nombre}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => navigate(`/servicios/${svc.id}`)}
                          className="w-full bg-[#009982] hover:bg-[#006E5E] text-white font-semibold px-6 py-3 rounded-full mt-2"
                        >
                          Más información
                        </button>
                      </div>                    
                    ))}
                    {group.length < 4 &&
                      Array(4 - group.length)
                        .fill(0)
                        .map((_, i) => <div key={`empty-${i}`} />)}
                  </div>
                </div>
              ))}
            </Slider>

            {/* Controles manuales abajo */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-10 h-10 flex items-center justify-center text-2xl text-white bg-[#009982] hover:bg-[#006E5E] rounded-full shadow-lg"
              >
                ‹
              </button>
              {/* Dots personalizados */}
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => sliderRef.current?.slickGoTo(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    currentSlide === i ? "bg-[#00495C]" : "bg-gray-400"
                  }`}
                />
              ))}
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-10 h-10 flex items-center justify-center text-2xl text-white bg-[#009982] hover:bg-[#006E5E] rounded-full shadow-lg"
              >
                ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};