// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Definisi interface untuk profil BPS SSO (jika diperlukan oleh profil Anda)
interface BPSProfile {
  sso_id: string;
  nama_lengkap: string;
  email: string;
  foto_url: string;
  role?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Konfigurasi SSO BPS
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
        if (!credentials?.username || !credentials?.password) {
          return null; // Jika kredensial tidak lengkap
        }
        const { username, password } = credentials;

        try {
          // Cari user di database berdasarkan username
          const user = await prisma.users.findUnique({
            where: { username }, // Mencari berdasarkan kolom 'username' di model 'users'
          });

          if (!user) {
            // Pengguna tidak ditemukan di database
            console.log("Pengguna tidak ditemukan:", username);
            return null;
          }

          // **PERHATIAN PENTING UNTUK KEAMANAN:**
          // Di lingkungan produksi, Anda HARUS menggunakan library hashing password seperti bcrypt
          // untuk mengenkripsi password saat disimpan dan membandingkannya saat login.
          // Contoh dengan bcrypt (pastikan bcrypt sudah terinstall: npm install bcrypt):
          // import bcrypt from 'bcrypt';
          // const isPasswordValid = await bcrypt.compare(password, user.password);

          // Untuk keperluan pengembangan/evaluasi sementara:
          const isPasswordValid = user.password === password; // Perbandingan password biasa (TIDAK AMAN untuk produksi)

          if (isPasswordValid) {
            // Jika password valid, kembalikan objek user yang akan disimpan di sesi
            return {
              id: user.user_id.toString(), // user_id (BigInt) harus dikonversi ke string
              name: user.nama_lengkap,
              email: user.email,
              role: user.role || 'user', // Ambil role dari database, default 'user' jika null
            };
          } else {
            // Password tidak valid
            console.log("Password tidak valid untuk pengguna:", username);
            return null;
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat otentikasi kredensial:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Pastikan ini mengarah ke halaman login Anda
  },
  callbacks: {
    async jwt({ token, user }) {
      // Tambahkan informasi role dari user ke JWT token
      if (user) {
        // Definisikan tipe user sesuai dengan struktur user yang dikembalikan dari authorize
        type AppUser = {
          id: string;
          name: string;
          email: string;
          role: string;
        };
        token.role = (user as AppUser).role; // 'user' di sini adalah objek yang dikembalikan dari `authorize`
      }
      return token;
    },
    async session({ session, token }) {
      // Tambahkan informasi role dari JWT token ke objek sesi
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
