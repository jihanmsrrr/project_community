// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'; 

const prisma = new PrismaClient();

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
  adapter: PrismaAdapter(prisma), // Tetap gunakan adapter Prisma jika Anda mengelola user di DB
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
      profile(profile: BPSProfile) { // ✅ PERBAIKAN: Menggunakan tipe BPSProfile yang spesifik
        return {
          id: profile.sso_id,
          name: profile.nama_lengkap,
          email: profile.email,
          image: profile.foto_url,
          role: profile.role || 'user', // Default role jika tidak ada dari SSO
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
        console.log("--- DEBUG: Authorize callback started for username:", credentials?.username);
        if (!credentials?.username || !credentials?.password) {
          // Penting: Gunakan throw new Error() agar pesan error bisa ditangkap oleh signIn({ redirect: false })
          throw new Error("Mohon masukkan username dan password.");
        }

        const user = await prisma.users.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) { // Sesuaikan 'user.password' dengan nama kolom hash password Anda
          // Jangan beri tahu penyerang apakah username ada atau tidak
          throw new Error("Username atau password salah.");
        }

        // ✅ INI ADALAH BAGIAN PALING PENTING: BANDINGKAN HASH PASSWORD
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password // ✅ PASTIKAN user.password DI SINI ADALAH HASH BUKAN PLAIN TEXT
        );

        if (isPasswordValid) {
          // Jika password valid, kembalikan objek user yang akan disimpan di sesi
          return {
            id: user.user_id.toString(), // user_id (BigInt) harus dikonversi ke string
            name: user.nama_lengkap,
            email: user.email,
            role: user.role || 'user', // Ambil role dari database, default 'user' jika null
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
    // Callback ini menyisipkan data dari hasil 'authorize' ke dalam token
    async jwt({ token, user }) {
      if (user) {
        // Pastikan 'user' dari provider memiliki properti 'id' dan 'role'
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Callback ini menyisipkan data dari token ke dalam objek 'session' yang bisa diakses client
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Pastikan ini mengarah ke halaman login Anda
  },
  secret: process.env.NEXTAUTH_SECRET, // Pastikan ini ada di file .env.local
};

export default NextAuth(authOptions);
