// components/ui/ProfileButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { LoaderCircle } from "lucide-react"; // Import LoaderCircle untuk loading state

const ProfileButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    console.log("Logging out and ending session...");
    await signOut({ callbackUrl: "/login" });
    setIsMenuOpen(false);
  };

  const handleMyProfile = () => {
    console.log("Navigating to My Profile");
    setIsMenuOpen(false);
    router.push("/profil");
  };

  // Tampilkan loading state atau sembunyikan tombol jika sesi belum siap
  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2 bg-surface-card text-text-primary font-semibold rounded-lg px-3 py-2 shadow-md">
        <LoaderCircle size={20} className="animate-spin" />
        <span>Memuat...</span>
      </div>
    );
  }

  // Jika tidak ada sesi (belum login), mungkin tidak perlu menampilkan tombol profil
  // Atau bisa menampilkan tombol "Login"
  if (!session) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      {/* Tombol Profile Utama */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 bg-surface-card text-text-primary font-semibold rounded-lg px-3 py-2 shadow-md hover:bg-surface-header 
                   transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary 
                   focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page
                   group"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <User
          size={20}
          className="group-hover:text-nav-active-indicator transition-colors duration-200"
        />
        {/* ✅ PERUBAHAN: Teks tombol utama hanya "Profil" */}
        <span className="group-hover:text-nav-active-indicator transition-colors duration-200">
          Profil
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isMenuOpen ? "rotate-180" : ""
          } group-hover:text-nav-active-indicator`}
        />
      </button>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none py-1 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {/* ✅ PERUBAHAN: Detail profil di bagian atas dropdown */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {session?.user?.name || "Nama Pengguna"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {session?.user?.email || "email@example.com"}
            </p>
            {session?.user?.role && (
              <p className="text-xs text-brand-primary mt-1 capitalize">
                {session.user.role}
              </p>
            )}
          </div>

          <button
            className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
            onClick={handleMyProfile}
            role="menuitem"
          >
            <User size={16} />
            Profil Saya
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
            role="menuitem"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
