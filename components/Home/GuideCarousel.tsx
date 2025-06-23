"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'; // Pastikan semua ikon ini diimpor
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/id';

// Setup dayjs
dayjs.extend(customParseFormat);
dayjs.locale('id');

// Data dummy (tetap sama)
const guides = [
  { date: '27 September 2024', title: 'Peraturan BPS Nomor 3 Tahun 2024', description: 'Tata Cara Pemberian Tunjangan Kinerja Pegawai', views: 794, linkText: 'Lihat Detail' },
  { date: '15 Oktober 2024', title: 'Panduan Statistik Penduduk 2024', description: 'Metode Pengumpulan dan Analisis Data Penduduk', views: 1123, linkText: 'Pelajari Lebih Lanjut' },
  { date: '30 Oktober 2024', title: 'Kebijakan Baru BPS Tentang Data Digital', description: 'Implementasi Sistem Statistik Berbasis Digital', views: 658, linkText: 'Baca Selengkapnya' },
  { date: '5 November 2024', title: 'Panduan Penyusunan Laporan Statistik', description: 'Format dan Tata Cara Penyusunan Laporan Tahunan', views: 523, linkText: 'Unduh Dokumen' },
  { date: '12 November 2024', title: 'Peraturan BPS Nomor 7 Tahun 2024', description: 'Standar Pelayanan Statistik Nasional', views: 785, linkText: 'Detail Peraturan' },
];

const GuideCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1); // Default akan diupdate oleh useEffect

  const totalPages = Math.ceil(guides.length / cardsPerPage);

  // Fungsi untuk update jumlah kartu per halaman berdasarkan lebar layar
  const updateCardsPerPageBasedOnWidth = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1200) setCardsPerPage(4); // Untuk max-w-[1200px] container, 4 kartu mungkin pas
      else if (width >= 1024) setCardsPerPage(3); // lg
      else if (width >= 768) setCardsPerPage(2);  // md
      else if (width >= 640) setCardsPerPage(2);  // sm (bisa juga 1 atau 2 tergantung desain)
      else setCardsPerPage(1);                   // xs
    } else {
      setCardsPerPage(1); // Default SSR
    }
  };
  
  useEffect(() => {
    updateCardsPerPageBasedOnWidth(); // Panggil saat mount
    window.addEventListener('resize', updateCardsPerPageBasedOnWidth);
    return () => window.removeEventListener('resize', updateCardsPerPageBasedOnWidth);
  }, []);

  // Update currentPage jika totalPages berubah (misalnya karena resize)
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (currentPage < 0 && totalPages > 0) { // Jika totalPages menjadi 0 karena error
        setCurrentPage(0);
    }
  }, [totalPages, currentPage]);


  const goToPage = (pageIndex: number) => {
    if (!containerRef.current || cardsPerPage === 0) return; // Tambah guard untuk cardsPerPage
    const container = containerRef.current;
    // Perhitungan scrollAmount yang lebih akurat berdasarkan lebar kartu + gap
    const cardWidth = container.scrollWidth / guides.length; // Perkiraan lebar satu kartu
    const scrollAmount = cardWidth * cardsPerPage * pageIndex;
    
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    setCurrentPage(pageIndex);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  };

  return (
    // Menggunakan variabel tema untuk background section
    <section
      className="max-w-[1200px] mx-auto px-4 sm:px-5 py-6 sm:py-8 bg-surface-page rounded-lg select-none"
      aria-label="Carousel Panduan BPS"
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        {/* Menggunakan variabel tema untuk aksen bar */}
        <span className="w-1 sm:w-1.5 h-5 sm:h-6 bg-brand-primary rounded-sm inline-block" aria-hidden="true" />
        {/* Menggunakan variabel tema untuk teks header */}
        <h2 className="text-text-primary font-semibold text-lg sm:text-xl">Pusat Panduan</h2>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Tombol Navigasi Kiri */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          aria-label="Halaman panduan sebelumnya"
          // Menggunakan variabel tema untuk tombol navigasi
          className="absolute top-1/2 -left-3 sm:-left-4 transform -translate-y-1/2 bg-surface-card text-text-primary rounded-full p-2 shadow-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-primary hover:text-text-on-brand focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page z-10"
        >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Kontainer Kartu */}
        <div
          ref={containerRef}
          role="list"
          tabIndex={-1} // Membuatnya tidak bisa di-fokus secara programatik, tapi konten di dalamnya bisa
          aria-live="polite" // Umumkan perubahan pada screen reader
          className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 py-1" // py-1 untuk ruang shadow
        >
          {guides.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage).map((guide, idx) => { // Hanya render kartu untuk halaman saat ini
            const parsedDate = dayjs(guide.date, 'D MMMM YYYY', 'id'); // Format YYYY
            const dateTimeISO = parsedDate.isValid() ? parsedDate.toISOString() : undefined;
            const formattedDate = parsedDate.isValid() ? parsedDate.format('D MMM YYYY') : guide.date; // Format lebih singkat

            return (
              <article
                key={idx + (currentPage * cardsPerPage)} // Key lebih unik jika data bisa berulang
                role="listitem"
                aria-label={`${guide.title}, tanggal ${formattedDate}, dilihat ${guide.views} kali`}
                // Menggunakan variabel tema untuk kartu. Lebar diatur oleh cardsPerPage.
                className={`flex flex-col flex-shrink-0 bg-surface-card rounded-lg shadow-lg p-4 sm:p-5 w-[calc((100%-(${(cardsPerPage-1)}*1rem))/${cardsPerPage})] max-w-[280px] sm:max-w-xs cursor-pointer hover:shadow-xl transition-shadow duration-300 min-h-[280px] sm:min-h-[300px] focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-1 focus-within:ring-offset-surface-card`}
              >
                <header className="flex justify-between text-xs text-text-secondary opacity-80 mb-2 sm:mb-3">
                  <time dateTime={dateTimeISO}>{formattedDate}</time>
                  <div className="flex items-center gap-1">
                    <Eye size={14} aria-hidden="true" />
                    <span>{guide.views}</span>
                  </div>
                </header>

                {/* Menggunakan variabel tema untuk teks judul */}
                <h3 className="text-text-primary font-semibold mb-2 text-sm sm:text-base leading-tight line-clamp-2 break-words">
                  {guide.title}
                </h3>

                {/* Menggunakan variabel tema untuk teks deskripsi */}
                <p className="text-text-secondary text-xs sm:text-sm mb-4 flex-grow line-clamp-3 sm:line-clamp-4 break-words">
                  {guide.description}
                </p>

                {/* Menggunakan variabel tema untuk tombol aksi */}
                <button
                  aria-label={`Buka panduan: ${guide.title}`}
                  className="mt-auto flex items-center gap-2 bg-brand-primary text-text-on-brand text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-md w-full justify-center hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-card transition-colors"
                >
                   <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  {guide.linkText}
                </button>
              </article>
            );
          })}
        </div>

        {/* Tombol Navigasi Kanan */}
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1} // Kondisi disabled diperbarui
          aria-label="Halaman panduan berikutnya"
          // Menggunakan variabel tema untuk tombol navigasi
          className="absolute top-1/2 -right-3 sm:-right-4 transform -translate-y-1/2 bg-surface-card text-text-primary rounded-full p-2 shadow-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-primary hover:text-text-on-brand focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page z-10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button> 
      </div>

      {/* Pagination dots */}
      {totalPages > 1 && ( // Hanya tampilkan pagination jika lebih dari 1 halaman
        <nav aria-label="Navigasi halaman carousel" className="flex justify-center mt-5 sm:mt-6 gap-2 sm:gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-current={currentPage === i ? 'page' : undefined} // aria-current lebih tepat 'page'
              aria-label={`Ke halaman ${i + 1}`}
              // Menggunakan variabel tema untuk pagination dots
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                currentPage === i ? 'bg-brand-primary' : 'bg-ui-border hover:bg-brand-accent'
              }`}
            />
          ))}
        </nav>
      )}
    </section>
  );
};

export default GuideCarousel;