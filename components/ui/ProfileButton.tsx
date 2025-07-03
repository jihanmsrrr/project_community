// components/ui/ProfileButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";

const ProfileButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log("Logging out and ending session...");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsMenuOpen(false);
    router.push("/login");
  };

  const handleMyProfile = () => {
    console.log("Navigating to My Profile");
    setIsMenuOpen(false);
    router.push("/profil");
  };

  return (
    <div className="relative inline-block text-left">
      {/* Tombol Profile Utama */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 bg-surface-card text-text-primary font-semibold rounded-lg px-3 py-2 shadow-md hover:bg-surface-header 
                   transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary 
                   focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page
                   // PERUBAHAN: Tambahkan kelas ini untuk hover khusus di mode light
                   group" // Tambahkan group agar bisa menggunakan group-hover pada teks dan ikon
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <User
          size={20}
          className="group-hover:text-nav-active-indicator transition-colors duration-200"
        />{" "}
        {/* PERUBAHAN */}
        <span className="group-hover:text-nav-active-indicator transition-colors duration-200">
          Profil
        </span>{" "}
        {/* PERUBAHAN */}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isMenuOpen ? "rotate-180" : ""
          } group-hover:text-nav-active-indicator`} // PERUBAHAN
        />
      </button>

      {/* Menu Dropdown (Tidak perlu diubah, karena hover di dalam dropdown sudah bagus) */}
      {isMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none py-1 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
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
