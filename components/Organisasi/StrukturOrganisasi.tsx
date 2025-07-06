// components/Organisasi/StrukturOrganisasi.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, Variants } from "framer-motion";

// Import tipe data yang telah disesuaikan
import type { AggregatedUnitData, Pejabat } from "@/types/pegawai";

type WilayahKey = string;

interface StrukturOrganisasiProps {
  wilayahKode: WilayahKey;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  }),
};

interface PejabatCardProps {
  pejabat: Pejabat;
  isLeader?: boolean;
  onClick?: () => void;
}

// FIX: Komponen PejabatCard hanya merender satu kartu pejabat.
// Logika grid telah dipindahkan ke komponen utama.
const PejabatCard: React.FC<PejabatCardProps> = ({
  pejabat,
  isLeader,
  onClick,
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] h-full ${
        isLeader
          ? "border-2 border-sky-500 dark:border-sky-400"
          : "border border-slate-200 dark:border-slate-700"
      } ${onClick ? "cursor-pointer" : ""}`}
      variants={cardVariants}
      whileHover={{ y: -5 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div
        className={`relative w-24 h-24 sm:w-28 sm:h-28 mb-3 rounded-full overflow-hidden shadow-md ${
          isLeader
            ? "ring-4 ring-sky-300 dark:ring-sky-600"
            : "ring-2 ring-slate-300 dark:ring-slate-600"
        }`}
      >
        {pejabat.foto_url ? (
          <Image
            src={pejabat.foto_url}
            alt={`Foto ${pejabat.nama_lengkap}`}
            layout="fill"
            objectFit="cover"
            className="bg-slate-200"
          />
        ) : (
          <UserCircleIcon className="w-full h-full text-slate-400 dark:text-slate-500 p-1" />
        )}
      </div>
      <h4 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
        {pejabat.nama_lengkap || "Nama Pejabat"}
      </h4>
      <p className="text-xs sm:text-sm text-sky-600 dark:text-sky-400 font-medium mt-1">
        {pejabat.jabatan_struktural || "Jabatan tidak tersedia"}
      </p>
    </motion.div>
  );
};

const StrukturOrganisasi: React.FC<StrukturOrganisasiProps> = ({
  wilayahKode,
}) => {
  const router = useRouter();

  const [dataOrganisasiApi, setDataOrganisasiApi] = useState<{
    dataStatistikLengkap: { [key: string]: AggregatedUnitData };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrgData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/organisasi/dashboard-data");
        if (!response.ok)
          throw new Error("Failed to fetch organization data for structure");
        const data: {
          dataStatistikLengkap: { [key: string]: AggregatedUnitData };
        } = await response.json();
        setDataOrganisasiApi(data);
      } catch (error) {
        console.error("Error fetching organization data for structure:", error);
        setDataOrganisasiApi(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgData();
  }, []);

  const satkerData = dataOrganisasiApi?.dataStatistikLengkap[wilayahKode];

  const handlePejabatClick = (clickedPejabat: Pejabat) => {
    if (clickedPejabat.nip_baru) {
      router.push(`/organisasi/pegawai/${clickedPejabat.nip_baru}`);
    } else {
      console.warn(
        "NIP Baru pejabat tidak ditemukan, tidak bisa navigasi:",
        clickedPejabat
      );
      // FIX: Menggunakan properti yang benar dalam pesan alert
      alert(
        `Detail lengkap untuk pejabat ${
          clickedPejabat.nama_lengkap || clickedPejabat.jabatan_struktural
        } saat ini belum dapat ditampilkan. NIP pegawai tidak tersedia.`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
          Memuat struktur organisasi...
        </p>
      </div>
    );
  }

  if (!satkerData) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
          {`Data Satker untuk "${wilayahKode}" tidak ditemukan.`}
        </p>
      </div>
    );
  }

  const { pejabatStruktural, namaSatkerLengkap, namaWilayahAsli } = satkerData;

  if (!pejabatStruktural || pejabatStruktural.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <UserCircleIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
          Tidak ada data pejabat struktural untuk{" "}
          {namaSatkerLengkap || namaWilayahAsli}.
        </p>
      </div>
    );
  }

  const pimpinanUtama = pejabatStruktural[0];
  const stafPimpinan = pejabatStruktural.slice(1);

  // FIX: Pindahkan konstanta ini ke dalam scope komponen agar bisa mengakses 'stafPimpinan'
  const gridColsMap: { [key: number]: string } = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };
  const numCols = Math.max(1, Math.min(stafPimpinan.length, 4));
  const gridColsClass = gridColsMap[numCols] || "lg:grid-cols-4"; // Fallback untuk keamanan

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <div className="text-center mb-8 border-b-2 border-sky-500 dark:border-sky-400 pb-4">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
          className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight"
        >
          Struktur Organisasi
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="text-lg sm:text-xl text-sky-600 dark:text-sky-400 font-medium"
        >
          {namaSatkerLengkap || namaWilayahAsli}
        </motion.p>
      </div>

      {pimpinanUtama && (
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            custom={0}
            variants={cardVariants}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <PejabatCard
              pejabat={pimpinanUtama}
              isLeader
              onClick={() => handlePejabatClick(pimpinanUtama)}
            />
          </motion.div>
          {stafPimpinan.length > 0 && (
            <ChevronDownIcon className="h-10 w-10 text-slate-400 dark:text-slate-500 transform animate-bounce" />
          )}
        </div>
      )}

      {stafPimpinan.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6 text-center">
            Pejabat Struktural
          </h3>
          {/* FIX: Logika grid dan pemetaan diterapkan di sini dengan kelas yang benar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-6`}
          >
            {stafPimpinan.map((pejabat, index) => (
              <motion.div
                custom={index + 1}
                key={pejabat.user_id?.toString() || index}
                variants={cardVariants}
                className="flex" // Menambahkan flex untuk memastikan kartu mengisi tinggi yang sama jika perlu
              >
                <PejabatCard
                  pejabat={pejabat}
                  onClick={() => handlePejabatClick(pejabat)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StrukturOrganisasi;
