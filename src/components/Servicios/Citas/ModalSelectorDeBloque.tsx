// src/components/Servicios/ModalSelectorDeBloque.tsx

import React from "react"
import BloqueSelectorAutosuficiente from "./BloqueSelectorAutosuficiente"

interface BloqueSeleccionado {
  id: number
  inicio: string
  fin: string
  fecha: Date
}

interface ModalSelectorDeBloqueProps {
  onClose: () => void
  onContinue: (bloque: BloqueSeleccionado) => void
}

const ModalSelectorDeBloque: React.FC<ModalSelectorDeBloqueProps> = ({
  onClose,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <BloqueSelectorAutosuficiente onClose={onClose} onContinue={onContinue} />
      </div>
    </div>
  )
}

export default ModalSelectorDeBloque
