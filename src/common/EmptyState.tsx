import React from 'react'

interface EmptyStateProps {
  mensaje: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ mensaje }) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 italic text-center px-2">
      {mensaje}
    </div>
  )
}

export default EmptyState
