import { useFontSize } from '../context/FontSizeContext';

export default function FontSizeToggle() {
  const { increaseFont, decreaseFont, resetFont } = useFontSize();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-row gap-2">
      {/* Disminuir tamaño */}
      <button
        onClick={decreaseFont}
        className="bg-[#009982] hover:bg-[#007766] text-white p-3 rounded-full shadow-lg transition-all font-bold text-lg"
        title="Disminuir tamaño de texto"
      >
        A-
      </button>

      {/* Restablecer tamaño */}
      <button
        onClick={resetFont}
        className="bg-[#FFC600] hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg transition-all font-bold text-lg"
        title="Tamaño normal"
      >
        A
      </button>

      {/* Aumentar tamaño */}
      <button
        onClick={increaseFont}
        className="bg-[#009982] hover:bg-[#007766] text-white p-3 rounded-full shadow-lg transition-all font-bold text-lg"
        title="Aumentar tamaño de texto"
      >
        A+
      </button>
    </div>
  );
}
