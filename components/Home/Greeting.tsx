"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LoaderCircle, Newspaper, Users, BookOpen } from "lucide-react";

// --- Daftar kutipan atau fakta menarik ---
const motivationalQuotes = [
  "“In God we trust, all others must bring data.” - W. Edwards Deming",
  "“Data is the new oil.” - Clive Humby",
  "“Without data, you're just another person with an opinion.” - W. Edwards Deming",
  "Fakta: Setiap hari, dunia menghasilkan sekitar 2.5 quintillion byte data.",
  "“The goal is to turn data into information, and information into insight.” - Carly Fiorina",
];

// --- Daftar tagline sambutan yang dinamis ---
const welcomeTaglines = [
  "Selamat datang di BPS Community. Mari berkolaborasi dan ciptakan inovasi.",
  "Menjelajahi dunia data, satu klik pada satu waktu.",
  "Pusat kolaborasi dan inovasi untuk seluruh Insan BPS.",
  "Temukan wawasan baru dan terhubung dengan rekan se-nusantara.",
  "Wadah untuk berbagi pengetahuan dan memperkuat sinergi.",
];

const Greeting: React.FC = () => {
  const { data: session, status } = useSession();
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [currentDate, setCurrentDate] = useState("");
  const [quote, setQuote] = useState("");
  const [tagline, setTagline] = useState("");

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
    setTagline(
      welcomeTaglines[Math.floor(Math.random() * welcomeTaglines.length)]
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-48">
        <LoaderCircle className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const userName = session?.user?.name?.split(" ")[0] || "Insan BPS";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      {/* DIUBAH: Warna tanggal lebih netral dan adaptif */}
      <p className="text-md text-text-secondary font-semibold mb-2">
        {currentDate}
      </p>
      {/* DIUBAH: Sapaan dibuat agar tidak pindah baris (wrap) */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 whitespace-nowrap">
        {`${greeting}, ${userName}!`}
      </h1>
      <p className="text-md md:text-lg text-text-secondary">{tagline}</p>
      <p className="text-sm text-text-secondary/70 italic mt-6">{quote}</p>

      {/* DITAMBAHKAN: Kartu Statistik Cepat */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="bg-surface-card/70 backdrop-blur-sm border border-ui-border/50 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-brand-primary/10 p-3 rounded-lg">
            <Newspaper className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">12</p>
            <p className="text-sm text-text-secondary">Berita Baru</p>
          </div>
        </div>
        <div className="bg-surface-card/70 backdrop-blur-sm border border-ui-border/50 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-brand-primary/10 p-3 rounded-lg">
            <Users className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">1,240</p>
            <p className="text-sm text-text-secondary">Pegawai Terdaftar</p>
          </div>
        </div>
        <div className="bg-surface-card/70 backdrop-blur-sm border border-ui-border/50 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-brand-primary/10 p-3 rounded-lg">
            <BookOpen className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">86</p>
            <p className="text-sm text-text-secondary">Dokumen Tersedia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
