import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalReportarReseñaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (motivo: string) => void;
}

const motivosPredefinidos = [
  "Contenido ofensivo o inapropiado",
  "Falsa reseña o engañosa",
  "Spam o publicidad",
  "Otro"
];

const ModalReportarReseña: React.FC<ModalReportarReseñaProps> = ({ open, onClose, onSubmit }) => {
    const [motivo, setMotivo] = useState("");
    const [otroMotivo, setOtroMotivo] = useState("");

    const handleEnviar = () => {
        const finalMotivo = motivo === "Otro" ? otroMotivo.trim() : motivo;
        if (finalMotivo) {
            onSubmit(finalMotivo);
            setMotivo("");
            setOtroMotivo("");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-40" />
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 relative z-50">
                <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-[1.5em] font-bold text-[#00495C] text-center flex-1">
                        ¿Por qué deseas reportar esta reseña?
                    </Dialog.Title>
                    <button
                        onClick={onClose}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-3">
                    {motivosPredefinidos.map((op, i) => (
                        <button
                            key={i}
                            onClick={() => setMotivo(op)}
                            className={`w-full text-left border rounded-xl px-4 py-3 text-[1.2em] transition ${
                                motivo === op ? "border-[#FFB326] bg-[#FFF4E3]" : "border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            {op}
                        </button>
                    ))}
                </div>

                {motivo === "Otro" && (
                    <textarea
                        placeholder="Describe el motivo..."
                        value={otroMotivo}
                        onChange={(e) => setOtroMotivo(e.target.value)}
                        className="mt-4 w-full border border-gray-300 rounded-lg p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[#FFB326]"
                        rows={3}
                    />
                )}

                <button
                    onClick={handleEnviar}
                    disabled={!motivo || (motivo === "Otro" && !otroMotivo.trim())}
                    className="mt-6 w-full bg-[#FFB326] hover:bg-[#e0a41f] text-white text-[1em] font-semibold py-2.5 rounded-lg disabled:opacity-50"
                >
                    Enviar reporte
                </button>
            </div>
        </Dialog>
    );
};

export default ModalReportarReseña;
