// components/Baca/ModulDetail.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  HardDriveDownload,
  Eye,
  AlertTriangle,
} from "lucide-react";
import type { Modul } from "@/data/modulData"; // Pastikan path ini benar

interface ModulDetailProps {
  modul: Modul; // Modul tidak lagi opsional, karena halaman [slug].tsx sudah memastikan modul ada
  onBack: () => void; // Fungsi untuk kembali ke daftar
}

const ModulDetail: React.FC<ModulDetailProps> = ({ modul, onBack }) => {
  // Karena komponen ini hanya dirender jika `modul` ditemukan di halaman [slug].tsx,
  // kita tidak perlu lagi `if (!modul)` di sini.

  const fileUrl = `/files/${modul.fileName}`; // Asumsi file ada di public/files

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-surface-card rounded-xl border border-ui-border shadow-lg">
      {/* --- Bagian Header --- */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-ui-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline mb-4 sm:mb-0"
          aria-label="Kembali ke daftar modul"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Materi
        </button>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <FileText size={14} />
            <span>{modul.ukuran}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            <span>Dilihat {modul.hits.toLocaleString()} kali</span>
          </div>
        </div>
      </div>

      {/* --- Bagian Konten Utama --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Penampil PDF Tersemat */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="w-full h-[80vh] sm:h-[85vh] rounded-lg border-2 border-ui-border bg-black/5">
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-full rounded-md"
            >
              {/* Pesan ini akan muncul jika browser tidak bisa menampilkan PDF */}
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AlertTriangle className="h-8 w-8 text-status-orange mb-2" />
                <p className="font-semibold text-text-primary">
                  Gagal memuat pratinjau PDF.
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  Browser Anda mungkin tidak mendukung pratinjau PDF secara
                  langsung.
                </p>
                <a
                  href={fileUrl}
                  download={modul.fileName}
                  className="text-brand-primary hover:underline font-semibold"
                >
                  Unduh file sebagai gantinya
                </a>
              </div>
            </object>
          </div>
        </div>

        {/* Kolom Kanan: Detail dan Tombol Aksi */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20">
            {" "}
            {/* Agar tetap terlihat saat scroll */}
            <h2 className="text-2xl font-bold mb-3 text-text-primary leading-tight">
              {modul.judul}
            </h2>
            {modul.deskripsi && (
              <p className="mb-6 text-sm text-text-secondary leading-relaxed">
                {modul.deskripsi}
              </p>
            )}
            <a
              href={fileUrl}
              download={modul.fileName}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
              aria-label={`Unduh modul ${modul.judul}`}
            >
              <HardDriveDownload size={20} />
              Unduh Modul
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ModulDetail;
