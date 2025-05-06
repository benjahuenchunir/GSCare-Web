import Hero from "../components/LandingPageComponents/Hero";
import Services from "../components/LandingPageComponents/Services";
import Footer from "../components/LandingPageComponents/Footer";

function LandingPage() {
	return (
    <div className="landing-page w-full mx-auto">
			<Hero />
			<Services />
			<Footer />
		</div>
	);
}

export default LandingPage;
