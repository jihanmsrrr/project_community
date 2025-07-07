// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

// --- TAMBAHKAN LOG DEBUG SANGAT AWAL INI ---
console.log("--- DEBUG: Initializing pages/api/auth/[...nextauth].ts ---");

// --- UBAH INISIALISASI PRISMACLIENT MENJADI PATTERN SERVERLESS INI ---
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {

  if (!global.prisma) {
  
    global.prisma = new PrismaClient();
  }
 
  prisma = global.prisma;
}

// --- AKHIR PERUBAHAN INISIALISASI PRISMACLIENT ---

// Tambahkan definisi tipe BPSProfile agar TypeScript mengenalinya
type BPSProfile = {
  sso_id: string;
  nama_lengkap: string;
  email: string;
  foto_url?: string;
  role?: string;
};

// Deklarasi untuk memperluas tipe sesi agar bisa menyimpan 'role' dan 'id'
// Ini penting agar TypeScript tahu properti kustom Anda di objek sesi
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ID pengguna dari database
      role: string; // Peran pengguna dari database
    } & NextAuthUser; // Gabungkan dengan tipe User default NextAuth
  }
  interface User {
    id: string; // ID pengguna dari database
    role: string; // Peran pengguna dari database
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // ID pengguna di token
    role: string; // Peran pengguna di token
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Menggunakan instance prisma yang sudah diinisialisasi
  providers: [
    // Konfigurasi SSO BPS (tetap sama jika sudah berfungsi)
    {
      id: "bps-sso",
      name: "SSO BPS",
      type: "oauth",
      clientId: process.env.BPS_SSO_CLIENT_ID,
      clientSecret: process.env.BPS_SSO_CLIENT_SECRET,
      authorization: {
        url: "https://sso.bps.go.id/auth",
        params: { scope: "openid email profile" },
      },
      token: "https://sso.bps.go.id/token",
      userinfo: "https://sso.bps.go.id/userinfo",
      profile(profile: BPSProfile) {
        return {
          id: profile.sso_id,
          name: profile.nama_lengkap,
          email: profile.email,
          image: profile.foto_url,
          role: profile.role || 'user',
        };
      },
    },
    // Konfigurasi Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // --- LOG DEBUG INI HARUSNYA SEKARANG MUNCUL ---
        console.log("--- DEBUG: Authorize callback started for username:", credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Mohon masukkan username dan password.");
        }

        // --- DEBUG: Log sebelum query database ---
        console.log("--- DEBUG: Querying database for user:", credentials.username);
        const user = await prisma.users.findUnique({
          where: { username: credentials.username },
        });
        // --- DEBUG: Log setelah query database ---
        console.log("--- DEBUG: User found:", !!user);


        if (!user || !user.password) {
          // --- DEBUG: Log jika user tidak ditemukan atau password kosong ---
          console.log("--- DEBUG: User not found or password not set for username:", credentials.username);
          throw new Error("Username atau password salah.");
        }

        // --- DEBUG: Log sebelum bcrypt compare ---
        console.log("--- DEBUG: Comparing passwords for user:", user.username);
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        // --- DEBUG: Log setelah bcrypt compare ---
        console.log("--- DEBUG: Password valid:", isPasswordValid);


        if (isPasswordValid) {
          return {
            id: user.user_id.toString(),
            name: user.nama_lengkap,
            email: user.email,
            role: user.role || 'user',
          };
        } else {
          throw new Error("Username atau password salah.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log("--- DEBUG: JWT callback - token:", token); // Log JWT
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      console.log("--- DEBUG: Session callback - session.user:", session.user); // Log Session user
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);