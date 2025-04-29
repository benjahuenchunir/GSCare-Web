import React from 'react'

interface Props {
  title: string
  content: React.ReactNode
  className?: string
}

const InfoCard: React.FC<Props> = ({ title, content, className = '' }) => (
  <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <div className="mt-2">{content}</div>
  </div>
)

export default InfoCard
