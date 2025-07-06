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
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type {
  DetailPegawaiData,
  RiwayatPendidikanItem,
  RiwayatJabatanItem,
  KompetensiItem,
  PrestasiItem,
} from "@/types/pegawai";

const getAvatar = (name: string | null | undefined): string => {
  const safeName = name && name.trim() !== "" ? name : "N/A";
  const nameParts = safeName.split(" ");
  let initial = nameParts[0]?.[0] || "";
  if (nameParts.length > 1 && nameParts[1]) initial += nameParts[1][0];
  const bgColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initial.toUpperCase()
  )}&size=128&background=${bgColor}&color=fff&font-size=0.45&bold=true&rounded=true`;
};

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

  const tabItems: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "umum", label: "Informasi Umum", icon: Info },
    { id: "pendidikan", label: "Pendidikan", icon: GraduationCap },
    { id: "jabatan", label: "Jabatan", icon: Briefcase },
    { id: "kompetensi", label: "Kompetensi", icon: Zap },
    { id: "prestasi", label: "Prestasi", icon: Award },
  ];

  const renderInfoItem = (
    label: string,
    value?: string | number | null | Date,
    IconComponent?: React.ElementType,
    isLink?: "email" | "url" | "tel"
  ) => {
    let displayValue: string;
    if (value instanceof Date) {
      displayValue = format(value, "dd MMMM yyyy", { locale: id });
    } else if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      displayValue = String(value);
    } else {
      displayValue = "-";
    }

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

  const renderTable = <T extends object, K extends keyof T>(
    headers: string[],
    data: T[] | undefined,
    idKey: K,
    renderRowCells: (
      item: T
    ) => (React.ReactNode | string | number | null | undefined)[]
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
            {data.map((item) => (
              <tr
                key={item[idKey]?.toString() || Math.random().toString()} // Fallback jika id tidak ada atau bermasalah
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
          src={pegawai.foto_url || getAvatar(pegawai.nama_lengkap)}
          alt={`Foto ${pegawai.nama_lengkap || "Pegawai"}`}
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-brand-accent p-0.5 flex-shrink-0"
          priority
        />
        <div className="text-center sm:text-left flex-grow">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            {pegawai.nama_lengkap || "Nama Pegawai Tidak Diketahui"}
          </h2>
          <p className="text-sm sm:text-base text-brand-primary font-medium">
            {pegawai.jabatan_struktural ||
              pegawai.jenjang_jabatan_fungsional ||
              "Jabatan Belum Diupdate"}
          </p>
          <p className="text-xs text-text-secondary">
            NIP: {pegawai.nip_baru || "N/A"}{" "}
            {pegawai.nip_lama && `(${pegawai.nip_lama})`}
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
            <h4 className="text-md font-semibold text-text-primary mb-2 pt-2">
              Informasi Pribadi & Kepegawaian
            </h4>
            {renderInfoItem("NIP Baru", pegawai.nip_baru, Hash)}
            {renderInfoItem("NIP Lama", pegawai.nip_lama, Hash)}
            {renderInfoItem(
              "Status Kepegawaian",
              pegawai.status_kepegawaian,
              ShieldCheck
            )}
            {renderInfoItem("TMT PNS", pegawai.tmt_pns, CalendarDays)}
            {renderInfoItem("Tempat Lahir", pegawai.tempat_lahir, Landmark)}
            {renderInfoItem("Tanggal Lahir", pegawai.tanggal_lahir, Calendar)}
            {renderInfoItem("Jenis Kelamin", pegawai.jenis_kelamin, Users)}
            {renderInfoItem("Email", pegawai.email, Mail, "email")}
            <h4 className="text-md font-semibold text-text-primary mb-2 mt-5 pt-2">
              Informasi Jabatan & Satuan Kerja
            </h4>
            {renderInfoItem(
              "Jabatan Struktural",
              pegawai.jabatan_struktural,
              Briefcase
            )}
            {renderInfoItem(
              "Jenjang Jabatan Fungsional",
              pegawai.jenjang_jabatan_fungsional,
              Briefcase
            )}
            {renderInfoItem("TMT Jabatan", pegawai.tmt_jabatan, CalendarDays)}
            {renderInfoItem(
              "Pangkat/Golongan",
              pegawai.pangkat_golongan,
              Award
            )}
            {renderInfoItem(
              "TMT Pangkat/Golongan",
              pegawai.tmt_pangkat_golongan,
              CalendarDays
            )}
            {renderInfoItem(
              "Satuan Kerja (Bagian)",
              pegawai.unit_kerja?.nama_satker_bagian ||
                pegawai.unit_kerja_eselon2,
              Building
            )}
            {pegawai.unit_kerja_eselon1 &&
              renderInfoItem(
                "Unit Kerja Eselon I",
                pegawai.unit_kerja_eselon1,
                Library
              )}
            {pegawai.unit_kerja_eselon2 &&
              renderInfoItem(
                "Unit Kerja Eselon II",
                pegawai.unit_kerja_eselon2,
                Library
              )}
            {renderInfoItem(
              "Alamat Kantor",
              pegawai.unit_kerja?.alamat,
              Landmark
            )}
            {renderInfoItem(
              "Telepon Kantor",
              pegawai.unit_kerja?.telepon,
              Phone,
              "tel"
            )}
            {renderInfoItem(
              "Homepage Satker",
              pegawai.unit_kerja?.web,
              Globe,
              "url"
            )}
            {renderInfoItem(
              "Pendidikan Terakhir (Deskripsi)",
              pegawai.pendidikan_terakhir,
              GraduationCap
            )}
          </dl>
        )}

        {activeTab === "pendidikan" &&
          renderTable<RiwayatPendidikanItem, "education_id">(
            [
              // ... headers
            ],
            pegawai.riwayat_pendidikan,
            "education_id",
            (item) => [
              item.jenjang,
              item.nama_sekolah_institusi,
              item.jurusan,

              item.tahun_lulus,
              item.tanggal_ijazah
                ? format(item.tanggal_ijazah, "dd MMMM🥅", { locale: id })
                : "-",
            ]
          )}

        {activeTab === "jabatan" &&
          renderTable<RiwayatJabatanItem, "job_history_id">(
            [
              // ... headers
            ],
            pegawai.riwayat_jabatan,
            "job_history_id",
            (item) => [
              item.jabatan,
              item.unit_kerja,
              item.periode_mulai
                ? format(item.periode_mulai, "dd MMMM🥅", { locale: id })
                : "-",
              item.periode_selesai,
              item.no_sk,
              item.tmt ? format(item.tmt, "dd MMMM🥅", { locale: id }) : "-",
            ]
          )}
        {activeTab === "kompetensi" &&
          renderTable<KompetensiItem, "competency_id">(
            [
              // ... headers
            ],
            pegawai.kompetensi,
            "competency_id",
            (item) => [
              item.tanggal
                ? format(item.tanggal, "dd MMMM🥅", { locale: id })
                : "-",
              item.nama_kompetensi,
              item.penyelenggara,
              item.nomor_sertifikat,
              item.berlaku_sampai
                ? format(item.berlaku_sampai, "dd MMMM🥅", { locale: id })
                : "-",
            ]
          )}
        {activeTab === "prestasi" &&
          renderTable<PrestasiItem, "achievement_id">(
            [
              // ... headers
            ],
            pegawai.prestasi,
            "achievement_id",
            (item) => [
              item.tahun,
              item.nama_prestasi,
              item.tingkat,
              item.pemberi_penghargaan,
            ]
          )}
      </div>
    </div>
  );
};

export default DetailPegawai;
