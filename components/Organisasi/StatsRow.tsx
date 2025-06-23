// components/Organisasi/StatsRow.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import StatCard from "./StatCard"; // Assuming StatCard is in the same directory or ./dashboard/StatCard
import NewsFeedCard from "./NewsFeedCard";
import {
  Building2,
  Users2,
  TrendingDown,
  Clock,
  Newspaper,
  XCircle,
  ChevronDown,
  Check,
} from "lucide-react";
// 1. Import the correct DetailPegawaiData type and NewsItem if needed for defaults
import type { DetailPegawaiData, NewsItem } from "@/types/pegawai";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface WilayahOption {
  id: string; // This should match the type of WilayahKey used in Organisasi.tsx if passed directly
  nama: string;
}

interface StatsRowProps {
  // 2. Use DetailPegawaiData for the stats prop
  stats?: DetailPegawaiData;
  wilayah: string; // This would be WilayahKey from Organisasi.tsx
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

  // 3. Adjust the default/fallback object for currentStats to match DetailPegawaiData
  //    Ensure all fields accessed below have a default value.
  const currentStats: DetailPegawaiData = stats || {
    // Mandatory fields from DetailPegawaiData:
    id: "default-id",
    nama: "Tidak Ada Data", // Or specific name for default state
    namaSatkerLengkap: "Informasi Tidak Tersedia",
    namaWilayahAsli: "Keseluruhan", // Or a more generic default

    // Fields used in statsForDisplay and NewsFeedCard with defaults:
    totalPegawai: 0,
    persenTerhadapABK: 0,
    subtextABK: "Belum ada data ABK",
    infoABK: undefined,
    rataUmurSatker: 0,
    rataKJKSatker: { jam: 0, menit: 0 },
    subtextKJK: "Belum ada data KJK",
    berita: [] as NewsItem[], // Default to empty NewsItem array

    // Add other non-optional fields from DetailPegawaiData with appropriate defaults
    // if they were to be accessed directly or for type completeness.
    // For example, if nipBaru was required and accessed: nipBaru: "N/A"
    // Only include defaults for fields that might be rendered or cause errors if undefined.
  };

  // 4. Update data access in statsForDisplay to use correct field names and handle optionals
  const statsForDisplay = [
    {
      id: 1,
      icon: <Building2 size={22} className="text-metric-icon-1" />,
      title: "Total Pegawai",
      value: (currentStats.totalPegawai ?? 0).toLocaleString(),
      bgColorClass: "bg-metric-card-bg-1",
      textColorClass: "text-metric-card-text-1",
    },
    {
      id: 2,
      icon: <Users2 size={22} className="text-metric-icon-2" />,
      title: "Pegawai terhadap ABK",
      value: `${(currentStats.persenTerhadapABK ?? 0).toFixed(2)} %`,
      subtext: currentStats.subtextABK || "Target Tahunan",
      infoText: currentStats.infoABK,
      bgColorClass: "bg-metric-card-bg-2",
      textColorClass: "text-metric-card-text-2",
    },
    {
      id: 3,
      icon: <TrendingDown size={22} className="text-metric-icon-3" />,
      title: "Rata-Rata Umur Pegawai",
      value: `${(currentStats.rataUmurSatker ?? 0).toFixed(2)} thn`, // Use rataUmurSatker
      // subtext: "Data Terkini", // 'subtextUmur' was not in DetailPegawaiData
      bgColorClass: "bg-metric-card-bg-3",
      textColorClass: "text-metric-card-text-3",
    },
    {
      id: 4,
      icon: <Clock size={22} className="text-metric-icon-4" />,
      title: "Rata-Rata KJK",
      value: `${currentStats.rataKJKSatker?.jam ?? 0}j ${
        currentStats.rataKJKSatker?.menit ?? 0
      }m`, // Use rataKJKSatker
      subtext: currentStats.subtextKJK || "Data KJK",
      bgColorClass: "bg-metric-card-bg-4",
      textColorClass: "text-metric-card-text-4",
    },
  ];

  if (!stats) {
    // Skeleton loading UI remains the same
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
        {/* Dropdown UI */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="group inline-flex items-center justify-between rounded-lg px-3 py-1.5 text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary-dark tracking-tight hover:bg-ui-hover dark:hover:bg-ui-hover-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus dark:focus-visible:ring-brand-focus-dark focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page dark:focus-visible:ring-offset-surface-page-dark transition-colors duration-150"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onKeyDown={(e) =>
              e.key === "Enter" && setIsDropdownOpen(!isDropdownOpen)
            }
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label={`Pilih Wilayah, Wilayah saat ini: ${currentWilayahNama}`}
          >
            <span className="mr-2">Statistik Wilayah:</span>
            <span className="font-semibold text-brand-primary dark:text-brand-primary-dark group-hover:text-brand-primary-hover dark:group-hover:text-brand-primary-hover-dark">
              {currentWilayahNama}
            </span>
            <ChevronDown
              size={22}
              aria-hidden="true"
              className={`ml-2 transform text-text-secondary dark:text-text-secondary-dark group-hover:text-brand-primary dark:group-hover:text-brand-primary-dark transition-transform duration-200 ease-in-out ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute left-0 z-20 mt-2 w-auto min-w-[280px] max-h-80 origin-top-left overflow-auto rounded-xl bg-surface-raised dark:bg-surface-raised-dark shadow-2xl ring-1 ring-ui-border dark:ring-ui-border-dark focus:outline-none py-2"
                role="listbox"
                aria-label="Daftar Wilayah"
              >
                {availableWilayahs.map((w) => (
                  <li
                    key={w.id}
                    onClick={() => handleWilayahSelect(w.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleWilayahSelect(w.id)
                    }
                    className={`flex items-center justify-between mx-2 px-3 py-2.5 text-sm rounded-md cursor-pointer transition-all duration-100 ease-in-out group/item
                      ${
                        w.id === wilayah
                          ? "font-semibold text-brand-primary dark:text-brand-primary-dark bg-brand-surface dark:bg-brand-surface-dark"
                          : "text-text-primary dark:text-text-primary-dark hover:bg-ui-hover dark:hover:bg-ui-hover-dark focus:bg-ui-hover dark:focus:bg-ui-hover-dark focus:outline-none"
                      }
                    `}
                    role="option"
                    aria-selected={w.id === wilayah}
                    tabIndex={0}
                  >
                    <span className="truncate">{w.nama}</span>
                    {w.id === wilayah && (
                      <Check
                        size={18}
                        className="ml-3 text-brand-primary dark:text-brand-primary-dark opacity-90"
                      />
                    )}
                  </li>
                ))}
                {availableWilayahs.length === 0 && (
                  <li className="px-3.5 py-2.5 text-sm text-text-disabled dark:text-text-disabled-dark text-center">
                    Tidak ada pilihan wilayah.
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Tombol Berita */}
        <button
          onClick={toggleNewsFeed}
          aria-label={
            showNewsFeed ? "Sembunyikan Berita" : "Tampilkan Berita Terkini"
          }
          className={`
            flex items-center justify-center gap-2 
            px-3 py-1.5 sm:px-4 sm:py-2 
            text-xs sm:text-sm font-semibold rounded-lg 
            transition-all duration-200 ease-in-out
            transform hover:scale-[1.03] active:scale-[0.98]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
            focus-visible:ring-brand-focus dark:focus-visible:ring-brand-focus-dark
            focus-visible:ring-offset-background dark:focus-visible:ring-offset-background-dark
            ${
              showNewsFeed
                ? "bg-surface-interactive text-text-interactive hover:bg-surface-interactive-hover dark:bg-surface-interactive-dark dark:text-text-interactive-dark dark:hover:bg-surface-interactive-hover-dark"
                : "bg-brand-primary text-white hover:bg-brand-primary-hover dark:bg-brand-primary-dark dark:text-brand-text-dark dark:hover:bg-brand-primary-hover-dark"
            }
            shadow-sm hover:shadow-md
          `}
        >
          {showNewsFeed ? (
            <XCircle size={18} aria-hidden="true" />
          ) : (
            <Newspaper size={18} aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {showNewsFeed ? "Sembunyikan" : "Berita"}
          </span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsForDisplay.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtext={stat.subtext}
            infoText={stat.infoText}
            bgColorClass={stat.bgColorClass}
            textColorClass={stat.textColorClass}
          />
        ))}
      </div>

      {/* News Feed Section */}
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
            {/* Pass the berita array from currentStats (which is DetailPegawaiData) */}
            <NewsFeedCard newsItems={currentStats.berita || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Varian Animasi (Framer Motion) ---
const newsFeedVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: "1.5rem", // Corresponds to mt-6
    transition: {
      height: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
      opacity: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
      marginTop: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      height: { duration: 0.3, ease: "circOut" },
      opacity: { duration: 0.2, ease: "circOut" },
      marginTop: { duration: 0.3, ease: "circOut" },
    },
  },
};

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.1, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.1, ease: "easeOut" },
  },
};

const SkeletonStatCard: React.FC = () => (
  <div className="animate-pulse bg-ui-border/30 dark:bg-ui-border-dark/30 rounded-xl h-32 sm:h-36 w-full" />
);

export default StatsRow;
