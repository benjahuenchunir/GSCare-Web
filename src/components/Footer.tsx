import AboutUs from "./AboutUs"
import Address from "./Address"
import SocialMedia from "./SocialMedia"
import NewsLetter from "./Newsletter"

export default function Footer() {
    return (
        <>
            <footer className="flex flex-col items-center justify-center bg-[#006881] text-white p-6 gap-5 h-[40vh] font-[Poppins]">
                <div className="flex flex-row justify-center items-start w-[90%] h-[70%] gap-10 border-b border-[#D1D5DB] border-opacity-[50%]">
                    <AboutUs />
                    <Address />
                    <SocialMedia />
                    <NewsLetter />
                </div>

                <div className="w-[90%] h-fit text-center text-lg">
                    <small className="footer__copy">
                        © 2025 Acompaña Mayor. Todos los derechos reservados.
                    </small>
                </div>
            </footer>
        </>
    )
}
