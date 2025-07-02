"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Download, Share2, Eye } from "lucide-react";

// Definisikan interface MateriCardProps yang sesuai dengan model Prisma `reading_materials`
// dan sertakan relasi yang akan di-include saat fetching data
interface MateriCardProps {
  modul: {
    material_id: bigint;
    judul: string | null;
    deskripsi: string | null;
    file_path: string | null;
    tanggal_upload: Date | null;
    hits: number;
    // Relasi ke Category dan SubCategory
    category?: {
      // Opsional, karena category_id di reading_materials bisa null
      name: string;
    } | null;
    subCategory?: {
      // Opsional, karena sub_category_id di reading_materials bisa null
      name: string;
    } | null;
  };
}

const MateriCard: React.FC<MateriCardProps> = ({ modul }) => {
  if (!modul) return null;

  // URL untuk halaman detail modul, menggunakan material_id sebagai slug
  const detailUrl = `/ruangbaca/${modul.material_id}`;
  // URL untuk mengunduh file, menggunakan file_path
  const downloadUrl = modul.file_path ? `/files/${modul.file_path}` : "#"; // Fallback jika file_path null

  const handleShareClick = () => {
    const fullDetailUrl = window.location.origin + detailUrl;
    try {
      const textarea = document.createElement("textarea");
      textarea.value = fullDetailUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      // Custom message box for success
      const messageBox = document.createElement("div");
      messageBox.textContent = "Link halaman detail berhasil disalin!";
      messageBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      `;
      document.body.appendChild(messageBox);
      setTimeout(() => {
        messageBox.style.opacity = "1";
      }, 10);
      setTimeout(() => {
        messageBox.style.opacity = "0";
        setTimeout(() => document.body.removeChild(messageBox), 500);
      }, 3000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
      // Custom message box for error
      const messageBox = document.createElement("div");
      messageBox.textContent =
        "Gagal menyalin link. Silakan salin manual: " + fullDetailUrl;
      messageBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f44336;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      `;
      document.body.appendChild(messageBox);
      setTimeout(() => {
        messageBox.style.opacity = "1";
      }, 10);
      setTimeout(() => {
        messageBox.style.opacity = "0";
        setTimeout(() => document.body.removeChild(messageBox), 500);
      }, 5000);
    }
  };

  return (
    <article className="bg-surface-card rounded-lg shadow-md p-4 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary">
      <div className="flex-grow">
        <Link href={detailUrl} legacyBehavior>
          <a className="focus:outline-none">
            <h4
              className="font-semibold text-base text-text-primary mb-1.5 line-clamp-2 hover:text-brand-primary transition-colors"
              title={modul.judul || "Tidak ada judul"}
            >
              {modul.judul || "Judul Tidak Tersedia"}
            </h4>
          </a>
        </Link>
        <p className="text-xs text-text-secondary line-clamp-3">
          {modul.deskripsi || "Deskripsi tidak tersedia."}
        </p>
      </div>
      <div className="text-xs text-text-secondary/80 mt-3 pt-3 border-t border-ui-border/50 flex justify-between items-center">
        {/* Menampilkan Kategori dan Sub-kategori dari relasi */}
        <span>
          {modul.category?.name}
          {modul.subCategory?.name && ` / ${modul.subCategory.name}`}
        </span>
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
          download={modul.file_path || undefined}
          className="flex items-center justify-center gap-1.5 px-3 py-2 font-medium rounded-md bg-status-green text-white hover:opacity-90 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={14} /> Unduh
        </a>
        {/* Tombol Bagikan: Salin link halaman detail */}
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
