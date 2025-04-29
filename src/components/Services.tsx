import "../styles/Services.css";
import Heart from "../assets/icons/heart.svg";
import Care from "../assets/icons/care.svg";
import House from "../assets/icons/house.svg";
import Procedure from "../assets/icons/procedures.svg";

export default function Services() {
    return (
        <>
            <section id="services" className="services-section">
                <h2 className="services-section-title">Nuestros servicios</h2>

                <section className="services-grid">
                    <div className="service-card service-card-first">
                        <div className="service-card-header">
                            <h3 className="service-card-title">Compañía para Esparcimiento</h3>

                            <figure className="service-card-figure">
                                <img src={Heart} alt="Heart" className="card-figure" />
                            </figure>
                        </div>

                        <div className="service-card-description">
                            <p className="card-description">
                                Acompañamiento en actividades recreativas y sociales para mantener una vida activa
                            </p>
                        </div>

                        <div className="service-button">
                            <a className="service-card-link" href="">Saber más</a>
                        </div>
                    </div>

                    <div className="service-card service-card-second">
                        <div className="service-card-header">
                            <h3 className="service-card-title">Gestión del Cuidado</h3>

                            <figure className="service-card-figure">
                                <img src={Care} alt="Heart" className="card-figure" />
                            </figure>
                        </div>

                        <div className="service-card-description">
                            <p className="card-description">
                            Coordinación de cuidados médicos y seguimiento personalizado de la
                            salud.
                            </p>
                        </div>


                        <div className="service-button">
                            <a className="service-card-link" href="">Saber más</a>
                        </div>
                    </div>

                    <div className="service-card service-card-third">
                        <div className="service-card-header">
                            <h3 className="service-card-title">Compañía para Trámites</h3>

                            <figure className="service-card-figure">
                                <img src={Procedure} alt="Heart" className="card-figure" />
                            </figure>
                        </div>

                        <div className="service-card-description">
                            <p className="card-description">
                            Acompañamiento en gestiones administrativas y acompañamiento a citas
                            importantes
                            </p>
                        </div>

                        <div className="service-button">
                            <a className="service-card-link" href="">Saber más</a>
                        </div>
                    </div>

                    <div className="service-card service-card-fourth">
                        <div className="service-card-header">
                            <h3 className="service-card-title">Mantención del Hogar</h3>

                            <figure className="service-card-figure">
                                <img src={House} alt="Heart" className="card-figure" />
                            </figure>
                        </div>

                        <div className="service-card-description">
                            <p className="card-description">
                            Apoyo en el mantenimiento y cuidado del hogar para un ambiente
                            seguro.
                            </p>
                        </div>

                        <div className="service-button">
                            <a className="service-card-link" href="">Saber más</a>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}
