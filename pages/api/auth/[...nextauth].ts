// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
          role: profile.role || 'user',
        };
      },
    },
    // Konfigurasi Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" }, // Ubah label menjadi Username
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const { username, password } = credentials as { username?: string; password?: string };

        try {
          const user = await prisma.users.findUnique({
            where: { username }, // Cari user berdasarkan username
          });

          if (!user) {
            return null;
          }

          // **PERHATIAN PENTING:**
          // Jika Anda berencana menggunakan password yang sebenarnya (bukan hanya untuk evaluasi),
          // sangat disarankan untuk menggunakan bcrypt untuk mengenkripsi dan membandingkan password.
          // Contoh menggunakan bcrypt (pastikan bcrypt sudah terinstall: npm install bcrypt):
          // const isPasswordValid = await bcrypt.compare(password, user.password);

          // Untuk keperluan evaluasi sementara, kita bisa menggunakan perbandingan string biasa:
          const isPasswordValid = user.password === password;

          if (isPasswordValid) {
            return {
              id: user.user_id.toString(), // Menggunakan user_id sebagai id
              name: user.nama_lengkap,
              email: user.email,
              role: user.role || 'user',
            };
          } else {
            return null; // Jika password tidak valid
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat login:", error);
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
    signIn: '/login',
  },
};

export default NextAuth(authOptions);