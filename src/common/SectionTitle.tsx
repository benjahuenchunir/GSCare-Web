// src/common/SectionTitle.tsx
import React from "react";

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
);

export default SectionTitle;
