// src/components/LandingPageComponents/Footer.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-[#006881] text-white py-8 px-6">
      {/* Bloques de Contacto y Síguenos */}
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Contacto */}
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Contacto</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
              <a href="tel:+56222466789" className="hover:underline">
                +56 2 2246 6789
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              <a href="mailto:contacto@acompanamayor.cl" className="hover:underline">
                contacto@acompanamayor.cl
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
              Av. Principal 123, Santiago
            </li>
          </ul>
        </div>

        {/* Síguenos */}
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Síguenos</h4>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright centrado */}
      <div className="mt-8 border-t border-white/50 pt-4 text-center text-sm">
        © 2025 Acompaña Mayor. Todos los derechos reservados.
      </div>
    </footer>
  );
}
