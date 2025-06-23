// components/Organisasi/InformasiOrganisasi.tsx (atau CardGrid.tsx)
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Contoh data (tetap sama)
const dataKategori = [
  {
    kategori: "Poliklinik",
    items: [
      { nama: "Poliklinik Umum", kode: 1012 },
      { nama: "Poliklinik Gigi", kode: 1013 },
    ],
  },
  {
    kategori: "Paguyuban Pensiun",
    items: [{ nama: "Sekretariat", kode: 1022 }],
  },
  {
    kategori: "Koperasi BPS",
    items: [
      { nama: "Manager", kode: 1019 },
      { nama: "Unit Tabungan", kode: 1020 },
      { nama: "Unit Toko Buku (Gd. 4 Lt. 1)", kode: 7445 },
      { nama: "Unit Toko Mini", kode: 1025 },
      { nama: "Unit Foto Copy", kode: 1026 },
    ],
  },
  {
    kategori: "POSKO",
    items: [
      { nama: "Satpam/Gerbang", kode: 1111 },
      { nama: "Teknisi BPS", kode: 1010 },
      { nama: "Teknisi Basement Gd 6", kode: 1060 },
      { nama: "Teknisi Komputer", kode: 1515 },
    ],
  },
  {
    kategori: "Ruang Rapat/Dapur",
    items: [
      { nama: "Gd 2 Lt 2", kode: 1033 },
      { nama: "Gd 3 Lt 1", kode: 1022 },
      { nama: "Gd 6 Lt 8", kode: 1066 },
    ],
  },
  { kategori: "Dharma Wanita", items: [{ nama: "Sekretariat", kode: 1024 }] },
  { kategori: "Lain-lain", items: [{ nama: "UNICEF", kode: 1643 }] },
];

const CardGrid: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollAmount = 300;

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const isAtAbsoluteStart = scrollLeft <= 0;
      const isAtAbsoluteEnd = scrollLeft >= scrollWidth - clientWidth - 1;

      setCanScrollLeft(!isAtAbsoluteStart);
      setCanScrollRight(!isAtAbsoluteEnd && scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (container) {
      const checkInitialScroll = () => {
        if (container.scrollWidth <= container.clientWidth) {
          setCanScrollLeft(false);
          setCanScrollRight(false);
        } else {
          checkScrollability();
        }
      };

      checkInitialScroll();
      container.addEventListener("scroll", checkScrollability, {
        passive: true,
      });
      window.addEventListener("resize", checkInitialScroll);

      const interval = setInterval(() => {
        if (!container) return;
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 1
        ) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }, 7000);

      return () => {
        clearInterval(interval);
        if (container) {
          container.removeEventListener("scroll", checkScrollability);
        }
        window.removeEventListener("resize", checkInitialScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKategori]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    // Menggunakan variabel tema Anda untuk background section
    <section className="w-full bg-surface-page p-4 sm:p-6 rounded-xl select-none shadow-sm">
      {/* Judul tidak lagi di tengah, menggunakan warna tema Anda */}
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
        Informasi Organisasi
      </h2>

      <div className="flex items-center">
        {" "}
        {/* Menghapus 'group' jika panah selalu terlihat */}
        {/* Tombol Navigasi Kiri */}
        <button
          onClick={() => scroll("left")}
          aria-label="Geser ke Kiri"
          disabled={!canScrollLeft}
          // Menggunakan variabel tema Anda dan styling yang lebih baik
          className={`p-2 rounded-full bg-surface-card text-text-primary shadow-md hover:bg-brand-primary hover:text-text-on-brand focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface-page transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed mr-2 sm:mr-3 z-10`}
        >
          <ChevronLeft size={24} />
        </button>
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6 px-1 py-2 scroll-smooth snap-x snap-mandatory flex-grow min-w-0"
          role="region"
          aria-label="Daftar Kategori Informasi Organisasi"
        >
          {dataKategori.map((kategori, index) => (
            <article
              key={index}
              // Menggunakan variabel tema Anda untuk kartu
              className="flex-shrink-0 snap-center w-[250px] sm:w-[270px] bg-surface-card border border-ui-border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col"
            >
              {/* Header Kartu menggunakan warna tema Anda */}
              <h3 className="text-base sm:text-lg font-semibold text-center bg-brand-accent text-text-on-accent rounded-t-lg py-2.5 sm:py-3 px-3 break-words">
                {kategori.kategori}
              </h3>
              {/* Konten Kartu */}
              <div className="pt-3 px-3 sm:px-4 pb-3 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-ui-border/70 scrollbar-track-surface-page scrollbar-thumb-rounded-full">
                {kategori.items.length > 0 ? (
                  // Menggunakan variabel tema Anda untuk separator dan teks item
                  <ul className="divide-y divide-ui-border/70">
                    {kategori.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center py-2.5 text-xs sm:text-sm text-text-secondary"
                      >
                        <span className="break-words pr-2">{item.nama}</span>
                        <span className="font-semibold text-text-primary flex-shrink-0">
                          {item.kode}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-text-secondary text-center py-4">
                    {" "}
                    {/* Menggunakan text-text-secondary */}
                    Tidak ada item.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        {/* Tombol Navigasi Kanan */}
        <button
          onClick={() => scroll("right")}
          aria-label="Geser ke Kanan"
          disabled={!canScrollRight}
          className={`p-2 rounded-full bg-surface-card text-text-primary shadow-md hover:bg-brand-primary hover:text-text-on-brand focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface-page transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed ml-2 sm:ml-3 z-10`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default CardGrid;
