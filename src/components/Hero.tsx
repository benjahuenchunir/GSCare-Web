import "../styles/Hero.css";
import SignupButton from "./SignupButton"; // ajusta la ruta si la tienes en otro lugar
import Logo from "../assets/imgs/logo.svg"; // o el SVG que uses para hero

export default function Hero() {
  return (
    <section className="hero flex-container">
      <div className="hero-content">
        <header className="hero-header flex-container">
          <h1 className="hero-title">
            Mejorando la Calidad de Vida de Nuestros Mayores
          </h1>
          <p className="hero-description">
            Brindamos compañía, apoyo y cuidado personalizado para adultos mayores, permitiéndoles mantener su independencia y bienestar.
          </p>
        </header>

        <div className="hero-actions">
          <a href="#services" className="hero-button hero-button-primary">
            Explorar Servicios
          </a>
          {/* Aquí reemplazamos el <a> por tu SignupButton */}
          <SignupButton />
        </div>
      </div>

      <figure className="hero-figure">
        <img src={Logo} alt="Logo GSCare" className="hero-image" />
      </figure>
    </section>
  );
}
