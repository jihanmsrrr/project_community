// components/ui/Navbar.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Pencil, ShieldCheck } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import ProfileButton from "./ProfileButton";
import { AnimatePresence, motion } from "framer-motion";

interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
  adminOnly?: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [activePath, setActivePath] = useState(router.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userRole } = useAuth();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setActivePath(url);
      setMenuOpen(false);
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

  const menuItems: MenuItem[] = [
    { label: "Home", href: "/user" },
    { label: "Organisasi", href: "/organisasi" },
    { label: "Ruang Baca", href: "/ruangbaca" },
    { label: "Varia Statistik", href: "/varia-statistik" },
    { label: "Email", href: "https://mail.bps.go.id/mail#1", external: true },
    { label: "Admin", href: "/admin", adminOnly: true },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && userRole === "admin")
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface-header text-text-on-header shadow-md z-50 h-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between">
        <Link href="/user" legacyBehavior>
          <a className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/bps.png"
              alt="Logo BPS"
              width={40}
              height={40}
              priority
            />
          </a>
        </Link>

        {/* Menu Desktop */}
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
                    className="font-normal text-text-on-header hover:text-nav-active-indicator transition-colors duration-200 text-sm lg:text-base"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} legacyBehavior>
                    <a
                      className={`cursor-pointer transition-colors duration-200 text-sm lg:text-base ${
                        isActive
                          ? "font-semibold text-nav-active-indicator"
                          : "font-normal text-text-on-header hover:text-nav-active-indicator"
                      }`}
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

        {/* Aksi di Kanan */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <button
            onClick={handleWriteClick}
            type="button"
            title="Tulis Berita Anda"
            className="group relative flex items-center bg-transparent text-text-on-header p-2 rounded-lg transition-colors duration-300 hover:bg-white/10"
          >
            <Pencil className="w-5 h-5 transition-colors duration-300 group-hover:text-nav-active-indicator" />
            <span className="ml-2 text-sm font-semibold opacity-0 max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:opacity-100 group-hover:max-w-xs group-hover:text-nav-active-indicator">
              Tulis Berita
            </span>
          </button>

          {/* DIUBAH: Tombol Tema & Profil hanya muncul di layar besar */}
          <div className="hidden lg:flex items-center space-x-2">
            <ThemeSwitcher />
            <ProfileButton />
          </div>

          {/* Tombol Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex lg:hidden flex-col justify-center items-center w-6 h-6 focus:outline-none space-y-1 p-1 rounded-md hover:bg-white/10"
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

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-16 left-0 w-full bg-surface-header p-4 border-t border-white/10 shadow-lg"
          >
            <ul className="space-y-2">
              {visibleMenuItems.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-normal text-text-on-header hover:bg-white/10 transition-colors duration-200 block text-base py-2 px-2 rounded-md"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} legacyBehavior>
                      <a
                        onClick={() => setMenuOpen(false)}
                        className="font-normal text-text-on-header hover:bg-white/10 transition-colors duration-200 block text-base py-2 px-2 rounded-md"
                      >
                        {item.adminOnly && (
                          <ShieldCheck className="inline-block w-4 h-4 mr-1.5 text-status-blue" />
                        )}
                        {item.label}
                      </a>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            {/* DITAMBAHKAN: Tombol Tema & Profil di dalam menu mobile */}
            <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
              <div className="w-full">
                <ProfileButton />
              </div>
              <div className="w-full">
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
