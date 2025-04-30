import Hero from "../components/Hero";
import Services from "../components/Services";
import Footer from "../components/Footer";

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
