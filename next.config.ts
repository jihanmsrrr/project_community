/** @type {import('next').NextConfig} */
const nextConfig = {
    
    reactStrictMode: true, // Ini praktik yang bagus untuk pengembangan React
    env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
        // Ini adalah konfigurasi untuk mengizinkan gambar dari domain eksternal tertentu.
        // Penting untuk keamanan dan performa.
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.co",
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com', // Digunakan untuk avatar default
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "randomuser.me",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // Untuk gambar dari Google (misal: NextAuth Google provider)
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com', // Untuk gambar dari GitHub (misal: NextAuth GitHub provider)
            },
        ],
    },
};

module.exports = nextConfig;