"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/router";
import type { DetailPegawaiData } from "@/types/pegawai";
import { useSession } from "next-auth/react"; // <-- Import useSession dari next-auth

interface AuthContextType {
  currentUser: DetailPegawaiData | null; // Kita tidak akan menyimpan ini secara manual
  userRole: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, status: authStatus } = useSession(); // <-- Gunakan useSession untuk mendapatkan sesi
  const router = useRouter();

  const currentUser = session?.user as DetailPegawaiData | null; // Ambil data user dari session
  const userRole = session?.user?.role as string | null; // Ambil role dari session
  const loading = authStatus === "loading"; // Status loading berdasarkan authStatus

  const logout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }); // Panggil endpoint signout dari NextAuth
    router.push("/login");
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
