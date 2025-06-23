"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Definisikan tipe props untuk BeritaCard di sini (jika belum ada secara global)
interface BeritaCardProps {
  id: number;
  judul: string;
  tanggal: string;
  deskripsi: string;
  gambar: string;
  index?: number;
}

// Komponen BeritaCard sebagai komponen lokal di dalam BeritaPreview
const BeritaCard: React.FC<BeritaCardProps> = ({
  judul,
  tanggal,
  deskripsi,
  gambar,
  index, // Menerima index
}) => {
  return (
    // Menggunakan variabel tema untuk background dan shadow
    // Menghapus min-h-[340px] agar tinggi lebih fleksibel
    <article className="bg-surface-card rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-page">
      <div className="relative w-full aspect-[16/9]">
        {" "}
        {/* Menggunakan aspect-ratio untuk gambar */}
        <Image
          src={gambar}
          alt={judul}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Sizes lebih detail
          priority={index !== undefined && index < 2} // Priority untuk 2 gambar pertama
        />
      </div>

      <div className="p-4 flex flex-col flex-grow min-w-0">
        {" "}
        {/* min-w-0 untuk flex child dengan truncate/line-clamp */}
        {/* Menggunakan variabel tema untuk warna teks */}
        <p className="text-xs text-text-secondary opacity-80 mb-1">{tanggal}</p>
        <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2 line-clamp-2 break-words group-hover:text-brand-primary transition-colors">
          {judul}
        </h3>
        <p className="text-sm text-text-secondary flex-grow line-clamp-3 break-words">
          {deskripsi}
        </p>
      </div>
    </article>
  );
};

// Data dummy berita (pastikan URL gambar konsisten atau sesuai kebutuhan)
const dummyBerita: BeritaCardProps[] = [
  {
    id: 1,
    judul: "Desa Cantik Resmi Diluncurkan di Kelurahan Kesambi",
    tanggal: "5 April 2025",
    deskripsi:
      "BPS Kota Cirebon bekerja sama dengan pemerintah daerah meresmikan program Desa Cinta Statistik (Desa Cantik) di Kelurahan Kesambi untuk meningkatkan literasi data warga.",
    gambar: `https://picsum.photos/seed/berita1/400/225`, // Menggunakan seed tetap
  },
  {
    id: 2,
    judul: "Sosialisasi Sensus Penduduk 2025 Dimulai Serentak",
    tanggal: "4 April 2025",
    deskripsi:
      "Tahap sosialisasi Sensus Penduduk (SP2025) Lanjutan telah dimulai di seluruh wilayah Kota Cirebon, disambut antusiasme tinggi dari masyarakat.",
    gambar: `https://picsum.photos/seed/berita2/400/225`,
  },
  {
    id: 3,
    judul: "Kunjungan Kerja Kepala BPS Provinsi Jawa Barat ke BPS Kota Cirebon",
    tanggal: "3 April 2025",
    deskripsi:
      "Bapak Marsudijono, Kepala BPS Provinsi Jawa Barat, mengapresiasi inovasi dan perubahan signifikan yang telah dicapai oleh BPS Kota Cirebon dalam setahun terakhir.",
    gambar: `https://picsum.photos/seed/berita3/400/225`,
  },
  {
    id: 4,
    judul: "Pelatihan Petugas Lapangan untuk Survei Ekonomi Terbaru",
    tanggal: "2 April 2025",
    deskripsi:
      "Puluhan calon petugas lapangan mengikuti pelatihan intensif untuk persiapan survei ekonomi triwulanan guna menghasilkan data yang akurat dan berkualitas.",
    gambar: `https://picsum.photos/seed/berita4/400/225`,
  },
];

const BeritaPreview = () => {
  return (
    // Menggunakan variabel tema untuk background section jika perlu, atau biarkan transparan (mewarisi dari parent)
    // Untuk contoh ini, kita biarkan transparan dan mengandalkan bg-surface-page dari layout utama
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        {" "}
        {/* flex-wrap untuk layar kecil */}
        {/* Menggunakan variabel tema untuk warna teks judul */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Berita Terbaru
        </h2>
        <Link href="/berita" legacyBehavior>
          {/* Menggunakan variabel tema untuk tombol */}
          <a className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-text-on-brand font-semibold py-2 px-4 sm:px-5 rounded-lg transition-colors duration-200 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page">
            Lihat Semua &rarr;
          </a>
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dummyBerita.map(
          (
            b,
            index // Menambahkan index ke map
          ) => (
            <BeritaCard
              key={b.id}
              id={b.id} // Teruskan id
              judul={b.judul}
              tanggal={b.tanggal}
              deskripsi={b.deskripsi}
              gambar={b.gambar}
              index={index} // Teruskan index untuk priority Image
            />
          )
        )}
      </div>
    </section>
  );
};

export default BeritaPreview;
