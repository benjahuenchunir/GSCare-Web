import Hero from "../components/LandingPageComponents/Hero";
import Services from "../components/LandingPageComponents/Services";
import Footer from "../components/LandingPageComponents/Footer";
import BenefitsSection from "../components/LandingPageComponents/BenefitsSection";

function LandingPage() {
	return (
    <div className="landing-page w-full mx-auto">
			<Hero />
			<Services />
			<BenefitsSection />
			<Footer />
		</div>
	);
}

export default LandingPage;
