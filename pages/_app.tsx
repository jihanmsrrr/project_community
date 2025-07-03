// pages/_app.tsx
import { SessionProvider, useSession } from "next-auth/react";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "leaflet/dist/leaflet.css";
import "slick-carousel/slick/slick.css"; // Jalur sudah diperbaiki
import "slick-carousel/slick/slick-theme.css"; // Jalur sudah diperbaiki

import type { AppProps } from "next/app";
import { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Session } from "next-auth"; // ✅ PERBAIKAN: Import Session dari 'next-auth'

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// Import ikon LoaderCircle untuk loading state
import { LoaderCircle } from "lucide-react";

// Deklarasi modul untuk memperluas tipe Session dari next-auth
// ✅ PERBAIKAN: Deklarasi ini dipindahkan ke pages/api/auth/[...nextauth].ts
// agar menjadi deklarasi global tunggal. Hapus deklarasi ini dari sini.
/*
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Pastikan 'role' ada di sini
      id?: string | null;
    };
  }
}
*/

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// Interface AppPropsWithLayout tetap seperti sebelumnya, karena Session sudah diperluas di atas
type AppPropsWithLayout = AppProps<{ session: Session }> & {
  // ✅ Menggunakan Session yang diimpor
  Component: NextPageWithLayout;
};

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

// Komponen pembungkus untuk menangani logika otentikasi dan redirect
function AuthWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: authSession, status } = useSession();

  React.useEffect(() => {
    // Jika status "unauthenticated" (belum login) dan path bukan '/login', redirect ke '/login'
    if (status === "unauthenticated" && router.pathname !== "/login") {
      router.push("/login");
    }
    // Jika status "authenticated" (sudah login) dan path adalah '/login', redirect sesuai role
    else if (status === "authenticated" && router.pathname === "/login") {
      // Tentukan jalur redirect berdasarkan peran
      const targetPath =
        authSession?.user?.role === "admin"
          ? "/admin"
          : authSession?.user?.role === "user"
          ? "/user"
          : "/"; // Default ke halaman utama jika peran tidak ada/dikenali
      router.push(targetPath);
    }
  }, [status, router, authSession]); // Tambahkan authSession sebagai dependensi

  // Tampilkan loading spinner saat sesi sedang dimuat
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page">
        <LoaderCircle className="animate-spin w-10 h-10 text-brand-primary" />
      </div>
    );
  }

  // Jika belum terautentikasi dan bukan halaman login, jangan render apa-apa
  // (redirect sudah ditangani oleh useEffect di atas)
  if (status === "unauthenticated" && router.pathname !== "/login") {
    return null;
  }

  // Jika sudah terautentikasi dan berada di halaman login, jangan render apa-apa
  // (redirect sudah ditangani oleh useEffect di atas)
  if (status === "authenticated" && router.pathname === "/login") {
    return null;
  }

  // Dalam semua kasus lain (sudah terautentikasi di halaman yang dilindungi,
  // atau belum terautentikasi di halaman login), render children.
  return <>{children}</>;
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const router = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  const getDefaultLayout = (page: ReactElement) => (
    <>
      <Navbar />
      <main className="flex-grow pt-16">{page}</main>
      <Footer />
    </>
  );

  const renderWithLayout = () => {
    // Halaman login tidak menggunakan layout
    if (router.pathname === "/login") {
      return <Component {...pageProps} />;
    }

    // Gunakan layout kustom jika didefinisikan pada komponen halaman
    if (Component.getLayout) {
      return (
        <>
          <Navbar />
          <main className="flex-grow pt-16">
            {getLayout(<Component {...pageProps} />)}
          </main>
          <Footer />
        </>
      );
    }

    // Gunakan layout default untuk halaman lain
    return getDefaultLayout(<Component {...pageProps} />);
  };

  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={["light", "dark", "pink"]}
      >
        <AuthProvider>
          <div
            className={`${poppins.variable} font-sans flex flex-col min-h-screen bg-surface-page text-text-primary`}
          >
            {/* Bungkus renderWithLayout dengan AuthWrapper */}
            <AuthWrapper>{renderWithLayout()}</AuthWrapper>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
