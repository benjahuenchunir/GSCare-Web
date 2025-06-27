// src/components/LandingPageComponents/Footer.jsx
import { useEffect, useState } from "react";
import { getConfig, Config } from "../../firebase/configService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    getConfig().then((data) => {
      if (data) {
        // Asegúrate de mapear los campos correctamente según tu estructura de Config
        setConfig({
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          address: data.address,
          landingImage: data.landingImage,
          landingTitle: data.landingTitle,
          landingSubtitle: data.landingSubtitle,
          socialLinks: data.socialLinks,
        });
      }
    });
  }, [])

  if (!config) return null // o un loader temporal

  return (
    <footer className="bg-[#006881] text-white py-8 px-6">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Contacto */}
        <div className="space-y-2">
          <h4 className="text-[1.2em] font-bold">Contacto</h4>
          <ul className="space-y-1 text-[0.9em]">
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
              <a href={`tel:${config.contactPhone}`} className="hover:underline">
                {config.contactPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              <a href={`mailto:${config.contactEmail}`} className="hover:underline">
                {config.contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
              {config.address}
            </li>
          </ul>
        </div>

        {/* Síguenos */}
        <div className="space-y-2">
          <h4 className="text-[1.2em] font-bold">Síguenos</h4>
          <div className="flex text-[0.9em] items-center gap-4">
            <a href={config.socialLinks?.facebook} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
            </a>
            <a href={config.socialLinks?.instagram} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
            </a>
            <a href={config.socialLinks?.x} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
            </a>
            <a href={config.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/50 pt-4 text-center text-[0.9em]">
        © 2025 Acompaña Mayor. Todos los derechos reservados.
      </div>
    </footer>
  )
}
