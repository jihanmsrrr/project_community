// components/ui/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;

  useEffect(() => {
    // Jangan lakukan apa-apa selagi sesi masih loading
    if (isLoading) {
      return;
    }

    // KASUS 1: Pengguna TIDAK LOGIN
    if (!isAuthenticated) {
      // Jika pengguna mencoba mengakses halaman selain login, tendang ke login
      if (router.pathname !== "/login") {
        router.push("/login");
      }
      return;
    }

    // KASUS 2: Pengguna SUDAH LOGIN
    if (isAuthenticated) {
      const targetPath = userRole === "admin" ? "/admin" : "/user";

      // Jika pengguna mencoba mengakses halaman login, tendang ke dashboard mereka
      if (router.pathname === "/login") {
        router.push(targetPath);
        return;
      }

      // Jika admin mencoba mengakses halaman user, atau sebaliknya
      if (userRole === "admin" && router.pathname.startsWith("/user")) {
        router.push("/admin"); // Admin tidak boleh di halaman user, arahkan ke dashboard admin
      } else if (userRole === "user" && router.pathname.startsWith("/admin")) {
        router.push("/user"); // User tidak boleh di halaman admin, arahkan ke dashboard user
      }
    }
  }, [status, userRole, router, isLoading, isAuthenticated]);

  // Tampilkan loading spinner selagi verifikasi sesi berjalan
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page">
        <LoaderCircle className="animate-spin w-10 h-10 text-brand-primary" />
      </div>
    );
  }

  // Jika sudah login, atau berada di halaman login, tampilkan konten halaman
  if (isAuthenticated || router.pathname === "/login") {
    return <>{children}</>;
  }

  // Fallback, seharusnya tidak pernah sampai ke sini, tapi untuk keamanan
  return null;
};

export default AuthGuard;
