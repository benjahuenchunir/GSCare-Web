import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { getConfig, Config } from "../firebase/configService";
import { Handshake } from "lucide-react";

const ProposeServiceCard = () => {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    getConfig().then(data => setConfig(data as Config | null));
  }, []);

  return (
    <div className="bg-primary1/15 border-4 border-primary1 rounded-xl shadow-md p-6 text-center space-y-4 h-full flex flex-col justify-center">
      <div className="flex justify-center">
        <div className="p-3 rounded-full bg-[#009982] shadow-md inline-block">
          <Handshake className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-[1.2em] font-bold text-[#006881]">
        ¿Quieres ofrecer un servicio?
      </h3>
      <p className="text-gray-700 text-[1em]">
        Para crear nuevos servicios, contáctate con un administrador.
      </p>
      {config?.contactEmail && (
        <div className="flex items-center justify-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <FaEnvelope className="text-secondary1 text-lg" />
          <div>
            <a href={`mailto:${config.contactEmail}`} className="text-secondary1 hover:underline font-semibold">
              {config.contactEmail}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposeServiceCard;
