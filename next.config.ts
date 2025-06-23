/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com'],
    dangerouslyAllowSVG: true, // Mengizinkan SVG secara global (kurang aman jika ada domain lain)
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Kebijakan keamanan konten tambahan
    remotePatterns: [
  
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
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',  
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        // Anda bisa menambahkan port dan pathname jika diperlukan, tapi untuk placehold.co biasanya tidak
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // Tambahkan ini juga karena Anda menggunakannya
        // port: '', // Kosongkan jika tidak ada port spesifik
        // pathname: '/api/**', // Sesuaikan jika pathnamenya selalu diawali /api/
      },
    ],
  },
};

module.exports = nextConfig;
