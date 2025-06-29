// src/components/Services.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServicios, fetchPromedioPorServicio, Servicio } from "../../services/serviceService";

interface ServicioConRating extends Servicio {
  promedio_rating?: number;
  total_opiniones: number;
}

export default function Services() {
  const [topServices, setTopServices] = useState<ServicioConRating[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTopServices = async () => {
      try {
        const allServices = await fetchServicios();
        const servicesWithRating = await Promise.all(
          allServices.map(async (s) => {
            const { promedio, total } = await fetchPromedioPorServicio(s.id);
            return { ...s, promedio_rating: promedio, total_opiniones: total };
          })
        );

        const groupedServices = new Map<number, ServicioConRating>();
        servicesWithRating.forEach((service) => {
          const baseId = service.id_servicio_base ?? service.id;
          if (!groupedServices.has(baseId)) {
            groupedServices.set(baseId, service);
          } else {
            const existing = groupedServices.get(baseId)!;
            if ((service.promedio_rating ?? 0) > (existing.promedio_rating ?? 0)) {
              groupedServices.set(baseId, service);
            } else if (
              (service.promedio_rating ?? 0) === (existing.promedio_rating ?? 0) &&
              (service.total_opiniones ?? 0) > (existing.total_opiniones ?? 0)
            ) {
              groupedServices.set(baseId, service);
            }
          }
        });

        const uniqueServices = Array.from(groupedServices.values());
        const sortedServices = uniqueServices
          .filter(s => s.promedio_rating !== null && s.promedio_rating !== undefined)
          .sort((a, b) => (b.promedio_rating ?? 0) - (a.promedio_rating ?? 0));

        setTopServices(sortedServices.slice(0, 4));
      } catch (error) {
        console.error("Error fetching top services:", error);
      }
    };

    getTopServices();
  }, []);

  return (
    <section id="services" className="w-full bg-white text-gray-600 font-[Poppins] py-16 px-6">
      <h2 className="text-center text-[2.5em] font-bold text-[#006881] mb-12">
        Nuestra oferta
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
        {topServices.map((service) => (
          <div key={service.id} className="bg-gray-100 p-6 flex flex-col justify-between rounded-lg shadow-md">
            <div>
              <h3 className="text-[1.5em] leading-snug font-bold text-[#006881] mb-2">
                {service.nombre}
              </h3>
              {typeof service.promedio_rating === "number" && (
                <div className="flex items-center gap-1 mb-3 text-yellow-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="text-xl">{i < Math.round(service.promedio_rating!) ? "★" : "☆"}</span>
                  ))}
                  <span className="text-gray-600 text-sm ml-2">
                    ({service.promedio_rating.toFixed(1)}/5)
                  </span>
                </div>
              )}
              <p className="text-[1em] mb-4 line-clamp-3">
                {service.descripcion}
              </p>
            </div>
            <div className="text-right mt-4">
              <button
                onClick={() => navigate(`/servicios/${service.id}`)}
                className="px-4 py-2 text-[1em] border-2 border-[#006881] text-[#006881] rounded-lg hover:bg-[#006881] hover:text-white transition"
              >
                Saber más
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
