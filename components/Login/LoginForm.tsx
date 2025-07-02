// components/Login/LoginForm.tsx
import React, { useState } from "react";
import { signIn } from "next-auth/react"; // <-- Mengimpor signIn dari next-auth
import { useRouter } from "next/router"; // <-- Import useRouter untuk redirect manual jika diperlukan

// Tidak perlu mendefinisikan Props jika tidak ada props yang diterima
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // <-- Inisialisasi router

  // Definisi komponen Ikon (tetap dipertahankan dari kode lama)
  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = (await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    })) as unknown as { error?: string; url?: string; ok?: boolean };

    if (result?.error) {
      // Periksa apakah result ada dan memiliki properti error
      setError(result.error);
    } else if (result?.ok && !result?.error) {
      const session = (await signIn("credentials", {
        // Lakukan signIn lagi untuk mendapatkan data sesi
        username: username,
        password: password,
        redirect: false,
      })) as unknown as { error?: string; url?: string; ok?: boolean } | null;
      if (session?.url) {
        const role = session.url.includes("/admin") ? "admin" : "user"; // Fallback jika role tidak ada
        router.push(role === "admin" ? "/admin" : "/user");
      } else {
        router.push("/user"); // Redirect ke user jika tidak ada informasi role spesifik
      }
    }
  };
  // Fungsi untuk toggle password visibility (tetap dipertahankan)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // --- UI LENGKAP DARI KODE LAMA DENGAN TAMBAHAN ---
  return (
    <div
      className="w-full max-w-md mx-auto rounded-xl sm:rounded-2xl p-0.5
                 bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary
                 hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 group"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full p-8 sm:p-10 bg-surface-card bg-opacity-95 backdrop-blur-sm
                   rounded-[calc(0.75rem-2px)] sm:rounded-[calc(1rem-2px)]
                   shadow-xl font-sans"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Selamat Datang Kembali
          </h1>
          <p className="text-text-secondary mt-2">
            Silakan masuk untuk melanjutkan.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-feedback-error-bg border border-feedback-error-border text-feedback-error-text rounded-lg text-sm transition-opacity duration-300 ease-in-out opacity-100">
            {error}
          </div>
        )}

        {/* Input Username */}
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
          />
          <label
            htmlFor="username"
            className="absolute text-base text-text-placeholder duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] start-3.5 peer-focus:text-brand-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Username
          </label>
        </div>

        {/* Input Password */}
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
          />
          <label
            htmlFor="password"
            className="absolute text-base text-text-placeholder duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] start-3.5 peer-focus:text-brand-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Password
          </label>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
            <button
              type="button"
              onClick={togglePasswordVisibility}
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
          className="w-full bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-text-on-brand font-semibold py-3.5 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ui-focus-ring focus:ring-offset-2 focus:ring-offset-surface-card transform hover:scale-105 active:scale-95"
        >
          Masuk
        </button>
      </form>

      <button onClick={() => signIn("bps-sso")}>Login dengan SSO BPS</button>
      {/* Bagian untuk Login Evaluasi */}
      <div className="mt-6 px-8 sm:px-10 text-center text-text-secondary">
        <p className="italic mb-2">
          Untuk kebutuhan evaluasi fitur dan keterbatasan waktu integrasi SSO,
          Anda dapat menggunakan akun berikut:
        </p>
        <ul className="list-disc list-inside">
          <li>
            Username: <span className="font-mono">evaluator1</span>, Password:{" "}
            <span className="font-mono">password123</span> (Role: user)
          </li>
          <li>
            Username: <span className="font-mono">admin_test</span>, Password:{" "}
            <span className="font-mono">secure456</span> (Role: admin)
          </li>
          {/* Tambahkan daftar akun evaluasi lainnya di sini */}
        </ul>
        <p className="mt-4">
          <span className="font-semibold">Catatan:</span> Seharusnya Anda login
          menggunakan SSO BPS. Akun-akun di atas hanya untuk keperluan evaluasi
          pengembangan fitur.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
