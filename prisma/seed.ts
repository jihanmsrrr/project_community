

// Helper function to generate plausible dummy data for users


// Data modul dari src/data/modulData.ts yang Anda berikan
interface ModulDataInterface {
  id: string;
  judul: string;
  deskripsi: string;
  ukuran: string;
  hits: number;
  fileName: string;
  slug: string;
}

interface SubKategoriInterface {
  id: string;
  nama: string;
  modul: ModulDataInterface[];
}

interface KategoriInterface {
  id: string;
  namaTampil: string;
  tahun: number;
  subKategori: SubKategoriInterface[];
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);

export const modulData: KategoriInterface[] = [
  {
    id: "pembinaan-statistik",
    namaTampil: "Pembinaan Statistik", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "pembinaan-topik-1",
        nama: "Dasar Penyelenggaraan Statistik", // Sesuai gambar "Pembinaan Statistik"
        modul: [
          { id: "modul-tata-laksana", judul: "Tata Laksana Penyelenggaraan Statistik", deskripsi: "Panduan lengkap tata laksana penyelenggaraan statistik sesuai standar BPS.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "Modul 1. Tata Laksana Penyelenggaraan Statistik.pdf", slug: "tata-laksana-penyelenggaraan-statistik" },
          { id: "modul-langkah-praktis", judul: "Langkah Praktis dalam Survei dan Kompromin", deskripsi: "Teknik praktis yang diterapkan dalam survei serta koordinasi pemasaran dan informasi.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "Modul 2. Langkah Praktis dalam Survei dan Kompromin.pdf", slug: "langkah-praktis-survei-kompromin" },
          { id: "modul-aplikasi-statistik", judul: "Aplikasi Penyelenggaraan Statistik", deskripsi: "Modul tentang aplikasi yang digunakan dalam penyelenggaraan statistik.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(300, 1000), fileName: "Modul 3. Aplikasi Penyelenggaraan Statistik.pdf", slug: "aplikasi-penyelenggaraan-statistik" },
          { id: "modul-dasar-statistik", judul: "Dasar-dasar Statistik", deskripsi: "Modul pengantar mengenai dasar-dasar ilmu statistik.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(700, 2000), fileName: "Modul 4. Dasar-dasar Statistik.pdf", slug: "dasar-dasar-statistik" },
        ],
      },
      {
        id: "pembinaan-topik-2",
        nama: "Teknik Lanjutan",
        modul: [
          { id: "modul-teknik-sampling", judul: "Teknik Sampling dan Pengolahan Data", deskripsi: "Penjelasan lengkap teknik sampling dan pengolahan data untuk hasil statistik yang valid.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "modul_teknik_sampling.pdf", slug: "teknik-sampling-pengolahan-data" },
        ],
      },
    ],
  },
  {
    id: "metodologi-sensus-survei",
    namaTampil: "Kumpulan Metodologi Sensus dan Survei", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "metodologi-topik-1",
        nama: "Kerangka Kerja", // Sesuai gambar "Kumpulan Metodologi Sensus dan Survei"
        modul: [
          { id: "modul-metode-sensus", judul: "Metode Sensus dan Survei Terpadu", deskripsi: "Panduan metodologi sensus dan survei terpadu terbaru.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(200, 700), fileName: "modul_metode_sensus.pdf", slug: "metode-sensus-survei-terpadu" },
          { id: "modul-teknik-pengolahan-sensus", judul: "Teknik Pengolahan Data Sensus", deskripsi: "Teknik pengolahan dan validasi data hasil sensus.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(200, 700), fileName: "modul_pengolahan_sensus.pdf", slug: "teknik-pengolahan-data-sensus" },
        ],
      },
    ],
  },
  {
    id: "paparan",
    namaTampil: "Paparan", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "paparan-topik-1",
        nama: "Indikator Strategis", // Sesuai gambar "Paparan"
        modul: [
          { id: "modul-paparan-hasil", judul: "Paparan Hasil Survei Nasional Triwulan I", deskripsi: "Paparan lengkap hasil survei nasional terbaru yang disampaikan oleh Kepala BPS.", ukuran: `${randomFloat(2, 5)} MB`, hits: randomInt(100, 400), fileName: "modul_paparan_hasil.pdf", slug: "paparan-hasil-survei-nasional" },
          { id: "paparan-fdg-komisi-xi", judul: "20161004 FGD BPS dengan Komisi XI DPR RI", deskripsi: "Materi Fokus Group Discussion BPS dengan Komisi XI DPR RI.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(100, 300), fileName: "20161004 FGD BPS denganKomisi XI DPR RI.pptx", slug: "fgd-bps-komisi-xi-dpr-ri" },
          { id: "paparan-ntt-satu-data", judul: "20161116 NTT Launching Satu Data Final", deskripsi: "Paparan final peluncuran Satu Data di NTT.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(100, 300), fileName: "20161116 NTT Launching Satu Data_Final.pptx", slug: "ntt-launching-satu-data-final" },
          { id: "paparan-indikator-kalsel", judul: "Indikator Pembangunan Kalsel Nov 2016", deskripsi: "Indikator pembangunan Kalimantan Selatan per November 2016.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(100, 300), fileName: "Indikator Pembangunan Kalsel Nov 2016.pptx", slug: "indikator-pembangunan-kalsel-nov-2016" },
          { id: "paparan-pulang-pisau-bpbd", judul: "Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau", deskripsi: "Paparan BPS Kabupaten Pulang Pisau untuk BPBD.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(100, 300), fileName: "Paparan BPS Pulang Pisau untuk BPBD Kab. Pulang Pisau.pptx", slug: "paparan-bps-pulang-pisau-bpbd" },
        ],
      },
    ],
  },
  {
    id: "kompetisi-inovasi",
    namaTampil: "Kompetisi Inovasi", // TETAP
    tahun: 2023,
    subKategori: [
      {
        id: "kompetisi-topik-1",
        nama: "Panduan", // Sesuai gambar "Kompetisi Inovasi"
        modul: [
          { id: "modul-panduan-kompetisi", judul: "Panduan Kompetisi Inovasi BPS 2024", deskripsi: "Peraturan dan panduan lengkap untuk kompetisi inovasi (INOBERS) BPS.", ukuran: `${randomFloat(2, 5)} MB`, hits: randomInt(100, 400), fileName: "modul_panduan_kompetisi.pdf", slug: "panduan-kompetisi-inovasi-bps-2024" },
          { id: "ide-proposal", judul: "Ide dan Proposal Inovasi", deskripsi: "Cara menyiapkan ide dan proposal inovasi untuk kompetisi.", ukuran: `${randomFloat(4, 8)} MB`, hits: randomInt(100, 300), fileName: "ide-proposal.pdf", slug: "ide-dan-proposal-inovasi" },
        ],
      },
    ],
  },
  {
    id: "monitoring-evaluasi",
    namaTampil: "Monitoring dan Evaluasi", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "monev-topik-1",
        nama: "Metodologi & Pelaporan", // Sesuai gambar "Monitoring dan Evaluasi"
        modul: [
          { id: "modul-metodologi-monev", judul: "Metodologi Monitoring dan Evaluasi Program", deskripsi: "Pendekatan dan teknik monitoring dan evaluasi program statistik.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(150, 300), fileName: "metodologi-monev.pdf", slug: "metodologi-monitoring-evaluasi" },
          { id: "modul-evaluasi-aktivitas-bps", judul: "Evaluasi Aktivitas Internal BPS", deskripsi: "Monitoring dan evaluasi aktivitas serta kinerja internal BPS secara menyeluruh.", ukuran: `${randomFloat(5, 10)} MB`, hits: randomInt(150, 300), fileName: "evaluasi-aktivitas-internal.pdf", slug: "evaluasi-aktivitas-internal-bps" },
        ],
      },
    ],
  },
  {
    id: "standar-biaya",
    namaTampil: "Standar Biaya", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "standar-biaya-topik-1",
        nama: "SBM & Operasional", // Sesuai gambar "Standar Biaya"
        modul: [
          { id: "modul-sbm", judul: "Standar Biaya Masukan (SBM) Tahun Anggaran 2023", deskripsi: "Dokumen resmi terkait standar biaya masukan untuk kegiatan.", ukuran: `${randomFloat(3, 6)} MB`, hits: randomInt(800, 2000), fileName: "modul_sbm_2023.pdf", slug: "standar-biaya-masukan-2023" },
        ],
      },
    ],
  },
  {
    id: "akuntabilitas-kinerja",
    namaTampil: "Akuntabilitas Kinerja", // Sesuai gambar
    tahun: 2024,
    subKategori: [
      {
        id: "akuntabilitas-topik-1",
        nama: "Kinerja & Pelaporan", // Sesuai gambar "Akuntabilitas Kinerja"
        modul: [
          { id: "modul-dasar-akuntabilitas", judul: "Dasar-dasar Akuntabilitas Kinerja", deskripsi: "Pengertian dan prinsip utama sistem akuntabilitas kinerja di instansi pemerintah.", ukuran: `${randomFloat(4, 8)} MB`, hits: randomInt(200, 500), fileName: "dasar-akuntabilitas.pdf", slug: "dasar-akuntabilitas-kinerja" },
          { id: "modul-pengukuran-kinerja", judul: "Pengukuran dan Evaluasi Kinerja", deskripsi: "Metode dan indikator pengukuran kinerja yang tepat untuk akuntabilitas.", ukuran: `${randomFloat(4, 8)} MB`, hits: randomInt(190, 400), fileName: "pengukuran-kinerja.pdf", slug: "pengukuran-dan-evaluasi-kinerja" },
        ],
      },
    ],
  },
  {
    id: "diseminasi-statistik",
    namaTampil: "Pengetahuan tentang Diseminasi", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "diseminasi-topik-1",
        nama: "Strategi & Praktik", // Sesuai gambar "Pengetahuan tentang Diseminasi"
        modul: [
          { id: "modul-strategi-diseminasi", judul: "Strategi Diseminasi Statistik Digital", deskripsi: "Strategi diseminasi dan publikasi hasil statistik ke publik secara efektif melalui kanal digital.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(150, 450), fileName: "modul_strategi_diseminasi.pdf", slug: "strategi-diseminasi-statistik-digital" },
        ],
      },
    ],
  },
  {
    id: "leadership-manajemen",
    namaTampil: "Leadership Training", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "leadership-topik-1",
        nama: "Pelatihan Kepemimpinan", // Sesuai gambar "Leadership Training"
        modul: [
          { id: "modul-leadership-training", judul: "Materi Pelatihan Kepemimpinan Statistik", deskripsi: "Kumpulan materi pelatihan dan pengembangan kepemimpinan bagi staf statistik.", ukuran: `${randomFloat(5, 12)} MB`, hits: randomInt(100, 300), fileName: "modul_leadership_training.pdf", slug: "pelatihan-kepemimpinan-statistik" },
          { id: "modul-leading-nso", judul: "Best Practices: Leading National Statistics Office", deskripsi: "Studi kasus dan strategi efektif dalam memimpin kantor statistik nasional di era modern.", ukuran: `${randomFloat(5, 12)} MB`, hits: randomInt(100, 300), fileName: "modul_leading_nso.pdf", slug: "best-practices-leading-nso" },
        ],
      },
    ],
  },
  {
    id: "asistensi-teknis",
    namaTampil: "Technical Assistance", // Sesuai gambar
    tahun: 2024,
    subKategori: [
      {
        id: "asistensi-topik-1",
        nama: "Bantuan Teknis", // Sesuai gambar "Technical Assistance"
        modul: [
          { id: "modul-ta-abs", judul: "Technical Assistance ABS", deskripsi: "Dokumentasi dan materi bantuan teknis untuk pelaksanaan statistik berbasis sampel (ABS).", ukuran: `${randomFloat(3, 6)} MB`, hits: randomInt(100, 250), fileName: "modul_ta_abs.pdf", slug: "technical-assistance-abs" },
        ],
      },
    ],
  },
  {
    id: "seminar-pelayanan-publik",
    namaTampil: "Seminar Pelayanan Publik", // TETAP
    tahun: 2024,
    subKategori: [
      {
        id: "seminar-topik-1",
        nama: "Materi Seminar", // Sesuai gambar "Seminar Pelayanan Publik"
        modul: [
          { id: "modul-seminar-publik", judul: "Materi Seminar Pelayanan Publik", deskripsi: "Materi dan laporan dari seminar pelayanan publik terbaru yang diselenggarakan oleh BPS.", ukuran: `${randomFloat(5, 15)} MB`, hits: randomInt(100, 200), fileName: "modul_seminar_publik.pdf", slug: "seminar-pelayanan-publik" },
        ],
      },
    ],
  },
  {
    id: "varia-statistik",
    namaTampil: "Varia Statistik", // TETAP
    tahun: 2023,
    subKategori: [
      {
        id: "varia-topik-1",
        nama: "Bacaan Keluarga BPS", // Sesuai gambar "Varia Statistik"
        modul: [
          { id: "modul-varia-statistik", judul: "Varia Statistik (Bacaan Keluarga BPS)", deskripsi: "Berbagai artikel ringan dan bacaan informatif seputar dunia statistik untuk keluarga besar BPS.", ukuran: `${randomFloat(4, 9)} MB`, hits: randomInt(150, 500), fileName: "modul_varia_statistik.pdf", slug: "varia-statistik-bacaan-keluarga-bps" },
        ],
      },
    ],
  },
  {
    id: "reformasi-birokrasi",
    namaTampil: "Reformasi Birokrasi", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "rb-topik-1",
        nama: "Panduan & Implementasi", // Sesuai gambar "Reformasi Birokrasi"
        modul: [
          { id: "modul-dasar-rb", judul: "Dasar-Dasar Reformasi Birokrasi", deskripsi: "Konsep dan prinsip reformasi birokrasi di instansi pemerintah.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(100, 300), fileName: "modul_dasar_rb.pdf", slug: "dasar-reformasi-birokrasi" },
          { id: "modul-implementasi-rb", judul: "Implementasi Reformasi Birokrasi di BPS", deskripsi: "Langkah-langkah dan studi kasus pelaksanaan reformasi birokrasi di lingkungan BPS.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(100, 300), fileName: "modul_implementasi_rb.pdf", slug: "implementasi-reformasi-birokrasi-bps" },
        ],
      },
    ],
  },
  {
    id: "regulasi",
    namaTampil: "Regulasi", // Sesuai gambar
    tahun: 2023,
    subKategori: [
      {
        id: "regulasi-topik-1",
        nama: "Hukum & Peraturan", // Sesuai gambar "Regulasi"
        modul: [
          { id: "modul-uu-statistik", judul: "Undang-Undang Statistik No. 16 Tahun 1997", deskripsi: "Teks lengkap dan penjelasan regulasi dasar yang mengatur penyelenggaraan statistik nasional.", ukuran: `${randomFloat(1, 4)} MB`, hits: randomInt(1000, 3000), fileName: "modul_uu_statistik.pdf", slug: "undang-undang-statistik" },
        ],
      },
    ],
  },
];
