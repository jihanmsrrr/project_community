"use client";

import React, { useState, useEffect } from "react";
import Skeleton from "@/components/ui/Skeleton";
import HeroSection from "@/components/Home/HeroSection";
import FeedbackSection from "@/components/Home/FeedbackSection";
import DashboardComponent from "@/components/Home/DashboardComponent";
import GuideCarousel from "@/components/Home/GuideCarousel";
import InfoCardGrid from "@/components/Home/InfoCardGrid";
import QuickStats from "@/components/Home/Quickstats";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // DIUBAH: Menghapus gap-10 agar tidak ada jarak vertikal ekstra di level ini
    <div className="flex flex-col relative overflow-x-hidden">
      {/* Background wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1064px] 
                   bg-[url('/bg2.png')] bg-cover bg-bottom bg-no-repeat -z-10"
      />

      {/* Hero Section dengan offset bottom */}
      {/* DIUBAH: Padding horizontal dan margin atas ditambahkan di sini untuk HeroSection */}
      <div className="relative mt-4 -mb-[100px] sm:-mb-[120px] md:-mb-[140px] z-20 w-full px-4 md:px-8">
        <HeroSection />
      </div>

      {/* Content Section */}
      <main
        className="relative z-10 pt-[120px] sm:pt-[140px] md:pt-[160px] 
                   flex flex-col 
                   space-y-8 md:space-y-12
                   w-full px-4 md:px-8" // DIUBAH: Menghapus max-w-screen-xl dan mx-auto, menyesuaikan padding
      >
        {/* Quick Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton height="h-24" radius="rounded-xl" />
            <Skeleton height="h-24" radius="rounded-xl" />
            <Skeleton height="h-24" radius="rounded-xl" />
          </div>
        ) : (
          <QuickStats />
        )}

        {/* Dashboard Component */}
        <section aria-labelledby="dashboard-title">
          <h2 id="dashboard-title" className="sr-only">
            Ringkasan Dashboard
          </h2>
          {loading ? (
            <div className="w-full">
              <Skeleton height="h-96 sm:h-[500px]" radius="rounded-xl" />
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
            <Skeleton height="h-96 sm:h-[500px]" radius="rounded-xl" />
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
            <Skeleton height="h-96 sm:h-[500px]" radius="rounded-xl" />
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
            <Skeleton height="h-96 sm:h-[500px]" radius="rounded-xl" />
          ) : (
            <FeedbackSection />
          )}
        </section>
      </main>
    </div>
  );
}
