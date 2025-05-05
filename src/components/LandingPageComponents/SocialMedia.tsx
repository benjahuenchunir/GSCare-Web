import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFacebook,
    faInstagram,
    faTwitter,
    faLinkedin,
} from '@fortawesome/free-brands-svg-icons'

export default function SocialMedia() {
    return (
        <>
            <div className="flex flex-col h-full justify-start items-start gap-10 w-[25%]">
                <h3 className="text-left text-white font-bold text-xl w-full m-0">Síguenos</h3>
                <div className="flex flex-row justify-start items-start gap-7 w-full h-[4rem]">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} className="text-white w-8 h-8" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} className="text-white-500 w-8 h-8" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} className="text-white w-8 h-8" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} className="text-white w-8 h-8" />
                    </a>
                </div>
            </div>
        </>
    )
}
