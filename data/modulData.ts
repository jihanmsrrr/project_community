// src/data/modulData.ts

// --- 1. DEFINISI TIPE DATA (DIEKSPOR UNTUK DIPAKAI DI TEMPAT LAIN) ---

export interface Modul {
  id: string; // ID unik, contoh: "modul-tata-laksana"
  judul: string;
  deskripsi: string; // Deskripsi modul
  ukuran: string; // e.g., "4.92 MB"
  hits: number; // Jumlah dilihat
  fileName: string; // Nama file untuk diunduh (asumsi di public/files/)
  slug: string; // Untuk URL yang ramah SEO, e.g., "tata-laksana-penyelenggaraan-statistik"
}

export interface SubKategori {
  id: string; // ID unik sub-kategori
  nama: string; // Nama yang tampil di UI, contoh: "Topik 1: Dasar-Dasar Statistik"
  modul: Modul[];
}

export interface Kategori {
  id: string; // ID kategori, contoh: "pembinaan-statistik"
  namaTampil: string; // Nama yang tampil di UI, contoh: "Pembinaan Statistik"
  tahun: number; // Tahun publikasi
  subKategori: SubKategori[];
}

// --- Fungsi Helper untuk membuat data lebih mudah dan konsisten ---
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);

// Helper untuk menghasilkan slug (ini harusnya ada di utilitas, tapi untuk konsistensi, saya sertakan di sini)
// Jika Anda sudah punya fungsi generateSlug di utils, pastikan modulData Anda dibuat dengan slug yang benar menggunakan fungsi itu


// --- 2. DATA DUMMY LENGKAP UNTUK SEMUA KATEGORI ---
// Catatan: Saya akan menggunakan slug yang Anda berikan di data, pastikan itu sesuai dengan yang diinginkan.
// Jika ada modul yang tidak memiliki slug, saya akan mengisinya dengan generateSlug.

export const modulData: Kategori[] = [
  {
    id: "pembinaan-statistik",
    namaTampil: "Pembinaan Statistik",
    tahun: 2023,
    subKategori: [
      {
        id: "pembinaan-topik-1",
        nama: "Topik 1: Dasar Penyelenggaraan Statistik",
        modul: [
          { id: "modul-tata-laksana", judul: "Tata Laksana Penyelenggaraan Statistik", deskripsi: "Panduan lengkap tata laksana penyelenggaraan statistik sesuai standar BPS.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "modul_tata_laksana.pdf", slug: "tata-laksana-penyelenggaraan-statistik" },
          { id: "modul-langkah-praktis", judul: "Langkah Praktis dalam Survei dan Kompromin", deskripsi: "Teknik praktis yang diterapkan dalam survei serta koordinasi pemasaran dan informasi.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "modul_langkah_praktis.pdf", slug: "langkah-praktis-survei-kompromin" },
        ],
      },
      {
        id: "pembinaan-topik-2",
        nama: "Topik 2: Teknik Lanjutan",
        modul: [
          { id: "modul-teknik-sampling", judul: "Teknik Sampling dan Pengolahan Data", deskripsi: "Penjelasan lengkap teknik sampling dan pengolahan data untuk hasil statistik yang valid.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "modul_teknik_sampling.pdf", slug: "teknik-sampling-pengolahan-data" },
        ],
      },
    ],
  },
  {
    id: "metodologi",
    namaTampil: "Metodologi Sensus & Survei",
    tahun: 2023,
    subKategori: [
      {
        id: "metodologi-topik-1",
        nama: "Topik 1: Kerangka Kerja",
        modul: [
          { id: "modul-metode-sensus", judul: "Metode Sensus dan Survei Terpadu", deskripsi: "Panduan metodologi sensus dan survei terpadu terbaru.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(200, 700), fileName: "modul_metode_sensus.pdf", slug: "metode-sensus-survei-terpadu" },
          { id: "modul-teknik-pengolahan-sensus", judul: "Teknik Pengolahan Data Sensus", deskripsi: "Teknik pengolahan dan validasi data hasil sensus.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(200, 700), fileName: "modul_pengolahan_sensus.pdf", slug: "teknik-pengolahan-data-sensus" },
        ],
      },
    ],
  },
  {
    id: "paparan-rilis",
    namaTampil: "Paparan & Rilis",
    tahun: 2024,
    subKategori: [
      {
        id: "paparan-topik-1",
        nama: "Topik 1: Indikator Strategis",
        modul: [
          { id: "modul-paparan-hasil", judul: "Paparan Hasil Survei Nasional Triwulan I", deskripsi: "Paparan lengkap hasil survei nasional terbaru yang disampaikan oleh Kepala BPS.", ukuran: `${randomFloat(2, 5)} MB`, hits: randomInt(100, 400), fileName: "modul_paparan_hasil.pdf", slug: "paparan-hasil-survei-nasional" },
        ],
      },
    ],
  },
  {
    id: "kompetisi-inovasi",
    namaTampil: "Kompetisi & Inovasi",
    tahun: 2024,
    subKategori: [
      {
        id: "kompetisi-topik-1",
        nama: "Topik 1: Panduan",
        modul: [
          { id: "modul-panduan-kompetisi", judul: "Panduan Kompetisi Inovasi BPS 2024", deskripsi: "Peraturan dan panduan lengkap untuk kompetisi inovasi (INOBERS) BPS.", ukuran: `${randomFloat(2, 5)} MB`, hits: randomInt(100, 400), fileName: "modul_panduan_kompetisi.pdf", slug: "panduan-kompetisi-inovasi-bps-2024" },
        ],
      },
    ],
  },
  {
    id: "monitoring-evaluasi",
    namaTampil: "Monitoring & Evaluasi",
    tahun: 2023,
    subKategori: [
      {
        id: "monev-topik-1",
        nama: "Topik 1: Metodologi & Pelaporan",
        modul: [
          { id: "modul-metodologi-monev", judul: "Metodologi Monitoring dan Evaluasi Program", deskripsi: "Pendekatan dan teknik monitoring dan evaluasi program statistik.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(150, 300), fileName: "modul_metodologi_monev.pdf", slug: "metodologi-monitoring-evaluasi-program" },
          { id: "modul-evaluasi-aktivitas-bps", judul: "Evaluasi Aktivitas Internal BPS", deskripsi: "Monitoring dan evaluasi aktivitas serta kinerja internal BPS secara menyeluruh.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(150, 300), fileName: "modul_evaluasi_internal.pdf", slug: "evaluasi-aktivitas-internal-bps" },
        ],
      },
    ],
  },
  {
    id: "standar-biaya",
    namaTampil: "Standar Biaya",
    tahun: 2023,
    subKategori: [
      {
        id: "standar-biaya-topik-1",
        nama: "Topik 1: SBM & Operasional",
        modul: [
          { id: "modul-sbm", judul: "Standar Biaya Masukan (SBM) Tahun Anggaran 2023", deskripsi: "Dokumen resmi terkait standar biaya masukan untuk kegiatan.", ukuran: `${randomFloat(3, 6)} MB`, hits: randomInt(800, 2000), fileName: "modul_sbm_2023.pdf", slug: "standar-biaya-masukan-2023" },
        ],
      },
    ],
  },
  {
    id: "akuntabilitas-sakip",
    namaTampil: "Akuntabilitas & SAKIP",
    tahun: 2024,
    subKategori: [
      {
        id: "akuntabilitas-topik-1",
        nama: "Topik 1: Kinerja & Pelaporan",
        modul: [
          { id: "modul-dasar-akuntabilitas", judul: "Dasar-dasar Akuntabilitas Kinerja", deskripsi: "Pengertian dan prinsip utama sistem akuntabilitas kinerja di instansi pemerintah.", ukuran: `${randomFloat(4, 8)} MB`, hits: randomInt(200, 500), fileName: "modul_dasar_akuntabilitas.pdf", slug: "dasar-akuntabilitas-kinerja" },
          { id: "modul-sakip-panduan", judul: "Panduan Implementasi SAKIP", deskripsi: "Panduan penerapan Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP).", ukuran: `${randomFloat(4, 8)} MB`, hits: randomInt(200, 500), fileName: "modul_panduan_sakip.pdf", slug: "panduan-implementasi-sakip" },
        ],
      },
    ],
  },
  {
    id: "diseminasi-statistik",
    namaTampil: "Diseminasi Statistik",
    tahun: 2023,
    subKategori: [
      {
        id: "diseminasi-topik-1",
        nama: "Topik 1: Strategi & Praktik",
        modul: [
          { id: "modul-strategi-diseminasi", judul: "Strategi Diseminasi Statistik Digital", deskripsi: "Strategi diseminasi dan publikasi hasil statistik ke publik secara efektif melalui kanal digital.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(150, 450), fileName: "modul_strategi_diseminasi.pdf", slug: "strategi-diseminasi-statistik-digital" },
        ],
      },
    ],
  },
  {
    id: "leadership-manajemen",
    namaTampil: "Leadership & Manajemen",
    tahun: 2023,
    subKategori: [
      {
        id: "leadership-topik-1",
        nama: "Topik 1: Pelatihan Kepemimpinan",
        modul: [
          { id: "modul-leadership-training", judul: "Materi Pelatihan Kepemimpinan Statistik", deskripsi: "Kumpulan materi pelatihan dan pengembangan kepemimpinan bagi staf statistik.", ukuran: `${randomFloat(5, 12)} MB`, hits: randomInt(100, 300), fileName: "modul_leadership_training.pdf", slug: "pelatihan-kepemimpinan-statistik" },
          { id: "modul-leading-nso", judul: "Best Practices: Leading National Statistics Office", deskripsi: "Studi kasus dan strategi efektif dalam memimpin kantor statistik nasional di era modern.", ukuran: `${randomFloat(5, 12)} MB`, hits: randomInt(100, 300), fileName: "modul_leading_nso.pdf", slug: "best-practices-leading-nso" },
        ],
      },
    ],
  },
  {
    id: "asistensi-teknis",
    namaTampil: "Asistensi Teknis",
    tahun: 2024,
    subKategori: [
      {
        id: "asistensi-topik-1",
        nama: "Topik 1: Bantuan Teknis",
        modul: [
          { id: "modul-ta-abs", judul: "Technical Assistance ABS", deskripsi: "Dokumentasi dan materi bantuan teknis untuk pelaksanaan statistik berbasis sampel (ABS).", ukuran: `${randomFloat(3, 6)} MB`, hits: randomInt(100, 250), fileName: "modul_ta_abs.pdf", slug: "technical-assistance-abs" },
        ],
      },
    ],
  },
  {
    id: "seminar-workshop",
    namaTampil: "Seminar & Workshop",
    tahun: 2024,
    subKategori: [
      {
        id: "seminar-topik-1",
        nama: "Topik 1: Materi Seminar",
        modul: [
          { id: "modul-seminar-publik", judul: "Materi Seminar Pelayanan Publik", deskripsi: "Materi dan laporan dari seminar pelayanan publik terbaru yang diselenggarakan oleh BPS.", ukuran: `${randomFloat(5, 15)} MB`, hits: randomInt(100, 200), fileName: "modul_seminar_publik.pdf", slug: "seminar-pelayanan-publik" },
        ],
      },
    ],
  },
  {
    id: "varia-statistik-bacaan",
    namaTampil: "Varia Statistik (Bacaan)",
    tahun: 2023,
    subKategori: [
      {
        id: "varia-topik-1",
        nama: "Topik 1: Edisi Terbaru",
        modul: [
          { id: "modul-varia-statistik", judul: "Varia Statistik (Bacaan Keluarga BPS)", deskripsi: "Berbagai artikel ringan dan bacaan informatif seputar dunia statistik untuk keluarga besar BPS.", ukuran: `${randomFloat(4, 9)} MB`, hits: randomInt(150, 500), fileName: "modul_varia_statistik.pdf", slug: "varia-statistik-bacaan-keluarga-bps" },
        ],
      },
    ],
  },
  {
    id: "reformasi-birokrasi",
    namaTampil: "Reformasi Birokrasi",
    tahun: 2023,
    subKategori: [
      {
        id: "rb-topik-1",
        nama: "Topik 1: Panduan & Implementasi",
        modul: [
          { id: "modul-dasar-rb", judul: "Dasar-Dasar Reformasi Birokrasi", deskripsi: "Konsep dan prinsip reformasi birokrasi di instansi pemerintah.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(100, 300), fileName: "modul_dasar_rb.pdf", slug: "dasar-reformasi-birokrasi" },
          { id: "modul-implementasi-rb", judul: "Implementasi Reformasi Birokrasi di BPS", deskripsi: "Langkah-langkah dan studi kasus pelaksanaan reformasi birokrasi di lingkungan BPS.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(100, 300), fileName: "modul_implementasi_rb.pdf", slug: "implementasi-reformasi-birokrasi-bps" },
        ],
      },
    ],
  },
  {
    id: "regulasi",
    namaTampil: "Regulasi",
    tahun: 2023,
    subKategori: [
      {
        id: "regulasi-topik-1",
        nama: "Topik 1: Hukum & Peraturan",
        modul: [
          { id: "modul-uu-statistik", judul: "Undang-Undang Statistik No. 16 Tahun 1997", deskripsi: "Teks lengkap dan penjelasan regulasi dasar yang mengatur penyelenggaraan statistik nasional.", ukuran: `${randomFloat(1, 4)} MB`, hits: randomInt(1000, 3000), fileName: "modul_uu_statistik.pdf", slug: "undang-undang-statistik" },
        ],
      },
    ],
  },
];