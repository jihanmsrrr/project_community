// File: pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// Definisikan tipe User yang akan kita gunakan di session
interface AppUser extends NextAuthUser {
  role: string;
  id: string; // Assuming 'id' is also on the AppUser type
}

// Definisikan interface untuk struktur profile dari SSO BPS
interface BPSProfile {
  sso_id: string;
  nama_lengkap: string;
  email: string;
  foto_url: string;
  role?: string; // Role mungkin opsional dari SSO
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Gunakan Prisma Adapter untuk otomatis sinkronisasi user dan session
  adapter: PrismaAdapter(prisma),

  providers: [
    // Kita ganti CredentialsProvider dengan provider yang sesuai untuk SSO.
    // Jika SSO BPS menggunakan standar OAuth2, kita bisa pakai ini.
    // Jika menggunakan standar lain (misal SAML), provider-nya akan berbeda.
    // Ini adalah contoh menggunakan OAuth2 Provider generik.
    {
      id: "bps-sso", // ID unik untuk provider ini
      name: "SSO BPS", // Nama yang akan muncul di tombol login
      type: "oauth",

      // Detail ini HARUS Anda dapatkan dari dokumentasi atau tim pengelola SSO BPS
      clientId: process.env.BPS_SSO_CLIENT_ID,
      clientSecret: process.env.BPS_SSO_CLIENT_SECRET,
      authorization: {
        url: "https://sso.bps.go.id/auth", // CONTOH URL
        params: { scope: "openid email profile" },
      },
      token: "https://sso.bps.go.id/token", // CONTOH URL
      userinfo: "https://sso.bps.go.id/userinfo", // CONTOH URL

      // Fungsi ini mengubah profil dari SSO menjadi format yang dimengerti NextAuth & Prisma Adapter
      profile(profile: BPSProfile) {
        return {
          id: profile.sso_id, // Pastikan ini adalah ID unik dari SSO
          name: profile.nama_lengkap,
          email: profile.email,
          image: profile.foto_url,
          role: profile.role || 'user', // Beri role default jika tidak ada dari SSO
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Callbacks tetap penting untuk menambahkan data custom ke token JWT
    async jwt({ token, user }) {
      if (user?.id) {
        token.role = (user as AppUser).role ?? 'user';
        token.id = user.id;
      }
      return token;
    },
    // Dan juga ke objek session di client
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);