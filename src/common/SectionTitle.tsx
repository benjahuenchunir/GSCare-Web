import React from 'react'

interface Props {
  title: string
  className?: string
}

const SectionTitle: React.FC<Props> = ({ title, className = '' }) => (
  <h2 className={`text-2xl font-semibold text-gray-800 ${className}`}>{title}</h2>
)

export default SectionTitle
