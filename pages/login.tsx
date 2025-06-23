// pages/login.tsx (atau file halaman login utama Anda)

import React from "react";
import LoginForm from "@/components/Login/LoginForm";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";

// Impor CSS untuk Swiper
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Ikon-ikon yang relevan (tidak ada perubahan)
const OrganizationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.159A3 3 0 0 0 9 5.25v2.25m3-2.25A3 3 0 0 0 9 5.25m3 2.25a3 3 0 0 0-3 2.25m-7.5 6.375a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 2.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>
);
const ReadingRoomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);
const VariaStatsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
    />
  </svg>
);

// Komponen Halaman Login Utama
const LoginPage = () => {
  const slideImages = [
    { src: "/bpsanimated.png", alt: "BPS Community Animation" },
    {
      src: "https://picsum.photos/seed/bpsDataViz/1920/1080",
      alt: "Data Visualization",
    },
    {
      src: "https://picsum.photos/seed/bpsInnovation/1920/1080",
      alt: "Statistical Innovation",
    },
  ];

  return (
    <div className="bg-surface-page text-text-primary antialiased">
      {/* Bagian Atas: Area Login */}
      <section className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Sisi Kiri: Slideshow Gambar */}
        <div className="relative hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gray-800 text-white overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            pagination={{ clickable: true }}
            navigation={true}
            className="w-full h-full"
          >
            {slideImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="max-w-full max-h-full object-contain p-4"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-x-0 bottom-0 mb-10 z-10 flex flex-col items-center justify-end text-center p-8 sm:p-12 pointer-events-none">
            {/* --- PERUBAHAN REDAKSI --- */}
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg">
              Selamat Datang di BPS Community
            </h1>
            <p className="text-md md:text-lg text-gray-200 drop-shadow-md">
              Platform kolaborasi dan pusat informasi insan statistik.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 bg-surface-page py-12 lg:py-6">
          <div className="w-full max-w-md">
            <div className="absolute top-6 right-6">
              <ThemeSwitcher />
            </div>
            <LoginForm />
          </div>
        </div>
      </section>

      {/* --- Bagian Bawah: Informasi Keunggulan (Direvisi Total) --- */}
      {/* --- PERUBAHAN: Latar belakang kembali ke biru (`bg-surface-header`) --- */}
      <section className="py-16 sm:py-24 px-6 bg-surface-header">
        <div className="container mx-auto text-center max-w-6xl">
          {/* --- PERUBAHAN: Warna teks diubah menjadi terang & redaksi baru --- */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10 text-text-on-header">
            Fitur Unggulan BPS Community
          </h2>
          <p className="text-lg text-gray-300 mb-12 sm:mb-16 max-w-3xl mx-auto">
            Platform kami dirancang sebagai pusat kolaborasi dan pengetahuan.
            Temukan berbagai fitur yang akan menunjang pekerjaan dan wawasan
            Anda sebagai insan statistik.
          </p>

          {/* --- PERUBAHAN: Redaksi pada InfoCard menjadi lebih realistis --- */}
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 text-left">
            <InfoCard
              title="Menu Organisasi"
              description="Pusat informasi resmi BPS Community. Akses direktori anggota, dokumen AD/ART, dan seluruh pengumuman penting organisasi."
              icon={<OrganizationIcon />}
            />
            <InfoCard
              title="Menu Ruang Baca"
              description="Perpustakaan digital Anda. Unduh materi, e-book, artikel ilmiah, dan hasil penelitian untuk meningkatkan kompetensi statistik Anda."
              icon={<ReadingRoomIcon />}
            />
            <InfoCard
              title="Menu Varia Statistik"
              description="Wawasan data disajikan secara menarik. Jelajahi kumpulan infografis, visualisasi interaktif, dan fakta statistik unik dari berbagai sumber."
              icon={<VariaStatsIcon />}
            />
          </div>
        </div>
      </section>

      {/* --- PERUBAHAN REDAKSI --- */}
      <footer className="py-8 text-center text-text-secondary text-sm bg-surface-card border-t border-ui-border">
        &copy; {new Date().getFullYear()} BPS Community. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};

// Komponen InfoCard (tidak ada perubahan)
interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-surface-card p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left">
      {icon && (
        <div className="mb-4 text-brand-primary bg-brand-primary/10 p-3 rounded-lg">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-3 text-text-primary">{title}</h3>
      <p className="text-text-secondary text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default LoginPage;
