// types/pegawai.ts
import { Prisma } from "@prisma/client";

// =================== TIPE DASAR =================== //

export type Pejabat = {
  user_id: bigint;
  nama_lengkap: string | null;
  nip_baru: string | null;
  foto_url: string | null;
  jabatan_struktural: string | null;
};

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
  };
}>;

export type NewsItem = {
  id: string;
  title: string;
  snippet: string;
  date: string;
  author: string;
  authorAvatar?: string | null;
  link: string;
  source: string;
  penulis: {
    nama_lengkap: string | null;
    foto_url: string | null;
  };
};

export interface UnitKerja {
  nama_satker_lengkap: string | null;
  nama_satker_bagian?: string | null;
  alamat?: string | null;
  telepon?: string | null;
  web?: string | null;
}

export type RiwayatPendidikanItem = Prisma.user_education_historyGetPayload<{
  select: {
    education_id: true;
    jenjang: true;
    nama_sekolah_institusi: true;
    jurusan: true;
    tahun_lulus: true;
    tanggal_ijazah: true;
  };
}>;

export type RiwayatJabatanItem = Prisma.user_job_historyGetPayload<{
  select: {
    job_history_id: true;
    jabatan: true;
    unit_kerja: true;
    periode_mulai: true;
    periode_selesai: true;
    no_sk: true;
    tmt: true;
  };
}>;

export type KompetensiItem = Prisma.user_competenciesGetPayload<{
  select: {
    competency_id: true;
    tanggal: true;
    nama_kompetensi: true;
    penyelenggara: true;
    nomor_sertifikat: true;
    berlaku_sampai: true;
  };
}>;

export type PrestasiItem = Prisma.user_achievementsGetPayload<{
  select: {
    achievement_id: true;
    tahun: true;
    nama_prestasi: true;
    tingkat: true;
    pemberi_penghargaan: true;
  };
}>;

export type PegawaiSearchResult = Prisma.usersGetPayload<{
  select: {
    user_id: true;
    nama_lengkap: true;
    nip_baru: true;
    foto_url: true;
    unit_kerja: { select: { nama_satker_lengkap: true } };
  };
}>;

export type SatkerOption = {
  org_unit_id: string;
  nama_wilayah: string | null;
  kode_bps: string | null;
};

export interface AnggotaTim {
  id: string;
  nama: string;
  posisi: string;
  nip?: string | null;
  fotoUrl?: string | null;
}

export interface TimKerja {
  id: string;
  namaTim: string;
  singkatan?: string | null;
  deskripsi?: string | null;
  ketuaTim: AnggotaTim;
  anggotaLain?: AnggotaTim[];
}

// =================== TIPE KOMPLEKS =================== //

export type DetailPegawaiData = Prisma.usersGetPayload<{
  select: {
    user_id: true;
    nama_lengkap: true;
    nip_baru: true;
    nip_lama: true;
    email: true;
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
    riwayat_pendidikan: true;
    riwayat_jabatan: true;
    kompetensi: true;
    prestasi: true;
    unit_kerja: true;
  };
  include: {
    riwayat_pendidikan: true;
    riwayat_jabatan: true;
    kompetensi: true;
    prestasi: true;
    unit_kerja: {
      select: {
        org_unit_id: true;
        nama_satker_bagian: true;
        alamat_kantor: true;
        telepon_kantor: true;
        homepage_satker: true;
        nama_wilayah: true;
        kode_bps: true;
        nama_wilayah_singkat: true;
      };
    };
  };
}>;

export interface AggregatedUnitData {
  id: string;
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
  rataUmurSatker?: number;
  rataKJKSatker?: { jam: number; menit: number };
  subtextABK?: string | null;
  infoABK?: string | null;
  subtextKJK?: string | null;
  berita: NewsItem[];
  daftarTimKerja?: TimKerja[];
  fungsionalMuda?: PegawaiDetail[];
  fungsionalPertama?: PegawaiDetail[];
  fungsionalTerampil?: PegawaiDetail[];
  pelaksanaDanStaf?: PegawaiDetail[];
}

export interface DashboardDataApi {
  dataStatistikLengkap: { [key: string]: AggregatedUnitData };
  daftarPegawaiPensiun: PegawaiDetail[];
  dataUntukPeta: StatistikData;
}

export interface StatistikData {
  [kodeProvinsi: string]: {
    nilai: number;
    detail: string;
  };
}

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
        nama_satker_lengkap: true;
      };
    };
  };
}>;
