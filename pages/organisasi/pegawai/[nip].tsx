// pages/organisasi/pegawai/[nip].tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftCircle,
  Briefcase,
  GraduationCap,
  Trophy,
  Fingerprint,
  Mail,
} from "lucide-react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import type { DetailPegawaiData } from "@/types/pegawai";
import PageTitle from "@/components/ui/PageTitle";
import Breadcrumb from "@/components/ui/Breadcrumb"; // Impor komponen Breadcrumb

// Helper untuk memformat tanggal
const formatDateSimple = (date: Date | string | null | undefined): string => {
  if (!date) {
    return "N/A";
  }

  const d = new Date(date);

  // Pengecekan ini sudah cukup untuk menangani tanggal yang tidak valid
  if (isNaN(d.getTime())) {
    return "N/A";
  }

  return format(d, "dd MMMM yyyy", { locale: id });
};

// Komponen Card Riwayat
const RiwayatItemCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md">
    <div className="flex items-center text-sky-600 dark:text-sky-400 mb-2">
      {icon && <span className="mr-2.5">{icon}</span>}
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

  const [pegawai, setPegawai] = useState<DetailPegawaiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (nip && typeof nip === "string") {
      setIsLoading(true);
      setErrorMessage(null);

      const fetchPegawai = async () => {
        try {
          const response = await fetch(`/api/organisasi/pegawai/${nip}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal mengambil data.");
          }
          const data: DetailPegawaiData = await response.json();
          setPegawai(data);
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("Terjadi kesalahan yang tidak diketahui.");
          }
          setPegawai(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPegawai();
    }
  }, [nip]);

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-300">
          Memuat data pegawai...
        </p>
      </div>
    );
  }

  // Tampilan saat error atau data tidak ditemukan
  if (errorMessage || !pegawai) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div
          className="relative text-center py-8 sm:py-10 shadow-lg bg-cover bg-center mb-8"
          style={{ backgroundImage: "url('/titlebg.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
          <div className="relative z-10">
            <PageTitle title="Profil Tidak Ditemukan" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {errorMessage || `Data pegawai dengan NIP ${nip} tidak ditemukan.`}
          </p>
          <Link
            href="/organisasi/pegawai"
            className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors group"
          >
            <ArrowLeftCircle className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Kembali ke Pencarian Pegawai
          </Link>
        </div>
      </div>
    );
  }

  // Definisikan item untuk breadcrumb secara dinamis
  const breadcrumbItems = [
    { label: "Organisasi", href: "/organisasi" },
    { label: "Direktori Pegawai", href: "/organisasi/pegawai" },
    { label: pegawai.nama_lengkap || "Detail Pegawai", href: "" }, // Item terakhir tidak memiliki link
  ];

  return (
    <div className="bg-surface-page min-h-screen flex flex-col">
      <div className="page-title-header-bg py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-screen-md mx-auto px-4">
          <PageTitle
            title="Detail Profil Pegawai"
            backgroundImage="/title.png"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-0"></div>
        <div className="relative z-10"></div>
      </div>

      {/* Menu Navigasi Horizontal SUDAH DIHAPUS */}

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Breadcrumb DITAMBAHKAN DI SINI */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg ring-4 ring-sky-300 dark:ring-sky-600 flex-shrink-0">
              <Image
                src={
                  pegawai.foto_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    pegawai.nama_lengkap || "P"
                  )}`
                }
                alt={`Foto ${pegawai.nama_lengkap}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                {pegawai.nama_lengkap || "N/A"}
              </h1>
              <p className="text-md text-sky-600 dark:text-sky-400 font-medium">
                {pegawai.jabatan_struktural ||
                  pegawai.jenjang_jabatan_fungsional ||
                  "Jabatan Belum Tersedia"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {pegawai.unit_kerja?.nama_satker_lengkap ||
                  "Satuan Kerja Tidak Diketahui"}
              </p>
              {pegawai.unit_kerja_eselon1 && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {pegawai.unit_kerja_eselon1}
                  {pegawai.unit_kerja_eselon2
                    ? ` > ${pegawai.unit_kerja_eselon2}`
                    : ""}
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3 text-xs">
                {pegawai.nip_baru && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    <Fingerprint className="w-3.5 h-3.5" />
                    NIP: {pegawai.nip_baru}
                  </span>
                )}
                {pegawai.email && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5" />
                    {pegawai.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                Data Pribadi & Kepegawaian
              </h3>
              <div>
                <strong>NIP Lama:</strong> {pegawai.nip_lama || "N/A"}
              </div>
              <div>
                <strong>Tempat, Tanggal Lahir:</strong>{" "}
                {`${pegawai.tempat_lahir || "N/A"}, ${formatDateSimple(
                  pegawai.tanggal_lahir
                )}`}
              </div>
              <div>
                <strong>Jenis Kelamin:</strong> {pegawai.jenis_kelamin || "N/A"}
              </div>
              <div>
                <strong>Status Kepegawaian:</strong>{" "}
                {pegawai.status_kepegawaian || "N/A"}
              </div>
              {pegawai.tmt_pns && (
                <div>
                  <strong>TMT PNS:</strong> {formatDateSimple(pegawai.tmt_pns)}
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
                <strong>TMT Jabatan:</strong>{" "}
                {formatDateSimple(pegawai.tmt_jabatan)}
              </div>
              <div>
                <strong>Pendidikan Terakhir:</strong>{" "}
                {pegawai.pendidikan_terakhir || "N/A"}
              </div>
            </div>

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
                <strong>Perkiraan Pensiun:</strong>{" "}
                {formatDateSimple(pegawai.tanggal_pensiun)}
              </div>
              <div>
                <strong>Sisa Masa Kerja:</strong>{" "}
                {pegawai.sisa_masa_kerja || "N/A"}
              </div>
              <div>
                <strong>Grade:</strong> {pegawai.grade || "N/A"}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {pegawai.riwayat_pendidikan?.length > 0 && (
              <RiwayatItemCard
                title="Riwayat Pendidikan"
                icon={<GraduationCap className="w-5 h-5" />}
              >
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {pegawai.riwayat_pendidikan.map((item) => (
                    <li key={item.education_id}>
                      <strong>{item.jenjang || "N/A"}</strong>{" "}
                      {item.jurusan ? `- ${item.jurusan}` : ""}
                      {item.nama_sekolah_institusi && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {item.nama_sekolah_institusi} (Lulus:{" "}
                          {item.tahun_lulus || "N/A"})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </RiwayatItemCard>
            )}
            {pegawai.riwayat_jabatan?.length > 0 && (
              <RiwayatItemCard
                title="Riwayat Jabatan"
                icon={<Briefcase className="w-5 h-5" />}
              >
                <ul className="space-y-2">
                  {pegawai.riwayat_jabatan.map((item) => (
                    <li
                      key={item.job_history_id}
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
                    </li>
                  ))}
                </ul>
              </RiwayatItemCard>
            )}
            {pegawai.kompetensi?.length > 0 && (
              <RiwayatItemCard
                title="Kompetensi & Sertifikasi"
                icon={<CheckBadgeIcon className="w-5 h-5" />}
              >
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {pegawai.kompetensi.map((item) => (
                    <li key={item.competency_id}>
                      <strong>{item.nama_kompetensi}</strong> (Diperoleh:{" "}
                      {formatDateSimple(item.tanggal)})
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        Penyelenggara: {item.penyelenggara}
                      </span>
                    </li>
                  ))}
                </ul>
              </RiwayatItemCard>
            )}
            {pegawai.prestasi?.length > 0 && (
              <RiwayatItemCard
                title="Prestasi & Penghargaan"
                icon={<Trophy className="w-5 h-5" />}
              >
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {pegawai.prestasi.map((item) => (
                    <li key={item.achievement_id}>
                      <strong>{item.nama_prestasi}</strong> ({item.tahun})
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        Pemberi: {item.pemberi_penghargaan}
                      </span>
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
