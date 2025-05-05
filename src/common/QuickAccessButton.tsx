import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export default function QuickAccessButton({ icon, label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary1"
    >
      {icon}
      <span className="text-lg font-medium text-gray-800">{label}</span>
    </button>
  );
}
