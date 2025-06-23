// components/Organisasi/DetailPegawai.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  Briefcase,
  Calendar,
  GraduationCap,
  Mail,
  Hash,
  Landmark,
  Building,
  Phone,
  Users,
  ShieldCheck,
  Zap,
  Info,
  CalendarDays,
  Library,
} from "lucide-react";
import type {
  DetailPegawaiData,
  RiwayatPendidikanItem as RiwayatPendidikanItem, // Menggunakan tipe yang lebih kaya
  RiwayatJabatanItem as RiwayatJabatanItem, // Menggunakan tipe yang lebih kaya
  // Asumsikan tipe ini juga didefinisikan di types/pegawai.ts
  // Jika belum, Anda perlu menambahkannya:
  // export interface KompetensiItem { id: string; tanggal: string; namaKompetensi: string; penyelenggara?: string; }
  // export interface PrestasiItem { id: string; tahun: string; namaPrestasi: string; tingkat?: string; }
} from "@/types/pegawai"; // Pastikan path ini benar dan tipe di dalamnya sudah komprehensif

// Definisikan tipe KompetensiItem dan PrestasiItem di sini jika belum ada di types/pegawai.ts
// Ini hanya untuk contoh jika belum terdefinisi secara global
interface KompetensiItemInternal {
  id: string | number;
  tanggal: string;
  namaKompetensi: string;
  penyelenggara?: string;
}
interface PrestasiItemInternal {
  id: string | number;
  tahun: string;
  namaPrestasi: string;
  tingkat?: string;
}

interface DetailPegawaiProps {
  pegawai: DetailPegawaiData | null;
}

type TabKey = "umum" | "pendidikan" | "jabatan" | "kompetensi" | "prestasi";

const DetailPegawai: React.FC<DetailPegawaiProps> = ({ pegawai }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("umum");

  if (!pegawai) {
    return (
      <div className="bg-surface-card rounded-xl shadow-lg p-6 text-center text-text-secondary">
        Pilih seorang pegawai untuk melihat detailnya atau data tidak ditemukan.
      </div>
    );
  }

  // Data dummy internal dihapus, kita akan mengandalkan data dari prop 'pegawai'
  // Pastikan 'dummyPegawaiService.ts' Anda menghasilkan data untuk riwayatPendidikan, riwayatJabatan, kompetensi, dan prestasi.

  const tabItems: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "umum", label: "Informasi Umum", icon: Info },
    { id: "pendidikan", label: "Pendidikan", icon: GraduationCap },
    { id: "jabatan", label: "Jabatan", icon: Briefcase },
    { id: "kompetensi", label: "Kompetensi", icon: Zap },
    { id: "prestasi", label: "Prestasi", icon: Award },
  ];

  const renderInfoItem = (
    label: string,
    value?: string | number | null,
    IconComponent?: React.ElementType,
    isLink?: "email" | "url" | "tel"
  ) => {
    const displayValue =
      value !== undefined && value !== null && String(value).trim() !== ""
        ? String(value)
        : "-";

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2.5 border-b border-ui-border/30 last:border-b-0">
        <dt className="text-xs text-text-secondary col-span-1 flex items-center gap-1.5">
          {IconComponent && (
            <IconComponent
              className="text-text-secondary/90 w-3.5 h-3.5 flex-shrink-0"
              size={14}
            />
          )}
          {!IconComponent && <div className="w-3.5 h-3.5 flex-shrink-0"></div>}
          <span>{label}</span>
        </dt>
        <dd className="text-xs sm:text-sm text-text-primary col-span-2 font-medium break-words pl-5 sm:pl-0">
          {isLink === "email" && displayValue !== "-" ? (
            <a
              href={`mailto:${displayValue}`}
              className="text-brand-primary hover:underline"
            >
              {displayValue}
            </a>
          ) : isLink === "url" && displayValue !== "-" ? (
            <a
              href={
                displayValue.startsWith("http")
                  ? displayValue
                  : `https://${displayValue}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              {displayValue}
            </a>
          ) : isLink === "tel" && displayValue !== "-" ? (
            <a
              href={`tel:${displayValue}`}
              className="text-brand-primary hover:underline"
            >
              {displayValue}
            </a>
          ) : (
            displayValue
          )}
        </dd>
      </div>
    );
  };

  const renderTable = <T extends { id: string | number }>(
    headers: string[],
    data: T[] | undefined,
    renderRowCells: (
      item: T
    ) => (React.ReactNode | string | number | null | undefined)[] // HARUS mengembalikan array dari KONTEN sel, bukan elemen <td>
  ) => {
    if (!data || data.length === 0) {
      return (
        <p className="text-text-secondary text-sm italic py-4">
          Data tidak tersedia.
        </p>
      );
    }
    return (
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-ui-border scrollbar-track-surface-page rounded-md border border-ui-border/50 mt-2">
        <table className="min-w-full divide-y divide-ui-border/50">
          <thead className="bg-surface-page">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-3 py-2.5 text-left text-xs font-medium text-text-secondary uppercase tracking-wider sm:pl-4"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-card divide-y divide-ui-border/30">
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="text-xs sm:text-sm hover:bg-surface-page/50 transition-colors"
              >
                {renderRowCells(item).map((cellContent, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2.5 whitespace-nowrap text-text-secondary sm:pl-4"
                  >
                    {cellContent || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-surface-card rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mt-6">
      {/* Informasi Header Pegawai */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b border-ui-border mb-6">
        <Image
          src={pegawai.fotoUrl || getAvatar(pegawai.nama)} // Fungsi getAvatar perlu diimpor atau didefinisikan
          alt={`Foto ${pegawai.nama}`}
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-brand-accent p-0.5 flex-shrink-0"
          priority
        />
        <div className="text-center sm:text-left flex-grow">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            {pegawai.nama}
          </h2>
          <p className="text-sm sm:text-base text-brand-primary font-medium">
            {pegawai.jabatanStruktural ||
              pegawai.jenjangJabatanFungsional ||
              "Jabatan Belum Diupdate"}
          </p>
          <p className="text-xs text-text-secondary">
            NIP: {pegawai.nipBaru} {pegawai.nipLama && `(${pegawai.nipLama})`}
          </p>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <nav
          className="flex border-b border-ui-border -mb-px"
          aria-label="Tabs"
        >
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-2.5 sm:px-4 sm:py-3 border-b-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2
                ${
                  activeTab === tab.id
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-ui-border"
                }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon
                className={`w-4 h-4 ${
                  activeTab === tab.id
                    ? "text-brand-primary"
                    : "text-text-secondary/80"
                }`}
              />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Konten Tab */}
      <div className="min-h-[250px] py-2">
        {activeTab === "umum" && (
          <dl>
            {" "}
            {/* Dihapus space-y-1, styling diatur oleh renderInfoItem */}
            <h4 className="text-md font-semibold text-text-primary mb-2 pt-2">
              Informasi Pribadi & Kepegawaian
            </h4>
            {renderInfoItem("NIP Baru", pegawai.nipBaru, Hash)}
            {renderInfoItem("NIP Lama", pegawai.nipLama, Hash)}
            {renderInfoItem(
              "Status Kepegawaian",
              pegawai.statusKepegawaian,
              ShieldCheck
            )}
            {renderInfoItem("TMT PNS", pegawai.TMT_PNS, CalendarDays)}
            {renderInfoItem("Tempat Lahir", pegawai.tempatLahir, Landmark)}
            {renderInfoItem("Tanggal Lahir", pegawai.tanggalLahir, Calendar)}
            {renderInfoItem("Jenis Kelamin", pegawai.jenisKelamin, Users)}
            {renderInfoItem("Email", pegawai.email, Mail, "email")}
            <h4 className="text-md font-semibold text-text-primary mb-2 mt-5 pt-2">
              Informasi Jabatan & Satuan Kerja
            </h4>
            {renderInfoItem(
              "Jabatan Struktural",
              pegawai.jabatanStruktural,
              Briefcase
            )}
            {renderInfoItem(
              "Jenjang Jabatan Fungsional",
              pegawai.jenjangJabatanFungsional,
              Briefcase
            )}
            {renderInfoItem("TMT Jabatan", pegawai.tmtJabatan, CalendarDays)}
            {renderInfoItem("Pangkat/Golongan", pegawai.pangkatGolongan, Award)}
            {renderInfoItem(
              "TMT Pangkat/Golongan",
              pegawai.tmtPangkatGolongan,
              CalendarDays
            )}
            {renderInfoItem("Satuan Kerja", pegawai.satuanKerjaNama, Building)}
            {pegawai.unitKerjaEselon1 &&
              renderInfoItem(
                "Unit Kerja Eselon I",
                pegawai.unitKerjaEselon1,
                Library
              )}
            {pegawai.unitKerjaEselon2 &&
              renderInfoItem(
                "Unit Kerja Eselon II",
                pegawai.unitKerjaEselon2,
                Library
              )}
            {renderInfoItem("Alamat Kantor", pegawai.alamatKantor, Landmark)}
            {renderInfoItem(
              "Telepon Kantor",
              pegawai.teleponKantor,
              Phone,
              "tel"
            )}
            {/* {renderInfoItem("Homepage Satker", pegawai.homepage, Globe, "url")} */}
            {renderInfoItem(
              "Pendidikan Terakhir (Deskripsi)",
              pegawai.pendidikanTerakhir,
              GraduationCap
            )}
          </dl>
        )}

        {activeTab === "pendidikan" &&
          renderTable<RiwayatPendidikanItem>( // Tentukan tipe data secara eksplisit
            ["Jenjang", "Nama Sekolah/Institusi", "Jurusan", "Tahun Lulus"],
            pegawai.riwayatPendidikan,
            (item) => [
              item.jenjang,
              item.namaSekolahInstitusi,
              item.jurusan,
              item.tahunLulus,
            ]
          )}

        {activeTab === "jabatan" &&
          renderTable<RiwayatJabatanItem>(
            ["Periode Mulai", "Periode Selesai", "Jabatan", "Unit Kerja"],
            pegawai.riwayatJabatan,
            (item) => [
              item.periodeMulai,
              item.periodeSelesai,
              item.jabatan,
              item.unitKerja,
            ]
          )}

        {activeTab === "kompetensi" &&
          renderTable<KompetensiItemInternal>( // Gunakan tipe internal jika belum global
            ["Tanggal", "Nama Kompetensi", "Penyelenggara"],
            pegawai.kompetensi, // Asumsi 'kompetensi' ada di DetailPegawaiData
            (item) => [item.tanggal, item.namaKompetensi, item.penyelenggara]
          )}

        {activeTab === "prestasi" &&
          renderTable<PrestasiItemInternal>( // Gunakan tipe internal jika belum global
            ["Tahun", "Nama Prestasi/Penghargaan", "Tingkat"],
            pegawai.prestasi, // Asumsi 'prestasi' adalah field yang benar di DetailPegawaiData
            (item) => [item.tahun, item.namaPrestasi, item.tingkat]
          )}
      </div>
    </div>
  );
};

// Helper function jika belum ada (atau impor dari service avatar Anda)
const getAvatar = (name: string): string => {
  const nameParts = name.split(" ");
  let initial = nameParts[0]?.[0] || "";
  if (nameParts.length > 1 && nameParts[1]) initial += nameParts[1][0];
  const bgColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initial.toUpperCase()
  )}&size=128&background=${bgColor}&color=fff&font-size=0.45&bold=true&rounded=true`;
};

export default DetailPegawai;
