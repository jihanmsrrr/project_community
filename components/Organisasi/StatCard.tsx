// components/Organisasi/StatCard.tsx
import React from "react";
import { LucideProps } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactElement<LucideProps>;
  title: string;
  value: string;
  subtext?: string | null;
  // Properti warna sekarang opsional
  bgColorClass?: string;
  textColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtext,
  bgColorClass, // Tidak ada nilai default di sini
  textColorClass,
}) => {
  // Tentukan kelas default jika tidak ada properti warna yang diberikan
  const finalBgColor = bgColorClass || "bg-card";
  const finalTextColor = textColorClass || "text-text-primary";
  const finalSubtextColor = textColorClass
    ? "opacity-80"
    : "text-text-secondary";
  const finalIconColor = textColorClass || "text-brand-text";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`p-4 sm:p-5 rounded-xl shadow-lg flex flex-col h-full ${finalBgColor}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg bg-white/10`}>
          {/* Hanya render jika ikonnya ada */}
          {icon &&
            React.cloneElement(icon, {
              size: 24,
              className: `sm:w-7 sm:h-7 ${finalIconColor}`, // Menggunakan nama variabel dari kode terakhir
            })}
        </div>
      </div>
      <div className="mt-auto pt-4">
        <p className={`text-sm font-medium ${finalSubtextColor}`}>{title}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${finalTextColor}`}>
          {value}
        </p>
        {subtext && (
          <p className={`text-xs mt-1 ${finalSubtextColor}`}>{subtext}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
