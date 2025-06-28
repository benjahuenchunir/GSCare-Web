import { useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { getRecommendationsForUser } from '../../services/recommendationService';

const RecommendedServices = () => {
  const { profile } = useContext(UserContext);

  useEffect(() => {
    if (profile?.id) {
      const fetchRecommendations = async () => {
        try {
          const recommendations = await getRecommendationsForUser(profile.id);
          console.log('Recomendaciones para el usuario (IDs de servicios):', recommendations);
        } catch (error) {
          console.error('No se pudieron obtener las recomendaciones:', error);
        }
      };

      fetchRecommendations();
    }
  }, [profile]);

  // Este componente solo registra en la consola como se solicitó, por lo que no renderiza nada.
  return null;
};

export default RecommendedServices;
