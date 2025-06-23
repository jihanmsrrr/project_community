// components/Baca/MateriCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Download, Share2, Eye } from "lucide-react";
import type { Modul } from "@/data/modulData"; // Pastikan path ini benar

interface MateriCardProps {
  modul: Modul;
  // onClick tidak lagi diperlukan karena navigasi ditangani oleh Next/Link
  // onClick?: () => void;
}

const MateriCard: React.FC<MateriCardProps> = ({ modul }) => {
  if (!modul) return null;

  // URL untuk halaman detail modul
  const detailUrl = `/ruangbaca/${modul.slug}`;
  // URL untuk mengunduh file
  const downloadUrl = `/files/${modul.fileName}`;

  const handleShareClick = () => {
    // URL yang akan disalin adalah URL halaman detail modul, bukan URL file langsung
    const fullDetailUrl = window.location.origin + detailUrl;
    navigator.clipboard.writeText(fullDetailUrl);
    alert("Link halaman detail berhasil disalin!"); // Anda bisa mengganti ini dengan Toast jika ada
  };

  return (
    <article className="bg-surface-card rounded-lg shadow-md p-4 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary">
      <div className="flex-grow">
        <Link href={detailUrl} legacyBehavior>
          <a className="focus:outline-none">
            <h4
              className="font-semibold text-base text-text-primary mb-1.5 line-clamp-2 hover:text-brand-primary transition-colors"
              title={modul.judul}
            >
              {modul.judul}
            </h4>
          </a>
        </Link>
        <p className="text-xs text-text-secondary line-clamp-3">
          {modul.deskripsi || "Deskripsi tidak tersedia."}
        </p>
      </div>
      <div className="text-xs text-text-secondary/80 mt-3 pt-3 border-t border-ui-border/50 flex justify-between items-center">
        <span>{modul.ukuran}</span>
        <span className="flex items-center gap-1">
          <Eye size={12} /> {modul.hits.toLocaleString()}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        {/* Tombol Baca: Navigasi ke halaman detail modul */}
        <Link href={detailUrl} legacyBehavior>
          <a className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium rounded-md bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover transition-colors">
            <BookOpen size={14} /> Baca
          </a>
        </Link>
        {/* Tombol Unduh: Unduh file langsung */}
        <a
          href={downloadUrl}
          download={modul.fileName}
          className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium rounded-md bg-status-green text-white hover:opacity-90 transition-opacity"
        >
          <Download size={14} /> Unduh
        </a>
        {/* Tombol Bagikan: Salin link halaman detail */}
        <button
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
