export default function NewsLetter() {
    return (
        <>
            <div className="flex flex-col justify-start items-start gap-10 w-[25%] h-full">
                <h3 className="text-left text-white font-bold text-xl w-full m-0">Boletín Informativo</h3>
                <form className="flex flex-col justify-start items-start gap-5 w-full h-[8rem]">
                    <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="w-full md:w-2/3 px-3 py-2 border text-white font-bold border-gray-300 rounded-md focus:outline-none"
                        aria-label="Suscribirse al boletín"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                    />
                    <button type="submit" className="text-lg px-5 py-2 rounded-lg border-none cursor-pointer transition-colors duration-300 bg-[#FFC600] text-gray-900 hover:bg-yellow-300">Suscribirse</button>
                </form>
            </div>
        </>
    )
}

