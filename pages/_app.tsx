// pages/_app.tsx
import { SessionProvider } from "next-auth/react"; // Sudah benar diimpor
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "leaflet/dist/leaflet.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import type { AppProps } from "next/app";
import { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// PERUBAHAN 1: Tambahkan `session` ke dalam tipe AppProps
interface Session {
  user: {
    // <-- User sekarang tidak opsional
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null; // Tambahkan role di sini jika Anda ingin mengetiknya di sini juga
    id?: string | null; // Tambahkan id di sini jika Anda ingin mengetiknya di sini juga
  };
  expires: string;
}
type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

// PERUBAHAN 2: Destructuring 'session' dari 'pageProps'
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
    if (router.pathname === "/login") {
      return <Component {...pageProps} />;
    }

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

    return getDefaultLayout(<Component {...pageProps} />);
  };

  return (
    // PERUBAHAN 3: Bungkus semuanya dengan <SessionProvider>
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
            {renderWithLayout()}
          </div>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
