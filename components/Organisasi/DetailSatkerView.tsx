// components/Organisasi/DetailSatkerView.tsx
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  UsersIcon as UsersIconOutline, // Heroicon
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon as UserGroupIconOutlineHero, // Heroicon
  UserCircleIcon as UserCircleIconHero, // Heroicon
  InformationCircleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  AcademicCapIcon, // Untuk Fungsional
} from "@heroicons/react/24/outline";
// Jika Anda ingin menggunakan Lucide icons untuk beberapa hal:
// import { UsersIcon as UsersIconLucide } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import type { DetailPegawaiData, NewsItem, TimKerja } from "@/types/pegawai";
// Menggunakan data yang sudah diproses yang memiliki nipUntukDetail pada Pejabat
import {
  processedDataStatistikLengkap as dataStatistikLengkap,
  DataStatistikNasional,
} from "@/data/dummyPegawaiService";
import { allDummyPegawai } from "@/data/dummyPegawaiService"; // Diperlukan untuk memfilter staf & fungsional lainnya
import StrukturOrganisasi from "./StrukturOrganisasi";
import { ClipboardListIcon } from "lucide-react";

// Tipe WilayahKey
type WilayahKey = Extract<keyof DataStatistikNasional, string>;

// --- Komponen-komponen kecil untuk tampilan ---

const StatMiniCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  subtext?: string;
}> = ({ title, value, icon: Icon, subtext }) => (
  <div className="bg-white dark:bg-slate-700/50 p-3 rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex items-center text-slate-500 dark:text-slate-400 mb-0.5">
      <Icon className="w-4 h-4 mr-1.5 flex-shrink-0" />
      <p className="text-xs font-medium uppercase tracking-wider truncate">
        {title}
      </p>
    </div>
    <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
      {value}
    </p>
    {subtext && (
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
        {subtext}
      </p>
    )}
  </div>
);

const BeritaSatkerList: React.FC<{ berita?: NewsItem[] }> = ({ berita }) => {
  if (!berita || berita.length === 0) {
    return (
      <p className="text-sm text-center py-4 text-slate-500 dark:text-slate-400">
        Tidak ada berita terkait untuk ditampilkan.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {berita.slice(0, 3).map((item) => (
        <Link href={item.link || "#"} key={item.id} legacyBehavior>
          <a className="block p-3 bg-white dark:bg-slate-700/50 rounded-lg shadow hover:shadow-md transition-shadow group">
            <h4 className="font-semibold text-sky-600 dark:text-sky-400 group-hover:underline mb-0.5 text-sm truncate">
              {item.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {item.date} {item.author && `- ${item.author}`}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {item.snippet}
            </p>
          </a>
        </Link>
      ))}
      {berita.length > 3 && (
        <div className="mt-3 text-right">
          <Link href="#" legacyBehavior>
            {/* Ganti # dengan link halaman daftar berita jika ada */}
            <a className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium">
              Lihat semua berita &rarr;
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

const CollapsibleTimKerjaCard: React.FC<{ tim: TimKerja }> = ({ tim }) => {
  const [isOpen, setIsOpen] = useState(false);

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "0.75rem", // py-3
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div layout className="bg-white dark:bg-slate-800 rounded-lg shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
        aria-expanded={isOpen}
        aria-controls={`tim-detail-${tim.id}`}
      >
        <div className="flex-grow">
          <h4 className="text-sm sm:text-base font-semibold text-sky-700 dark:text-sky-400">
            {tim.namaTim} {tim.singkatan && `(${tim.singkatan})`}
          </h4>
        </div>
        <ChevronRightIcon
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 transform transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`tim-detail-${tim.id}`}
            key="content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden border-t border-slate-200 dark:border-slate-700"
          >
            <div className="p-3 space-y-3">
              {" "}
              {/* Konten diberi padding */}
              {tim.deskripsi && (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 italic">
                  <InformationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-500" />
                  <span>{tim.deskripsi}</span>
                </p>
              )}
              <div>
                {" "}
                {/* Wrapper untuk Ketua Tim */}
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" /> Ketua
                  Tim:
                </p>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded">
                  {tim.ketuaTim.fotoUrl ? (
                    <Image
                      src={tim.ketuaTim.fotoUrl}
                      alt={tim.ketuaTim.nama}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIconHero className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {tim.ketuaTim.nama}
                    </p>
                    <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                      {tim.ketuaTim.posisi}
                    </p>
                  </div>
                </div>
              </div>
              {tim.anggotaLain && tim.anggotaLain.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 mt-1.5">
                    Anggota Tim:
                  </p>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {tim.anggotaLain.map((anggota) => (
                      <li
                        key={anggota.id}
                        className="flex items-center gap-1.5 text-[0.7rem] py-1"
                      >
                        {anggota.fotoUrl ? (
                          <Image
                            src={anggota.fotoUrl}
                            alt={anggota.nama}
                            width={20}
                            height={20}
                            className="rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <UserCircleIconHero className="w-5 h-5 text-slate-300 dark:text-slate-500 flex-shrink-0" />
                        )}
                        <div className="flex-grow">
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {anggota.nama}
                          </span>
                          <span className="block text-slate-500 dark:text-slate-400">
                            {anggota.posisi}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>{" "}
            {/* Akhir padding konten */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const KategoriPersonelList: React.FC<{
  title: string;
  personel: DetailPegawaiData[];
  icon?: React.ReactNode;
}> = ({ title, personel, icon }) => {
  if (!personel || personel.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow">
      <div className="flex items-center text-sky-600 dark:text-sky-400 mb-2">
        {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
        <h3 className="text-sm sm:text-base font-semibold truncate">
          {title} ({personel.length})
        </h3>
      </div>
      <ul className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
        {personel.map((p) => (
          <li
            key={p.id}
            className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 py-1 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
          >
            <Image
              src={
                p.fotoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  p.nama
                )}&size=32&background=random&color=fff`
              }
              alt={p.nama}
              width={24}
              height={24}
              className="rounded-full object-cover flex-shrink-0"
            />
            <div className="truncate">
              <span className="font-medium block truncate">{p.nama}</span>
              <span className="block text-slate-500 dark:text-slate-400 text-[0.7rem] truncate">
                {p.jenjangJabatanFungsional || p.jabatanStruktural || "Staf"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Komponen Utama ---
interface DetailSatkerViewProps {
  wilayahKode: WilayahKey;
}

const DetailSatkerView: React.FC<DetailSatkerViewProps> = ({ wilayahKode }) => {
  const satkerData = dataStatistikLengkap[wilayahKode]; // Tidak perlu cast 'as DetailPegawaiData | undefined' jika WilayahKey valid

  // Memoized data personel per kategori fungsional
  const {
    fungsionalMuda,
    fungsionalPertama,
    fungsionalTerampil,
    pelaksanaDanStaf,
  } = useMemo(() => {
    if (!satkerData)
      return {
        fungsionalMuda: [],
        fungsionalPertama: [],
        fungsionalTerampil: [],
        pelaksanaDanStaf: [],
      };

    // Ambil NIP dari pejabat struktural yang sudah ditampilkan agar tidak duplikat
    const pejabatStrukturalNips = new Set(
      (satkerData.pejabatStruktural
        ?.map((p) => p.nipUntukDetail)
        .filter(Boolean) as string[]) || []
    );

    const pegawaiDiSatkerIni = allDummyPegawai.filter((p) => {
      if (wilayahKode === "nasional") return p.satuanKerjaId === "NASIONAL";
      return p.satuanKerjaId === satkerData.satuanKerjaId; // satkerData dijamin ada di sini
    });

    const stafDanFungsionalLain = pegawaiDiSatkerIni.filter(
      (p) => !pejabatStrukturalNips.has(p.nipBaru || "")
    );

    const kategorikan = (keyword: string) =>
      stafDanFungsionalLain.filter((p) =>
        p.jenjangJabatanFungsional?.toLowerCase().includes(keyword)
      );

    const muda = kategorikan("muda");
    const pertama = kategorikan("pertama");
    const terampil = kategorikan("terampil");

    // Pelaksana/Staf adalah sisanya yg tidak masuk kategori fungsional di atas
    const fungsionalDikenaliNips = new Set(
      [...muda, ...pertama, ...terampil].map((p) => p.nipBaru)
    );
    const pelaksana = stafDanFungsionalLain.filter(
      (p) => !fungsionalDikenaliNips.has(p.nipBaru)
    );

    return {
      fungsionalMuda: muda,
      fungsionalPertama: pertama,
      fungsionalTerampil: terampil,
      pelaksanaDanStaf: pelaksana,
    };
  }, [satkerData, wilayahKode]);

  if (!satkerData) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <BuildingOffice2Icon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
        <p className="mt-4 text-xl font-medium text-slate-600 dark:text-slate-300">
          Informasi Satuan Kerja tidak ditemukan.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kode Wilayah: {wilayahKode}
        </p>
      </div>
    );
  }

  const {
    nama,
    namaSatkerLengkap,
    namaWilayahAsli,
    fotoUrl,
    alamatKantor,
    teleponKantor,
    email,
    homepageSatker,
    totalPegawai,
    persenTerhadapABK,
    subtextABK,
    rataUmurSatker,
    rataKJKSatker,
    subtextKJK,
    berita,
    daftarTimKerja,
  } = satkerData;

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 }, // y sedikit dikurangi
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    }, // durasi disesuaikan
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Bagian Header Identitas Satker */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-6 bg-gradient-to-br from-sky-500 to-sky-600 dark:from-sky-700 dark:to-sky-800 rounded-xl shadow-xl text-white"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {fotoUrl && (
            <Image
              src={fotoUrl}
              alt={`Logo ${nama || "Satker"}`}
              width={80}
              height={80}
              className="rounded-lg object-contain bg-white p-0.5 shadow-md flex-shrink-0"
            />
          )}
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {nama}
            </h1>
            <p className="text-sm sm:text-base opacity-90">
              {namaSatkerLengkap}
            </p>
            {namaWilayahAsli && (
              <p className="text-xs opacity-80 mt-0.5">
                Wilayah Administrasi: {namaWilayahAsli}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Bagian Statistik Agregat */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2.5">
          Sekilas Info Satker
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {typeof totalPegawai === "number" && (
            <StatMiniCard
              title="Total Pegawai"
              value={totalPegawai.toLocaleString()}
              icon={UsersIconOutline}
            />
          )}
          {typeof persenTerhadapABK === "number" && (
            <StatMiniCard
              title="% thd ABK"
              value={`${persenTerhadapABK.toFixed(1)}%`}
              icon={ChartBarIcon}
              subtext={subtextABK}
            />
          )}
          {typeof rataUmurSatker === "number" && (
            <StatMiniCard
              title="Rerata Umur"
              value={`${rataUmurSatker.toFixed(1)} thn`}
              icon={UserGroupIconOutlineHero}
            />
          )}
          {rataKJKSatker && (
            <StatMiniCard
              title="Rerata KJK"
              value={`${rataKJKSatker.jam}j ${rataKJKSatker.menit}m`}
              icon={ClockIcon}
              subtext={subtextKJK}
            />
          )}
        </div>
      </motion.section>

      {/* Bagian Informasi Kontak & Lokasi */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2.5">
          Kontak & Lokasi
        </h2>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg space-y-2.5 text-xs">
          {alamatKantor && (
            <div className="flex items-start gap-2">
              {" "}
              <MapPinIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 mt-px flex-shrink-0" />{" "}
              <span className="text-slate-600 dark:text-slate-300">
                {alamatKantor}
              </span>{" "}
            </div>
          )}
          {teleponKantor && (
            <div className="flex items-center gap-2">
              {" "}
              <PhoneIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />{" "}
              <span className="text-slate-600 dark:text-slate-300">
                {teleponKantor}
              </span>{" "}
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2">
              {" "}
              <EnvelopeIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />{" "}
              <a
                href={`mailto:${email}`}
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                {email}
              </a>{" "}
            </div>
          )}
          {homepageSatker && (
            <div className="flex items-center gap-2">
              {" "}
              <GlobeAltIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />{" "}
              <a
                href={homepageSatker}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                {" "}
                {homepageSatker.replace(/^https?:\/\//, "")}{" "}
                <span className="text-[0.65rem]">↗</span>
              </a>
            </div>
          )}
        </div>
      </motion.section>

      {/* Bagian Struktur Organisasi (Pimpinan Utama & Koordinator Fungsi/Kabag) */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Judul "Struktur Organisasi" sekarang ada di dalam komponen StrukturOrganisasi */}
        <StrukturOrganisasi wilayahKode={wilayahKode} />
      </motion.section>

      {/* --- BAGIAN BARU: DAFTAR PERSONEL FUNGSIONAL & STAF LAINNYA --- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2.5">
          Personel Fungsional & Staf Pendukung
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <KategoriPersonelList
            title="Fungsional Ahli Muda"
            personel={fungsionalMuda}
            icon={<AcademicCapIcon className="w-4 h-4" />}
          />
          <KategoriPersonelList
            title="Fungsional Ahli Pertama"
            personel={fungsionalPertama}
            icon={<AcademicCapIcon className="w-4 h-4" />}
          />
          <KategoriPersonelList
            title="Fungsional Terampil"
            personel={fungsionalTerampil}
            icon={<AcademicCapIcon className="w-4 h-4" />}
          />
          <KategoriPersonelList
            title="Pelaksana & Staf"
            personel={pelaksanaDanStaf}
            icon={<ClipboardListIcon className="w-4 h-4" />}
          />
        </div>
      </motion.section>

      {/* --- BAGIAN DAFTAR TIM KERJA (COLLAPSIBLE) --- */}
      {daftarTimKerja && daftarTimKerja.length > 0 && (
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2.5">
            Tim Kerja Internal
          </h2>
          <div className="space-y-3">
            {daftarTimKerja.map((tim) => (
              <CollapsibleTimKerjaCard key={tim.id} tim={tim} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Bagian Berita Terkait Satker */}
      {berita && berita.length > 0 && (
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2.5">
            Berita & Kegiatan Terkait
          </h2>
          <BeritaSatkerList berita={berita} />
        </motion.section>
      )}
    </div>
  );
};

export default DetailSatkerView;
