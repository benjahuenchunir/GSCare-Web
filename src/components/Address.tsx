import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function Address() {
    return (
        <>
            <address className="flex flex-col h-full justify-start items-start gap-10 w-[25%] not-italic">
                <h3 className="text-left text-white font-bold text-xl w-full m-0">Contacto</h3>
                <ul className="w-full flex flex-col gap-2">
                    <li>
                        <a href="tel:+56222466789" className="flex flex-row items-center gap-2 h-[2rem]">
                            <FontAwesomeIcon
                                icon={faPhone}
                                style={{color: "#ffffff",}}
                                className="w-5 h-5"
                            />
                            +56 X XXXX XXXX
                        </a>
                    </li>
                    <li className="flex flex-row items-center gap-2 h-[2rem]">
                        <a href="mailto:contacto@acompanamayor.cl" className="flex flex-row items-center gap-2 h-[2rem]">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                style={{color: "#ffffff",}}
                                className="w-5 h-5"
                            />
                            contacto@acompanamayor.cl
                        </a>
                    </li>
                    <li className="flex flex-row items-center gap-2 h-[2rem]">
                        <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{color: "#ffffff",}}
                            className="w-5 h-5"
                        />
                        Av. Principal 123, Santiago
                    </li>
                </ul>
            </address>
        </>
    )
}
