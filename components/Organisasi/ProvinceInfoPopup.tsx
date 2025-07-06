// components/Organisasi/ProvinceInfoPopup.tsx
"use client";

import React from "react";
import { X, ExternalLink, Users, Building, Clock } from "lucide-react";
import {
  motion,
  AnimatePresence,
  Variants,
  type Transition,
} from "framer-motion";
// PERBAIKAN: Import AggregatedUnitData
import type { AggregatedUnitData } from "@/types/pegawai"; // Ganti DetailPegawaiData dengan AggregatedUnitData
import Link from "next/link";

interface ProvinceInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // PERBAIKAN UTAMA: Ubah tipe provinsiData menjadi AggregatedUnitData
  provinsiData?: AggregatedUnitData;
  provinceCode?: string;
  animationsDisabled?: boolean;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.05 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const ProvinceInfoPopup: React.FC<ProvinceInfoPopupProps> = ({
  isOpen,
  onClose,
  provinsiData,
  provinceCode,
  animationsDisabled,
}) => {
  const modalTransition: Transition = animationsDisabled // Add the ': Transition' type annotation here
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 300, damping: 30 };

  if (!provinsiData && isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && provinsiData && (
        <motion.div
          key="province-info-backdrop"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            key="province-info-content"
            className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl p-5 sm:p-6 w-full max-w-md text-slate-800 dark:text-slate-200 relative flex flex-col"
            variants={modalVariants}
            transition={modalTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-sky-600 dark:text-sky-400">
                Detail Statistik: {provinsiData.namaWilayahAsli}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="Tutup popup"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Statistik - Menggunakan properti dari AggregatedUnitData */}
              <div className="bg-white dark:bg-slate-700/50 p-3.5 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-0.5">
                  <Users size={14} />
                  Total Pegawai
                </p>
                <p className="font-semibold text-lg text-slate-700 dark:text-slate-100">
                  {(provinsiData.jumlahPegawai ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-700/50 p-3.5 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-0.5">
                  <Building size={14} />
                  Pegawai thd ABK
                </p>
                <p className="font-semibold text-lg text-slate-700 dark:text-slate-100">
                  {(provinsiData.persenTerhadapABK ?? 0).toFixed(2)} %
                </p>
                {/* subtextABK dan infoABK */}
                {provinsiData.subtextABK && (
                  <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 opacity-90 mt-1">
                    {provinsiData.subtextABK}
                  </p>
                )}
                {provinsiData.infoABK && (
                  <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 opacity-90 mt-1">
                    {provinsiData.infoABK}
                  </p>
                )}
              </div>
              <div className="bg-white dark:bg-slate-700/50 p-3.5 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-0.5">
                  <Clock size={14} />
                  Pensiun Tahun Ini
                </p>
                <p className="font-semibold text-lg text-slate-700 dark:text-slate-100">
                  {(provinsiData.jumlahPensiunTahunIni ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-700/50 p-3.5 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-0.5">
                  <Clock size={14} />
                  Pensiun 5 Thn ke Depan
                </p>
                <p className="font-semibold text-lg text-slate-700 dark:text-slate-100">
                  {(
                    provinsiData.jumlahPensiun5TahunKedepan ?? 0
                  ).toLocaleString()}
                </p>
              </div>
              {/* Rata-Rata Umur dan Rata-Rata KJK jika ada */}
              {provinsiData.rataUmurSatker !== undefined && (
                <div className="bg-white dark:bg-slate-700/50 p-3.5 rounded-lg shadow-sm">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-0.5">
                    <Users size={14} />{" "}
                    {/* Menggunakan Users untuk rata-rata umur pegawai */}
                    Rata-Rata Umur
                  </p>
                  <p className="font-semibold text-lg text-slate-700 dark:text-slate-100">
                    {(provinsiData.rataUmurSatker ?? 0).toFixed(2)} thn
                  </p>
                </div>
              )}
              {provinsiData.rataKJKSatker && (
                <div className="bg-white dark:bg-slate-700/50 p-3.5 rounded-lg shadow-sm">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-0.5">
                    <Clock size={14} />
                    Rata-Rata KJK
                  </p>
                  <p className="font-semibold text-lg text-slate-700 dark:text-slate-100">
                    {provinsiData.rataKJKSatker.jam ?? 0}j{" "}
                    {provinsiData.rataKJKSatker.menit ?? 0}m
                  </p>
                  {provinsiData.subtextKJK && (
                    <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 opacity-90 mt-1">
                      {provinsiData.subtextKJK}
                    </p>
                  )}
                </div>
              )}
            </div>

            {provinceCode && (
              <Link
                href={`/organisasi/struktur?wilayah=${provinceCode}`}
                passHref
                legacyBehavior
              >
                <a
                  className="mt-5 w-full bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-sky-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-800 text-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    onClose(); // Tutup popup saat link diklik
                  }}
                >
                  Lihat Struktur Satker <ExternalLink size={16} />
                </a>
              </Link>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProvinceInfoPopup;
