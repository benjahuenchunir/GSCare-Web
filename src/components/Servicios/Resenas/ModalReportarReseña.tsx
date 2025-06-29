import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalReportarReseñaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (motivo: string) => void;
  contentType: "Reseña" | "Comentario";
}

const motivosPredefinidos = [
    "Contenido ofensivo o inapropiado",
    "Spam",
    "Falsa reseña o engañosa",
    "No relevante o fuera de tema",
    "Violación de derechos de autor",
    "Violación de privacidad",
    "Discriminación o acoso",
    "Contenido ilegal o peligroso",
    "Otro"
];

const ModalReportarReseña: React.FC<ModalReportarReseñaProps> = ({ open, onClose, onSubmit, contentType }) => {
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
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />

                <div className="relative bg-white w-full max-w-md rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-6">
                        <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-[#00495C] flex-1">
                            ¿Por qué deseas reportar este {contentType.toLowerCase()}?
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                            aria-label="Cerrar"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        <div className="space-y-3">
                            {motivosPredefinidos.map((op, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMotivo(op)}
                                    className={`w-full text-left border rounded-xl px-4 py-3 text-base transition ${
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
                                className="mt-4 w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#FFB326]"
                                rows={3}
                            />
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleEnviar}
                            disabled={!motivo || (motivo === "Otro" && !otroMotivo.trim())}
                            className="w-full bg-[#FFB326] hover:bg-[#e0a41f] text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
                        >
                            Enviar reporte
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalReportarReseña;
