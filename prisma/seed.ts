import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate plausible dummy data for users
interface UserData {
    user_id: number;
    nama_lengkap: string;
    nip_baru: string;
    nip_lama: string;
    email: string;
    unit_kerja_id: number | null;
    role: string;
    sso_id: string;
    foto_url: string | null;
    tempat_lahir: string;
    tanggal_lahir: Date;
    jenis_kelamin: string;
    status_kepegawaian: string;
    tmt_pns: Date;
    pangkat_golongan: string;
    tmt_pangkat_golongan: Date;
    jabatan_struktural: string;
    jenjang_jabatan_fungsional: string;
    tmt_jabatan: Date;
    pendidikan_terakhir: string;
    masa_kerja_golongan: string;
    masa_kerja_total: string;
    tanggal_pensiun: Date;
    sisa_masa_kerja: string;
    grade: string;
    unit_kerja_eselon1: string;
    unit_kerja_eselon2: string;
    username: string;
    password: string;
}

function generateUserData(id: number, namaLengkap: string, nipBaru: string, email: string, role: string): UserData {
    const cleanedNip = nipBaru.replace(/[^0-9]/g, '');
    const tanggalLahirStr = cleanedNip.substring(0, 8);
    const tmtPnsStr = cleanedNip.substring(8, 14);

    const yearLahir = parseInt(tanggalLahirStr.substring(0, 4));
    const monthLahir = parseInt(tanggalLahirStr.substring(4, 6)) - 1;
    const dayLahir = parseInt(tanggalLahirStr.substring(6, 8));
    const tanggal_lahir = new Date(yearLahir, monthLahir, dayLahir);

    const yearTmtPns = parseInt(tmtPnsStr.substring(0, 4));
    const monthTmtPns = parseInt(tmtPnsStr.substring(4, 6)) - 1;
    const tmt_pns = new Date(yearTmtPns, monthTmtPns, 1);

    const genders = ['Laki-laki', 'Perempuan'];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];

    const pendidikan = ['S1', 'S2', 'S3', 'D3', 'SMA'];
    const randomPendidikan = pendidikan[Math.floor(Math.random() * pendidikan.length)];

    const grades = ['A', 'B', 'C', 'D'];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];

    return {
        user_id: id,
        nama_lengkap: namaLengkap,
        nip_baru: nipBaru,
        nip_lama: `${cleanedNip.substring(0, 10)}`,
        email: email,
        unit_kerja_id: null,
        role: role,
        sso_id: `sso-${Math.random().toString(36).substring(2, 15)}`,
        foto_url: null,
        tempat_lahir: 'Jakarta',
        tanggal_lahir: tanggal_lahir,
        jenis_kelamin: randomGender,
        status_kepegawaian: 'PNS',
        tmt_pns: tmt_pns,
        pangkat_golongan: 'Pembina Tk. I, III/b',
        tmt_pangkat_golongan: new Date(yearTmtPns + 5, monthTmtPns, 1),
        jabatan_struktural: 'Kepala Bagian',
        jenjang_jabatan_fungsional: 'Pranata Komputer Madya',
        tmt_jabatan: new Date(yearTmtPns + 7, monthTmtPns, 1),
        pendidikan_terakhir: randomPendidikan,
        masa_kerja_golongan: '10 Tahun',
        masa_kerja_total: '20 Tahun',
        tanggal_pensiun: new Date(yearLahir + 58, monthLahir, dayLahir),
        sisa_masa_kerja: '5 Tahun',
        grade: randomGrade,
        unit_kerja_eselon1: 'Sekretariat Utama',
        unit_kerja_eselon2: 'Biro Hubungan Masyarakat dan Hukum',
        username: email.split('@')[0],
        password: 'password123',
    };
}

// Data modul dari src/data/modulData.ts yang Anda berikan
interface ModulDataInterface {
  id: string;
  judul: string;
  deskripsi: string;
  ukuran: string;
  hits: number;
  fileName: string; // Ini yang akan kita sesuaikan
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

const modulData: KategoriInterface[] = [
  {
    id: "pembinaan-statistik",
    namaTampil: "Pembinaan Statistik",
    tahun: 2023,
    subKategori: [
      {
        id: "pembinaan-topik-1",
        nama: "Topik 1: Dasar Penyelenggaraan Statistik",
        modul: [
          // FILE PDF DARI SCREENSHOT
          { id: "modul-tata-laksana", judul: "Tata Laksana Penyelenggaraan Statistik", deskripsi: "Panduan lengkap tata laksana penyelenggaraan statistik sesuai standar BPS.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "Modul 1. Tata Laksana Penyelenggaraan Statistik.pdf", slug: "tata-laksana-penyelenggaraan-statistik" },
          { id: "modul-langkah-praktis", judul: "Langkah Praktis dalam Survei dan Kompromin", deskripsi: "Teknik praktis yang diterapkan dalam survei serta koordinasi pemasaran dan informasi.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(500, 1500), fileName: "Modul 2. Langkah Praktis dalam Survei dan Kompromin.pdf", slug: "langkah-praktis-survei-kompromin" },
          // MODUL 3 & 4 DARI SCREENSHOT (Tambahan)
          { id: "modul-aplikasi-statistik", judul: "Aplikasi Penyelenggaraan Statistik", deskripsi: "Modul tentang aplikasi yang digunakan dalam penyelenggaraan statistik.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(300, 1000), fileName: "Modul 3. Aplikasi Penyelenggaraan Statistik.pdf", slug: "aplikasi-penyelenggaraan-statistik" },
          { id: "modul-dasar-statistik", judul: "Dasar-dasar Statistik", deskripsi: "Modul pengantar mengenai dasar-dasar ilmu statistik.", ukuran: `${randomFloat(3, 7)} MB`, hits: randomInt(700, 2000), fileName: "Modul 4. Dasar-dasar Statistik.pdf", slug: "dasar-dasar-statistik" },
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
          // FILE PPTX DARI SCREENSHOT
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


async function main() {
  console.log('🌱 Memulai proses seeding data...');

  // 1. Seed Data Users (Pengguna) Terlebih Dahulu
  console.log('👥 Memulai seeding data pengguna (users)...');
  const usersToSeed = [
    generateUserData(1, 'Arianto S.Si., SE., M.Si', '196911091991011001', 'arianto@bps.go.id', 'admin'),
    generateUserData(2, 'Siti Nurdjannah SST', '197012191993122001', 'snurdjan@bps.go.id', 'admin'),
    generateUserData(3, 'Siti Nur Laelatul Badriyah SE.AK, M.Si, CA', '197607182011012003', 'sitinurlaela@bps.go.id', 'user'),
    generateUserData(4, 'Achmad Muchlis Abdi Putra SST., MT', '198610142009021001', 'achmadmuchlis@bps.go.id', 'user'),
    generateUserData(5, 'Mohamad Rivani S.IP, M.M.', '198103042006041001', 'mohamad.rivani@bps.go.id', 'user'),
    generateUserData(6, 'Andri Saleh S.Si, M.I.Kom.', '198005162009021006', 'andris@bps.go.id', 'user'),
    generateUserData(7, 'Muhammad Haikal Candra S.Tr.Ds.', '199812162025061004', 'haikal.candra@bps.go.id', 'user'),
    generateUserData(8, 'Bagus Ardiansyah S.Tr.Stat.', '199605282019121001', 'bagus.ardi@bps.go.id', 'user'),
    generateUserData(9, 'Aliyah Salsabila Hakim S.Hum.', '200108122025062004', 'aliyah.salsabila@bps.go.id', 'user'),
    generateUserData(10, 'Dira Afiani S.S.', '200009302025062005', 'dira.afiani@bps.go.id', 'user'),
    generateUserData(11, 'Aina Sabedah Fitri S.Si, MSE', '197709101999122001', 'aina@bps.go.id', 'user'),
  ];

  for (const user of usersToSeed) {
    await prisma.users.upsert({
      where: { user_id: BigInt(user.user_id) },
      update: {
        nama_lengkap: user.nama_lengkap,
        nip_baru: user.nip_baru,
        nip_lama: user.nip_lama,
        email: user.email,
        unit_kerja_id: user.unit_kerja_id,
        role: user.role,
        sso_id: user.sso_id,
        foto_url: user.foto_url,
        tempat_lahir: user.tempat_lahir,
        tanggal_lahir: user.tanggal_lahir,
        jenis_kelamin: user.jenis_kelamin,
        status_kepegawaian: user.status_kepegawaian,
        tmt_pns: user.tmt_pns,
        pangkat_golongan: user.pangkat_golongan,
        tmt_pangkat_golongan: new Date(user.tmt_pangkat_golongan),
        jabatan_struktural: user.jabatan_struktural,
        jenjang_jabatan_fungsional: user.jenjang_jabatan_fungsional,
        tmt_jabatan: new Date(user.tmt_jabatan),
        pendidikan_terakhir: user.pendidikan_terakhir,
        masa_kerja_golongan: user.masa_kerja_golongan,
        masa_kerja_total: user.masa_kerja_total,
        tanggal_pensiun: new Date(user.tanggal_pensiun),
        sisa_masa_kerja: user.sisa_masa_kerja,
        grade: user.grade,
        unit_kerja_eselon1: user.unit_kerja_eselon1,
        unit_kerja_eselon2: user.unit_kerja_eselon2,
        username: user.username,
        password: user.password,
      },
      create: {
        user_id: BigInt(user.user_id),
        nama_lengkap: user.nama_lengkap,
        sso_id: user.sso_id, // sso_id harus unik jika tidak null
        // Pastikan field-field unik lainnya (seperti nip_baru dan email) hanya di-set saat create atau di-handle dengan benar di upsert
        nip_baru: user.nip_baru,
        nip_lama: user.nip_lama,
        email: user.email,
        unit_kerja_id: user.unit_kerja_id,
        role: user.role,
        foto_url: user.foto_url,
        tempat_lahir: user.tempat_lahir,
        tanggal_lahir: user.tanggal_lahir,
        jenis_kelamin: user.jenis_kelamin,
        status_kepegawaian: user.status_kepegawaian,
        tmt_pns: user.tmt_pns,
        pangkat_golongan: user.pangkat_golongan,
        tmt_pangkat_golongan: new Date(user.tmt_pangkat_golongan),
        jabatan_struktural: user.jabatan_struktural,
        jenjang_jabatan_fungsional: user.jenjang_jabatan_fungsional,
        tmt_jabatan: new Date(user.tmt_jabatan),
        pendidikan_terakhir: user.pendidikan_terakhir,
        masa_kerja_golongan: user.masa_kerja_golongan,
        masa_kerja_total: user.masa_kerja_total,
        tanggal_pensiun: new Date(user.tanggal_pensiun),
        sisa_masa_kerja: user.sisa_masa_kerja,
        grade: user.grade,
        unit_kerja_eselon1: user.unit_kerja_eselon1,
        unit_kerja_eselon2: user.unit_kerja_eselon2,
        username: user.username,
        password: user.password,
      },
    });
    console.log(`✅ Pengguna dengan ID ${user.user_id} (${user.nama_lengkap}) berhasil ditambahkan atau diperbarui.`);
  }
  console.log('👥 Seeding data pengguna selesai.');


  // 3. Seed Data Reading Materials dari modulData.ts
  console.log('📚 Memulai seeding data materi bacaan (reading_materials) dari modulData...');
  let materialIdCounter = 1; // Untuk ID material yang berurutan
  const allReadingMaterials = [];
  const uploaderIds = usersToSeed.map(u => u.user_id); // Ambil ID uploader yang valid

  for (const kategori of modulData) {
    for (const subKategori of kategori.subKategori) {
      for (const modul of subKategori.modul) {
        // Pilih uploader_id secara acak dari yang sudah ada (1-11)
        const randomUploaderId = uploaderIds[Math.floor(Math.random() * uploaderIds.length)];

        allReadingMaterials.push({
          material_id: materialIdCounter++, // ID unik
          judul: modul.judul,
          kategori: kategori.namaTampil, // Nama kategori utama
          sub_kategori: subKategori.nama, // Nama sub-kategori
          deskripsi: modul.deskripsi,
          file_path: modul.fileName, // Gunakan fileName yang sudah diperbarui
          uploader_id: randomUploaderId,
          // Tanggal upload diatur ke 15 hari setelah kategori.tahun
          tanggal_upload: new Date(`${kategori.tahun}-01-15T10:00:00Z`),
          hits: modul.hits,
        });
      }
    }
  }

  for (const material of allReadingMaterials) {
    await prisma.reading_materials.upsert({
      where: { material_id: BigInt(material.material_id) },
      update: {
        judul: material.judul,
        kategori: material.kategori,
        sub_kategori: material.sub_kategori, // Pastikan ini juga di-update
        deskripsi: material.deskripsi,
        file_path: material.file_path,
        uploader_id: BigInt(material.uploader_id),
        tanggal_upload: material.tanggal_upload,
        hits: material.hits,
      },
      create: {
        material_id: BigInt(material.material_id),
        judul: material.judul,
        kategori: material.kategori,
        sub_kategori: material.sub_kategori, // Pastikan ini juga di-create
        deskripsi: material.deskripsi,
        file_path: material.file_path,
        uploader_id: BigInt(material.uploader_id),
        tanggal_upload: material.tanggal_upload,
        hits: material.hits,
      },
    });
    console.log(`✅ Materi Bacaan dengan ID ${material.material_id} (${material.judul}) berhasil ditambahkan atau diperbarui.`);
  }
  console.log('📚 Seeding data materi bacaan selesai.');


  // 5. Seed Data News (Berita)
  console.log('📰 Memulai seeding data berita...');
  const beritaYangAkanDitambahkan = [
    {
      id: 1750131465170,
      judul: "Coba Pakai User Jihan",
      kategori: "Berita Daerah",
      kataKunci: ["coba", "user"],
      abstrak: "Ini adalah berita percobaan yang dibuat oleh user jihan.",
      isiBerita: "<p>Detail berita percobaan user jihan. Isi ini bisa sangat panjang dengan HTML.</p>",
      status: "pending_review",
      namaPenulis: "Siti Nur Laelatul Badriyah SE.AK, M.Si, CA",
      gambarFiles: [],
      savedAt: 1750131465170,
      penulisId: 3
    },
    {
      id: 1750089575502,
      judul: "Lorem Ipsum is Simply Dummy",
      kategori: "Serba Serbi",
      kataKunci: ["lorem", "dummy"],
      abstrak: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      isiBerita: "<p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>",
      status: "pending_review",
      namaPenulis: "Arianto S.Si., SE., M.Si",
      gambarFiles: [],
      savedAt: 1750089575502,
      penulisId: 1
    },
    {
      id: 1747973892973,
      judul: "Format Upload Berita Baru",
      kategori: "Berita Daerah",
      kataKunci: ["format", "upload"],
      abstrak: "Penjelasan mengenai format upload berita terbaru.",
      isiBerita: "<p>Dokumentasi teknis tentang bagaimana mengunggah berita dengan format yang benar.</p>",
      status: "pending_review",
      namaPenulis: "Siti Nur Laelatul Badriyah SE.AK, M.Si, CA",
      gambarFiles: [],
      savedAt: 1747973892973,
      penulisId: 3
    },
    {
      id: 1748860800000,
      judul: "Rilis Indikator Strategis Juni 2025",
      kategori: "BPS Terkini",
      kataKunci: ["inflasi", "ekspor", "impor", "pertumbuhan"],
      abstrak: "BPS merilis data indikator strategis terbaru untuk bulan Juni 2025, mencakup inflasi, nilai tukar petani, dan pariwisata.",
      isiBerita: "<p>Detail data dan analisis mengenai inflasi, nilai tukar petani, dan sektor pariwata.</p>",
      status: "published",
      gambarFiles: [
        {
          "originalFilename": "bps-rilis-juni.jpg",
          "mimetype": "image/jpeg",
          "size": 120000,
          "url": "https://placehold.co/1200x800/012B6A/FFFFFF?text=Rilis+BPS+Juni+2025"
        }
      ],
      savedAt: 1748860800000,
      namaPenulis: "Arianto S.Si., SE., M.Si",
      penulisId: 1
    },
    {
      id: 1747974000001,
      judul: "Peluncuran Survei Ekonomi Nasional 2026",
      kategori: "BPS Terkini",
      kataKunci: ["survei", "ekonomi", "nasional"],
      abstrak: "BPS secara resmi meluncurkan pelaksanaan Survei Ekonomi Nasional (SEN) 2026 untuk mendapatkan data ekonomi yang komprehensif.",
      isiBerita: "<p>Informasi detail mengenai metodologi, cakupan, dan jadwal pelaksanaan SEN 2026.</p>",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/1200x800/0284C7/FFFFFF?text=SEN+2026"
        }
      ],
      savedAt: 1747974000001,
      namaPenulis: "Siti Nurdjannah SST",
      penulisId: 2
    },
    {
      id: 1748774400000,
      judul: "Pertumbuhan Ekonomi Jawa Barat Triwulan II 2025",
      kategori: "Berita Daerah",
      kataKunci: ["jawa barat", "ekonomi", "pertumbuhan"],
      abstrak: "Analisis pertumbuhan ekonomi Provinsi Jawa Barat pada triwulan kedua tahun 2025 menunjukkan tren positif.",
      isiBerita: "Detail data dan faktor-faktor yang mempengaruhi pertumbuhan ekonomi di Jawa Barat.",
      status: "published",
      gambarFiles: [
        {
          "originalFilename": "jabar-ekonomi.png",
          "mimetype": "image/png",
          "size": 95000,
          "url": "https://placehold.co/800x500/10B981/FFFFFF?text=Ekonomi+Jawa+Barat"
        }
      ],
      savedAt: 1748774400000,
      namaPenulis: "Achmad Muchlis Abdi Putra SST., MT",
      penulisId: 4
    },
    {
      id: 1748688000000,
      judul: "Indeks Pembangunan Manusia di Papua Meningkat",
      kategori: "Berita Daerah",
      kataKunci: ["ipm", "papua", "pembangunan"],
      abstrak: "Laporan terkini menunjukkan adanya peningkatan signifikan pada Indeks Pembangunan Manusia (IPM) di Provinsi Papua.",
      isiBerita: "Data IPM terbaru Papua beserta analisis komponen pendidikan, kesehatan, dan standar hidup layak.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/600x400/059669/FFFFFF?text=IPM+Papua"
        }
      ],
      savedAt: 1748688000000,
      namaPenulis: "Mohamad Rivani S.IP, M.M.",
      penulisId: 5
    },
    {
      id: 1748601600000,
      judul: "Produksi Padi Sumatera Utara Capai Target",
      kategori: "Berita Daerah",
      kataKunci: ["sumut", "pertanian", "padi"],
      abstrak: "Petani di Sumatera Utara berhasil mencapai target produksi padi untuk musim tanam ini.",
      isiBerita: "Data produksi, tantangan, dan upaya pemerintah daerah dalam mendukung sektor pertanian.",
      status: "published",
      gambarFiles: [],
      savedAt: 1748601600000,
      namaPenulis: "Andri Saleh S.Si, M.I.Kom.",
      penulisId: 6
    },
    {
      id: 1748515200000,
      judul: "Serba Serbi: Sejarah Sensus Penduduk di Indonesia",
      kategori: "Serba Serbi",
      kataKunci: ["sensus", "sejarah", "penduduk"],
      abstrak: "Menilik kembali perjalanan sensus penduduk di Indonesia dari masa ke masa.",
      isiBerita: "Fakta-fakta menarik dan perubahan metodologi sensus penduduk sepanjang sejarah.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/600x400/3B82F6/FFFFFF?text=Sejarah+Sensus"
        }
      ],
      savedAt: 1748515200000,
      namaPenulis: "Muhammad Haikal Candra S.Tr.Ds.",
      penulisId: 7
    },
    {
      id: 1748428800000,
      judul: "Infografis Unik: 10 Pekerjaan Paling Diminati",
      kategori: "Serba Serbi",
      kataKunci: ["infografis", "pekerjaan", "karir"],
      abstrak: "Visualisasi data mengenai 10 jenis pekerjaan yang paling banyak diminati di Indonesia saat ini.",
      isiBerita: "Data dan analisis tren pasar kerja berdasarkan survei terbaru.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/600x400/2563EB/FFFFFF?text=Top+10+Pekerjaan"
        }
      ],
      savedAt: 1748428800000,
      namaPenulis: "Bagus Ardiansyah S.Tr.Stat.",
      penulisId: 8
    },
    {
      id: 1748342400000,
      judul: "Quiz: Seberapa Paham Kamu Tentang Istilah Statistik?",
      kategori: "Serba Serbi",
      kataKunci: ["quiz", "statistik", "istilah"],
      abstrak: "Uji pemahamanmu mengenai istilah-istilah dasar dalam dunia statistik melalui kuis interaktif ini.",
      isiBerita: "Kumpulan pertanyaan dan jawaban seputar statistik.",
      status: "published",
      gambarFiles: [],
      savedAt: 1748342400000,
      namaPenulis: "Arianto S.Si., SE., M.Si",
      penulisId: 1
    },
    {
      id: 1748256000000,
      judul: "Fotogenik: Senyum Petugas Lapangan",
      kategori: "Fotogenik",
      kataKunci: ["petugas", "lapangan", "senyum"],
      abstrak: "Potret-potret humanis petugas sensus dan survei BPS saat bertugas di berbagai pelosok negeri.",
      isiBerita: "Kumpulan foto inspiratif yang menangkap dedikasi para insan statistik.",
      status: "published",
      gambarFiles: [
        {
          "originalFilename": "petugas-lapangan.jpg",
          "mimetype": "image/jpeg",
          "size": 78000,
          "url": "https://placehold.co/600x350/F59E0B/FFFFFF?text=Senyum+Petugas"
        }
      ],
      savedAt: 1748256000000,
      namaPenulis: "Siti Nur Laelatul Badriyah SE.AK, M.Si, CA",
      penulisId: 3
    },
    {
      id: 1748169600000,
      judul: "Fotogenik: Pasar Tradisional Penuh Warna",
      kategori: "Fotogenik",
      kataKunci: ["pasar", "tradisional", "warna"],
      abstrak: "Kehidupan pasar tradisional yang terekam dalam lensa.",
      isiBerita: "Foto-foto suasana pasar tradisional.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/600x350/D97706/FFFFFF?text=Pasar+Warna"
        }
      ],
      savedAt: 1748169600000,
      namaPenulis: "Achmad Muchlis Abdi Putra SST., MT",
      penulisId: 4
    },
    {
      id: 1748083200000,
      judul: "Fotogenik: Landmark Kota dalam Angka",
      kategori: "Fotogenik",
      kataKunci: ["landmark", "kota", "angka"],
      abstrak: "Visualisasi data yang disandingkan dengan foto-foto ikonik berbagai kota.",
      isiBerita: "Gabungan fotografi dan infografis.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/600x350/B45309/FFFFFF?text=Landmark+Data"
        }
      ],
      savedAt: 1748083200000,
      namaPenulis: "Mohamad Rivani S.IP, M.M.",
      penulisId: 5
    },
    {
      id: 1747996800000,
      judul: "Wisata Statistik: Mengunjungi Museum BPS",
      kategori: "Wisata",
      kataKunci: ["museum bps", "edukasi", "sejarah"],
      abstrak: "Panduan lengkap untuk berkunjung dan belajar di Museum BPS.",
      isiBerita: "Informasi jam buka, koleksi, dan kegiatan menarik di Museum BPS.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/400x225/EC4899/FFFFFF?text=Museum+BPS"
        }
      ],
      savedAt: 1747996800000,
      namaPenulis: "Andri Saleh S.Si, M.I.Kom.",
      penulisId: 6
    },
    {
      id: 1747910400000,
      judul: "Desa Cantik Statistik: Belajar Langsung dari Masyarakat",
      kategori: "Wisata",
      kataKunci: ["desa cantik", "komunitas", "data"],
      abstrak: "Menelusuri Desa Cinta Statistik (Desa Cantik).",
      isiBerita: "Profil desa-desa yang berhasil memanfaatkan data untuk pembangunan.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/400x225/DB2777/FFFFFF?text=Desa+Cantik"
        }
      ],
      savedAt: 1747910400000,
      namaPenulis: "Muhammad Haikal Candra S.Tr.Ds.",
      penulisId: 7
    },
    {
      id: 1747824000000,
      judul: "Wisata Data: Pameran Visualisasi Interaktif",
      kategori: "Wisata",
      kataKunci: ["pameran", "visualisasi", "interaktif"],
      abstrak: "Pameran visualisasi data interaktif yang akan hadir di kota Anda!",
      isiBerita: "Jadwal, lokasi, dan highlight dari pameran data.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/400x225/BE185D/FFFFFF?text=Pameran+Data"
        }
      ],
      savedAt: 1747824000000,
      namaPenulis: "Bagus Ardiansyah S.Tr.Stat.",
      penulisId: 8
    },
    {
      id: 1747737600000,
      judul: "Jelajah Kampus Statistik: STIS",
      kategori: "Wisata",
      kataKunci: ["stis", "kampus", "pendidikan"],
      abstrak: "Mengenal Politeknik Statistika STIS, tempat lahirnya para ahli statistik.",
      isiBerita: "Profil kampus, program studi, dan kehidupan mahasiswa STIS.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/400x225/9D174D/FFFFFF?text=Kampus+STIS"
        }
      ],
      savedAt: 1747737600000,
      namaPenulis: "Siti Nurdjannah SST",
      penulisId: 2
    },
    {
      id: 1747651200000,
      judul: "Opini: Pentingnya Literasi Data di Era Digital",
      kategori: "Opini",
      kataKunci: ["literasi data", "digital", "pendidikan"],
      abstrak: "Mengapa kemampuan membaca dan memahami data menjadi krusial di era digital?",
      isiBerita: "Pembahasan mendalam mengenai urgensi literasi data.",
      status: "published",
      gambarFiles: [],
      savedAt: 1747651200000,
      namaPenulis: "Siti Nur Laelatul Badriyah SE.AK, M.Si, CA",
      penulisId: 3
    },
    {
      id: 1747564800000,
      judul: "Opini: Big Data untuk Kebijakan Publik yang Lebih Baik",
      kategori: "Opini",
      kataKunci: ["big data", "kebijakan publik", "pemerintahan"],
      abstrak: "Bagaimana pemanfaatan big data dapat membantu pemerintah merumuskan kebijakan yang lebih efektif?",
      isiBerita: "Studi kasus dan potensi penerapan big data dalam pemerintahan.",
      status: "published",
      gambarFiles: [
        {
          "url": "https://placehold.co/600x400/7E22CE/FFFFFF?text=Big+Data+Opini"
        }
      ],
      savedAt: 1747564800000,
      namaPenulis: "Achmad Muchlis Abdi Putra SST., MT",
      penulisId: 4
    },
    {
      id: 1747478400000,
      judul: "Opini: Etika dalam Penggunaan Artificial Intelligence",
      kategori: "Opini",
      kataKunci: ["ai", "etika", "teknologi"],
      abstrak: "Menyoroti aspek etika yang perlu diperhatikan dalam pengembangan AI.",
      isiBerita: "Diskusi mengenai bias, privasi, dan tanggung jawab dalam penggunaan AI.",
      status: "published",
      gambarFiles: [],
      savedAt: 1747478400000,
      namaPenulis: "Mohamad Rivani S.IP, M.M.",
      penulisId: 5
    },
    {
      id: 1750131465171,
      judul: "Dukungan BPS untuk Prasasti Center for Policy Studies",
      kategori: "BPS Terkini",
      kataKunci: ["berita terbaru"],
      abstrak: "BPS menunjukkan komitmennya dalam mendukung penguatan ekosistem riset kebijakan publik melalui partisipasi aktif dalam peluncuran Prasasti Center for Policy Studies.",
      isiBerita: `Badan Pusat Statistik (BPS) menunjukkan komitmennya dalam mendukung penguatan ekosistem riset kebijakan publik melalui partisipasi aktif dalam peluncuran Prasasti Center for Policy Studies di Djakarta Theater (30/6). Prasasti merupakan lembaga independen yang berfokus pada kajian penelitian dan analisis kebijakan berbasis data, guna mendorong proses perumusan kebijakan yang lebih inklusif, adaptif, dan berdampak langsung kepada masyarakat.

Kehadiran BPS dalam acara ini menegaskan pentingnya sinergi antara lembaga statistik dan lembaga riset untuk mendorong kebijakan berbasis bukti (evidence-based policy) dan berbasis data (data-driven). Kepala BPS, Amalia Adininggar Widyasanti hadir dalam sesi diskusi panel di acara peluncuran tersebut. Amalia menekankan bahwa data statistik yang akurat dan terpercaya adalah fondasi utama dalam pengambilan keputusan publik yang efektif.

“BPS menyambut baik kehadiran Prasasti Research dan mendukung penuh dalam hal menganalisis dan menginterpretasi data menjadi rekomendasi kebijakan yang relevan,” ujar Amalia dalam diskusi panel. Sebagai narasumber, Amalia memaparkan terkait data sosial ekonomi termasuk tingkat pendidikan penduduk bekerja, karakteristik penduduk bekerja menurut lapangan usaha dan pendidikan terakhir, serta komposisi pekerja berdasarkan pendidikan di masing-masing sektor. Hal ini mempertegas adanya kontribusi BPS yang tidak hanya sebagai penyedia data, tetapi juga sebagai lembaga yang senantiasa berinovasi dalam membangun ekosistem data nasional yang terbuka dan kolaboratif.

“Prasasti hadir untuk memperkuat posisi Indonesia, berkontribusi pada perumusan kebijakan yang terarah, tepat sasaran, dan berdampak jangka panjang,” ungkap Hashim Djojohadikusumo, Board of Advisors Prasasti. Sinergi ini diharapkan menjadi tonggak penting dalam memperkuat tata kelola data nasional dan mempercepat tercapainya pembangunan yang berkelanjutan.`,
      status: "published",
      namaPenulis: "Dira Afiani S.S.",
      gambarFiles: [],
      savedAt: new Date(1656573600000),
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      penulisId: 10,
    },
  ];

  for (const berita of beritaYangAkanDitambahkan) {
    await prisma.news.upsert({
      where: { news_id: BigInt(berita.id) },
      update: {
        judul: berita.judul,
        kategori: berita.kategori,
        kata_kunci: berita.kataKunci,
        abstrak: berita.abstrak,
        isi_berita: berita.isiBerita,
        status: berita.status,
        nama_penulis: berita.namaPenulis,
        gambar_urls: berita.gambarFiles,
        savedAt: new Date(berita.savedAt),
        publishedAt: berita.publishedAt || (berita.status === 'published' ? new Date() : null),
        createdAt: berita.createdAt || new Date(),
        updatedAt: berita.updatedAt || new Date(),
        penulisId: BigInt(berita.penulisId),
      },
      create: {
        news_id: BigInt(berita.id),
        judul: berita.judul,
        kategori: berita.kategori,
        kata_kunci: berita.kataKunci,
        abstrak: berita.abstrak,
        isi_berita: berita.isiBerita,
        status: berita.status,
        nama_penulis: berita.namaPenulis,
        gambar_urls: berita.gambarFiles,
        savedAt: new Date(berita.savedAt),
        publishedAt: berita.publishedAt || (berita.status === 'published' ? new Date() : null),
        createdAt: berita.createdAt || new Date(),
        updatedAt: new Date(),
        penulisId: BigInt(berita.penulisId),
      },
    });
    console.log(`✅ Berita dengan ID ${berita.id} berhasil ditambahkan atau diperbarui.`);
  }

  console.log('🌱 Proses seeding data selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
