// pages/Home.tsx (atau file Anda)
"use client"; // Jika menggunakan App Router di Next.js 13+

import React, { useState, useEffect } from "react";
import Skeleton from "@/components/ui/Skeleton"; // Pastikan path ini benar
import HeroSection from "@/components/Home/HeroSection"; // Pastikan path ini benar
import FeedbackSection from "@/components/Home/FeedbackSection"; // Pastikan path ini benar

import DashboardComponent from "@/components/Home/DashboardComponent"; // Pastikan path ini benar
import GuideCarousel from "@/components/Home/GuideCarousel"; // Pastikan path ini benar
import InfoCardGrid from "@/components/Home/InfoCardGrid"; // Pastikan path ini benar

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Durasi loading bisa disesuaikan

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-10 p-4 pt-0 sm:pt-4 relative overflow-x-hidden">
      {" "}
      {/* Dihilangkan padding atas di mobile agar HeroSection bisa lebih fleksibel */}
      {/* Background wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1064px] 
                   bg-[url('/bg2.png')] bg-cover bg-bottom bg-no-repeat -z-10"
      />
      {/* Hero Section with offset bottom */}
      <div className="relative -mb-[100px] sm:-mb-[120px] md:-mb-[140px] z-20">
        {" "}
        {/* Offset disesuaikan sedikit */}
        <HeroSection />
      </div>
      {/* Content Section */}
      {/* Penyesuaian pt agar ada ruang setelah HeroSection yang overlap */}
      <main
        className="relative z-10 pt-[120px] sm:pt-[140px] md:pt-[160px] 
                   flex flex-col 
                   space-y-8 md:space-y-12 // CONTOH: Menggunakan space-y yang lebih kecil
                   max-w-screen-xl mx-auto w-full px-2 sm:px-0"
      >
        {/* Dashboard Component */}
        <section aria-labelledby="dashboard-title">
          <h2 id="dashboard-title" className="sr-only">
            Ringkasan Dashboard
          </h2>
          {loading ? (
            <div className="w-full">
              {" "}
              {/* Div pembungkus untuk mengatur lebar */}
              <Skeleton
                height="h-96 sm:h-[500px]" // Asumsi height dan radius adalah prop valid di Skeleton
                radius="rounded-xl"
              />
            </div>
          ) : (
            <DashboardComponent />
          )}
        </section>

        {/* Info Card Grid */}
        <section aria-labelledby="info-cards-title">
          <h2 id="info-cards-title" className="sr-only">
            Informasi Umum
          </h2>
          {loading ? (
            <Skeleton
              height="h-96 sm:h-[500px]" // Asumsi height dan radius adalah prop valid di Skeleton
              radius="rounded-xl"
            />
          ) : (
            <InfoCardGrid />
          )}
        </section>

        {/* Guide Carousel */}
        <section aria-labelledby="guide-carousel-title">
          <h2 id="guide-carousel-title" className="sr-only">
            Panduan Pengguna
          </h2>
          {loading ? (
            <Skeleton
              height="h-96 sm:h-[500px]" // Asumsi height dan radius adalah prop valid di Skeleton
              radius="rounded-xl"
            />
          ) : (
            <GuideCarousel />
          )}
        </section>

        {/* Feedback Section */}
        <section aria-labelledby="feedback-title">
          <h2 id="feedback-title" className="sr-only">
            Umpan Balik Pengguna
          </h2>
          {loading ? (
            <Skeleton
              height="h-96 sm:h-[500px]" // Asumsi height dan radius adalah prop valid di Skeleton
              radius="rounded-xl"
            />
          ) : (
            <FeedbackSection />
          )}
        </section>
      </main>
    </div>
  );
}
