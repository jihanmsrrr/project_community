import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import users from "@/data/users.json"; // Impor data user kita

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
     async authorize(credentials) {
  // Logika ini meniru form login Anda
  if (!credentials) return null;

  const user = users.find(u => u.username === credentials.username && u.password === credentials.password);

        if (user) {
    // Objek yang dikembalikan di sini akan disimpan di dalam token JWT
    // Kita hanya perlu mengembalikan data yang aman
    return {
      id: user.id,
      name: user.nama,
      email: user.email,
      image: user.image,
      role: user.role, // <-- PENTING: sertakan role
    };
        }
        // Jika user tidak ditemukan, kembalikan null
        return null;
      },
    }),
    // Anda masih bisa menambahkan GoogleProvider atau lainnya di sini
  ],
  session: {
    strategy: "jwt",
    maxAge: 4320, // Durasi sesi maksimum dalam detik (1 jam)
    // updateAge: 600, // (Opsional) Perbarui sesi setiap 10 menit selama user aktif
  },
  callbacks: {
    // Callback ini dipanggil setiap kali JWT dibuat
    async jwt({ token, user }) {
      // Saat pertama kali login (objek `user` ada), tambahkan role ke token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Callback ini dipanggil setiap kali sesi diakses dari klien
    async session({ session, token }) {
      // Tambahkan role dan id dari token ke objek sesi
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Arahkan ke halaman login kustom Anda
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);