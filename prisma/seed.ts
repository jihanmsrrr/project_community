// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Helper untuk membuat slug yang bersih dan unik dari judul
const slugify = (title: string, id: number): string => {
  if (!title) return `material-${id}`; // Fallback jika judul kosong
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Hapus karakter non-alfanumerik kecuali spasi dan strip
    .replace(/[\s_-]+/g, '-') // Ganti spasi atau underscore dengan satu strip
    .replace(/^-+|-+$/g, '') + `-${id}`; // Hapus strip di awal/akhir dan tambahkan ID unik
};

async function main() {
  console.log(`Mulai proses seeding HANYA UNTUK READING MATERIALS...`);

  // --- 1. Menghapus data reading_materials LAMA ---
  console.log("Menghapus data reading_materials lama...");
  await prisma.reading_materials.deleteMany();
  console.log("Data reading_materials lama berhasil dihapus.");

  // --- 2. Mengisi data reading_materials BARU ---
  console.log("Memasukkan data reading_materials baru...");
  const readingMaterialsData = [
    { material_id: 1, judul: 'Tata Laksana Penyelenggaraan Statistik', kategori: 'Pembinaan Statistik', file_path: 'Modul 1. Tata Laksana Penyelenggaraan Statistik.pdf', uploader_id: 9, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Panduan lengkap tata laksana penyelenggaraan statistik sesuai standar BPS.', hits: 733, sub_kategori: 'Topik 1: Dasar Penyelenggaraan Statistik' },
    { material_id: 2, judul: 'Langkah Praktis dalam Survei dan Kompromin', kategori: 'Pembinaan Statistik', file_path: 'Modul 2. Langkah Praktis dalam Survei dan Kompromin.pdf', uploader_id: 5, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Teknik praktis yang diterapkan dalam survei serta koordinasi pemasaran dan informasi.', hits: 1418, sub_kategori: 'Topik 1: Dasar Penyelenggaraan Statistik' },
    { material_id: 3, judul: 'Aplikasi Penyelenggaraan Statistik', kategori: 'Pembinaan Statistik', file_path: 'Modul 3. Aplikasi Penyelenggaraan Statistik.pdf', uploader_id: 8, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Modul tentang aplikasi yang digunakan dalam penyelenggaraan statistik.', hits: 470, sub_kategori: 'Topik 1: Dasar Penyelenggaraan Statistik' },
    { material_id: 4, judul: 'Dasar-dasar Statistik', kategori: 'Pembinaan Statistik', file_path: 'Modul 4. Dasar-dasar Statistik.pdf', uploader_id: 5, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Modul pengantar mengenai dasar-dasar ilmu statistik.', hits: 1708, sub_kategori: 'Topik 1: Dasar Penyelenggaraan Statistik' },
    { material_id: 5, judul: 'Teknik Sampling dan Pengolahan Data', kategori: 'Pembinaan Statistik', file_path: 'modul_teknik_sampling.pdf', uploader_id: 5, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Penjelasan lengkap teknik sampling dan pengolahan data untuk hasil statistik yang valid.', hits: 1278, sub_kategori: 'Topik 2: Teknik Lanjutan' },
    { material_id: 6, judul: 'Metode Sensus dan Survei Terpadu', kategori: 'Metodologi Sensus & Survei', file_path: 'modul_metode_sensus.pdf', uploader_id: 10, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Panduan metodologi sensus dan survei terpadu terbaru.', hits: 624, sub_kategori: 'Topik 1: Kerangka Kerja' },
    { material_id: 7, judul: 'Teknik Pengolahan Data Sensus', kategori: 'Metodologi Sensus & Survei', file_path: 'modul_pengolahan_sensus.pdf', uploader_id: 6, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Teknik pengolahan dan validasi data hasil sensus.', hits: 491, sub_kategori: 'Topik 1: Kerangka Kerja' },
    { material_id: 8, judul: 'Paparan Hasil Survei Nasional Triwulan I', kategori: 'Dokumentasi Paparan', file_path: 'modul_paparan_hasil.pdf', uploader_id: 8, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Paparan lengkap hasil survei nasional terbaru yang disampaikan oleh Kepala BPS.', hits: 255, sub_kategori: 'Topik 1: Indikator Strategis' },
    { material_id: 9, judul: '20161004 FGD BPS dengan Komisi XI DPR RI', kategori: 'Dokumentasi Paparan', file_path: '20161004 FGD BPS denganKomisi XI DPR RI.pdf', uploader_id: 3, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Materi Fokus Group Discussion BPS dengan Komisi XI DPR RI.', hits: 213, sub_kategori: 'Topik 1: Indikator Strategis' },
    { material_id: 10, judul: '20161116 NTT Launching Satu Data Final', kategori: 'Dokumentasi Paparan', file_path: '20161116 NTT Launching Satu Data_Final.pdf', uploader_id: 4, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Paparan final peluncuran Satu Data di NTT.', hits: 292, sub_kategori: 'Topik 1: Indikator Strategis' },
    { material_id: 11, judul: 'Indikator Pembangunan Kalsel Nov 2016', kategori: 'Dokumentasi Paparan', file_path: 'Indikator Pembangunan Kalsel Nov 2016.pdf', uploader_id: 10, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Indikator pembangunan Kalimantan Selatan per November 2016.', hits: 269, sub_kategori: 'Topik 1: Indikator Strategis' },
    { material_id: 12, judul: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau', kategori: 'Dokumentasi Paparan', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 11, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Paparan BPS Kabupaten Pulang Pisau untuk BPBD.', hits: 294, sub_kategori: 'Topik 1: Indikator Strategis' },
    { material_id: 14, judul: 'Metodologi Monitoring dan Evaluasi Program', kategori: 'Monitoring & Evaluasi', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 8, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Pendekatan dan teknik monitoring dan evaluasi program statistik.', hits: 294, sub_kategori: 'Topik 1: Metodologi & Pelaporan' },
    { material_id: 15, judul: 'Evaluasi Aktivitas Internal BPS', kategori: 'Monitoring & Evaluasi', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 2, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Monitoring dan evaluasi aktivitas serta kinerja internal BPS secara menyeluruh.', hits: 275, sub_kategori: 'Topik 1: Metodologi & Pelaporan' },
    { material_id: 16, judul: 'Standar Biaya Masukan (SBM) Tahun Anggaran 2023', kategori: 'Standar Biaya', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 6, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Dokumen resmi terkait standar biaya masukan untuk kegiatan.', hits: 1489, sub_kategori: 'Topik 1: SBM & Operasional' },
    { material_id: 17, judul: 'Dasar-dasar Akuntabilitas Kinerja', kategori: 'Akuntabilitas Kinerja', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 9, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Pengertian dan prinsip utama sistem akuntabilitas kinerja di instansi pemerintah.', hits: 417, sub_kategori: 'Topik 1: Kinerja & Pelaporan' },
    { material_id: 18, judul: 'Panduan Implementasi SAKIP', kategori: 'Akuntabilitas Kinerja', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 3, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Panduan penerapan Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP).', hits: 252, sub_kategori: 'Topik 1: Kinerja & Pelaporan' },
    { material_id: 19, judul: 'Strategi Diseminasi Statistik Digital', kategori: 'Diseminasi Statistik', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 8, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Strategi diseminasi dan publikasi hasil statistik ke publik secara efektif melalui kanal digital.', hits: 277, sub_kategori: 'Topik 1: Strategi & Praktik' },
    { material_id: 20, judul: 'Materi Pelatihan Kepemimpinan Statistik', kategori: 'Leadership & Manajemen', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 1, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Kumpulan materi pelatihan dan pengembangan kepemimpinan bagi staf statistik.', hits: 271, sub_kategori: 'Topik 1: Pelatihan Kepemimpinan' },
    { material_id: 21, judul: 'Best Practices: Leading National Statistics Office', kategori: 'Leadership & Manajemen', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 9, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Studi kasus dan strategi efektif dalam memimpin kantor statistik nasional di era modern.', hits: 224, sub_kategori: 'Topik 1: Pelatihan Kepemimpinan' },
    { material_id: 22, judul: 'Technical Assistance ABS', kategori: 'Asistensi Teknis', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 11, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Dokumentasi dan materi bantuan teknis untuk pelaksanaan statistik berbasis sampel (ABS).', hits: 140, sub_kategori: 'Topik 1: Bantuan Teknis' },
    { material_id: 23, judul: 'Materi Seminar Pelayanan Publik', kategori: 'Seminar & Workshop', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 5, tanggal_upload: new Date('2024-01-15 10:00:00'), deskripsi: 'Materi dan laporan dari seminar pelayanan publik terbaru yang diselenggarakan oleh BPS.', hits: 168, sub_kategori: 'Topik 1: Materi Seminar' },
    { material_id: 25, judul: 'Dasar-Dasar Reformasi Birokrasi', kategori: 'Reformasi Birokrasi', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 3, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Konsep dan prinsip reformasi birokrasi di instansi pemerintah.', hits: 152, sub_kategori: 'Topik 1: Panduan & Implementasi' },
    { material_id: 26, judul: 'Implementasi Reformasi Birokrasi di BPS', kategori: 'Reformasi Birokrasi', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 9, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Langkah-langkah dan studi kasus pelaksanaan reformasi birokrasi di lingkungan BPS.', hits: 163, sub_kategori: 'Topik 1: Panduan & Implementasi' },
    { material_id: 27, judul: 'Undang-Undang Statistik No. 16 Tahun 1997', kategori: 'Regulasi', file_path: 'Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pdf', uploader_id: 9, tanggal_upload: new Date('2023-01-15 10:00:00'), deskripsi: 'Teks lengkap dan penjelasan regulasi dasar yang mengatur penyelenggaraan statistik nasional.', hits: 1712, sub_kategori: 'Topik 1: Hukum & Peraturan' },
  ];

  for (const material of readingMaterialsData) {
    // Membuat slug, bacaUrl, dan unduhUrl secara dinamis
    const slug = slugify(material.judul, material.material_id);
    const bacaUrl = `/baca/${slug}`;
    const unduhUrl = `/unduh/${slug}`;

    await prisma.reading_materials.create({
      data: {
        material_id: material.material_id,
        judul: material.judul,
        kategori: material.kategori?.trim(), // Membersihkan spasi atau karakter tak terlihat
        sub_kategori: material.sub_kategori,
        deskripsi: material.deskripsi,
        file_path: material.file_path,
        uploader_id: material.uploader_id,
        tanggal_upload: material.tanggal_upload,
        hits: material.hits,
        // Kolom tambahan sesuai skema
        slug: slug,
        bacaUrl: bacaUrl,
        unduhUrl: unduhUrl,
      },
    });
  }
  console.log(`${readingMaterialsData.length} data reading materials berhasil dimasukkan.`);

  console.log(`\nSeeding Reading Materials selesai dengan sukses!`);
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