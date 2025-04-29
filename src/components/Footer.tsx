import "../styles/Footer.css";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer__container container">
                    <div className="footer__main">
                        <div className="footer__brand">
                            <h2 className="footer__title">Acompaña Mayor</h2>
                            <p className="footer__tagline">
                            Mejorando la calidad de vida de nuestros adultos mayores con servicios personalizados y profesionales.
                            </p>
                        </div>

                        <address className="footer__contact">
                            <h3 className="footer__subtitle">Contacto</h3>
                            <ul className="footer__list">
                                <li><a href="tel:+56222466789" className="footer__link">+56 2 2246 6789</a></li>
                                <li><a href="mailto:contacto@acompanamayor.cl" className="footer__link">contacto@acompanamayor.cl</a></li>
                                <li>Av. Principal 123, Santiago</li>
                            </ul>
                        </address>

                        <div className="footer__social">
                            <h3 className="footer__subtitle">Síguenos</h3>
                            <div className="footer__social-icons">
                            <a href="#" className="footer__social-link" aria-label="Facebook">📘</a>
                            <a href="#" className="footer__social-link" aria-label="Twitter">🐦</a>
                            <a href="#" className="footer__social-link" aria-label="Instagram">📸</a>
                            <a href="#" className="footer__social-link" aria-label="LinkedIn">💼</a>
                            </div>
                        </div>

                        <div className="footer__newsletter">
                            <h3 className="footer__subtitle">Boletín Informativo</h3>
                            <form className="footer__form">
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="footer__input"
                                    aria-label="Suscribirse al boletín"
                                />
                                <button type="submit" className="footer__button">Suscribirse</button>
                            </form>
                        </div>
                    </div>

                    <div className="footer__bottom">
                        <small className="footer__copy">
                            © 2025 Acompaña Mayor. Todos los derechos reservados.
                        </small>
                    </div>
                </div>
            </footer>
        </>
    )
}
