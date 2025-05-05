import Hero from "../components/LandingPageComponents/Hero";
import Services from "../components/Services";
import Footer from "../components/LandingPageComponents/Footer";

function LandingPage() {
	return (
		<div className='landing-page'>
			<Hero />
			<Services />
			<Footer />
		</div>
	);
}

export default LandingPage;
