// components/ui/Skeleton.tsx
import React from "react";

// Definisikan tipe untuk props yang bisa diterima komponen Skeleton
interface SkeletonProps {
  height?: string;
  width?: string;
  radius?: string;
  className?: string; // Prop untuk kelas CSS tambahan seperti margin
  count?: number; // Prop untuk jumlah skeleton yang akan dirender
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = "h-5", // Nilai default jika tidak diisi
  width = "w-full", // Nilai default jika tidak diisi
  radius = "rounded-md", // Nilai default jika tidak diisi
  className = "", // Nilai default jika tidak diisi
  count = 1, // Nilai default jika tidak diisi
}) => {
  // Jika count lebih dari 1, render skeleton sebanyak count
  if (count > 1) {
    return (
      // Bungkus dengan div agar ada jarak antar skeleton
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${height} ${width} ${radius}`}
          />
        ))}
      </div>
    );
  }

  // Jika count hanya 1, render satu skeleton saja
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${height} ${width} ${radius} ${className}`}
    />
  );
};

export default Skeleton;
