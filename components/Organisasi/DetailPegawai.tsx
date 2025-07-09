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
  ShieldCheck,
  Zap,
  Info,
  CalendarDays,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { DetailPegawaiData } from "@/types/pegawai";

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

  return (
    <div className="bg-surface-card rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mt-6">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={pegawai.foto_url || getAvatar(pegawai.nama_lengkap)}
          alt={pegawai.nama_lengkap || "Foto Pegawai"}
          width={72}
          height={72}
          className="rounded-full object-cover border border-ui-border"
        />
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            {pegawai.nama_lengkap}
          </h2>
          <p className="text-sm text-text-secondary">
            {pegawai.jabatan_struktural}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-4 border-b border-ui-border overflow-x-auto">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-t-md border-b-2 ${
              activeTab === tab.id
                ? "text-brand-primary border-brand-primary bg-muted"
                : "text-text-secondary border-transparent hover:text-brand-primary"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "umum" && (
        <dl>
          {renderInfoItem("NIP Baru", pegawai.nip_baru, Hash)}
          {renderInfoItem("Status", pegawai.status_kepegawaian, ShieldCheck)}
          {renderInfoItem("TMT PNS", pegawai.tmt_pns ?? undefined, Calendar)}
          {renderInfoItem("Email", pegawai.email, Mail, "email")}
          {renderInfoItem(
            "Tempat, Tanggal Lahir",
            pegawai.tanggal_lahir
              ? `${pegawai.tempat_lahir}, ${format(
                  pegawai.tanggal_lahir,
                  "dd MMMM yyyy",
                  { locale: id }
                )}`
              : pegawai.tempat_lahir,
            CalendarDays
          )}
          {renderInfoItem("Jenis Kelamin", pegawai.jenis_kelamin)}
          {renderInfoItem("Pangkat / Golongan", pegawai.pangkat_golongan)}
          {renderInfoItem(
            "Jabatan Struktural",
            pegawai.jabatan_struktural,
            Briefcase
          )}
          {renderInfoItem(
            "Unit Kerja",
            pegawai.unit_kerja?.nama_satker_lengkap,
            Building
          )}
          {renderInfoItem(
            "Alamat Kantor",
            pegawai.unit_kerja?.alamat_kantor,
            Landmark
          )}
          {renderInfoItem(
            "Telepon Kantor",
            pegawai.unit_kerja?.telepon_kantor,
            Phone,
            "tel"
          )}
          {renderInfoItem(
            "Website Kantor",
            pegawai.unit_kerja?.homepage_satker,
            Globe,
            "url"
          )}
        </dl>
      )}

      {/* Tab lain tidak diubah */}
    </div>
  );
};

export default DetailPegawai;
