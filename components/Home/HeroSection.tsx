"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { LoaderCircle } from "lucide-react";
import Carousel from "./Carousel";

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
    <div className="text-center text-white">
      <p className="text-md font-semibold mb-2 opacity-90 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
        {currentDate}
      </p>
      {/* DIUBAH: Ukuran font sapaan utama dikecilkan */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 whitespace-nowrap text-white [text-shadow:0_2px_5px_rgba(0,0,0,0.5)]">
        {`${greeting}, ${userName}!`}
      </h1>
      {/* DIUBAH: Ukuran font tagline disesuaikan */}
      <p className="text-base md:text-lg opacity-90 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
        Selamat datang di pusat kolaborasi dan data BPS Community.
      </p>
      <p className="text-sm opacity-80 italic mt-4 max-w-xl mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
        {quote}
      </p>
    </div>
  );
};

// --- Komponen HeroSection Utama ---
const HeroSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [backdropSrc, setBackdropSrc] = useState("/backdrop.png"); // Default ke .jpg
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      switch (resolvedTheme) {
        case "dark":
          setBackdropSrc("/backdrop-dark.png");
          break;
        case "pink":
          setBackdropSrc("/backdrop-pink.png"); // Menggunakan .jpg sesuai file baru
          break;
        default:
          setBackdropSrc("/backdrop.png");
          break;
      }
    }
  }, [resolvedTheme, isMounted]);

  if (!isMounted) {
    return <div className="w-full h-[78vh] bg-surface-card rounded-3xl" />;
  }

  return (
    <section className="relative w-full rounded-xl overflow-visible">
      <div className="absolute top-0 left-0 right-0 h-[78vh] rounded-3xl overflow-hidden z-0">
        <Image
          key={backdropSrc}
          src={backdropSrc}
          alt="Backdrop BPS Community"
          fill
          style={{ objectFit: "cover" }}
          className="transition-opacity duration-700 ease-in-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-2 flex flex-col items-center gap-6">
        <Greeting />
        <div className="w-full max-w-4xl xl:max-w-5xl pt-4">
          <Carousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
