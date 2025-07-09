"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Pengumuman } from "@/types/pengumuman"; // Assuming you create this interface

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const total = pengumumanList.length;

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        const response = await fetch("/api/pengumuman");
        if (response.ok) {
          const data = await response.json();
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

  const getSlide = (offset: number) => {
    return pengumumanList[(index + offset + total) % total];
  };

  const handleImageClick = (image: string) => setSelectedImage(image);

  const handleClose = () => setSelectedImage(null);

  return (
    <>
      <div className="relative max-w-full mx-auto flex items-center justify-center h-[460px] select-none px-16 overflow-visible">
        {/* Prev Button - lebih nempel kiri */}
        <button
          onClick={prevSlide}
          className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white border border-blue-900 text-blue-600 rounded-full p-3 shadow-md hover:bg-blue-900 hover:text-white transition-transform duration-200 z-20"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Slider 3 gambar */}
        <div className="flex items-center justify-center gap-4">
          {[-1, 0, 1].map((offset) => {
            const item = getSlide(offset);
            const isActive = offset === 0;

            return (
              item && (
                <motion.div
                  key={item.id}
                  onClick={() => handleImageClick(item.gambarUrl)}
                  className="cursor-pointer rounded-2xl overflow-hidden shadow-lg border-2 border-gray-300 flex flex-col items-center justify-start"
                  style={{
                    width: isActive ? 380 : 300,
                    height: isActive ? 450 : 380,
                    opacity: isActive ? 1 : 0.5,
                    filter: isActive
                      ? "none"
                      : "grayscale(70%) brightness(70%)",
                    transition: "all 0.4s ease",
                    borderRadius: 20,
                    boxShadow: isActive
                      ? "0 8px 20px rgba(0,0,0,0.3)"
                      : "0 4px 10px rgba(0,0,0,0.15)",
                    backgroundColor: "white",
                    overflow: "hidden",
                  }}
                  layout
                >
                  <Image
                    src={item.gambarUrl}
                    alt={item.judul}
                    width={isActive ? 400 : 320}
                    height={isActive ? 450 : 380}
                    className="object-cover rounded-2xl"
                    priority
                  />
                  <h3 className="mt-2 text-center text-gray-800 text-base select-none">
                    {item.judul}
                  </h3>
                </motion.div>
              )
            );
          })}
        </div>

        {/* Next Button - lebih nempel kanan */}
        <button
          onClick={nextSlide}
          className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white border border-blue-900 text-blue-600 rounded-full p-3 shadow-md hover:bg-blue-900 hover:text-white transition-transform duration-200 z-20"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Popup Modal */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
              >
                <motion.div
                  className="relative max-w-[90vw] max-h-[90vh] rounded-3xl overflow-hidden bg-transparent"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 bg-white rounded-full p-1 flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Close"
                  >
                    <X size={28} />
                  </button>
                  <Image
                    src={selectedImage}
                    alt="Popup"
                    width={1080}
                    height={1920}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: 20,
                    }}
                    priority
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
