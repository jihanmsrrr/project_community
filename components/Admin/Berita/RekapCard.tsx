// components/Admin/Berita/RekapCard.tsx
"use client";

import React, { ReactElement } from "react";

interface RekapCardProps {
  title: string;
  value: number;
  icon: ReactElement;
  colorClass: string;
}

const RekapCard: React.FC<RekapCardProps> = ({
  title,
  value,
  icon,
  colorClass,
}) => {
  return (
    <div
      className={`bg-surface-card border-l-4 rounded-lg p-4 flex items-center gap-4 shadow-sm ${colorClass}`}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: "w-8 h-8 flex-shrink-0",
      })}
      <div>
        <p className="text-2xl font-bold text-text-primary">
          {value.toLocaleString("id-ID")}
        </p>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
      </div>
    </div>
  );
};

export default RekapCard;
