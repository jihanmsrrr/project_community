// components/dashboard/StatCard.tsx
import React from "react";
import { LucideProps } from "lucide-react"; // Untuk tipe ikon

interface StatCardProps {
  icon: React.ReactElement<LucideProps>;
  title: string;
  value: string;
  subtext?: string;
  infoText?: string; // Teks kecil di bawah seperti "Kapka No 182..."
  bgColorClass: string; // Misal: "bg-metric-card-bg-1"
  textColorClass: string; // Misal: "text-metric-card-text-1"
  iconBgClass?: string; // Opsional, jika ikon punya background sendiri
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtext,
  infoText,
  bgColorClass,
  textColorClass,
  iconBgClass,
}) => {
  return (
    <div
      className={`rounded-xl shadow-lg p-4 sm:p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[180px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${bgColorClass} ${textColorClass}`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`p-2 sm:p-2.5 rounded-lg ${
            iconBgClass
              ? iconBgClass
              : `${bgColorClass} bg-opacity-20 backdrop-blur-sm`
          }`}
        >
          {React.cloneElement(icon, {
            size: 24,
            className: `sm:w-7 sm:h-7 ${textColorClass}`,
          })}
        </div>
        {/* Anda bisa tambahkan ikon info kecil di sini jika perlu, seperti di kartu ABK */}
      </div>
      <div>
        <p className="text-xs sm:text-sm opacity-80 mb-0.5">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold mb-1">{value}</p>
        {subtext && <p className="text-xs opacity-90">{subtext}</p>}
      </div>
      {infoText && (
        <p className="text-[0.7rem] opacity-70 mt-auto pt-1">{infoText}</p>
      )}
    </div>
  );
};

export default StatCard;
