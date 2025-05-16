import { useFontSize } from '../context/FontSizeContext';
import { ZoomIn } from 'lucide-react'; // 👈 ícono válido

export default function FontSizeToggle() {
  const { fontSize, setFontSize } = useFontSize();

  const cycleFontSize = () => {
    if (fontSize === 'text-base') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-xl');
    else setFontSize('text-base');
  };

  return (
    <button
      onClick={cycleFontSize}
      className="fixed bottom-4 right-4 z-50 bg-[#009982] hover:bg-[#007766] text-white p-3 rounded-full shadow-lg transition-all"
      title="Ajustar tamaño de texto"
    >
    <ZoomIn className="w-5 h-5" />
    </button>
  );
}
