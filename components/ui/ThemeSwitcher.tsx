// components/ui/ThemeSwitcher.tsx
"use client";

import { JSX, useEffect, useState } from "react";
import { Sun, Moon, Monitor, ChevronDown, Heart } from "lucide-react";

type Theme = "light" | "dark" | "system" | "pink";

const themeClasses: Partial<Record<Theme, string>> = {
  dark: "dark",
  pink: "theme-pink",
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    const validThemes: Theme[] = ["light", "dark", "system", "pink"];
    if (validThemes.includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      setTheme("system");
      localStorage.setItem("theme", "system");
    }
  }, []);

  useEffect(() => {
    if (!mounted || !theme) return;

    const applyTheme = (selectedTheme: Theme) => {
      document.documentElement.classList.remove("dark", "theme-pink");
      let themeToApply: Theme = selectedTheme;
      if (selectedTheme === "system") {
        themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      const newClass = themeClasses[themeToApply];
      if (newClass) {
        document.documentElement.classList.add(newClass);
      }
    };

    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const selectTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
    setDropdownOpen(false);
  };

  const themeOptions: { value: Theme; label: string; icon: JSX.Element }[] = [
    { value: "light", label: "Light", icon: <Sun size={16} /> },
    { value: "dark", label: "Dark", icon: <Moon size={16} /> },
    { value: "pink", label: "Pink", icon: <Heart size={16} /> },
    { value: "system", label: "System", icon: <Monitor size={16} /> },
  ];

  const getCurrentThemeIcon = () => {
    const iconSize = 20;
    if (!theme) return <Monitor size={iconSize} />;
    switch (theme) {
      case "light":
        return <Sun size={iconSize} />;
      case "dark":
        return <Moon size={iconSize} />;
      case "pink":
        return <Heart size={iconSize} />;
      default:
        return <Monitor size={iconSize} />;
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[40px] bg-white/10 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="relative w-full text-left">
      {/* Tombol utama dibuat transparan */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Pilih Tema"
        className="group flex items-center justify-between w-full gap-2 p-2 rounded-lg bg-transparent text-text-on-header hover:bg-white/10 transition-colors duration-300"
      >
        <div className="flex items-center gap-2">
          <span className="group-hover:text-nav-active-indicator transition-colors duration-200">
            {getCurrentThemeIcon()}
          </span>
          {/* DIUBAH: Menampilkan nama tema yang aktif, bukan teks statis */}
          <span className="group-hover:text-nav-active-indicator transition-colors duration-200 text-sm font-semibold capitalize">
            {theme}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          } group-hover:text-nav-active-indicator`}
        />
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right bg-surface-card rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50">
          {themeOptions.map((option) => {
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => selectTheme(option.value)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors duration-150 ${
                  isActive
                    ? "font-semibold bg-brand-primary/10 text-brand-primary"
                    : "font-normal text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                {option.icon} {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
