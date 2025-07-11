"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes"; // Diimpor untuk manajemen tema
import { LoaderCircle } from "lucide-react";
import Carousel from "./Carousel"; // Asumsi Carousel.tsx ada di folder yang sama

// --- Komponen Greeting ---
const motivationalQuotes = [
  "“In God we trust, all others must bring data.” - W. Edwards Deming",
  "“Data is the new oil.” - Clive Humby",
  "“Without data, you're just another person with an opinion.” - W. Edwards Deming",
  "Fakta: Setiap hari, dunia menghasilkan sekitar 2.5 quintillion byte data.",
  "“The goal is to turn data into information, and information into insight.” - Carly Fiorina",
];

const Greeting: React.FC = () => {
  const { data: session, status } = useSession();
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [currentDate, setCurrentDate] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 19) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-24">
        <LoaderCircle className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const userName = session?.user?.name?.split(" ")[0] || "Insan BPS";

  return (
    // Teks di sini menggunakan warna putih agar kontras dengan backdrop
    <div className="text-center text-white">
      <p className="text-md font-semibold mb-2 opacity-80">{currentDate}</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-2 whitespace-nowrap drop-shadow-lg">
        {`${greeting}, ${userName}!`}
      </h1>
      <p className="text-lg opacity-90 drop-shadow-md">
        Selamat datang di pusat kolaborasi dan data BPS Community.
      </p>
      <p className="text-sm opacity-70 italic mt-4 max-w-xl mx-auto drop-shadow-sm">
        {quote}
      </p>
    </div>
  );
};

// --- Komponen HeroSection Utama (Desain Baru) ---
const HeroSection: React.FC = () => {
  // DIPERBAIKI: Menggunakan resolvedTheme untuk deteksi yang lebih andal
  const { resolvedTheme } = useTheme();
  const [backdropSrc, setBackdropSrc] = useState("/backdrop.png");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // DIPERBAIKI: Menggunakan resolvedTheme dalam logika switch
      switch (resolvedTheme) {
        case "dark":
          setBackdropSrc("/backdrop-dark.png");
          break;
        case "pink":
          setBackdropSrc("/backdrop-pink.png");
          break;
        default:
          setBackdropSrc("/backdrop.png");
          break;
      }
    }
  }, [resolvedTheme, isMounted]); // Dependency diubah ke resolvedTheme

  if (!isMounted) {
    // Placeholder untuk menjaga layout saat loading di client
    return <div className="w-full h-[78vh] bg-surface-card rounded-3xl" />;
  }

  return (
    // DIKEMBALIKAN: Menggunakan layout dengan tinggi viewport dan konten di atasnya
    <section className="relative w-full rounded-xl overflow-visible">
      {/* Backdrop dengan tinggi 78vh dan full rounded */}
      <div className="absolute top-0 left-0 right-0 h-[78vh] rounded-3xl overflow-hidden z-0">
        <Image
          key={backdropSrc} // Key diubah agar Next.js memicu transisi gambar
          src={backdropSrc}
          alt="Backdrop BPS Community"
          fill
          style={{ objectFit: "cover" }}
          className="transition-opacity duration-700 ease-in-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
      </div>

      {/* Konten utama diposisikan di atas backdrop */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 pt-8 pb-2 flex flex-col items-center gap-6">
        <Greeting />
        <div className="w-full max-w-4xl xl:max-w-5xl">
          <Carousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
