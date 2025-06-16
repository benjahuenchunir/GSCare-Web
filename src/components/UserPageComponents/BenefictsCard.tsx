import { Sparkles, ArrowRight, Users, Gift } from 'lucide-react';

const BenefitsCard = ({ onClickCTA }: { onClickCTA?: () => void }) => {
  return (
    <div className="relative overflow-hidden bg-[#F5F5F5] rounded-[2rem] border border-[#E0E0E0] shadow-md p-6 sm:p-10 max-w-5xl mx-auto transition-all duration-300">

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-full bg-[#009982] shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-[1.5em] font-bold text-[#009982] font-poppins">
            ¿Quieres acceder a más beneficios?
          </h3>
        </div>

        {/* Descripción */}
        <p className="text-gray-700 text-[1em] leading-relaxed mb-6 max-w-3xl font-openSans">
          Únete a nuestra comunidad de adultos mayores y accede a actividades exclusivas,
          soporte dedicado y nuevas herramientas para mejorar tu bienestar y autonomía.
        </p>

        {/* Beneficios */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-[#62CBC9] shadow-sm">
            <Users className="w-4 h-4 text-[#009982]" />
            <span className="text-[1em] font-medium text-gray-700">Comunidad activa</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-[#FFC600] shadow-sm">
            <Gift className="w-4 h-4 text-[#B89000]" />
            <span className="text-[1em] font-medium text-gray-700">Beneficios exclusivos</span>
          </div>
        </div>

        {/* Botón CTA */}
        <button
          onClick={onClickCTA}
          className="group bg-[#009982] hover:bg-[#006E5E] text-white font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-[1.2em] font-poppins"
        >
          <span>Conocer beneficios de Socio</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Fondo decorativo orgánico */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#62CBC9]/20 rounded-[1.5rem] z-0" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FFC600]/30 rounded-[1.5rem] z-0" />
    </div>
  );
};

export default BenefitsCard;
