// types/pegawai.ts
import { Prisma } from '@prisma/client';

// Tipe untuk Pejabat (untuk StrukturOrganisasi)
// Ini adalah tipe untuk data kepala unit yang diambil dari relasi 'kepala' di organization_units.
export type Pejabat = {
  user_id: bigint;
  nama_lengkap: string | null;
  nip_baru: string | null;
  foto_url: string | null;
  // Jabatan struktural dari user, ini adalah sumber untuk property 'jabatan' di Pejabat Card
  jabatan_struktural: string | null;
};

// Tipe untuk detail Unit Organisasi yang disederhanakan (jika diselipkan dalam relasi lain)
export type OrganizationUnitDetail = Prisma.organization_unitsGetPayload<{
  select: {
    org_unit_id: true;
    nama_wilayah: true;
    kode_bps: true;
    nama_satker_bagian: true;
    alamat: true;
    telepon: true;
    web: true;
    nama_wilayah_singkat: true;
  }
}>;

// Tipe untuk Item Berita (digunakan di AggregatedUnitData untuk news feed)
// --- PERBAIKAN DI SINI ---
export type NewsItem = {
  id: string; // news.news_id
  title: string; // news.judul
  snippet: string; // news.abstrak
  date: string; // news.createdAt (dalam format ISO string)
  author: string; // news.penulis.nama_lengkap
  authorAvatar?: string | null; // news.penulis.foto_url
  link: string; // `/berita/${news.news_id}`
  source: string; // 'Internal Organisasi' atau 'Internal'
  penulis: { // Objek penulis yang dibutuhkan
    nama_lengkap: string | null;
    foto_url: string | null;
  };
};
// --- AKHIR PERBAIKAN ---

// Tipe untuk Riwayat Pendidikan
export type RiwayatPendidikanItem = Prisma.user_education_historyGetPayload<{
  select: {
    education_id: true;
    jenjang: true;
    nama_sekolah_institusi: true;
    jurusan: true;
    tahun_lulus: true;
    tanggal_ijazah: true;
  }
}>;

// Tipe untuk Riwayat Jabatan
export type RiwayatJabatanItem = Prisma.user_job_historyGetPayload<{
  select: {
    job_history_id: true;
    jabatan: true;
    unit_kerja: true;
    periode_mulai: true;
    periode_selesai: true;
    no_sk: true;
    tmt: true;
  }
}>;

// Tipe untuk Kompetensi
export type KompetensiItem = Prisma.user_competenciesGetPayload<{
  select: {
    competency_id: true;
    tanggal: true;
    nama_kompetensi: true;
    penyelenggara: true;
    nomor_sertifikat: true;
    berlaku_sampai: true;
  }
}>;

// Tipe untuk Prestasi
export type PrestasiItem = Prisma.user_achievementsGetPayload<{
  select: {
    achievement_id: true;
    tahun: true;
    nama_prestasi: true;
    tingkat: true;
    pemberi_penghargaan: true;
  }
}>;

// Tipe untuk Anggota Tim (digunakan di TimKerja)
export interface AnggotaTim {
  id: string;
  nama: string;
  posisi: string;
  nip?: string | null;
  fotoUrl?: string | null;
}

// Tipe untuk Tim Kerja (digunakan di AggregatedUnitData)
export interface TimKerja {
  id: string;
  namaTim: string;
  singkatan?: string | null;
  deskripsi?: string | null;
  ketuaTim: AnggotaTim;
  anggotaLain?: AnggotaTim[];
}


// --- DEFINISI TIPE UTAMA ---

// **1. DetailPegawaiData:** Tipe lengkap untuk DETAIL SATU PEGAWAI (dari model `users` dengan semua relasi).
// Digunakan di halaman detail pegawai (`/organisasi/pegawai/[nipBaru]`).
export type DetailPegawaiData = Prisma.usersGetPayload<{
  select: {
    user_id: true;
    nama_lengkap: true;
    nip_baru: true;
    nip_lama: true;
    email: true;
    unit_kerja_id: true;
    role: true;
    foto_url: true;
    tempat_lahir: true;
    tanggal_lahir: true;
    jenis_kelamin: true;
    status_kepegawaian: true;
    tmt_pns: true;
    pangkat_golongan: true;
    tmt_pangkat_golongan: true;
    jabatan_struktural: true;
    jenjang_jabatan_fungsional: true;
    tmt_jabatan: true;
    pendidikan_terakhir: true;
    masa_kerja_golongan: true;
    masa_kerja_total: true;
    tanggal_pensiun: true;
    sisa_masa_kerja: true;
    grade: true;
    unit_kerja_eselon1: true;
    unit_kerja_eselon2: true;
    username: true;

    riwayat_pendidikan: { select: { education_id: true; jenjang: true; nama_sekolah_institusi: true; jurusan: true; tahun_lulus: true; tanggal_ijazah: true; } };
    riwayat_jabatan: { select: { job_history_id: true; jabatan: true; unit_kerja: true; periode_mulai: true; periode_selesai: true; no_sk: true; tmt: true; } };
    kompetensi: { select: { competency_id: true; tanggal: true; nama_kompetensi: true; penyelenggara: true; nomor_sertifikat: true; berlaku_sampai: true; } };
    prestasi: { select: { achievement_id: true; tahun: true; nama_prestasi: true; tingkat: true; pemberi_penghargaan: true; } };

    unit_kerja: {
      select: {
        alamat: true;
        telepon: true;
        web: true;
        nama_wilayah: true;
        kode_bps: true;
        nama_satker_bagian: true;
        nama_wilayah_singkat: true;
      }
    }
  };
}>;

// **2. AggregatedUnitData:** Tipe untuk data statistik agregat per unit organisasi.
// Properti ini adalah HASIL KALKULASI/AGREGASI di API Route, BUKAN KOLOM LANGSUNG DI DATABASE.
export interface AggregatedUnitData {
  id: string; // Kode BPS atau 'nasional'
  namaWilayahAsli: string;
  jumlahPegawai: number;
  jumlahPegawaiPNS?: number;
  jumlahPegawaiNonPNS?: number;
  jumlahPensiunTahunIni: number;
  jumlahPensiun5TahunKedepan: number;
  totalABK: number;
  persenTerhadapABK: number;
  alamat?: string | null;
  telepon?: string | null;
  web?: string | null;
  kepalaNama?: string | null;
  kepalaNIP?: string | null;

  pejabatStruktural: Pejabat[];
  namaSatkerLengkap: string;

  // Properti tambahan hasil kalkulasi/agregasi untuk tampilan di StatsRow/Popup
  rataUmurSatker?: number;
  rataKJKSatker?: { jam: number; menit: number; };
  subtextABK?: string | null;
  infoABK?: string | null;
  subtextKJK?: string | null;

  berita: NewsItem[]; // Ini sekarang akan cocok dengan tipe NewsItem yang baru
  daftarTimKerja?: TimKerja[];

  fungsionalMuda?: PegawaiDetail[];
  fungsionalPertama?: PegawaiDetail[];
  fungsionalTerampil?: PegawaiDetail[];
  pelaksanaDanStaf?: PegawaiDetail[];
}

// **3. DashboardDataApi:** Tipe untuk respons lengkap dari API `/api/organisasi/dashboard-data.ts`.
export interface DashboardDataApi {
  dataStatistikLengkap: { [key: string]: AggregatedUnitData };
  daftarPegawaiPensiun: PegawaiDetail[];
  dataUntukPeta: StatistikData;
}

// **4. StatistikData:** Tipe untuk data yang akan ditampilkan di peta choropleth.
export interface StatistikData {
  [kodeProvinsi: string]: {
    nilai: number;
    detail: string;
  };
}

// **5. PegawaiDetail:** Tipe untuk daftar pegawai yang lebih sederhana (misalnya untuk tabel pensiun atau daftar semua pegawai).
// Ini adalah sub-set dari model `users` yang digunakan di `DaftarPensiunTable` dan `CariPegawai`.
export type PegawaiDetail = Prisma.usersGetPayload<{
  select: {
    user_id: true;
    nama_lengkap: true;
    tanggal_lahir: true;
    nip_baru: true;
    jabatan_struktural: true;
    pangkat_golongan: true;
    tanggal_pensiun: true;
    unit_kerja_eselon1: true;
    unit_kerja_eselon2: true;
    jenjang_jabatan_fungsional: true;
    masa_kerja_total: true;
    foto_url: true;
    email: true;
    username: true;
    nip_lama: true;
    role: true;
    tempat_lahir: true;
    jenis_kelamin: true;
    status_kepegawaian: true;
    tmt_pns: true;
    tmt_pangkat_golongan: true;
    tmt_jabatan: true;
    pendidikan_terakhir: true;
    masa_kerja_golongan: true;
    sisa_masa_kerja: true;
    grade: true;
    unit_kerja_id: true;
    unit_kerja: {
      select: {
        org_unit_id: true;
        nama_wilayah_singkat: true;
        kode_bps: true;
      };
    };
  };
}>;