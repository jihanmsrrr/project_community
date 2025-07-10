"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link"; // Diimpor untuk tombol aksi
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Asumsi Anda membuat interface ini di file terpisah, misal: src/types/pengumuman.ts
interface Pengumuman {
  id: number;
  judul: string;
  gambarUrl: string;
  targetUrl?: string; // URL tujuan saat diklik
}

const Carousel = () => {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const total = pengumumanList.length;

  // Efek untuk menandakan komponen sudah di-mount di sisi client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Efek untuk mengambil data pengumuman dari API
  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        const response = await fetch("/api/pengumuman"); // Endpoint untuk pengumuman aktif
        if (response.ok) {
          const data: Pengumuman[] = await response.json();
          setPengumumanList(data);
        } else {
          console.error("Gagal mengambil data pengumuman");
        }
      } catch (error) {
        console.error(
          "Terjadi kesalahan saat mengambil data pengumuman:",
          error
        );
      }
    };

    fetchPengumuman();
  }, []);

  // Fungsi navigasi yang di-memoize
  const prevSlide = useCallback(() => {
    if (total > 0) setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const nextSlide = useCallback(() => {
    if (total > 0) setIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Fungsi untuk mendapatkan slide berdasarkan offset dari index saat ini
  const getSlide = (offset: number) => {
    if (total === 0) return null;
    return pengumumanList[(index + offset + total) % total];
  };

  // Handler untuk klik gambar dan popup
  const handleImageClick = (image: string) => setSelectedImage(image);
  const handleClose = () => setSelectedImage(null);

  // Tampilan jika tidak ada data
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[460px] bg-surface-card rounded-xl">
        <p className="text-text-secondary">
          Tidak ada pengumuman untuk ditampilkan.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* DIUBAH: Tinggi container disesuaikan */}
      <div className="relative w-full flex items-center justify-center h-[500px] select-none overflow-hidden">
        {/* Tombol Navigasi Kiri */}
        <button
          onClick={prevSlide}
          className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 bg-surface-card border border-ui-border text-brand-primary rounded-full p-2 md:p-3 shadow-md hover:bg-brand-primary hover:text-text-on-brand transition-all duration-200 z-20"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>

        {/* --- Slider --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            {/* Tampilan Desktop: 3 Gambar */}
            <div className="hidden md:flex items-center justify-center gap-6">
              {[-1, 0, 1].map((offset) => {
                const item = getSlide(offset);
                const isActive = offset === 0;
                if (!item)
                  return <div key={offset} className="w-[320px] h-[400px]" />;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => isActive && handleImageClick(item.gambarUrl)}
                    className={`relative rounded-2xl overflow-hidden shadow-lg border-2 flex flex-col items-center justify-center transition-all duration-400 ease-in-out ${
                      isActive
                        ? "cursor-pointer border-brand-primary"
                        : "border-transparent"
                    }`}
                    style={{
                      // DIUBAH: Ukuran kartu diperbesar
                      width: isActive ? 420 : 320,
                      height: isActive ? 480 : 400,
                      opacity: isActive ? 1 : 0.4,
                      filter: isActive ? "none" : "grayscale(50%)",
                      backgroundColor: "rgb(var(--surface-card))",
                    }}
                    whileHover={isActive ? { scale: 1.02 } : {}}
                  >
                    <Image
                      src={item.gambarUrl}
                      alt={item.judul}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={isActive}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 pt-16">
                      <h3 className="text-center text-white text-xl font-semibold select-none truncate">
                        {item.judul}
                      </h3>
                      {/* DITAMBAHKAN: Tombol Lihat Detail */}
                      {isActive && item.targetUrl && (
                        <Link href={item.targetUrl} passHref legacyBehavior>
                          <a
                            className="flex items-center justify-center gap-2 mt-3 w-full max-w-xs mx-auto px-4 py-2 rounded-lg bg-brand-primary/80 text-text-on-brand backdrop-blur-sm border border-white/20 hover:bg-brand-primary transition-colors font-semibold"
                            onClick={(e) => e.stopPropagation()} // Mencegah popup gambar terbuka
                          >
                            Lihat Detail <ArrowUpRight size={16} />
                          </a>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Tampilan Mobile: 1 Gambar */}
            <div className="md:hidden w-full h-full flex items-center justify-center">
              {getSlide(0) && (
                <div className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden shadow-xl bg-surface-card">
                  <Image
                    src={getSlide(0)!.gambarUrl}
                    alt={getSlide(0)!.judul}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col items-center">
                    <h3 className="text-center text-white text-lg font-semibold select-none truncate">
                      {getSlide(0)!.judul}
                    </h3>
                    {/* DITAMBAHKAN: Tombol Lihat Detail untuk Mobile */}
                    {getSlide(0)!.targetUrl ? (
                      <Link
                        href={getSlide(0)!.targetUrl!}
                        passHref
                        legacyBehavior
                      >
                        <a className="flex items-center justify-center gap-2 mt-2 px-4 py-2 text-sm rounded-lg bg-brand-primary/80 text-text-on-brand backdrop-blur-sm border border-white/20 hover:bg-brand-primary transition-colors font-semibold">
                          Lihat Detail
                        </a>
                      </Link>
                    ) : (
                      <div
                        onClick={() => handleImageClick(getSlide(0)!.gambarUrl)}
                        className="mt-2 text-sm text-white/80 cursor-pointer"
                      >
                        Ketuk untuk memperbesar
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tombol Navigasi Kanan */}
        <button
          onClick={nextSlide}
          className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 bg-surface-card border border-ui-border text-brand-primary rounded-full p-2 md:p-3 shadow-md hover:bg-brand-primary hover:text-text-on-brand transition-all duration-200 z-20"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* --- Popup Modal --- */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
              >
                <motion.div
                  className="relative w-full h-full max-w-3xl max-h-[90vh]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleClose}
                    className="absolute -top-10 right-0 md:top-2 md:-right-12 bg-surface-card rounded-full p-2 text-text-primary hover:scale-110 transition-transform z-10"
                    aria-label="Close"
                  >
                    <X size={28} />
                  </button>
                  <Image
                    src={selectedImage}
                    alt="Popup"
                    fill
                    className="object-contain rounded-2xl"
                    sizes="100vw"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default Carousel;
