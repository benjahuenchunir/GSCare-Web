import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { getRecommendationsForUser } from '../../services/recommendationService';
import { Sparkles } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';

interface Recommendation {
  id: number;
  id_base?: number;
  nombre: string;
  score?: number;
}

const RecommendedServices = () => {
  const { profile } = useContext(UserContext);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.id) {
      const fetchRecommendations = async () => {
        setLoading(true);
        try {
          const recs = await getRecommendationsForUser(profile.id);
          // Normalizamos los datos para evitar problemas de consistencia
          const normalizadas = recs.map((rec: Recommendation) => ({
            ...rec,
            id_base: rec.id_base ?? rec.id,
          }));
          setRecommendations(normalizadas);
        } catch (error) {
          console.error('No se pudieron obtener las recomendaciones:', error);
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Buscando recomendaciones para ti...</p>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  // Asegura que haya siempre 3 espacios
  const filledRecs: (Recommendation | null)[] = [...recommendations];
  while (filledRecs.length < 3) {
    filledRecs.push(null); // Agrega placeholders vacíos
  }

  return (
    <div className="space-y-4">
      <SectionTitle title="Actividades recomendadas para ti" />
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-primary mb-2">¿No sabes qué agendar?</h2>
          <p className="text-gray-600">Te recomendamos estas actividades:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filledRecs.map((rec, idx) =>
            rec ? (
              <div
                key={rec.id_base}
                onClick={() => navigate(`/actividades/${rec.id_base}`)}
                className="bg-primary1/10 p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-primary1/20 transition-colors"
              >
                <div className="bg-primary1/80 p-2 rounded-full">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-lg">{rec.nombre}</h3>
                </div>
              </div>
            ) : (
              <div key={`placeholder-${idx}`} className="p-4 rounded-lg bg-transparent" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendedServices;
