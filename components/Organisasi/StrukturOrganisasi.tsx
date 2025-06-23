// components/Organisasi/StrukturOrganisasi.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import type { DetailPegawaiData, Pejabat } from "@/types/pegawai";
import {
  dataStatistikLengkap,
  DataStatistikNasional,
} from "@/data/statistikProvinsi";
import { allDummyPegawai } from "@/data/dummyPegawaiService";

type WilayahKey = Extract<keyof DataStatistikNasional, string>;

interface StrukturOrganisasiProps {
  wilayahKode: WilayahKey;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    // Menerima custom prop 'i' untuk delay
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

interface PejabatCardProps {
  pejabat: Pejabat;
  isLeader?: boolean;
  onClick?: () => void;
}

const PejabatCard: React.FC<PejabatCardProps> = ({
  pejabat,
  isLeader,
  onClick,
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
        isLeader
          ? "border-2 border-sky-500 dark:border-sky-400"
          : "border border-slate-200 dark:border-slate-700"
      } ${onClick ? "cursor-pointer" : ""}`}
      variants={cardVariants} // Digunakan oleh parent motion component dengan staggerChildren
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
        {pejabat.fotoUrl ? (
          <Image
            src={pejabat.fotoUrl}
            alt={`Foto ${pejabat.nama}`}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <UserCircleIcon className="w-full h-full text-slate-400 dark:text-slate-500 p-1" />
        )}
      </div>
      <h4 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
        {pejabat.nama}
      </h4>
      <p className="text-xs sm:text-sm text-sky-600 dark:text-sky-400 font-medium mt-1">
        {pejabat.jabatan}
      </p>
    </motion.div>
  );
};

const StrukturOrganisasi: React.FC<StrukturOrganisasiProps> = ({
  wilayahKode,
}) => {
  const router = useRouter();
  const satkerData = dataStatistikLengkap[wilayahKode] as
    | DetailPegawaiData
    | undefined;

  const handlePejabatClick = (clickedPejabat: Pejabat) => {
    if (!satkerData) return;

    // ---------------------------------------------------------------------------
    // SARAN DAN REKOMENDASI TERKAIT PENCARIAN DETAIL PEGAWAI DARI STRUKTUR:
    // ---------------------------------------------------------------------------
    // Logika di bawah ini adalah upaya "best-effort" untuk menemukan data pegawai lengkap
    // (termasuk NIP) dari `allDummyPegawai` berdasarkan informasi minimalis (`nama`, `jabatan`)
    // yang ada pada objek `Pejabat` yang berasal dari `dataStatistikLengkap.pejabatStruktural`.

    // KETERBATASAN PENDEKATAN SAAT INI:
    // 1. Pencocokan Nama: `detailPegawai.nama.includes(clickedPejabat.nama)`
    //    - `clickedPejabat.nama` (dari `getPejabatUntukSatker`) adalah nama lengkap dengan gelar dari sumber awal.
    //    - `detailPegawai.nama` (dari `allDummyPegawai` yang di-generate oleh `dummyPegawaiService`)
    //      menggunakan `clickedPejabat.nama` sebagai inti, namun bisa saja ditambahkan gelar acak
    //      di depan atau belakangnya oleh `gelarDepanGlobal` dan `gelarBelakangGlobal`.
    //    - Metode `includes()` cukup baik untuk kasus ini, tetapi bisa jadi kurang presisi jika ada
    //      nama yang sangat mirip atau jika `clickedPejabat.nama` sendiri sangat generik.
    // 2. Tidak Ada ID Unik Langsung: Objek `Pejabat` saat ini tidak memiliki NIP atau ID unik pegawai
    //    yang bisa langsung digunakan untuk navigasi atau pencarian presisi.

    // SOLUSI IDEAL (JANGKA PANJANG) YANG DISARANKAN:
    // A. Memperkaya Tipe `Pejabat`:
    //    - Tambahkan field opsional `nipUntukDetail?: string` atau `pegawaiUnikId?: string` pada
    //      interface `Pejabat` di `src/types/pegawai.ts`.
    // B. Penyesuaian Data Generation:
    //    - Saat `getPejabatUntukSatker` di `data/statistikProvinsi.ts` membuat objek `Pejabat`,
    //      idealnya ia sudah bisa menyertakan NIP (jika NIP pejabat struktural ini statis/diketahui)
    //      atau ID unik yang akan konsisten dengan data pegawai yang di-generate.
    //    - Alternatifnya, setelah `allDummyPegawai` (yang berisi NIP) dan `dataStatistikLengkap`
    //      (yang berisi `pejabatStruktural` tanpa NIP) selesai di-generate, lakukan langkah
    //      post-processing:
    //        Iterasi `dataStatistikLengkap[kodeWilayah].pejabatStruktural`. Untuk setiap `Pejabat`,
    //        cari entri yang cocok di `allDummyPegawai` (berdasarkan nama, jabatan awal, dan konteks satker).
    //        Setelah ditemukan, suntikkan `nipBaru` dari `allDummyPegawai` ke field baru
    //        (misalnya `nipUntukDetail`) pada objek `Pejabat` di `dataStatistikLengkap`.
    // C. Hasil: Dengan NIP atau ID unik yang sudah ada di objek `Pejabat` yang diterima `PejabatCard`,
    //    navigasi bisa langsung dilakukan tanpa perlu pencarian "fuzzy" seperti di bawah ini.

    // Logika pencarian "best-effort" saat ini:
    const foundPegawai = allDummyPegawai.find((detailPegawai) => {
      const isNameMatch = detailPegawai.nama.includes(clickedPejabat.nama);
      const isJabatanMatch =
        detailPegawai.jabatanStruktural === clickedPejabat.jabatan;

      let isSatkerMatch = false;
      if (wilayahKode === "nasional") {
        isSatkerMatch = detailPegawai.satuanKerjaId === "NASIONAL";
      } else {
        isSatkerMatch =
          detailPegawai.satuanKerjaId === satkerData.satuanKerjaId;
      }
      return isNameMatch && isJabatanMatch && isSatkerMatch;
    });

    if (foundPegawai && foundPegawai.nipBaru) {
      router.push(`/organisasi/pegawai/${foundPegawai.nipBaru}`);
    } else {
      console.warn(
        "Peringatan: Detail pegawai lengkap (dari allDummyPegawai) tidak ditemukan untuk pejabat:",
        `Nama di Struktur: "${clickedPejabat.nama}"`,
        `Jabatan di Struktur: "${clickedPejabat.jabatan}"`,
        `Satker: ${satkerData?.namaWilayahAsli} (Kode: ${wilayahKode})`,
        "Hal ini mungkin disebabkan oleh ketidakcocokan dalam logika pencarian nama/jabatan/satker, atau data pejabat tersebut belum sepenuhnya di-generate di allDummyPegawai dengan detail yang cocok. Pertimbangkan Solusi Ideal di atas untuk perbaikan jangka panjang."
      );
      alert(
        `Detail lengkap untuk pejabat ${clickedPejabat.nama} (${clickedPejabat.jabatan}) saat ini belum dapat ditampilkan. Data pegawai terkait tidak ditemukan secara presisi.`
      );
    }
  };

  if (!satkerData) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
          Data Satker untuk {wilayahKode} tidak ditemukan.
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

  const containerVariants = {
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
          {/* Menerapkan custom prop ke motion.div yang membungkus PejabatCard */}
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
          <motion.div
            variants={containerVariants}
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(
              stafPimpinan.length,
              4
            )} gap-6`}
          >
            {stafPimpinan.map((pejabat, index) => (
              <motion.div
                custom={index + 1}
                key={pejabat.id}
                variants={cardVariants}
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
