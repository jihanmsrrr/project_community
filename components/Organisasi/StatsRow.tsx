// components/Organisasi/StatsRow.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import StatCard from "./StatCard";
import NewsFeedCard from "./NewsFeedCard";
import {
  Users2,
  TrendingDown,
  Clock,
  Newspaper,
  XCircle,
  ChevronDown,
  Check,
} from "lucide-react";
// We are explicitly importing NewsItem from types/pegawai to ensure consistency
import type { AggregatedUnitData } from "@/types/pegawai";

import { motion, AnimatePresence, Variants } from "framer-motion";

interface WilayahOption {
  id: string;
  nama: string;
}

interface StatsRowProps {
  stats?: AggregatedUnitData;
  wilayah: string;
  availableWilayahs: WilayahOption[];
  onWilayahChange: (newWilayahId: string) => void;
}

const StatsRow: React.FC<StatsRowProps> = ({
  stats,
  wilayah,
  availableWilayahs,
  onWilayahChange,
}) => {
  const [showNewsFeed, setShowNewsFeed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleNewsFeed = () => setShowNewsFeed((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleWilayahSelect = (newWilayahId: string) => {
    if (newWilayahId !== wilayah) {
      onWilayahChange(newWilayahId);
    }
    setIsDropdownOpen(false);
  };

  const currentWilayahNama =
    availableWilayahs.find((w) => w.id === wilayah)?.nama || wilayah;

  const currentStats: AggregatedUnitData = stats || {
    id: "default",
    namaWilayahAsli: "Keseluruhan",
    jumlahPegawai: 0,
    jumlahPensiunTahunIni: 0,
    jumlahPensiun5TahunKedepan: 0,
    persenTerhadapABK: 0,
    rataUmurSatker: 0,
    rataKJKSatker: { jam: 0, menit: 0 },
    pejabatStruktural: [],
    namaSatkerLengkap: "Data Tidak Tersedia",
    berita: [], // Ensure this is an empty array of NewsItem
    subtextABK: "Target Tahunan",
    jumlahPegawaiPNS: 0,
    jumlahPegawaiNonPNS: 0,
    totalABK: 0,
    daftarTimKerja: [],
    // Add other missing properties that AggregatedUnitData might require
    alamat: null,
    telepon: null,
    web: null,
    kepalaNama: null,
    kepalaNIP: null,
    // Ensure all optional properties are explicitly defined if using `|| {}` or similar initialization
  };

  const statsForDisplay = [
    {
      id: 1,
      icon: <Users2 size={22} />,
      title: "Total Pegawai",
      value: (currentStats.jumlahPegawai ?? 0).toLocaleString(),
    },
    {
      id: 2,
      icon: <TrendingDown size={22} />,
      title: "Pegawai thd. ABK",
      value: `${(currentStats.persenTerhadapABK ?? 0).toFixed(2)} %`,
      subtext: currentStats.subtextABK ?? undefined,
      infoText: "Some info",
      bgColorClass: "bg-blue-500" as string,
      textColorClass: "text-white" as string,
    },
    {
      id: 3,
      icon: <TrendingDown size={22} />,
      title: "Pensiun Tahun Ini",
      value: (currentStats.jumlahPensiunTahunIni ?? 0).toLocaleString(),
      infoText: "More info",
    },
    {
      id: 4,
      icon: <Clock size={22} />,
      title: "Pensiun 5 Thn ke Depan",
      value: (currentStats.jumlahPensiun5TahunKedepan ?? 0).toLocaleString(),
    },
  ];

  if (!stats) {
    return (
      <div className="mb-8 md:mb-10">
        <div className="mb-4 sm:mb-5 flex justify-between items-center">
          <div className="animate-pulse bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-lg h-7 w-3/5 sm:w-2/5"></div>
          <div className="animate-pulse bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-lg h-9 w-10 sm:w-36"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((id) => (
            <SkeletonStatCard key={id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 md:mb-10">
      <div className="mb-4 sm:mb-5 flex justify-between items-center">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary-dark hover:text-brand-primary dark:hover:text-brand-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-focus rounded-md px-2 py-1"
            aria-expanded={isDropdownOpen}
            aria-controls="wilayah-dropdown"
          >
            {currentWilayahNama}
            <ChevronDown
              size={20}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                id="wilayah-dropdown"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-surface-card dark:bg-surface-card-dark ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-ui-border dark:scrollbar-thumb-ui-border-dark scrollbar-track-surface-page dark:scrollbar-track-surface-page-dark scrollbar-thumb-rounded-full"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1">
                  {availableWilayahs.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleWilayahSelect(option.id)}
                      className={`group flex items-center justify-between w-full px-4 py-2 text-sm text-text-secondary dark:text-text-secondary-dark ${
                        option.id === wilayah
                          ? "bg-brand-primary/10 dark:bg-brand-primary-dark/10 text-brand-primary dark:text-brand-primary-dark font-medium"
                          : "hover:bg-ui-fill dark:hover:bg-ui-fill-dark"
                      }`}
                      role="menuitem"
                    >
                      {option.nama}
                      {option.id === wilayah && (
                        <Check size={16} className="text-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleNewsFeed}
          aria-label={
            showNewsFeed ? "Sembunyikan Berita" : "Tampilkan Berita Terkini"
          }
          className={`
            inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium
            ${
              showNewsFeed
                ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-400 dark:hover:bg-red-800/40"
                : "bg-brand-50 text-brand-primary hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-primary-dark dark:hover:bg-brand-900/40"
            }
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-focus focus:ring-offset-2 dark:focus:ring-offset-background-dark
          `}
        >
          {showNewsFeed ? (
            <>
              <XCircle size={18} className="mr-2" /> Sembunyikan Berita
            </>
          ) : (
            <>
              <Newspaper size={18} className="mr-2" /> Berita Terkini
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsForDisplay.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtext={stat.subtext}
            infoText={stat.infoText}
            bgColorClass={stat.bgColorClass as string}
            textColorClass={stat.textColorClass as string}
          />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {showNewsFeed && (
          <motion.div
            id="news-feed-dynamic-section"
            key="news-feed-content-statsrow"
            role="region"
            aria-labelledby="news-feed-title"
            variants={newsFeedVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden rounded-lg shadow-lg dark:shadow-2xl mt-6"
          >
            {/* newsItems prop here uses the imported NewsItem type from types/pegawai */}
            <NewsFeedCard newsItems={currentStats.berita || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Varian Animasi (Framer Motion) ---
const newsFeedVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};
const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};
const SkeletonStatCard: React.FC = () => (
  <div className="bg-ui-background dark:bg-ui-background-dark p-4 sm:p-5 rounded-lg shadow-sm animate-pulse h-28 flex flex-col justify-between">
    <div className="flex items-center mb-3">
      <div className="bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-full h-8 w-8 mr-3"></div>
      <div className="bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-md h-5 w-3/4"></div>
    </div>
    <div className="bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-md h-6 w-1/2 mb-2"></div>
    <div className="bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-md h-4 w-2/3"></div>
  </div>
);

export default StatsRow;
