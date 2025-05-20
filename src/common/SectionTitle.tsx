// src/common/SectionTitle.tsx
import React from "react";

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <h2 className="font-bold text-[1.7em] text-black mb-4">{title}</h2>
);

export default SectionTitle;
