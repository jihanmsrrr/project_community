// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react"; // Import signOut dari next-auth/react

// --- PERBAIKAN PENTING DI SINI ---
// Definisikan tipe AuthUser agar secara AKURAT mencerminkan apa yang ada di session.user
// berdasarkan konfigurasi NextAuth Anda.
// Ini adalah subset dari DetailPegawaiData yang benar-benar dikirim NextAuth.
interface AuthUser {
  id: string; // Ini adalah 'id' yang wajib dari NextAuth
  role: string; // Ini adalah 'role' kustom yang Anda tambahkan
  name?: string | null; // Properti 'name' default NextAuth (dari nama_lengkap)
  email?: string | null; // Properti 'email' default NextAuth
  image?: string | null; // Properti 'image' default NextAuth (dari foto_url)

  // JIKA Anda menambahkan properti lain di JWT/Session callback NextAuth Anda,
  // maka tambahkan juga di sini. Contoh:
  // user_id?: bigint; // Jika user_id juga dimasukkan ke sesi
  // nip_baru?: string | null; // Jika nip_baru juga dimasukkan ke sesi
}
// --- AKHIR PERBAIKAN ---

interface AuthContextType {
  currentUser: AuthUser | null; // Gunakan tipe AuthUser yang lebih akurat
  userRole: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  // Konstruksi currentUser. Sekarang TypeScript akan senang karena
  // session.user (yang tipenya diperluas oleh next-auth.d.ts)
  // cocok dengan AuthUser yang kita definisikan.
  const currentUser: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        // Tambahkan properti lain jika Anda memasukkannya ke sesi
        // Contoh:
        // user_id: session.user.user_id,
        // nip_baru: session.user.nip_baru,
      }
    : null;

  const userRole = currentUser?.role || null;
  const loading = authStatus === "loading";

  const logout = async () => {
    await signOut({ redirect: false }); // Gunakan fungsi signOut dari next-auth/react
    router.push("/login"); // Redirect secara client-side
  };

  const value = { currentUser, userRole, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
