"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Download, Share2, Eye } from "lucide-react";

// Definisikan interface MateriCardProps yang sesuai dengan data dari API
interface MateriCardProps {
  modul: {
    // --- PERBAIKAN DI SINI ---
    material_id: string; // Diubah dari bigint ke string
    uploader_id: string | null; // Diubah dari bigint | null ke string | null
    // -------------------------

    judul: string | null;
    kategori: string | null;
    sub_kategori: string | null;
    deskripsi: string | null;
    file_path: string | null;
    tanggal_upload: Date | null;
    hits: number;
    uploader?: {
      nama_lengkap: string | null;
    } | null;
  };
}

const MateriCard: React.FC<MateriCardProps> = ({ modul }) => {
  if (!modul) return null;

  // URL untuk halaman detail modul, sekarang menggunakan ID string
  const detailUrl = `/ruangbaca/${modul.material_id}`;
  // URL untuk mengunduh file
  const downloadUrl = modul.file_path ? `/files/${modul.file_path}` : "#";

  const handleShareClick = () => {
    // Fungsi ini tidak perlu diubah, sudah benar
    const fullDetailUrl = window.location.origin + detailUrl;
    try {
      navigator.clipboard.writeText(fullDetailUrl).then(() => {
        alert("Link halaman detail berhasil disalin!");
      });
    } catch (err) {
      console.error("Gagal menyalin: ", err);
      alert("Gagal menyalin link.");
    }
  };

  return (
    <article className="bg-surface-card rounded-lg shadow-md p-4 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary">
      <div className="flex-grow">
        <Link href={detailUrl}>
          <h4
            className="font-semibold text-base text-text-primary mb-1.5 line-clamp-2 hover:text-brand-primary transition-colors"
            title={modul.judul || "Tidak ada judul"}
          >
            {modul.judul || "Judul Tidak Tersedia"}
          </h4>
        </Link>
        <p className="text-xs text-text-secondary line-clamp-3">
          {modul.deskripsi || "Deskripsi tidak tersedia."}
        </p>
      </div>
      <div className="text-xs text-text-secondary/80 mt-3 pt-3 border-t border-ui-border/50 flex justify-between items-center">
        <span>
          {modul.kategori}
          {modul.sub_kategori && ` / ${modul.sub_kategori}`}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={12} /> {modul.hits.toLocaleString()}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Link
          href={detailUrl}
          className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium rounded-md bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover transition-colors"
        >
          <BookOpen size={14} /> Baca
        </Link>
        <a
          href={downloadUrl}
          download
          className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium rounded-md bg-status-green text-white hover:opacity-90 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={14} /> Unduh
        </a>
        <button
          type="button"
          onClick={handleShareClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium rounded-md bg-ui-border text-text-secondary hover:bg-ui-border/70 transition-colors"
        >
          <Share2 size={14} /> Bagikan
        </button>
      </div>
    </article>
  );
};

export default MateriCard;
