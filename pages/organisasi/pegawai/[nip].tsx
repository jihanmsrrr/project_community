// pages/organisasi/pegawai/[nip].tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftCircleIcon,
  UserCircleIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  TrophyIcon,
  FingerprintIcon,
} from "lucide-react";
import {
  CheckBadgeIcon as BadgeCheckIconOutline,
  AtSymbolIcon as AtSymbolIconOutline,
} from "@heroicons/react/24/outline";
import { format } from "date-fns"; // Import format dari date-fns
import { id } from "date-fns/locale"; // Import locale id dari date-fns

import type { DetailPegawaiData } from "@/types/pegawai";
import PageTitle from "@/components/ui/PageTitle";

// Helper untuk memformat tanggal sederhana
const formatDateSimple = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  const d = date instanceof Date ? date : new Date(date); // Konversi string ke Date jika perlu
  if (isNaN(d.getTime())) return "N/A"; // Cek jika Date tidak valid
  return format(d, "dd MMM yyyy", { locale: id }); // Menggunakan 'yyyy' untuk tahun penuh
};

// Komponen RiwayatItemCard (tetap sama)
const RiwayatItemCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg shadow">
    <div className="flex items-center text-sky-600 dark:text-sky-400 mb-2">
      {icon && <span className="mr-2">{icon}</span>}
      <h3 className="text-md font-semibold">{title}</h3>
    </div>
    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
      {children}
    </div>
  </div>
);

const DetailPegawaiHalaman: React.FC = () => {
  const router = useRouter();
  const { nip } = router.query;

  const [pegawai, setPegawai] = useState<DetailPegawaiData | null | undefined>(
    undefined
  );

  // --- Fetch data pegawai dari API ---
  useEffect(() => {
    const fetchPegawai = async () => {
      if (nip && typeof nip === "string") {
        try {
          // Panggil API Route untuk detail pegawai
          const response = await fetch(`/api/organisasi/pegawai/${nip}`);
          if (!response.ok) {
            // Jika response 404, set pegawai ke null (tidak ditemukan)
            if (response.status === 404) {
              setPegawai(null);
            } else {
              throw new Error(
                `Gagal mengambil data pegawai: ${response.status} ${response.statusText}`
              );
            }
          } else {
            const data: DetailPegawaiData = await response.json();
            setPegawai(data);
          }
        } catch (error) {
          console.error("Error fetching pegawai detail:", error);
          setPegawai(null); // Set ke null jika ada error lain
        }
      }
    };
    fetchPegawai();
  }, [nip]); // Dipanggil ulang jika NIP berubah

  const menuButtonBaseStyle =
    "py-3 px-4 sm:px-6 rounded-lg text-primary font-poppins text-sm sm:text-base text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const menuItems = [
    { label: "Peta & Statistik", path: "/organisasi" },
    { label: "Struktur Organisasi", path: "/organisasi/struktur" },
    { label: "Cari Pegawai", path: "/organisasi/pegawai" },
  ];

  if (pegawai === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-300">
          Memuat data pegawai...
        </p>
      </div>
    );
  }

  if (!pegawai) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div
          className="relative text-center py-8 sm:py-10 shadow-lg bg-cover bg-center mb-8"
          style={{ backgroundImage: "url('/titlebg.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
          <div className="relative z-10">
            <PageTitle title="Profil Pegawai Tidak Ditemukan" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Data pegawai dengan NIP <span className="font-semibold">{nip}</span>{" "}
            tidak ditemukan.
          </p>
          <Link href="/organisasi/pegawai" legacyBehavior>
            <a className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors group">
              <ArrowLeftCircleIcon className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Kembali ke Pencarian Pegawai
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col">
      {/* Bagian Page Title */}
      <div
        className="relative text-center py-8 sm:py-10 shadow-lg bg-cover bg-center"
        style={{ backgroundImage: "url('/titlebg.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
        <div className="relative z-10">
          <PageTitle title="Profil Pegawai" />
        </div>
      </div>
      {/* Bagian Menu Navigasi Horizontal */}
      <div className="bg-white dark:bg-slate-800 shadow-md sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center py-3 sm:py-4">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/organisasi/pegawai" &&
                router.pathname.startsWith("/organisasi/pegawai");
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`${menuButtonBaseStyle} 
                    ${
                      isActive
                        ? "bg-[#adcbe3] dark:bg-[#8ab6d6] text-slate-900 dark:text-slate-100 font-semibold shadow-md ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-blue-500 dark:ring-sky-400"
                        : "bg-[#e0eaf4] dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-[#d0ddeb] dark:hover:bg-slate-600 shadow-sm"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Konten Utama Detail Pegawai */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-6">
          <Link href="/organisasi/pegawai" legacyBehavior>
            <a className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors group">
              <ArrowLeftCircleIcon className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
              Kembali ke Pencarian Pegawai
            </a>
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 md:p-8">
          {/* Bagian Header Profil */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg ring-4 ring-sky-300 dark:ring-sky-600 flex-shrink-0">
              {/* PERBAIKAN: Gunakan foto_url dari DetailPegawaiData */}
              {pegawai.foto_url ? (
                <Image
                  src={pegawai.foto_url}
                  alt={`Foto ${pegawai.nama_lengkap || "Pegawai"}`}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <UserCircleIcon className="w-full h-full text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                {/* PERBAIKAN: Gunakan nama_lengkap */}
                {pegawai.nama_lengkap || "Nama Pegawai Tidak Diketahui"}
              </h1>
              <p className="text-md text-sky-600 dark:text-sky-400 font-medium">
                {/* PERBAIKAN: Gunakan jabatan_struktural atau jenjang_jabatan_fungsional */}
                {pegawai.jabatan_struktural ||
                  pegawai.jenjang_jabatan_fungsional ||
                  "Jabatan Belum Tersedia"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {/* PERBAIKAN: Akses unit_kerja dari relasi atau unit_kerja_eselon2 */}
                {pegawai.unit_kerja?.nama_wilayah || // Using nama_wilayah which exists in schema
                  pegawai.unit_kerja_eselon2 ||
                  "Satuan Kerja Tidak Diketahui"}
              </p>
              {pegawai.unit_kerja_eselon1 && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {/* PERBAIKAN: Akses unit_kerja_eselon1 dan unit_kerja_eselon2 */}
                  {pegawai.unit_kerja_eselon1}
                  {pegawai.unit_kerja_eselon2
                    ? ` > ${pegawai.unit_kerja_eselon2}`
                    : ""}
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3 text-xs">
                {pegawai.nip_baru && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    <FingerprintIcon className="w-3.5 h-3.5" />
                    NIP: {pegawai.nip_baru}
                  </span>
                )}
                {pegawai.email && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    <AtSymbolIconOutline className="w-3.5 h-3.5" />
                    {pegawai.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Grid untuk Informasi Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                Data Pribadi & Kepegawaian
              </h3>
              <div>
                <strong>NIP Lama:</strong> {pegawai.nip_lama || "N/A"}
              </div>
              <div>
                <strong>Tempat, Tanggal Lahir:</strong>{" "}
                {pegawai.tempat_lahir || "N/A"},{" "}
                {formatDateSimple(pegawai.tanggal_lahir)}
              </div>
              <div>
                <strong>Jenis Kelamin:</strong> {pegawai.jenis_kelamin || "N/A"}
              </div>
              <div>
                <strong>Status Kepegawaian:</strong>{" "}
                {pegawai.status_kepegawaian || "N/A"}
              </div>
              {pegawai.status_kepegawaian !== "PPPK" && pegawai.tmt_pns && (
                <div>
                  <strong>TMT PNS/CPNS:</strong>{" "}
                  {formatDateSimple(pegawai.tmt_pns)}
                </div>
              )}
              <div>
                <strong>Pangkat/Golongan:</strong>{" "}
                {pegawai.pangkat_golongan || "N/A"}
              </div>
              <div>
                <strong>TMT Pangkat/Gol:</strong>{" "}
                {formatDateSimple(pegawai.tmt_pangkat_golongan)}
              </div>
              <div>
                <strong>TMT Jabatan Saat Ini:</strong>{" "}
                {formatDateSimple(pegawai.tmt_jabatan)}
              </div>
              <div>
                <strong>Pendidikan Terakhir:</strong>{" "}
                {pegawai.pendidikan_terakhir || "N/A"}
              </div>
            </div>
            {/* Kolom Kanan */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                Informasi Lainnya
              </h3>
              <div>
                <strong>Masa Kerja Golongan:</strong>{" "}
                {pegawai.masa_kerja_golongan || "N/A"}
              </div>
              <div>
                <strong>Masa Kerja Total:</strong>{" "}
                {pegawai.masa_kerja_total || "N/A"}
              </div>
              <div>
                <strong>Perkiraan Tgl. Pensiun:</strong>{" "}
                {formatDateSimple(pegawai.tanggal_pensiun)}
              </div>
              <div>
                <strong>Sisa Masa Kerja:</strong>{" "}
                {pegawai.sisa_masa_kerja || "N/A"}
              </div>
              <div>
                <strong>Grade:</strong> {pegawai.grade || "N/A"}
              </div>
              {/* bmnDipegang tidak ada di DetailPegawaiData, jadi dihapus atau tambahkan ke tipe dan select di API */}
              {/* <div>
                <strong>BMN Dipegang:</strong>{" "}
                {pegawai.bmnDipegang && pegawai.bmnDipegang.length > 0
                  ? pegawai.bmnDipegang.join(", ")
                  : "N/A"}
              </div> */}
            </div>
          </div>
          {/* Bagian Riwayat-Riwayat */}
          <div className="mt-8 space-y-6">
            {pegawai.riwayat_pendidikan &&
              pegawai.riwayat_pendidikan.length > 0 && (
                <RiwayatItemCard
                  title="Riwayat Pendidikan"
                  icon={<GraduationCapIcon className="w-5 h-5" />}
                >
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    {pegawai.riwayat_pendidikan.map((item) => (
                      <li key={item.education_id.toString()}>
                        {" "}
                        {/* PERBAIKAN: Gunakan ID dari item riwayat */}
                        {/* --- PERBAIKAN: Hapus item.pendidikan karena tidak ada di schema --- */}
                        {/* <strong>{item.pendidikan}</strong>{" "} */}
                        <strong>
                          {item.jenjang || "Jenjang Tidak Diketahui"}
                        </strong>{" "}
                        {item.jurusan ? `- ${item.jurusan}` : ""}
                        {item.tahun_lulus && ` (Lulus: ${item.tahun_lulus})`}
                        {item.nama_sekolah_institusi && (
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {item.nama_sekolah_institusi}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </RiwayatItemCard>
              )}
            {pegawai.riwayat_jabatan && pegawai.riwayat_jabatan.length > 0 && (
              <RiwayatItemCard
                title="Riwayat Jabatan"
                icon={<BriefcaseIcon className="w-5 h-5" />}
              >
                <ul className="space-y-2">
                  {pegawai.riwayat_jabatan.map((item) => (
                    <li
                      key={item.job_history_id.toString()}
                      className="border-l-2 border-sky-500 pl-3 py-1"
                    >
                      <strong>{item.jabatan}</strong>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {item.unit_kerja}
                      </span>
                      <span className="block text-xs text-slate-400 dark:text-slate-500">
                        Periode: {formatDateSimple(item.periode_mulai)} s.d.{" "}
                        {item.periode_selesai || "Sekarang"}
                      </span>
                      {item.no_sk && (
                        <span className="block text-xs text-slate-400 dark:text-slate-500">
                          No. SK: {item.no_sk}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </RiwayatItemCard>
            )}
            {pegawai.kompetensi && pegawai.kompetensi.length > 0 && (
              <RiwayatItemCard
                title="Kompetensi & Sertifikasi"
                icon={<BadgeCheckIconOutline className="w-5 h-5" />}
              >
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {pegawai.kompetensi.map((item) => (
                    <li key={item.competency_id.toString()}>
                      {" "}
                      {/* PERBAIKAN: Gunakan ID dari item riwayat */}
                      <strong>{item.nama_kompetensi}</strong> (Diperoleh:{" "}
                      {formatDateSimple(item.tanggal)})
                      {item.penyelenggara && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          Penyelenggara: {item.penyelenggara}
                        </span>
                      )}
                      {item.nomor_sertifikat && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          No. Sertifikat: {item.nomor_sertifikat}
                        </span>
                      )}
                      {item.berlaku_sampai && (
                        <span className="block text-xs text-slate-500 dark:text-slate-500">
                          Berlaku s.d: {formatDateSimple(item.berlaku_sampai)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </RiwayatItemCard>
            )}
            {pegawai.prestasi && pegawai.prestasi.length > 0 && (
              <RiwayatItemCard
                title="Prestasi & Penghargaan"
                icon={<TrophyIcon className="w-5 h-5" />}
              >
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {pegawai.prestasi.map((item) => (
                    <li key={item.achievement_id.toString()}>
                      {" "}
                      {/* PERBAIKAN: Gunakan ID dari item riwayat */}
                      <strong>{item.nama_prestasi}</strong> ({item.tahun})
                      {item.tingkat && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          Tingkat: {item.tingkat}
                        </span>
                      )}
                      {item.pemberi_penghargaan && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          Pemberi: {item.pemberi_penghargaan}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </RiwayatItemCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPegawaiHalaman;
