// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daftar pengguna berdasarkan screenshot Anda untuk membuat data yang realistis
const users = [
    { id: 1, name: 'Arianto S.Si., SE., M.Si' },
    { id: 2, name: 'Siti Nurdjannah SST' },
    { id: 3, name: 'Siti Nur Laelatul Badriyah SE.AK, M.Si, CA' },
    { id: 4, name: 'Achmad Muchlis Abdi Putra SST., MT' },
    { id: 5, name: 'Mohamad Rivani S.IP, M.M.' },
    { id: 6, name: 'Andri Saleh S.Si, M.I.Kom.' },
    { id: 7, name: 'Muhammad Haikal Candra S.Tr.Ds.' },
    { id: 8, name: 'Bagus Ardiansyah S.Tr.Stat.' },
    { id: 9, name: 'Aliyah Salsabila Hakim S.Hum.' },
    { id: 10, name: 'Dira Afiani S.S.' },
    { id: 11, name: 'Aina Sabedah Fitri S.Si, MSE' },
];

// Helper untuk menghasilkan data berita secara dinamis
const generateNewsData = (count: number) => {
    const newsItems = [];
    const categories = ["BPS Terkini", "Wisata", "Opini", "Fotogenik", "Serba Serbi", "Berita Daerah"];
    const keywords = ["Data", "Statistik", "Ekonomi", "Pariwisata", "Kebijakan", "Inovasi", "Teknologi"];

    for (let i = 1; i <= count; i++) {
        const category = categories[i % categories.length];
        const title = `${category}: Analisis Mendalam Topik ke-${i}`;
        newsItems.push({
            judul: title,
            abstrak: `Ini adalah abstrak untuk berita "${title}". Artikel ini membahas berbagai aspek penting yang relevan dengan topik terkini.`,
            kategori: category,
            kata_kunci: [keywords[i % keywords.length], keywords[(i + 1) % keywords.length]],
            isi_berita: `Ini adalah isi lengkap untuk berita ke-${i}. Pembahasan mencakup data historis, analisis tren, dan proyeksi masa depan untuk memberikan pemahaman yang komprehensif kepada pembaca.`,
            status: "published",
            gambar_urls: [{ url: `https://placehold.co/1200x600/3B82F6/FFFFFF/png?text=Berita+${i}` }],
            savedAt: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000), // Tanggal mundur dari hari ini
            publishedAt: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
        });
    }
    return newsItems;
};


async function main() {
  console.log(`Mulai proses seeding...`);

  // --- 1. Hapus data lama dengan urutan yang benar ---
  console.log("Menghapus data lama...");
  await prisma.bookmarks.deleteMany();
  await prisma.likes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.news.deleteMany();
  console.log("Data lama berhasil dihapus.");

  // --- 2. Buat 100 data berita baru ---
  console.log("Membuat 100 data berita baru...");
  const newsData = generateNewsData(100);
  const createdNews = [];

  // --- PERBAIKAN: Gunakan counter untuk ID jika tidak auto-increment ---
  let newsIdCounter = 1;
  for (const news of newsData) {
    const randomAuthor = users[Math.floor(Math.random() * users.length)];
    const created = await prisma.news.create({
      data: {
        // Menyediakan ID secara manual untuk mengatasi error
        news_id: BigInt(newsIdCounter),
        ...news,
        penulisId: BigInt(randomAuthor.id),
        nama_penulis: randomAuthor.name,
      },
    });
    createdNews.push(created);
    newsIdCounter++; // Naikkan counter untuk berita berikutnya
  }
  console.log(`${createdNews.length} berita berhasil dibuat.`);

  // --- 3. Buat data interaksi (likes, comments, bookmarks) untuk setiap berita ---
  console.log("Membuat data interaksi...");
  for (const news of createdNews) {
    const interactionCount = Math.floor(Math.random() * 10) + 1; // 1 to 10 interactions

    for (let i = 0; i < interactionCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // 50% chance to add a like
      if (Math.random() > 0.5) {
        await prisma.likes.create({
          data: {
            article_id: news.news_id,
            user_id: BigInt(randomUser.id),
            timestamp: new Date(),
          },
        }).catch(e => console.log(`Skipping duplicate like: ${e.message}`));
      }

      // 30% chance to add a comment
      if (Math.random() > 0.7) {
        await prisma.comments.create({
          data: {
            news_id: news.news_id,
            user_id: BigInt(randomUser.id),
            username: randomUser.name,
            isi_komentar: `Ini adalah komentar yang sangat informatif untuk berita #${news.news_id}. Terima kasih atas wawasannya!`,
            tanggal_komentar: new Date(),
          }
        });
      }
      
      // 20% chance to add a bookmark
      if (Math.random() > 0.8) {
          await prisma.bookmarks.create({
              data: {
                  article_id: news.news_id,
                  user_id: BigInt(randomUser.id),
                  timestamp: new Date(),
              }
          }).catch(e => console.log(`Skipping duplicate bookmark: ${e.message}`));
      }
    }
  }
  console.log("Data interaksi berhasil dibuat.");

  console.log(`\nSeeding selesai dengan sukses!`);
}

main()
  .catch(async (e) => {
    console.error("Terjadi error saat seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
