// components/Organisasi/DetailSatkerView.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  UsersIcon as UsersIconOutline,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon as UserGroupIconOutlineHero,
  InformationCircleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Import tipe yang relevan dari types/pegawai.ts
import type {
  NewsItem,
  TimKerja,
  PegawaiDetail,
  DashboardDataApi,
  // Removed AggregatedUnitData import as it's not directly used here
  // and linting flags it as unused. It's still implicitly used via DashboardDataApi.
} from "@/types/pegawai";
import StrukturOrganisasi from "./StrukturOrganisasi";
import { ClipboardListIcon } from "lucide-react"; // Pastikan Anda menginstal lucide-react

// Tipe WilayahKey (disesuaikan agar fleksibel dengan string apa pun yang bisa jadi kode unit)
type WilayahKey = string;

// --- Komponen-komponen kecil untuk tampilan ---

const StatMiniCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  subtext?: string; // This indicates string or undefined (NOT null)
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

  const contentVariants: Variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "0.75rem",
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
              {tim.deskripsi && (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 italic">
                  <InformationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-500" />
                  <span>{tim.deskripsi}</span>
                </p>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" /> Ketua
                  Tim:
                </p>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded">
                  {/* --- PERBAIKAN: Fallback untuk fotoUrl Ketua Tim --- */}
                  <Image
                    src={
                      tim.ketuaTim.fotoUrl &&
                      typeof tim.ketuaTim.fotoUrl === "string" &&
                      tim.ketuaTim.fotoUrl !== ""
                        ? tim.ketuaTim.fotoUrl
                        : "/images/default-avatar.png" // Fallback ke gambar placeholder avatar
                    }
                    alt={tim.ketuaTim.nama}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  {/* --- AKHIR PERBAIKAN --- */}
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
                        {/* --- PERBAIKAN: Fallback untuk fotoUrl Anggota Tim --- */}
                        <Image
                          src={
                            anggota.fotoUrl &&
                            typeof anggota.fotoUrl === "string" &&
                            anggota.fotoUrl !== ""
                              ? anggota.fotoUrl
                              : "/images/default-avatar.png" // Fallback ke gambar placeholder avatar
                          }
                          alt={anggota.nama}
                          width={20}
                          height={20}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                        {/* --- AKHIR PERBAIKAN --- */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const KategoriPersonelList: React.FC<{
  title: string;
  personel: PegawaiDetail[];
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
            key={p.user_id.toString()}
            className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 py-1 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
          >
            <Image
              src={
                p.foto_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  p.nama_lengkap || "Pegawai"
                )}&size=32&background=random&color=fff`
              }
              alt={p.nama_lengkap || "Pegawai"}
              width={24}
              height={24}
              className="rounded-full object-cover flex-shrink-0"
            />
            <div className="truncate">
              <span className="font-medium block truncate">
                {p.nama_lengkap}
              </span>
              <span className="block text-slate-500 dark:text-slate-400 text-[0.7rem] truncate">
                {p.jenjang_jabatan_fungsional || p.jabatan_struktural || "Staf"}
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
  const [dashboardData, setDashboardData] = useState<DashboardDataApi | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/organisasi/dashboard-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardDataApi = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const satkerData = useMemo(() => {
    if (!dashboardData) return null;
    return dashboardData.dataStatistikLengkap[wilayahKode];
  }, [dashboardData, wilayahKode]);

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <BuildingOffice2Icon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 animate-pulse" />
        <p className="mt-4 text-xl font-medium text-slate-600 dark:text-slate-300">
          Memuat informasi Satuan Kerja...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-red-500">
        <InformationCircleIcon className="mx-auto h-16 w-16 text-red-400" />
        <p className="mt-4 text-xl font-medium">{error}</p>
        <p className="text-sm text-red-400">
          Silakan periksa koneksi internet Anda atau hubungi administrator.
        </p>
      </div>
    );
  }

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
    namaWilayahAsli: nama,
    namaSatkerLengkap,
    alamat: alamatKantor,
    telepon: teleponKantor,
    web: homepageSatker,
    jumlahPegawai: totalPegawai,
    persenTerhadapABK,
    subtextABK,
    rataUmurSatker,
    rataKJKSatker,
    subtextKJK,
    berita,
    daftarTimKerja,
    fungsionalMuda,
    fungsionalPertama,
    fungsionalTerampil,
    pelaksanaDanStaf,
  } = satkerData;

  const satkerLogoUrl = "/bps-logo-darkmode.svg";

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
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
          {satkerLogoUrl && (
            <Image
              src={satkerLogoUrl}
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
            {nama && (
              <p className="text-xs opacity-80 mt-0.5">
                Wilayah Administrasi: {nama}
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
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
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
              subtext={subtextABK === null ? undefined : subtextABK}
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
              subtext={subtextKJK === null ? undefined : subtextKJK}
            />
          )}
        </motion.div>
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
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg space-y-2.5 text-xs"
        >
          {alamatKantor && (
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 mt-px flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">
                {alamatKantor}
              </span>
            </div>
          )}
          {teleponKantor && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">
                {teleponKantor}
              </span>
            </div>
          )}
          {/* Removed direct access to satkerData.email */}
          {/* If you add 'email' to AggregatedUnitData later, you can uncomment this */}
          {/* {satkerData.email && (
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />
              <a
                href={`mailto:${satkerData.email}`}
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                {satkerData.email}
              </a>
            </div>
          )} */}
          {homepageSatker && (
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />
              <a
                href={homepageSatker}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                {homepageSatker.replace(/^https?:\/\//, "")}
                <span className="text-[0.65rem]">↗</span>
              </a>
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* Bagian Struktur Organisasi (Pimpinan Utama & Koordinator Fungsi/Kabag) */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
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
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          <KategoriPersonelList
            title="Fungsional Ahli Muda"
            personel={fungsionalMuda || []}
            icon={<AcademicCapIcon className="w-4 h-4" />}
          />
          <KategoriPersonelList
            title="Fungsional Ahli Pertama"
            personel={fungsionalPertama || []}
            icon={<AcademicCapIcon className="w-4 h-4" />}
          />
          <KategoriPersonelList
            title="Fungsional Terampil"
            personel={fungsionalTerampil || []}
            icon={<AcademicCapIcon className="w-4 h-4" />}
          />
          <KategoriPersonelList
            title="Pelaksana & Staf"
            personel={pelaksanaDanStaf || []}
            icon={<ClipboardListIcon className="w-4 h-4" />}
          />
        </motion.div>
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
          <motion.div variants={itemVariants} className="space-y-3">
            {daftarTimKerja.map((tim) => (
              <CollapsibleTimKerjaCard key={tim.id} tim={tim} />
            ))}
          </motion.div>
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
          <motion.div variants={itemVariants}>
            <BeritaSatkerList berita={berita} />
          </motion.div>
        </motion.section>
      )}
    </div>
  );
};

export default DetailSatkerView;
