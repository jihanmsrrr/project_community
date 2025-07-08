// components/Organisasi/StatsRow.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import StatCard from "./StatCard";
import NewsFeedCard from "./NewsFeedCard";
import {
  Users2,
  TrendingUp,
  TrendingDown,
  Clock,
  Newspaper,
  XCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import type { AggregatedUnitData } from "@/types/pegawai";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface WilayahOption {
  id: string;
  nama: string;
}

interface StatsRowProps {
  stats: AggregatedUnitData | null;
  isLoading?: boolean;
  wilayah: string;
  availableWilayahs: WilayahOption[];
  onWilayahChange: (newWilayahId: string) => void;
}

const StatsRow: React.FC<StatsRowProps> = ({
  stats,
  isLoading = false,
  wilayah,
  availableWilayahs,
  onWilayahChange,
}) => {
  const [showNewsFeed, setShowNewsFeed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleNewsFeed = () => setShowNewsFeed((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWilayahSelect = (newWilayahId: string) => {
    if (newWilayahId !== wilayah) onWilayahChange(newWilayahId);
    setIsDropdownOpen(false);
  };

  const currentWilayahNama =
    availableWilayahs.find((w) => w.id === wilayah)?.nama || "Memuat...";

  if (isLoading) {
    return <SkeletonStatsRow />;
  }

  if (!stats) {
    return (
      <div className="mb-8 md:mb-10 bg-card border border-card-border p-6 rounded-xl text-center shadow-lg">
        <h2 className="text-xl font-bold text-text-primary">
          Statistik Nasional
        </h2>
        <p className="text-text-secondary mt-2">
          Pilih sebuah provinsi pada peta atau dari dropdown untuk melihat
          statistik detail.
        </p>
      </div>
    );
  }

  // Definisikan data untuk card statistik. Jauh lebih bersih.
  const statsForDisplay = [
    {
      id: 1,
      icon: <Users2 />,
      title: "Total Pegawai",
      value: (stats.jumlahPegawai ?? 0).toLocaleString(),
    },
    {
      id: 2,
      icon: <TrendingUp />,
      title: "Pegawai vs ABK",
      value: `${(stats.persenTerhadapABK ?? 0).toFixed(1)}%`,
      subtext: stats.subtextABK,
      bgColorClass: "bg-brand-bg",
      textColorClass: "text-white",
    },
    {
      id: 3,
      icon: <TrendingDown />,
      title: "Pensiun Tahun Ini",
      value: (stats.jumlahPensiunTahunIni ?? 0).toLocaleString(),
    },
    {
      id: 4,
      icon: <Clock />,
      title: "Rata-rata Umur",
      value: `${(stats.rataUmurSatker ?? 0).toFixed(1)} Thn`,
    },
  ];

  return (
    <div className="mb-8 md:mb-10">
      <div className="mb-5 flex flex-wrap gap-4 justify-between items-center">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-text-primary hover:text-brand-text transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-text rounded-md -ml-2 px-2 py-1"
            aria-expanded={isDropdownOpen}
          >
            {stats.namaWilayahAsli || currentWilayahNama}
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute z-20 mt-2 w-64 rounded-md shadow-lg bg-card ring-1 ring-card-border focus:outline-none max-h-60 overflow-y-auto scrollbar-thin"
              >
                <div className="py-1">
                  {availableWilayahs.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleWilayahSelect(option.id)}
                      className={`group flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                        option.id === wilayah
                          ? "bg-brand-bg/10 text-brand-text font-semibold"
                          : "text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {option.nama}
                      {option.id === wilayah && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleNewsFeed}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            showNewsFeed
              ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
              : "bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-900"
          }`}
        >
          {showNewsFeed ? (
            <>
              <XCircle size={18} className="mr-2" /> Sembunyikan
            </>
          ) : (
            <>
              <Newspaper size={18} className="mr-2" /> Berita
            </>
          )}
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {statsForDisplay.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </motion.div>

      <AnimatePresence>
        {showNewsFeed && stats.berita && stats.berita.length > 0 && (
          <motion.div
            variants={newsFeedVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden mt-6"
          >
            <NewsFeedCard newsItems={stats.berita} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Komponen Skeleton
const SkeletonStatCard: React.FC = () => (
  <div className="bg-card p-5 rounded-xl shadow-sm h-32 animate-pulse">
    {" "}
    <div className="bg-slate-200 dark:bg-slate-700 h-8 w-8 rounded-lg mb-4"></div>{" "}
    <div className="bg-slate-200 dark:bg-slate-700 h-6 w-1/2 rounded-md mb-2"></div>{" "}
    <div className="bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded-md"></div>{" "}
  </div>
);
const SkeletonStatsRow: React.FC = () => (
  <div className="mb-8 md:mb-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {" "}
      {[1, 2, 3, 4].map((id) => (
        <SkeletonStatCard key={id} />
      ))}{" "}
    </div>
  </div>
);

// Variabel animasi
const newsFeedVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};
const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export default StatsRow;
