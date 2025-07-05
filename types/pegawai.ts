// src/types/pegawai.ts

// Tipe dasar untuk item dalam riwayat atau list
interface BaseHistoryItem {
  id: string | number; // Bisa string dari generator, atau number jika dari DB
}

export interface Pejabat extends BaseHistoryItem {
  nama: string;
  jabatan: string;
  fotoUrl?: string;
  nipUntukDetail?: string; 
}

export interface AnggotaTim extends BaseHistoryItem {
  nama: string;
  posisi: string; // Atau jabatan
  nip?: string;
  fotoUrl?: string;
}

export interface RiwayatPendidikanItem extends BaseHistoryItem {
  tanggalIjazah: string; // Format "DD-MM-YYYY"
  pendidikan: string;    // Deskripsi lengkap pendidikan, misal "S1 Statistik - Universitas ABC"
  jenjang?: "SMA/SMK" | "D-I" | "D-II" | "D-III" | "D-IV" | "S1" | "S2" | "S3" | "Profesi" | "Sp-I" | "Sp-II";
  namaSekolahInstitusi?: string;
  jurusan?: string;
  tahunLulus: string; // Tahun saja
}

export interface RiwayatJabatanItem extends BaseHistoryItem {
  jabatan: string;
  unitKerja: string;
  periodeMulai: string; // "DD-MM-YYYY"
  periodeSelesai?: string; // "DD-MM-YYYY" atau "Sekarang"
  noSK?: string;
  tmt?: string; // Tanggal Mulai Tugas untuk jabatan tersebut "DD-MM-YYYY"
}

export interface KompetensiItem extends BaseHistoryItem {
  tanggal: string; // "DD-MM-YYYY" perolehan kompetensi/sertifikat
  namaKompetensi: string;
  penyelenggara?: string;
  nomorSertifikat?: string;
  berlakuSampai?: string; // "DD-MM-YYYY" atau "Seumur Hidup"
}

export interface PrestasiItem extends BaseHistoryItem {
  tahun: string;
  namaPrestasi: string;
  tingkat?: "Instansi" | "Kabupaten/Kota" | "Provinsi" | "Nasional" | "Internasional";
  pemberiPenghargaan?: string;
}

export interface NewsItem extends BaseHistoryItem {
  title: string;
  snippet: string;
  date: string; // "DD MMMM YYYY" atau format lain yang konsisten
  author?: string;
  authorAvatar?: string;
  link?: string;
  source?: string;
}
export interface TimKerja {
  id: string; // ID unik untuk tim, misal "sosial-1100"
  namaTim: string; // Misal: "Tim Statistik Sosial"
  singkatan?: string; // Misal: "SOS"
  deskripsi?: string; // Deskripsi singkat tugas tim
  ketuaTim: AnggotaTim; // Informasi ketua tim
  anggotaLain?: AnggotaTim[]; // Daftar anggota tim lainnya
}

// Interface Utama untuk Detail Pegawai dan juga bisa merepresentasikan data Satuan Kerja (jika digabung)
export interface DetailPegawaiData {
  role: string;
  // Informasi Identifikasi Utama Pegawai/Satker
  id: string; // Untuk pegawai: NIP Baru. Untuk Satker: Kode Satker (e.g., "NASIONAL", "IDAC")
  nama: string; // Nama Pegawai atau Nama Wilayah/Satker (untuk header utama)
  namaSatkerLengkap: string; // Nama resmi lengkap Satker (BPS Provinsi Aceh, Badan Pusat Statistik RI)
  namaWilayahAsli: string; // Nama provinsi/kabupaten/kota atau "Nasional" (untuk display)

  // Informasi Spesifik Pegawai (opsional jika DetailPegawaiData juga untuk Satker umum)
  nipLama?: string;
  nipBaru?: string; // Wajib jika ini data pegawai individu, bisa sama dengan 'id'
  email?: string;
  fotoUrl?: string;
  tempatLahir?: string;
  tanggalLahir?: string; // "DD-MM-YYYY"
  jenisKelamin?: "Laki-laki" | "Perempuan";
  statusKepegawaian?: "PNS" | "PPPK" | "CPNS";
  TMT_PNS?: string; // "DD-MM-YYYY"
  pangkatGolongan?: string;
  tmtPangkatGolongan?: string; // "DD-MM-YYYY"
  jabatanStruktural?: string;
  jenjangJabatanFungsional?: string;
  tmtJabatan?: string; // "DD-MM-YYYY"
  pendidikanTerakhir?: string;
  masaKerjaGolongan?: string;
  masaKerjaTotal?: string;
  tanggalPensiun?: string; // "DD-MM-YYYY"
  sisaMasaKerja?: string;
  grade?: string;
  bmnDipegang?: string[];

  // Informasi Kontak & Lokasi Satker
  alamatKantor?: string;
  teleponKantor?: string;
  homepageSatker?: string;

  // Informasi Unit Kerja (lebih relevan untuk pegawai di BPS Pusat atau struktur besar)
  unitKerjaEselon1?: string;
  unitKerjaEselon2?: string;
  // satuanKerjaId dan satuanKerjaNama bisa jadi duplikat dari id dan namaWilayahAsli jika DetailPegawaiData untuk Satker
  // Jika ini murni data pegawai, maka satuanKerjaId dan satuanKerjaNama menunjuk ke satker tempat dia bekerja.
  satuanKerjaId?: string; // Kode Satker tempat pegawai bekerja (jika berbeda dari 'id' utama)
  satuanKerjaNama?: string; // Nama singkat Satker tempat pegawai bekerja

  // Data Statistik Agregat (lebih relevan jika DetailPegawaiData untuk Satker)
  totalPegawai?: number;
  persenTerhadapABK?: number;
  subtextABK?: string;
  infoABK?: string;
  rataUmurSatker?: number;
  rataKJKSatker?: { jam: number; menit: number };
  subtextKJK?: string;

  // Relasi & Riwayat (jika ini data pegawai individu)

  pejabatStruktural?: Pejabat[]; // Jika DetailPegawaiData ini adalah Satker, ini daftar pimpinannya
  daftarTimKerja?: TimKerja[]; 
  anggotaTim?: AnggotaTim[];     // Jika DetailPegawaiData ini adalah Satker, ini daftar tim/pegawai di bawahnya
  berita?: NewsItem[];           // Berita terkait Satker atau organisasi secara umum
  riwayatPendidikan?: RiwayatPendidikanItem[];
  riwayatJabatan?: RiwayatJabatanItem[];
  kompetensi?: KompetensiItem[];
  prestasi?: PrestasiItem[];
}