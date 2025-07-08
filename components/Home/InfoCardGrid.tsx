"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AppCardData {
  id: number | string;
  title: string;
  imageUrl: string;
  link: string;
  subtitle?: string;
}

const cardData: AppCardData[] = [
  {
    id: "jdih",
    title: "JDIH BPS",
    imageUrl: "/jdih.png",
    link: "https://jdih.web.bps.go.id/public/",
    subtitle: "Jaringan Dokumentasi & Informasi Hukum",
  },
  {
    id: "kipapp",
    title: "Kip App",
    imageUrl: "/kipapp.png",
    link: "https://webapps.bps.go.id/kipapp/",
    subtitle: "Kendali Internal Proses Aplikasi",
  },
  {
    id: "selindo",
    title: "Back Office Selindo",
    imageUrl: "/bos.png",
    link: "https_URL_SELINDRO_ANDA",
    subtitle: "Sistem Layanan Internal Terpadu Online",
  },
  {
    id: "simpeg",
    title: "SIMPEG BPS",
    imageUrl: "/simpeg.png",
    link: "https://simpeg.bps.go.id/data/",
    subtitle: "Sistem Informasi Manajemen Kepegawaian",
  },
  {
    id: "ckp",
    title: "CKP Online",
    imageUrl: "/ckp.png",
    link: "https_URL_CKPONLINE_ANDA",
    subtitle: "Capaian Kinerja Pegawai Online",
  },
  {
    id: "wilkerstat",
    title: "WILKERSTAT",
    imageUrl: "/wilkerstat.png",
    link: "https_URL_WILKERSTAT_ANDA",
    subtitle: "Wilayah Kerja Statistik",
  },
  {
    id: "fasih",
    title: "FASIH",
    imageUrl: "/fasih.png",
    link: "https_URL_FASIH_ANDA",
    subtitle: "Forum Aspirasi Statistik Handal",
  },
  {
    id: "sipecut",
    title: "SIPECUT",
    imageUrl: "/sipecut.png",
    link: "https_URL_SIPECUT_ANDA",
    subtitle: "Sistem Informasi Pengelolaan Cuti",
  },
  {
    id: "simdasi",
    title: "SIMDASI",
    imageUrl: "/simdasi.png",
    link: "https_URL_SIMDASI_ANDA",
    subtitle: "Sistem Informasi Manajemen Data Statistik Internal",
  },
  // Contoh data tambahan jika lebih dari 9
  {
    id: "romantik",
    title: "Romantik",
    imageUrl: "/romantik.png",
    link: "#",
    subtitle: "Rekomendasi Kegiatan Statistik",
  },
  {
    id: "sidika",
    title: "SIDIKA",
    imageUrl: "/bps.png",
    link: "#",
    subtitle: "Sistem Informasi Desa Dan Kelurahan",
  },
  {
    id: "silastik",
    title: "SILASTIK",
    imageUrl: "/silastik.png",
    link: "#",
    subtitle: "Sistem Layanan Statistik",
  },
];

const InfoCardGrid: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Mengganti nama state agar lebih jelas

  const INITIAL_CARD_COUNT = 3;
  const EXPANDED_CARD_COUNT = 9;

  const cardsToShow = isExpanded
    ? cardData.slice(0, Math.min(EXPANDED_CARD_COUNT, cardData.length))
    : cardData.slice(0, INITIAL_CARD_COUNT);

  return (
    <section className="bg-surface-page rounded-xl p-6 sm:p-8 max-w-7xl mx-auto select-none">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="w-1 sm:w-1.5 h-6 sm:h-7 bg-brand-primary rounded-sm inline-block"
            aria-hidden="true"
          />
          <h2 className="text-text-primary font-semibold text-lg sm:text-xl">
            Aplikasi Terkait
          </h2>
        </div>
      </div>

      {/* Grid container untuk kartu aplikasi */}
      <div
        // Untuk layar kecil (sebelum md), akan scroll horizontal jika item lebih dari yang muat
        // Untuk layar md ke atas, akan menjadi grid vertikal responsif
        className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] sm:auto-cols-[minmax(260px,1fr)] gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide md:grid-flow-row md:grid-cols-2 lg:grid-cols-3"
        // xl:grid-cols-4 dihapus agar maksimal 3 kolom di desktop jika initialCount=3 atau expandedCount=9
        // Jika Anda ingin 4 atau 5 kolom di layar sangat besar, Anda bisa tambahkan kembali xl:grid-cols-4 atau xl:grid-cols-5
        // dan sesuaikan INITIAL_CARD_COUNT atau EXPANDED_CARD_COUNT
      >
        {cardsToShow.map(
          (
            card // Tidak perlu index jika tidak dipakai untuk priority di sini
          ) => (
            <Link key={card.id} href={card.link} passHref legacyBehavior>
              <a
                target={
                  card.link === "#" || !card.link.startsWith("http")
                    ? "_self"
                    : "_blank"
                } // Cek link placeholder
                rel="noopener noreferrer"
                className="bg-surface-card rounded-xl shadow-md hover:shadow-lg p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:-translate-y-1 group focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-page h-full"
              >
                <div className="w-full h-24 sm:h-28 md:h-32 flex items-center justify-center bg-surface-page p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 group-hover:bg-ui-border transition-colors duration-200">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    width={100} // Lebar dasar, akan diskalakan oleh objectFit & container
                    height={50} // Tinggi dasar
                    style={{
                      objectFit: "contain",
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h5 className="text-sm sm:text-base font-semibold mb-1 text-text-primary line-clamp-2 break-words group-hover:text-brand-primary transition-colors">
                  {card.title}
                </h5>

                {card.subtitle && (
                  <p className="text-xs text-text-secondary line-clamp-2 break-words mt-auto pt-1">
                    {" "}
                    {/* mt-auto agar subtitle di bawah jika judul pendek */}
                    {card.subtitle}
                  </p>
                )}
              </a>
            </Link>
          )
        )}
      </div>

      {/* Tombol Tampilkan Semua / Lebih Sedikit */}
      {/* Muncul hanya jika total kartu lebih banyak dari yang tampil awal (3) */}
      {cardData.length > INITIAL_CARD_COUNT && (
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-brand-primary hover:text-brand-primary-hover font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md px-3 py-1.5 flex items-center gap-1.5 text-sm sm:text-base"
          >
            {isExpanded
              ? "Tampilkan Lebih Sedikit"
              : `Tampilkan Semua (${Math.min(
                  EXPANDED_CARD_COUNT,
                  cardData.length
                )})`}
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      )}
    </section>
  );
};

export default InfoCardGrid;
