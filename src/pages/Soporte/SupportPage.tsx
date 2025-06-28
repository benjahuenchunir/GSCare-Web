import { useEffect, useState } from 'react';
import { getConfig, Config } from '../../firebase/configService';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SupportPage = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await getConfig();
        if (configData) {
          setConfig(configData as Config);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!config) {
    return <div className="text-center p-10">No se pudo cargar la información de soporte. Por favor, intente más tarde.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-[2.5em] md:text-[2.5em] font-bold text-gray-900 mb-6 text-center">
          Página de Soporte
        </h1>

        <p className="text-gray-700 mb-6 text-center text-[1.1em]">
          Nuestro equipo está aquí para ayudarte. Contáctanos por cualquiera de los medios a continuación y te responderemos lo antes posible.
        </p>

        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-[1.6em] font-semibold text-gray-800 mb-4 text-center">
            Canales de Contacto
          </h2>
          {config.supportHours && (
          <div className="text-center text-[1em] text-gray-500 mt-4 mb-6">
            Horario de atención: {config.supportHours}
          </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="flex items-center gap-4 bg-blue-100 p-5 rounded-xl shadow transition">
              <FaEnvelope className="text-blue-600 text-[1.875em]" />
              <div>
                <h3 className="text-gray-800 font-semibold text-[1.125em]">Correo Electrónico</h3>
                <a href={`mailto:${config.contactEmail}`} className="text-blue-600 hover:underline text-[1em]">
                  {config.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-blue-100 p-5 rounded-xl shadow transition">
              <FaPhone className="text-blue-600 text-[1.875em]" />
              <div>
                <h3 className="text-gray-800 font-semibold text-[1.125em]">Teléfono</h3>
                <a href={`tel:${config.contactPhone}`} className="text-blue-600 hover:underline text-[1em]">
                  {config.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/user')}
            className="bg-[#009982] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#007e6e] transition-colors text-[1.1em]"
          >
            Volver a mi Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
