// components/ui/AccessibilityMenu.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings,
  X,
  ZoomIn,
  ZoomOut,
  Contrast,
  Moon,
  Palette,
  ShieldOff,
  RotateCcw,
} from "lucide-react";

// Dimensi tombol FAB (perkiraan, bisa disesuaikan atau diukur)
const FAB_SIZE = 52; // perkiraan dari p-3 (48px) + border/shadow
const MENU_PANEL_OFFSET_Y = 10; // Jarak antara FAB dan menu panel jika menu di atas FAB
const MENU_PANEL_WIDTH = 320; // sm:w-80 (320px)
const MENU_PANEL_MAX_HEIGHT_CSS = "calc(100vh - 12rem)"; // dari className panel

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const defaultSettings = {
    fontSizeMultiplier: 1,
    contrastMode: "default" as "default" | "high-contrast" | "grayscale",
    animationsDisabled: false,
  };

  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(
    defaultSettings.fontSizeMultiplier
  );
  const [contrastMode, setContrastMode] = useState(
    defaultSettings.contrastMode
  );
  const [animationsDisabled, setAnimationsDisabled] = useState(
    defaultSettings.animationsDisabled
  );

  // --- State dan Ref untuk Draggable FAB ---
  interface Position {
    x: number;
    y: number;
  }
  const [fabPosition, setFabPosition] = useState<Position | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const fabInitialPosRef = useRef<{ x: number; y: number } | null>(null);
  // --- Akhir State dan Ref untuk Draggable FAB ---

  const applyFontSize = useCallback((multiplier: number) => {
    // Terapkan multiplier ke root element (misal: html)
    if (typeof window !== "undefined" && document.documentElement) {
      document.documentElement.style.fontSize = `${multiplier * 100}%`;
      localStorage.setItem(
        "accessibility-fontSizeMultiplier",
        multiplier.toString()
      );
    }
  }, []);
  const applyContrastMode = useCallback(
    (mode: "default" | "high-contrast" | "grayscale") => {
      // Terapkan mode kontras ke root element (misal: html atau body)
      if (typeof window !== "undefined" && document.documentElement) {
        document.documentElement.dataset.contrastMode = mode;
        localStorage.setItem("accessibility-contrastMode", mode);
      }
    },
    []
  );
  const applyAnimationSetting = useCallback((disabled: boolean) => {
    if (typeof window !== "undefined" && document.documentElement) {
      if (disabled) {
        document.documentElement.style.setProperty(
          "transition",
          "none",
          "important"
        );
        document.documentElement.classList.add("animations-disabled");
        localStorage.setItem("accessibility-animationsDisabled", "true");
      } else {
        document.documentElement.style.removeProperty("transition");
        document.documentElement.classList.remove("animations-disabled");
        localStorage.setItem("accessibility-animationsDisabled", "false");
      }
    }
  }, []);

  // Efek untuk memuat pengaturan dan posisi FAB dari localStorage
  useEffect(() => {
    setMounted(true);
    const savedFontSize = parseFloat(
      localStorage.getItem("accessibility-fontSizeMultiplier") ||
        defaultSettings.fontSizeMultiplier.toString()
    );
    setFontSizeMultiplier(savedFontSize);
    const savedContrast =
      (localStorage.getItem(
        "accessibility-contrastMode"
      ) as typeof contrastMode) || defaultSettings.contrastMode;
    setContrastMode(savedContrast);
    const savedAnimations =
      localStorage.getItem("accessibility-animationsDisabled") === "true" ||
      defaultSettings.animationsDisabled;
    setAnimationsDisabled(savedAnimations);

    // Muat posisi FAB
    const savedFabPos = localStorage.getItem("accessibility-fabPosition");
    if (savedFabPos) {
      setFabPosition(JSON.parse(savedFabPos));
    } else if (fabRef.current) {
      // Jika tidak ada, set ke posisi default (bottom-4 right-4)
      // Ini akan dijalankan setelah mounted dan fabRef tersedia
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const fabCurrentSize = fabRef.current.offsetWidth || FAB_SIZE; // Gunakan ukuran aktual jika bisa
      setFabPosition({
        x: viewportWidth - fabCurrentSize - 16, // right-4 (1rem = 16px)
        y: viewportHeight - fabCurrentSize - 16, // bottom-4
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // defaultSettings dihilangkan

  // Efek untuk menerapkan pengaturan aksesibilitas
  useEffect(() => {
    if (mounted) {
      applyFontSize(fontSizeMultiplier);
      applyContrastMode(contrastMode);
      applyAnimationSetting(animationsDisabled);
    }
  }, [
    fontSizeMultiplier,
    contrastMode,
    animationsDisabled,
    mounted,
    applyFontSize,
    applyContrastMode,
    applyAnimationSetting,
  ]);

  const handleFontSizeChange = (increment: boolean) => {
    setFontSizeMultiplier((prev) => {
      let newMultiplier = increment ? prev + 0.1 : prev - 0.1;
      newMultiplier = Math.max(0.7, Math.min(newMultiplier, 2)); // batas minimum dan maksimum
      localStorage.setItem(
        "accessibility-fontSizeMultiplier",
        newMultiplier.toString()
      );
      return newMultiplier;
    });
  };
  const handleContrastChange = (
    mode: "default" | "high-contrast" | "grayscale"
  ) => {
    setContrastMode(mode);
    localStorage.setItem("accessibility-contrastMode", mode);
    applyContrastMode(mode);
  };
  const handleAnimationToggle = () => {
    /* ... (fungsi tetap sama) ... */
  };

  const handleResetSettings = () => {
    // ... (fungsi reset tetap sama) ...
    // Reset juga posisi FAB ke default jika diinginkan, atau biarkan
    if (fabRef.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const fabCurrentSize = fabRef.current.offsetWidth || FAB_SIZE;
      const defaultPos = {
        x: viewportWidth - fabCurrentSize - 16,
        y: viewportHeight - fabCurrentSize - 16,
      };
      setFabPosition(defaultPos);
      localStorage.setItem(
        "accessibility-fabPosition",
        JSON.stringify(defaultPos)
      );
    }
    setIsOpen(false);
  };

  // --- Logika Drag untuk FAB ---
  const handleFabClick = () => {
    if (!isDraggingRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  const onFabDragStart = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    isDraggingRef.current = false; // Reset, akan jadi true jika ada pergerakan signifikan

    const event = "touches" in e ? e.touches[0] : e;
    dragStartPosRef.current = { x: event.clientX, y: event.clientY };

    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect();
      fabInitialPosRef.current = { x: rect.left, y: rect.top };
    } else if (fabPosition) {
      // Fallback jika ref belum siap tapi posisi sudah ada
      fabInitialPosRef.current = { x: fabPosition.x, y: fabPosition.y };
    } else {
      // Tidak bisa memulai drag jika posisi awal tidak diketahui
      return;
    }

    document.addEventListener("mousemove", onFabDragMove);
    document.addEventListener("touchmove", onFabDragMove, { passive: false });
    document.addEventListener("mouseup", onFabDragEnd);
    document.addEventListener("touchend", onFabDragEnd);
  };

  const onFabDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragStartPosRef.current || !fabInitialPosRef.current) return;

      // Untuk touchmove, kita ingin mencegah default scroll behavior
      if (e.cancelable && e.type === "touchmove") e.preventDefault();

      const event = "touches" in e ? e.touches[0] : e;
      const dx = event.clientX - dragStartPosRef.current.x;
      const dy = event.clientY - dragStartPosRef.current.y;

      if (!isDraggingRef.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        isDraggingRef.current = true;
        if (isOpen) setIsOpen(false); // Tutup menu saat mulai drag
      }

      if (isDraggingRef.current) {
        let newX = fabInitialPosRef.current.x + dx;
        let newY = fabInitialPosRef.current.y + dy;

        // Batasan area drag
        const fabCurrentSize = fabRef.current?.offsetWidth || FAB_SIZE;
        newX = Math.max(
          16,
          Math.min(newX, window.innerWidth - fabCurrentSize - 16)
        ); // min left-4, max right-4
        newY = Math.max(
          16,
          Math.min(newY, window.innerHeight - fabCurrentSize - 16)
        ); // min top-4, max bottom-4

        setFabPosition({ x: newX, y: newY });
      }
    },
    [isOpen]
  ); // isOpen dependency untuk menutup menu saat drag

  const onFabDragEnd = () => {
    if (isDraggingRef.current && fabPosition) {
      localStorage.setItem(
        "accessibility-fabPosition",
        JSON.stringify(fabPosition)
      );
    }
    // Reset ref untuk klik selanjutnya
    // isDraggingRef.current sudah direset di awal onFabDragStart atau akan diabaikan oleh handleFabClick
    // penting untuk reset isDraggingRef.current di sini agar klik selanjutnya berfungsi
    // Namun, jika onFabDragEnd dipanggil setelah handleFabClick, ini bisa salah.
    // Cara yang lebih aman: setTimeout untuk reset isDraggingRef setelah event loop selesai
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);

    document.removeEventListener("mousemove", onFabDragMove);
    document.removeEventListener("touchmove", onFabDragMove);
    document.removeEventListener("mouseup", onFabDragEnd);
    document.removeEventListener("touchend", onFabDragEnd);
  };
  // --- Akhir Logika Drag untuk FAB ---

  // Hitung posisi menu panel agar tidak keluar layar
  const getMenuPanelStyle = (): React.CSSProperties => {
    if (!fabPosition || !fabRef.current) {
      // Posisi default jika fabPosition belum ada (sebelum drag pertama)
      return { position: "fixed", bottom: "5rem", right: "1rem" }; // bottom-20 right-4
    }

    const fabRect = fabRef.current.getBoundingClientRect();
    const panelWidth = MENU_PANEL_WIDTH; // Lebar panel (sekitar w-72 atau w-80)
    // Estimasi tinggi panel; bisa lebih akurat jika panel diref dan diukur.
    // Untuk sekarang, kita asumsikan bisa cukup tinggi.

    let top = fabRect.top - MENU_PANEL_OFFSET_Y; // Coba posisikan di atas FAB
    let left = fabRect.left + fabRect.width / 2 - panelWidth / 2; // Coba tengahkan horizontal dengan FAB

    // Cek apakah panel akan keluar atas viewport
    // Jika ya, posisikan di bawah FAB
    // Perlu tinggi panel aktual untuk ini. Mari asumsikan max height untuk sementara.
    // Ini butuh perhitungan yang lebih kompleks untuk 'snap' ke sisi yang benar.
    // Untuk sekarang, kita buat simpel: selalu di atas, atau di bawah jika tidak cukup ruang di atas.

    const estimatedPanelHeight = Math.min(350, window.innerHeight * 0.6); // Estimasi kasar
    if (
      top - estimatedPanelHeight < 0 &&
      fabRect.bottom + estimatedPanelHeight < window.innerHeight
    ) {
      // Jika tidak cukup ruang di atas, coba di bawah
      top = fabRect.bottom + MENU_PANEL_OFFSET_Y;
    } else {
      // Defaultnya di atas, geser ke bawah jika mentok atas
      top = fabRect.top - estimatedPanelHeight - MENU_PANEL_OFFSET_Y;
      if (top < 16) top = 16; // Jaga jarak dari atas viewport
    }

    // Jaga agar panel tidak keluar kiri/kanan viewport
    left = Math.max(16, Math.min(left, window.innerWidth - panelWidth - 16));

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${panelWidth}px`,
      maxHeight: MENU_PANEL_MAX_HEIGHT_CSS,
    };
  };

  if (!mounted) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-surface-card text-text-secondary p-3 rounded-full shadow-lg z-[9999] opacity-50 cursor-not-allowed"
        aria-label="Memuat Menu Aksesibilitas"
        disabled
      >
        <Settings size={24} />
      </button>
    );
  }

  const fabBaseClasses =
    "p-3 rounded-full shadow-lg z-[9999] hover:bg-brand-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ui-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page";
  const fabCurrentClasses = fabPosition
    ? `${fabBaseClasses} bg-brand-primary text-text-on-brand` // Kelas saat posisi diatur state
    : `${fabBaseClasses} fixed bottom-4 right-4 bg-brand-primary text-text-on-brand`; // Kelas awal

  return (
    <>
      <button
        ref={fabRef}
        onClick={handleFabClick}
        onMouseDown={onFabDragStart}
        onTouchStart={onFabDragStart}
        style={
          fabPosition
            ? { position: "fixed", left: fabPosition.x, top: fabPosition.y }
            : undefined
        }
        className={fabCurrentClasses} // Gunakan kelas Tailwind untuk styling awal, lalu style inline untuk posisi
        aria-label={
          isOpen ? "Tutup Menu Aksesibilitas" : "Buka Menu Aksesibilitas"
        }
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        {isOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {/* Panel Menu akan coba diposisikan relatif terhadap FAB.
        Ini adalah bagian yang kompleks karena harus mempertimbangkan batas layar.
      */}
      {isOpen && (
        <div
          id="accessibility-panel"
          style={getMenuPanelStyle()} // Menggunakan style dinamis
          // Hapus kelas fixed positioning dari className jika semua dihandle style
          className="bg-surface-card shadow-2xl rounded-lg p-4 z-[9998] border border-ui-border text-text-primary overflow-y-auto"
          // overflow-y-auto diatur oleh max-height pada style
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-menu-title"
        >
          {/* ... Konten menu tetap sama ... */}
          <div className="flex justify-between items-center mb-3">
            <h3
              id="accessibility-menu-title"
              className="text-lg font-semibold text-text-primary"
            >
              Menu Aksesibilitas
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Tutup Menu Aksesibilitas"
              className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-ui-border focus-visible:ring-1 focus-visible:ring-brand-primary"
            >
              <X size={20} />
            </button>
          </div>
          <hr className="border-ui-border my-3" />
          <div className="space-y-4 no-scrollbar">
            {" "}
            {/* Hapus pr-1 & overflow-y-auto jika sudah di parent panel */}
            {/* Opsi Ukuran Teks */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-text-secondary">
                Ukuran Teks
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFontSizeChange(false)}
                  aria-label="Perkecil Ukuran Teks"
                  className="p-2 bg-surface-page hover:bg-ui-border rounded-md text-text-primary focus-visible:ring-1 focus-visible:ring-brand-primary"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm text-text-primary w-10 text-center tabular-nums">
                  {Math.round(fontSizeMultiplier * 100)}%
                </span>
                <button
                  onClick={() => handleFontSizeChange(true)}
                  aria-label="Perbesar Ukuran Teks"
                  className="p-2 bg-surface-page hover:bg-ui-border rounded-md text-text-primary focus-visible:ring-1 focus-visible:ring-brand-primary"
                >
                  <ZoomIn size={18} />
                </button>
              </div>
            </div>
            <hr className="border-ui-border" />
            {/* Opsi Kontras */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-text-secondary">
                Mode Tampilan
              </p>
              <div className="flex flex-col space-y-1">
                {[
                  {
                    value: "default",
                    label: "Normal",
                    icon: <Palette size={16} />,
                  },
                  {
                    value: "high-contrast",
                    label: "Kontras Tinggi",
                    icon: <Contrast size={16} />,
                  },
                  {
                    value: "grayscale",
                    label: "Skala Abu-abu",
                    icon: <Moon size={16} />,
                  },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() =>
                      handleContrastChange(
                        mode.value as "default" | "high-contrast" | "grayscale"
                      )
                    }
                    className={`flex items-center gap-2 p-2 w-full text-left text-sm rounded-md transition-colors ${
                      contrastMode === mode.value
                        ? "bg-brand-primary text-text-on-brand font-semibold"
                        : "bg-surface-page text-text-primary hover:bg-ui-border"
                    }`}
                  >
                    {mode.icon} {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <hr className="border-ui-border" />
            {/* Opsi Animasi */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-text-secondary">
                Preferensi Gerakan
              </p>
              <label className="flex items-center justify-between space-x-3 cursor-pointer p-2 bg-surface-page rounded-md hover:bg-ui-border">
                <span className="text-sm text-text-primary">
                  Nonaktifkan Animasi
                </span>
                <div className="flex items-center gap-2">
                  <ShieldOff size={18} className="text-text-secondary" />
                  <input
                    type="checkbox"
                    checked={animationsDisabled}
                    onChange={handleAnimationToggle}
                    className="form-checkbox h-5 w-5 text-brand-primary rounded border-ui-border-input bg-surface-card focus:ring-offset-surface-card focus:ring-brand-primary"
                    aria-labelledby="animation-toggle-label"
                  />
                </div>
              </label>
              <span id="animation-toggle-label" className="sr-only">
                Aktifkan atau nonaktifkan animasi
              </span>
            </div>
            <hr className="border-ui-border my-4" />
            {/* Tombol Reset Pengaturan */}
            <div>
              <button
                onClick={handleResetSettings}
                className="flex items-center justify-center gap-2 p-2 w-full text-sm rounded-md transition-colors bg-ui-border text-text-secondary hover:bg-brand-accent hover:text-text-on-accent focus-visible:ring-1 focus-visible:ring-brand-primary"
                aria-label="Kembalikan ke Pengaturan Awal"
              >
                <RotateCcw size={16} /> Kembalikan ke Awal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;
