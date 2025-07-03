// components/ui/Navbar.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Pencil, ShieldCheck } from "lucide-react"; // Menambahkan ShieldCheck untuk ikon admin
import ThemeSwitcher from "./ThemeSwitcher";
import ProfileButton from "./ProfileButton";
import { AnimatePresence, motion } from "framer-motion";

// Tipe untuk item menu
interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
  adminOnly?: boolean; // Properti untuk menandai menu khusus admin
}

export default function Navbar() {
  const router = useRouter();
  const [activePath, setActivePath] = useState(router.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  // State untuk menyimpan peran pengguna
  const { userRole } = useAuth();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setActivePath(url);
      setMenuOpen(false); // Tutup menu mobile saat pindah halaman
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const handleWriteClick = () => {
    router.push("/varia-statistik/tambahberita");
    setMenuOpen(false);
  };

  // --- PERUBAHAN UTAMA DI SINI ---

  // 1. Definisikan semua kemungkinan menu di sini
  const menuItems: MenuItem[] = [
    { label: "Home", href: "/user" },
    { label: "Organisasi", href: "/organisasi" },
    { label: "Ruang Baca", href: "/ruangbaca" },
    { label: "Varia Statistik", href: "/varia-statistik" },
    { label: "Email", href: "https://mail.bps.go.id/mail#1", external: true },
    // Menu tambahan untuk admin ditambahkan di sini
    { label: "Admin", href: "/admin", adminOnly: true },
  ];

  // 2. Filter menu yang akan ditampilkan berdasarkan peran pengguna
  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && userRole === "admin")
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface-header text-text-on-header shadow-md z-50 h-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between">
        <Link href="/user" legacyBehavior>
          <a className="flex items-center gap-2 flex-shrink-0">
            {/* Bagian logo tidak diubah */}
            <Image
              src="/bps.png"
              alt="Logo BPS"
              width={40}
              height={40}
              priority
            />
          </a>
        </Link>

        {/* Menu item desktop sekarang me-render dari visibleMenuItems */}
        <ul className="hidden lg:flex space-x-6 lg:space-x-8 tracking-wide">
          {visibleMenuItems.map((item) => {
            const isActive =
              !item.external &&
              (activePath === item.href ||
                (item.href !== "/" && activePath.startsWith(item.href + "/")));
            return (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-normal text-text-on-header hover:text-opacity-75 transition-opacity duration-200 text-sm lg:text-base
                       // PERUBAHAN OPSIONAL: Tambahkan ini
                       hover:text-nav-active-indicator" // Tambahkan ini
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} legacyBehavior>
                    <a
                      className={
                        `cursor-pointer transition-opacity duration-200 text-sm lg:text-base ${
                          isActive
                            ? "font-semibold text-nav-active-indicator"
                            : "font-normal text-text-on-header hover:text-opacity-75"
                        }
                // PERUBAHAN OPSIONAL: Tambahkan ini
                ${!isActive && "hover:text-nav-active-indicator"}` // Tambahkan ini, hanya berlaku jika tidak aktif
                      }
                    >
                      {item.adminOnly && (
                        <ShieldCheck className="inline-block w-4 h-4 mr-1.5 text-status-blue" />
                      )}
                      {item.label}
                    </a>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Bagian kanan Navbar (Aksi, Tema, Profil) tidak diubah */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <button
            onClick={handleWriteClick}
            type="button"
            title="Tulis Berita Anda"
            className="group relative flex items-center bg-transparent text-text-on-header p-2 rounded-lg transition-colors duration-300 hover:bg-white/10 dark:hover:bg-black/10"
          >
            <Pencil className="w-5 h-5 transition-colors duration-300 group-hover:text-nav-active-indicator" />
            <span className="ml-2 text-sm font-semibold opacity-0 max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:opacity-100 group-hover:max-w-xs group-hover:text-nav-active-indicator">
              Tulis Berita
            </span>
          </button>
          <ThemeSwitcher />
          <ProfileButton />
          {/* Tombol Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex lg:hidden flex-col justify-center items-center w-6 h-6 focus:outline-none space-y-1 p-1 rounded-md hover:bg-white/10 dark:hover:bg-black/10"
          >
            <span
              className={`block w-5 h-0.5 bg-text-on-header rounded transition-transform duration-200 ease-in-out ${
                menuOpen ? "transform rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-text-on-header rounded transition-opacity duration-200 ease-in-out ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-text-on-header rounded transition-transform duration-200 ease-in-out ${
                menuOpen ? "transform -rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-16 left-0 w-full bg-surface-header p-4 border-t border-ui-border shadow-lg"
          >
            <ul className="space-y-2">
              {visibleMenuItems.map(
                (
                  item // Menggunakan visibleMenuItems
                ) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-normal text-text-on-header hover:bg-black/10 transition-colors duration-200 block text-base py-2 px-2 rounded-md"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} legacyBehavior>
                        <a
                          onClick={() => setMenuOpen(false)}
                          className="font-normal text-text-on-header hover:bg-black/10 transition-colors duration-200 block text-base py-2 px-2 rounded-md"
                        >
                          {item.adminOnly && (
                            <ShieldCheck className="inline-block w-4 h-4 mr-1.5 text-status-blue" />
                          )}
                          {item.label}
                        </a>
                      </Link>
                    )}
                  </li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
