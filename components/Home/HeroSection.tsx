"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import Carousel from "./Carousel"; // Asumsi Carousel.tsx ada di folder yang sama

// --- Komponen Greeting (Disederhanakan & digabung di sini) ---

// DITAMBAHKAN KEMBALI: Daftar kutipan atau fakta menarik
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
  const [quote, setQuote] = useState(""); // State baru untuk kutipan

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

    // Memilih kutipan acak saat komponen dimuat
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-24">
        <LoaderCircle className="w-8 h-8 animate-spin text-text-on-brand" />
      </div>
    );
  }

  const userName = session?.user?.name?.split(" ")[0] || "Insan BPS";

  return (
    <div className="text-center text-white">
      <p className="text-md font-semibold mb-2 opacity-80">{currentDate}</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-2 whitespace-nowrap">
        {`${greeting}, ${userName}!`}
      </h1>
      <p className="text-lg opacity-90">
        Selamat datang di pusat kolaborasi dan data BPS Community.
      </p>
      {/* DITAMBAHKAN KEMBALI: Kutipan motivasi */}
      <p className="text-sm opacity-70 italic mt-4 max-w-xl mx-auto">{quote}</p>
    </div>
  );
};

// --- Komponen HeroSection Utama (Desain Baru) ---
const HeroSection: React.FC = () => {
  return (
    // Section utama dengan background gradasi yang adaptif tema
    <section className="relative w-full rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent p-4 md:p-6 overflow-hidden">
      {/* Pola geometris halus sebagai background texture */}
      <div
        className="absolute inset-0 bg-[url('/bg2.png')] bg-cover bg-center opacity-10"
        style={{ filter: "invert(1)" }}
      />

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <Greeting />
        <div className="w-full max-w-5xl">
          <Carousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
