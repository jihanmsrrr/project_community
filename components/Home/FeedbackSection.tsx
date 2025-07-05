// components/Home/FeedbackSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence, Transition } from "framer-motion"; // Import Transition type
import ilustrasiLayanan from "@/public/ruangbaca.png"; // Pastikan path ini benar

// --- Tipe Data ---
interface SurveyData {
  rating: number | null;
  pendapat: string;
}
interface SatisfactionReviewProps {
  onClose: () => void;
  onSubmitSurvey: (data: SurveyData) => void;
}

// --- Komponen Modal Survei (Dengan Penyesuaian Ukuran) ---
const SatisfactionReviewModal: React.FC<SatisfactionReviewProps> = ({
  onClose,
  onSubmitSurvey,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [pendapat, setPendapat] = useState("");
  const [animationsDisabled, setAnimationsDisabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnimationsDisabled(
        document.documentElement.classList.contains("animations-disabled")
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSurvey({ rating, pendapat });
  };
  const modalTransition: Transition = animationsDisabled
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 300, damping: 30 };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-[1001]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }} // Sedikit modifikasi animasi masuk
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={modalTransition}
        className="bg-surface-card w-full max-w-md flex flex-col shadow-2xl rounded-xl" // max-w-md untuk modal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-ui-border flex justify-between items-center">
          <h4 className="text-md font-semibold text-text-primary">
            Bagaimana Pengalaman Anda?
          </h4>{" "}
          {/* Ukuran font modal title */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:bg-ui-border hover:text-text-primary transition-colors"
          >
            <X size={18} /> {/* Ukuran ikon close modal */}
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5 overflow-y-auto"
        >
          {" "}
          {/* Gap disesuaikan */}
          <p className="text-xs sm:text-sm text-text-secondary text-center mb-1">
            Berikan penilaian Anda untuk membantu kami.
          </p>
          <div className="flex justify-center gap-1 sm:gap-2 mb-2 select-none py-1">
            {" "}
            {/* Gap bintang disesuaikan */}
            {[1, 2, 3, 4, 5].map((star) => (
              <label
                key={star}
                className="cursor-pointer group"
                title={`Beri ${star} bintang`}
              >
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  onChange={() => setRating(star)}
                  className="sr-only peer"
                />
                <Star
                  size={32} // Ukuran bintang di modal lebih kecil
                  className={`text-ui-border peer-hover:text-brand-accent/70 peer-checked:text-brand-accent ${
                    rating !== null && rating >= star
                      ? "text-brand-accent fill-brand-accent"
                      : "fill-ui-border/30 group-hover:text-brand-accent/70"
                  } transition-all duration-150 transform group-hover:scale-110 group-active:scale-95`}
                />
              </label>
            ))}
          </div>
          <textarea
            placeholder="Tuliskan pendapat Anda di sini (opsional)..."
            value={pendapat}
            onChange={(e) => setPendapat(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm text-text-primary bg-surface-page border border-ui-border-input rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
          />{" "}
          {/* Ukuran font & padding textarea */}
          <div className="mt-1 space-y-2.5">
            {" "}
            {/* Spasi tombol disesuaikan */}
            <button
              type="submit"
              disabled={rating === null}
              className="w-full bg-brand-primary text-text-on-brand font-semibold py-2.5 text-sm rounded-md hover:bg-brand-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Kirim Penilaian
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-ui-border text-text-secondary font-medium py-2.5 text-sm rounded-md hover:bg-ui-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
            >
              Nanti Saja
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FeedbackSection: React.FC = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalRating = 776;
  const average = 4.9;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenReviewModal = () => setIsReviewModalOpen(true);
  const handleCloseReviewModal = () => setIsReviewModalOpen(false);
  const handleSubmitSurvey = (data: SurveyData) => {
    console.log("Survey Submitted:", data);
    alert(
      `Terima kasih! Penilaian ${data.rating} bintang dan pendapat Anda telah kami terima.`
    );
    handleCloseReviewModal();
  };

  if (!mounted && typeof window === "undefined") {
    // Tampilkan null atau placeholder sederhana saat SSR/belum mounted
    return (
      <section className="bg-surface-page py-12 sm:py-16 md:py-20 w-full min-h-[400px]"></section>
    ); // Placeholder tinggi
  }

  return (
    <section className="bg-surface-page py-12 sm:py-12 md:py-16 w-full">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* max-w-5xl untuk kontainer lebih ramping */}
        <div className="bg-surface-card rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-12 lg:gap-0 lg:items-center min-h-[480px] md:min-h-[500px]">
          {/* Kolom Kiri: Ilustrasi Gambar dengan Efek Floating Sederhana */}
          <div className="lg:col-span-6 relative flex items-center justify-center p-6 sm:p-8 md:p-10 self-stretch order-last lg:order-first">
            {" "}
            {/* Order first di lg, self-stretch */}
            {/* Panel Latar Belakang untuk gambar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full aspect-[1/1] max-w-sm sm:max-w-md lg:max-w-full mx-auto" // aspect-square dan max-width
            >
              <div className="absolute inset-[10%] bg-brand-accent/10 dark:bg-brand-accent/20 rounded-3xl transform -rotate-3 group-hover:rotate-[-5deg] transition-transform duration-300"></div>
              <div className="absolute inset-[10%] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-3xl transform rotate-2 group-hover:rotate-[4deg] transition-transform duration-300 shadow-lg"></div>

              {/* Gambar Utama */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <Image
                  src={ilustrasiLayanan} // GAMBAR INI HARUS PUNYA BACKGROUND TRANSPARAN
                  alt="Ilustrasi Layanan Informasi BPS"
                  width={400}
                  height={400}
                  style={{
                    objectFit: "contain",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                  className="drop-shadow-xl hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Kolom Kanan: Konten Survei Kepuasan */}
          <div className="lg:col-span-6 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-3">
                {" "}
                {/* Ukuran font judul utama disesuaikan */}
                Kami Menghargai Pendapat Anda!
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6 text-xs sm:text-sm">
                {" "}
                {/* Ukuran font paragraf */}
                Bantu kami meningkatkan kualitas layanan dengan memberikan
                penilaian dan masukan Anda. Partisipasi Anda sangat berarti.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 items-center mb-6 w-full max-w-md mx-auto lg:mx-0" // Kontainer rating lebih ramping
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div
                aria-label={`Rating rata-rata ${average.toFixed(1)} dari 5`}
                className="flex flex-col items-center lg:items-start"
              >
                <div className="text-4xl sm:text-5xl font-bold text-brand-accent">
                  {average.toFixed(1)}
                </div>
                <div className="flex gap-0.5 text-brand-accent text-lg sm:text-xl mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(average)
                          ? "fill-brand-accent"
                          : "text-ui-border"
                      }
                    />
                  ))}
                </div>
                <p className="text-text-secondary text-xs">
                  {totalRating.toLocaleString()} Total Penilaian
                </p>
              </div>

              <div className="w-full">
                {/* Distribusi penilaian tidak ditampilkan di sini untuk menyederhanakan, bisa ditambahkan kembali jika perlu */}
              </div>
            </motion.div>

            <motion.div // Wrapper untuk tombol
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              // Kelas ini akan menengahkan tombol di mobile/tablet, dan rata kiri di desktop
              className="mt-auto w-full flex justify-center lg:justify-start pt-2"
            >
              <button
                onClick={handleOpenReviewModal} // Pastikan handleOpenReviewModal sudah didefinisikan
                type="button"
                className={`
                  bg-brand-primary text-text-on-brand
                  font-semibold text-sm rounded-lg
                  px-6 py-2.5  {/* Padding internal tombol */}
                  transition-colors duration-200 ease-in-out
                  hover:bg-brand-primary-hover
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
                  focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card

                  w-auto /* PERUBAHAN UTAMA: Lebar tombol sekarang auto, sesuai konten + padding */

                  {/* Anda masih bisa menambahkan max-width jika diperlukan,
                      misalnya jika teks tombolnya bisa sangat panjang:
                      max-w-xs
                  */}
                `}
              >
                Berikan Penilaian Anda
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReviewModalOpen && (
          <SatisfactionReviewModal
            onClose={handleCloseReviewModal}
            onSubmitSurvey={handleSubmitSurvey}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeedbackSection;
