import React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { ChevronUp, Star } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") { // Pastikan window tersedia (client-side)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    // Menggunakan variabel tema untuk background dan teks utama
    <footer className="bg-brand-primary text-text-on-brand py-10 px-5 md:px-20 relative select-none">
      <div className="flex flex-wrap justify-between gap-8 max-w-[1200px] mx-auto">
        {/* Kiri */}
        <div className="flex-1 min-w-[260px] space-y-4">
          <Image src="/bps.png" alt="Logo BPS" width={42} height={42} />
          {/* Menggunakan variabel tema untuk teks */}
          <h3 className="font-poppins font-bold text-lg text-text-on-brand">BADAN PUSAT STATISTIK</h3>
          <p className="text-sm text-text-on-brand opacity-80 leading-relaxed max-w-sm"> {/* Opacity disesuaikan */}
            Badan Pusat Statistik (BPS - Statistics Indonesia) <br />
            Jl. Dr. Sutomo 6–8 <br />
            Jakarta 10710 Indonesia <br />
            Telp (62–21) 3841195; 3842508; 3810291 <br />
            Faks (62–21) 3857046 <br />
            Mailbox:{" "}
            <a
              href="mailto:bpshq@bps.go.id"
              // Menggunakan variabel tema untuk link
              className="underline text-text-on-brand hover:opacity-100 hover:text-brand-accent transition-colors"
            >
              bpshq@bps.go.id
            </a>
          </p>
          <Image
            src="/footer.png" // Pastikan path ini benar dan gambar ada di public
            alt="Logo BerAKHLAK"
            width={368}
            height={96}
            className="rounded-xl object-contain"
          />
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="https://manual-website-bps.readthedocs.io/id/latest/"
              // Menggunakan variabel tema untuk link
              className="text-sm text-text-on-brand opacity-80 underline hover:opacity-100 hover:text-brand-accent transition-colors"
            >
              Manual S&K
            </Link>
            <Link
              href="http://bps.go.id/id/tautan"
              // Menggunakan variabel tema untuk link
              className="text-sm text-text-on-brand opacity-80 underline hover:opacity-100 hover:text-brand-accent transition-colors"
            >
              Daftar Tautan
            </Link>
          </div>
        </div>

        {/* Tengah */}
        <div className="flex-1 min-w-[180px]">
          {/* Menggunakan variabel tema untuk teks */}
          <h4 className="font-bold text-lg mb-3 text-text-on-brand">Tentang Kami</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">
                Profil BPS
              </Link>
            </li>
            <li>
              <Link
                href="https://ppid.bps.go.id/?mfd=0000&_gl=1*1fc7rdp*_ga*OTczNTk4OTEyLjE3NDMzMzkwOTg.*_ga_XXTTVXWHDB*MTc0NDQ0MzgxMi43LjEuMTc0NDQ0Mzg2MS4wLjAuMA.."
                className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors"
              >
                PPID
              </Link>
            </li>
          </ul>
        </div>

        {/* Kanan */}
        <div className="flex-1 min-w-[180px]">
          {/* Menggunakan variabel tema untuk teks */}
          <h4 className="font-bold text-lg mb-3 text-text-on-brand">Tautan Lainnya</h4>
          <ul className="space-y-2">
            {/* Contoh untuk satu item, terapkan pola yang sama untuk item lainnya */}
            <li>
              <Link
                href="https://www.aseanstats.org/"
                className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors"
              >
                ASEAN Stats
              </Link>
            </li>
            {/* ... (Terapkan pola kelas yang sama untuk link lainnya di bagian ini) ... */}
            <li><Link href="https://fmsindonesia.id/" className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">Forum Masyarakat Statistik</Link></li>
            <li><Link href="https://rb.bps.go.id/?_gl=1*1ky8rin*_ga*OTczNTk4OTEyLjE3NDMzMzkwOTg.*_ga_XXTTVXWHDB*MTc0NDQ0MzgxMi43LjEuMTc0NDQ0MzkxNi4wLjAuMA.." className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">Reformasi Birokrasi</Link></li>
            <li><Link href="https://lpse.bps.go.id/eproc4?_gl=1*1ky8rin*_ga*OTczNTk4OTEyLjE3NDMzMzkwOTg.*_ga_XXTTVXWHDB*MTc0NDQ0MzgxMi43LjEuMTc0NDQ0MzkxNi4wLjAuMA.." className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">Layanan Pengadaan Secara Elektronik</Link></li>
            <li><Link href="https://www.stis.ac.id/" className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">Politeknik Statistika STIS</Link></li>
            <li><Link href="https://pusdiklat.bps.go.id/?_gl=1*1rwe58q*_ga*OTczNTk4OTEyLjE3NDMzMzkwOTg.*_ga_XXTTVXWHDB*MTc0NDQ0MzgxMi43LjEuMTc0NDQ0Mzk1MS4wLjAuMA.." className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">Pusdiklat BPS</Link></li>
            <li><Link href="https://jdih.bps.go.id/?_gl=1*1rwe58q*_ga*OTczNTk4OTEyLjE3NDMzMzkwOTg.*_ga_XXTTVXWHDB*MTc0NDQ0MzgxMi43LjEuMTc0NDQ0Mzk1MS4wLjAuMA.." className="text-sm text-text-on-brand opacity-80 hover:opacity-100 hover:text-brand-accent transition-colors">JDIH BPS</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      {/* Menggunakan variabel tema untuk border dan teks */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-8 border-t border-text-on-brand/20 pt-4 max-w-[1200px] mx-auto text-sm text-text-on-brand opacity-80">
        <p>Hak Cipta © {new Date().getFullYear()} Badan Pusat Statistik</p> {/* Tahun dinamis */}
        <div className="flex gap-4">
          {/* Tombol sosial media (warna latar dipertahankan sebagai warna brand masing-masing) */}
          <a href="https://x.com/bps_statistics" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-black text-white hover:opacity-80 transition" aria-label="Twitter"><FaXTwitter /></a>
          <a href="https://www.facebook.com/bpsstatistics" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877f2] text-white hover:opacity-80 transition" aria-label="Facebook"><FaFacebookF /></a>
          <a href="https://www.instagram.com/bps_statistics/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-[#e4405f] text-white hover:opacity-80 transition" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://www.youtube.com/c/bpsstatistics" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ff0000] text-white hover:opacity-80 transition" aria-label="YouTube"><FaYoutube /></a> {/* Path YouTube diperbaiki */}
        </div>
      </div>

      {/* Floating Buttons */}
      {/* Menggunakan variabel tema untuk background tombol floating */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-40"> {/* z-index disesuaikan agar di bawah menu aksesibilitas jika perlu */}
        <button
          onClick={scrollToTop}
          className="bg-status-orange text-text-on-brand rounded-full p-3 shadow-lg hover:opacity-80 transition"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
        <button
          className="bg-status-green text-text-on-brand rounded-full p-3 shadow-lg hover:opacity-80 transition"
          aria-label="Satisfaction review" // Anda mungkin ingin menambahkan onClick handler untuk tombol ini
        >
          <Star size={24} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;