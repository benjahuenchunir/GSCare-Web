import { Crown, Unlock, Star, ArrowRight, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExclusiveSubscriptionCard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#E0F8F4] via-[#F5FFFB] to-[#F0FFF9] rounded-2xl border border-[#B0E3DB] shadow-xl hover:shadow-2xl transition-all duration-300 p-8 max-w-4xl mx-auto">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#AEEADE]/20 to-[#C2F0EC]/20 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#A0DCD3]/20 to-[#D1F3EE]/20 rounded-full translate-y-16 -translate-x-16"></div>

      {/* Premium badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#009982] to-[#62CBC9] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
        <Crown className="w-3 h-3" />
        EXCLUSIVO
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-[#009982] to-[#62CBC9] rounded-2xl shadow-lg">
            <Unlock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#006E5E] to-[#009982] bg-clip-text text-transparent mb-2">
              Suscríbete a funcionalidades exclusivas
            </h3>
            <p className="text-gray-700 text-lg">
              Solo los usuarios con una <span className="font-semibold text-[#006E5E]">membresía activa</span> pueden
              suscribirse a los servicios. Únete a la comunidad para disfrutar de estos beneficios.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Star className="w-4 h-4 text-[#009982]" />, label: "Acceso prioritario", desc: "Reserva citas con prioridad", bg: "bg-[#E0F8F4]" },
            { icon: <Shield className="w-4 h-4 text-[#20AF94]" />, label: "Servicios premium", desc: "Funciones avanzadas exclusivas", bg: "bg-[#D6F3EF]" },
            { icon: <Zap className="w-4 h-4 text-[#1F7D9A]" />, label: "Soporte 24/7", desc: "Atención personalizada", bg: "bg-[#CFF4F0]" },
          ].map((f, idx) => (
            <div key={idx} className={`backdrop-blur-sm rounded-xl p-4 border border-[#B0E3DB] ${f.bg}`}>
              <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white shadow">{f.icon}</div>
            <span className="font-semibold text-gray-800">{f.label}</span>
              </div>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
          </div>

          <button
            onClick={() => navigate("/pricing")}
            className="group bg-gradient-to-r from-[#009982] to-[#62CBC9] hover:from-[#007F6F] hover:to-[#36A2A1] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 min-w-fit"
          >
            <span>Conocer beneficios de Socio</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveSubscriptionCard;
