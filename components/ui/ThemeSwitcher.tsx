// components/ui/ThemeSwitcher.tsx
"use client";

import { JSX, useEffect, useState } from "react";
import { Sun, Moon, Monitor, ChevronDown, Palette, Heart } from "lucide-react";

type Theme = "light" | "dark" | "system" | "pink";

const themeClasses: Partial<Record<Theme, string>> = {
  dark: "dark",
  pink: "theme-pink",
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const applyTheme = (selectedTheme: Theme) => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.remove(
      "dark",
      "theme-soft",
      "theme-pink"
    );
    let themeToApply: Theme = selectedTheme;
    if (selectedTheme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    const newClass = themeClasses[themeToApply as keyof typeof themeClasses];
    if (newClass) {
      document.documentElement.classList.add(newClass);
    }
  };

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
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (localStorage.getItem("theme") === "system") {
        setTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (mounted && theme) {
      applyTheme(theme);
    }
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
    const buttonIconSize = 20;
    if (!mounted || !theme) {
      return <Monitor size={buttonIconSize} />;
    }
    if (theme === "system") {
      return <Monitor size={buttonIconSize} />;
    }
    switch (theme) {
      case "light":
        return <Sun size={buttonIconSize} />;
      case "dark":
        return <Moon size={buttonIconSize} />;
      case "pink":
        return <Heart size={buttonIconSize} />;
      default:
        return <Palette size={buttonIconSize} />;
    }
  };

  if (!mounted) {
    return (
      <div className="relative inline-block text-left">
        <button
          aria-label="Pilih Tema"
          disabled
          className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 text-gray-500 opacity-50 cursor-not-allowed"
        >
          <Monitor size={20} /> <ChevronDown size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Pilih Tema"
        className="flex items-center gap-2 p-2 rounded-lg bg-surface-card text-text-primary shadow-md hover:bg-surface-header 
                   transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary 
                   focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page
                   // PERUBAHAN: Tambahkan kelas ini untuk hover khusus di mode light
                   group" // Tambahkan group agar bisa menggunakan group-hover pada ikon
      >
        {/* PERUBAHAN: Tambahkan group-hover pada ikon */}
        <span className="group-hover:text-nav-active-indicator transition-colors duration-200">
          {getCurrentThemeIcon()}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          } group-hover:text-nav-active-indicator`}
        />
      </button>
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none py-1 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {themeOptions.map((option) => {
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => selectTheme(option.value)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors duration-150
                             ${
                               isActive
                                 ? "font-semibold bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                                 : "font-normal text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                             }`}
                role="menuitem"
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
