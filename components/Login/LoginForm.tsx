// components/Login/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router"; // ✅ PERBAIKAN: Gunakan useRouter dari 'next/router'

import { Eye, EyeOff, LoaderCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Komponen Ikon (Bisa dipisah ke file sendiri) ---
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Eye className={`w-5 h-5 ${className || ""}`} />
);
const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <EyeOff className={`w-5 h-5 ${className || ""}`} />
);

// --- Komponen Alert untuk Error ---
interface AlertProps {
  message: string;
}
const ErrorAlert: React.FC<AlertProps> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="mb-5 p-3 flex items-center gap-3 bg-status-red/10 border border-status-red/30 text-status-red-dark rounded-lg text-sm"
    role="alert"
  >
    <AlertCircle className="h-5 w-5 flex-shrink-0" />
    <span className="flex-grow">{message}</span>
  </motion.div>
);

// === KOMPONEN UTAMA LOGIN FORM ===
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // ✅ Gunakan useRouter dari 'next/router'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Penting: Tetap false agar kita bisa handle error di sini
        username: username,
        password: password,
      });

      if (result?.error) {
        // NextAuth akan mengembalikan error jika authorize throw error
        setError(result.error); // Tampilkan pesan error dari NextAuth
        setIsLoading(false);
      } else if (result?.ok) {
        // Jika berhasil, arahkan ke halaman utama.
        // AuthWrapper di _app.tsx akan menangani redirect sesuai peran.
        router.push("/"); // ✅ Gunakan router.push dari next/router
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary hover:shadow-2xl transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full p-8 sm:p-10 bg-surface-card bg-opacity-95 backdrop-blur-sm rounded-[calc(0.75rem-2px)] sm:rounded-[calc(1rem-2px)] shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Selamat Datang Kembali
          </h1>
          <p className="text-text-secondary mt-2">
            Silakan masuk untuk melanjutkan.
          </p>
        </div>
        <AnimatePresence>
          {error && <ErrorAlert message={error} />}
        </AnimatePresence>
        <div className="relative mb-6">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block px-3.5 pb-2.5 pt-5 w-full text-base text-text-primary bg-transparent rounded-lg border border-ui-border-input appearance-none focus:outline-none focus:ring-0 focus:border-brand-primary peer"
            placeholder=" "
            required
            autoComplete="username"
            disabled={isLoading}
          />
          <label
            htmlFor="username"
            className="absolute text-base text-text-placeholder duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] start-3.5 peer-focus:text-brand-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5"
          >
            Username
          </label>
        </div>
        <div className="relative mb-8">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block px-3.5 pr-12 pb-2.5 pt-5 w-full text-base text-text-primary bg-transparent rounded-lg border border-ui-border-input appearance-none focus:outline-none focus:ring-0 focus:border-brand-primary peer"
            placeholder=" "
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
          <label
            htmlFor="password"
            className="absolute text-base text-text-placeholder duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] start-3.5 peer-focus:text-brand-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5"
          >
            Password
          </label>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-placeholder hover:text-brand-primary focus:outline-none"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-text-on-brand font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ui-focus-ring focus:ring-offset-2 focus:ring-offset-surface-card disabled:opacity-70 disabled:cursor-wait"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
              <span>Memproses...</span>
            </>
          ) : (
            "Masuk"
          )}
        </button>
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-ui-border"></div>
          <span className="flex-shrink mx-4 text-xs text-text-secondary">
            ATAU
          </span>
          <div className="flex-grow border-t border-ui-border"></div>
        </div>
        <button
          type="button"
          onClick={() => signIn("bps-sso")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-surface-button-secondary hover:bg-surface-button-secondary-hover text-text-on-button-secondary font-semibold py-3 rounded-lg transition-colors shadow-sm border border-ui-border disabled:opacity-70"
        >
          Login dengan SSO BPS
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
