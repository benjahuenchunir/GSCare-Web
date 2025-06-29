import { Helmet } from "react-helmet-async";
import Hero from "../components/LandingPageComponents/Hero";
import Services from "../components/LandingPageComponents/Services";
import Footer from "../components/LandingPageComponents/Footer";
import BenefitsSection from "../components/LandingPageComponents/BenefitsSection";

function LandingPage() {
	return (
    <div className="landing-page w-full mx-auto">
			<Helmet>
        <title>GSCare | Apoyo integral para adultos mayores</title>
        <meta
          name="description"
          content="GSCare ofrece servicios y actividades pensadas especialmente para mejorar la calidad de vida de los adultos mayores. Encuentra atención personalizada, talleres y más."
        />
      </Helmet>
			<Hero />
			<BenefitsSection />
			<Services />
			<Footer />
		</div>
	);
}

export default LandingPage;
