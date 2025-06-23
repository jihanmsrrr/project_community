// components/Admin/RekapCard.tsx
"use client";

import React from "react";

interface RekapCardProps {
  title: string;
  value: number | string; // Bisa menerima angka atau string
  icon: React.ReactNode;
  colorClass: string; // Contoh: "border-status-blue text-status-blue-dark"
  link?: string; // Opsional jika kartu ingin bisa diklik
}

const RekapCard: React.FC<RekapCardProps> = ({
  title,
  value,
  icon,
  link,
  colorClass,
}) => {
  const content = (
    <div className="bg-surface-card p-5 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">
            {typeof value === "number" ? value.toLocaleString("id-ID") : value}
          </p>
        </div>
        <div className={`opacity-50 ${colorClass}`}>{icon}</div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default RekapCard;
