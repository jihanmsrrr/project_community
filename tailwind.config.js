import plugin from "tailwindcss/plugin";
import lineClamp from "@tailwindcss/line-clamp";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./styles/globals.css",
    "./app/**/*.{ts,tsx,js,jsx,html}",
    "./pages/**/*.{ts,tsx,js,jsx,html}",
    "./components/**/*.{ts,tsx,js,jsx,html}",
    "./src/components/**/*.{ts,tsx,js,jsx,html}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "kategori-1": "rgb(var(--kategori-warna-1))",
        "kategori-2": "rgb(var(--kategori-warna-2))",
        "kategori-3": "rgb(var(--kategori-warna-3))",
        "kategori-4": "rgb(var(--kategori-warna-4))",
        "kategori-5": "rgb(var(--kategori-warna-5))",
        "kategori-6": "rgb(var(--kategori-warna-6))",
        "kategori-7": "rgb(var(--kategori-warna-7))",
        "kategori-8": "rgb(var(--kategori-warna-8))",
        "kategori-9": "rgb(var(--kategori-warna-9))",
        "kategori-10": "rgb(var(--kategori-warna-10))",
        "kategori-11": "rgb(var(--kategori-warna-11))",
        "kategori-12": "rgb(var(--kategori-warna-12))",
        "kategori-default": "rgb(var(--kategori-warna-default))",
      },
      screens: {
        xs: "480px", // Contoh breakpoint xs
        "mobile-L": "425px", // Sesuai kode Anda
      },
      fontFamily: {
        // Konfigurasi font Poppins Anda sudah benar menggunakan variabel CSS
        sans: [
          "var(--font-poppins)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        "surface-card-dark": "#1F2937", // Misal: gray-800
        "surface-raised": "#FFFFFF", // 👈 Warna untuk dropdown (light mode)
        "surface-raised-dark": "#2C3748", // 👈 Warna untuk dropdown (dark mode), misal sedikit lebih terang dari card
        "metric-card-bg-1": "rgb(var(--metric-card-bg-1-rgb) / <alpha-value>)",
        "metric-card-text-1":
          "rgb(var(--metric-card-text-1-rgb) / <alpha-value>)",
        "metric-card-bg-2": "rgb(var(--metric-card-bg-2-rgb) / <alpha-value>)",
        "metric-card-text-2":
          "rgb(var(--metric-card-text-2-rgb) / <alpha-value>)",
        "metric-card-bg-3": "rgb(var(--metric-card-bg-3-rgb) / <alpha-value>)",
        "metric-card-text-3":
          "rgb(var(--metric-card-text-3-rgb) / <alpha-value>)",
        "metric-card-bg-4": "rgb(var(--metric-card-bg-4-rgb) / <alpha-value>)",
        "metric-card-text-4":
          "rgb(var(--metric-card-text-4-rgb) / <alpha-value>)",

        "surface-page": "rgb(var(--surface-page) / <alpha-value>)",
        "surface-card": "rgb(var(--surface-card) / <alpha-value>)",
        "surface-header": "rgb(var(--surface-header) / <alpha-value>)",
        "surface-name-badge": "rgb(var(--surface-name-badge) / <alpha-value>)",
        // Untuk --surface-button-transparent, biasanya lebih baik diterapkan langsung di CSS
        // atau sebagai bagian dari kelas komponen karena melibatkan alpha channel secara spesifik.
        "menu-bg": "rgb(var(--menu-bg) / <alpha-value>)",
        "menu-text": "rgb(var(--menu-text) / <alpha-value>)",
        "menu-bg-hover": "rgb(var(--menu-bg-hover) / <alpha-value>)",
        "menu-text-hover": "rgb(var(--menu-text-hover) / <alpha-value>)",
        "menu-bg-active": "rgb(var(--menu-bg-active) / <alpha-value>)",
        "menu-text-active": "rgb(var(--menu-text-active) / <alpha-value>)",
        // Warna Teks/Foreground
        "text-on-header": "rgb(var(--text-on-header) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-on-brand": "rgb(var(--text-on-brand) / <alpha-value>)",
        "text-on-accent": "rgb(var(--text-on-accent) / <alpha-value>)",
        "text-placeholder": "rgb(var(--text-placeholder) / <alpha-value>)",
        card: "rgb(var(--card-bg) / <alpha-value>)",
        "card-border": "rgb(var(--card-border) / <alpha-value>)",
        "input-bg": "rgb(var(--input-bg) / <alpha-value>)",
        "input-border": "rgb(var(--input-border) / <alpha-value>)",
        "brand-text": "rgb(var(--brand-text) / <alpha-value>)",
        "brand-bg": "rgb(var(--brand-bg) / <alpha-value>)",
        // Warna Interaksi & Merek (Brand)
        "brand-primary": "rgb(var(--brand-primary) / <alpha-value>)",
        "brand-primary-hover":
          "rgb(var(--brand-primary-hover) / <alpha-value>)",
        "brand-primary-active":
          "rgb(var(--brand-primary-active) / <alpha-value>)",

        "brand-secondary": "rgb(var(--brand-secondary) / <alpha-value>)",
        "brand-secondary-hover":
          "rgb(var(--brand-secondary-hover) / <alpha-value>)",

        "brand-accent": "rgb(var(--brand-accent) / <alpha-value>)",
        "brand-accent-hover": "rgb(var(--brand-accent-hover) / <alpha-value>)",

        "button-solid-bg": "rgb(var(--brand-button-solid-bg) / <alpha-value>)",
        "button-solid-text":
          "rgb(var(--brand-button-solid-text) / <alpha-value>)",

        // Warna Navigasi
        "nav-active-indicator":
          "rgb(var(--nav-active-indicator) / <alpha-value>)",

        // Warna Status/Semantik Tambahan
        "status-orange": "rgb(var(--status-orange) / <alpha-value>)",
        "status-green": "rgb(var(--status-green) / <alpha-value>)",
        "status-blue": "rgb(var(--status-blue) / <alpha-value>)",

        // Elemen UI Lainnya
        "ui-border": "rgb(var(--ui-border) / <alpha-value>)",
        "ui-border-input": "rgb(var(--ui-border-input) / <alpha-value>)",
        "ui-focus-ring": "rgb(var(--ui-focus-ring) / <alpha-value>)",
        "feedback-error-bg": "rgb(var(--feedback-error-bg) / <alpha-value>)",
        "feedback-error-border":
          "rgb(var(--feedback-error-border) / <alpha-value>)",
        "feedback-error-text":
          "rgb(var(--feedback-error-text) / <alpha-value>)",

        // Jika Anda masih memiliki warna spesifik yang tidak ter-theme, Anda bisa menambahkannya di sini.
        // Contoh: 'custom-active': '#e6ac78', (seperti yang Anda punya sebelumnya)
        // Namun, idealnya semua warna yang bisa berubah dengan tema masuk ke sistem variabel CSS.
        // Warna seperti 'primary-dark': '#1E40AF' (biru gelap) yang Anda punya sebelumnya
        // sekarang seharusnya dihandle oleh definisi variabel di dalam tema .dark atau tema lainnya.
      },
      keyframes: {
        // Keyframes Anda yang sudah ada
        shimmer: {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" },
        },
        // Tambahan keyframes untuk Aurora
        "aurora-float-1": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(20px, -30px) scale(1.1)" },
        },
        "aurora-float-2": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-30px, 25px) scale(1.05)" },
        },
        "aurora-float-3": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(10px, 15px) scale(1.1)" },
        },
      },
      animation: {
        // Animasi Anda yang sudah ada
        shimmer: "shimmer 1.5s linear infinite",
        // Tambahan animasi untuk Aurora
        "aurora-float-1": "aurora-float-1 18s ease-in-out infinite alternate",
        "aurora-float-2":
          "aurora-float-2 22s ease-in-out infinite alternate-reverse",
        "aurora-float-3": "aurora-float-3 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [
    import("@tailwindcss/typography"), // <-- TAMBAHKAN DI SINI
    lineClamp,
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".text-stroke-sm": {
          "-webkit-text-stroke": "0.1px rgb(var(--text-primary))",
          "text-stroke": "0.1px rgb(var(--text-primary))",
        },
      });
    }),
  ],
};

export default config;
