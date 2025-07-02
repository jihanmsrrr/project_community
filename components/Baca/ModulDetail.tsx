"use client";

import React, { useState, useEffect } from "react"; // Import useState dan useEffect
import {
  ArrowLeft,
  HardDriveDownload,
  Eye,
  AlertTriangle,
  BookOpen,
  User,
} from "lucide-react";

interface ModulDetailProps {
  modul: {
    material_id: bigint;
    judul: string | null;
    kategori: string | null;
    sub_kategori: string | null;
    deskripsi: string | null;
    file_path: string | null;
    uploader_id: bigint | null;
    tanggal_upload: Date | null;
    hits: number;
    uploader?: {
      nama_lengkap: string | null;
    } | null;
  };
  onBack: () => void;
}

const ModulDetail: React.FC<ModulDetailProps> = ({ modul, onBack }) => {
  // State untuk menyimpan hits yang sudah diformat di sisi klien
  const [formattedHits, setFormattedHits] = useState<string>("");

  useEffect(() => {
    // Pastikan kode ini hanya berjalan di sisi klien setelah hidrasi
    if (modul && typeof modul.hits === "number") {
      setFormattedHits(modul.hits.toLocaleString());
    }
  }, [modul]); // Bergantung pada perubahan modul

  if (!modul) {
    return (
      <div className="text-center p-8 text-text-secondary">
        Materi tidak ditemukan.
        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline mx-auto"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>
    );
  }

  const fileUrl = modul.file_path ? `/files/${modul.file_path}` : "#";
  const fileExtension = modul.file_path?.split(".").pop()?.toLowerCase();
  const isPdf = fileExtension === "pdf";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-surface-card rounded-xl border border-ui-border shadow-lg">
      {/* --- Bagian Header --- */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-ui-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline mb-4 sm:mb-0"
          aria-label="Kembali ke daftar materi"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Materi
        </button>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {modul.kategori && (
            <div className="flex items-center gap-1.5">
              <BookOpen size={14} />
              <span>
                {modul.kategori}{" "}
                {modul.sub_kategori && ` / ${modul.sub_kategori}`}
              </span>
            </div>
          )}
          {modul.uploader?.nama_lengkap && (
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{modul.uploader.nama_lengkap}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            {/* Menggunakan state formattedHits yang diatur di sisi klien */}
            <span>Dilihat {formattedHits} kali</span>
          </div>
        </div>
      </div>

      {/* --- Bagian Konten Utama --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Penampil File */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="w-full h-[80vh] sm:h-[85vh] rounded-lg border-2 border-ui-border bg-black/5 flex items-center justify-center">
            {isPdf ? (
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
                    download={modul.file_path || undefined}
                    className="text-brand-primary hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Unduh file sebagai gantinya
                  </a>
                </div>
              </object>
            ) : (
              // Konten untuk file non-PDF (misal: PPT, DOCX)
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AlertTriangle className="h-8 w-8 text-status-orange mb-2" />
                <p className="font-semibold text-text-primary">
                  Pratinjau tidak tersedia untuk format .
                  {fileExtension?.toUpperCase()}
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  Silakan unduh file untuk membukanya.
                </p>
                <a
                  href={fileUrl}
                  download={modul.file_path || undefined}
                  className="text-brand-primary hover:underline font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unduh file {modul.file_path}
                </a>
                {/* Opsional: Tambahkan link ke Google Docs Viewer jika file di-host publik */}
                {modul.file_path && (
                  <p className="mt-2 text-xs text-text-tertiary">
                    Atau coba pratinjau via Google Docs Viewer:{" "}
                    <a
                      href={`https://docs.google.com/gview?url=${encodeURIComponent(
                        window.location.origin + fileUrl
                      )}&embedded=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Lihat Pratinjau
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Detail dan Tombol Aksi */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20">
            <h2 className="text-2xl font-bold mb-3 text-text-primary leading-tight">
              {modul.judul || "Judul Tidak Tersedia"}
            </h2>
            {modul.deskripsi && (
              <p className="mb-6 text-sm text-text-secondary leading-relaxed">
                {modul.deskripsi}
              </p>
            )}
            <a
              href={fileUrl}
              download={modul.file_path || undefined}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
              aria-label={`Unduh modul ${modul.judul || ""}`}
              target="_blank"
              rel="noopener noreferrer"
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
