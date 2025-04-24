import React from 'react'

interface Props {
  icon: React.ReactNode
  label: string
}

const QuickAccessButton: React.FC<Props> = ({ icon, label }) => (
  <button className="flex flex-col items-center p-4 bg-white shadow rounded-lg hover:bg-gray-50 transition">
    {icon}
    <span className="mt-2 text-base font-medium text-neutral-800">{label}</span>
  </button>
)

export default QuickAccessButton
