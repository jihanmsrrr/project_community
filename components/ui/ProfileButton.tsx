// components/ui/ProfileButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ChevronDown } from "lucide-react";

const ProfileButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    setIsMenuOpen(false);
  };

  const handleMyProfile = () => {
    router.push("/profil");
    setIsMenuOpen(false);
  };

  if (status === "loading") {
    return (
      <div className="w-full h-[40px] bg-white/10 rounded-lg animate-pulse" />
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="relative w-full text-left">
      {/* DIUBAH: Tombol utama dibuat transparan */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="group flex items-center justify-between w-full gap-2 p-2 rounded-lg bg-transparent text-text-on-header hover:bg-white/10 transition-colors duration-300"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <div className="flex items-center gap-2">
          <User
            size={20}
            className="group-hover:text-nav-active-indicator transition-colors duration-200"
          />
          <span className="group-hover:text-nav-active-indicator transition-colors duration-200 text-sm font-semibold">
            Profil
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isMenuOpen ? "rotate-180" : ""
          } group-hover:text-nav-active-indicator`}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-surface-card rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50">
          <div className="px-4 py-3 border-b border-ui-border/50 mb-1">
            <p className="text-sm font-semibold text-text-primary truncate">
              {session.user?.name || "Nama Pengguna"}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {session.user?.email || "email@example.com"}
            </p>
            {session.user?.role && (
              <p className="text-xs text-brand-primary mt-1 capitalize font-semibold">
                {session.user.role}
              </p>
            )}
          </div>
          <button
            className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors duration-150"
            onClick={handleMyProfile}
          >
            <User size={16} />
            Profil Saya
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left text-feedback-error-text hover:bg-feedback-error-bg transition-colors duration-150"
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
