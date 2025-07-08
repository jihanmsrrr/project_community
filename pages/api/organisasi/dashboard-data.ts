// pages/api/organisasi/dashboard-data.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import type { PegawaiDetail, StatistikData, AggregatedUnitData, DashboardDataApi, Pejabat, NewsItem, TimKerja } from '@/types/pegawai';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// --- Pola inisialisasi PrismaClient yang aman ---
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Gunakan globalThis untuk akses global yang lebih kuat di Next.js
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}
// --- Akhir pola inisialisasi PrismaClient ---

// Tipe helper untuk proses agregasi
type AggregatedUnitDataWithTemp = AggregatedUnitData & {
  _umurList?: number[];
};

// Fungsi helper untuk kalkulasi umur
const calculateAge = (birthDate: Date | null): number => {
  if (!birthDate) return 0;
  const today = new Date();
  let age = today.getFullYear() - new Date(birthDate).getFullYear();
  const m = today.getMonth() - new Date(birthDate).getMonth();
  if (m < 0 || (m === 0 && today.getDate() < new Date(birthDate).getDate())) {
    age--;
  }
  return age;
};

// Fungsi helper untuk kalkulasi rata-rata
const calculateAverage = (arr: number[]): number => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

// Fungsi untuk mengkategorikan pegawai
function categorizePersonnel(personnelList: PegawaiDetail[]) {
  const fungsionalMuda: PegawaiDetail[] = [];
  const fungsionalPertama: PegawaiDetail[] = [];
  const fungsionalTerampil: PegawaiDetail[] = [];
  const pelaksanaDanStaf: PegawaiDetail[] = [];

  personnelList.forEach(p => {
    const jjf = p.jenjang_jabatan_fungsional?.toLowerCase();
    if (jjf?.includes("muda")) {
      fungsionalMuda.push(p);
    } else if (jjf?.includes("pertama")) {
      fungsionalPertama.push(p);
    } else if (jjf?.includes("terampil")) {
      fungsionalTerampil.push(p);
    } else {
      pelaksanaDanStaf.push(p);
    }
  });
  return { fungsionalMuda, fungsionalPertama, fungsionalTerampil, pelaksanaDanStaf };
}

// Handler utama API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardDataApi | { message: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 1. Ambil data utama dengan relasi yang dibutuhkan dalam satu query
    const organizationUnits = await prisma.organization_units.findMany({
      include: {
        kepala: true,
        pegawai: { // Ini adalah satu-satunya sumber data pegawai
          include: {
            unit_kerja: true, // Sertakan detail unit kerja jika perlu
          },
        },
      },
    });

    const allTeams = await prisma.teams.findMany({
      include: {
        ketua_tim: true,
        anggota: { include: { pengguna: true } },
      },
    });

    const allNews = await prisma.news.findMany({
      include: {
        penulis: {
          select: {
            nama_lengkap: true,
            foto_url: true,
            unit_kerja_id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // --- PROSES TRANSFORMASI & AGREGASI DATA PER UNIT ---
    const aggregatedStats: { [key: string]: AggregatedUnitDataWithTemp } = {};
    const currentYear = new Date().getFullYear();

    organizationUnits.forEach((ou) => {
      const key = ou.kode_bps || ou.org_unit_id.toString();
      const personnelInUnit = ou.pegawai; // Gunakan data dari relasi
      const categorized = categorizePersonnel(personnelInUnit as PegawaiDetail[]);

      const pejabatList: Pejabat[] = ou.kepala ? [{
        user_id: ou.kepala.user_id,
        nama_lengkap: ou.kepala.nama_lengkap,
        nip_baru: ou.kepala.nip_baru,
        foto_url: ou.kepala.foto_url,
        jabatan_struktural: ou.kepala.jabatan_struktural,
      }] : [];

      const timKerjaList: TimKerja[] = allTeams
        .filter((team) => team.org_unit_id === ou.org_unit_id && team.ketua_tim)
        .map((team) => {
          if (!team.ketua_tim) return null;
          return {
            id: team.team_id.toString(),
            namaTim: team.nama_tim || '',
            singkatan: team.singkatan || '',
            deskripsi: team.deskripsi || '',
            ketuaTim: {
              id: team.ketua_tim.user_id.toString(),
              nama: team.ketua_tim.nama_lengkap || '',
              nip: team.ketua_tim.nip_baru || '',
              posisi: team.ketua_tim.jabatan_struktural || team.ketua_tim.jenjang_jabatan_fungsional || 'Ketua Tim',
              fotoUrl: team.ketua_tim.foto_url || undefined,
            },
            anggotaLain: team.anggota.map((m) => ({
              id: m.pengguna.user_id.toString(),
              nama: m.pengguna.nama_lengkap || '',
              nip: m.pengguna.nip_baru || '',
              posisi: m.posisi || 'Anggota',
              fotoUrl: m.pengguna.foto_url || undefined,
            })),
          };
        }).filter(Boolean) as TimKerja[];

      const newsForUnit: NewsItem[] = allNews
        .filter((news) => news.penulis?.unit_kerja_id === ou.org_unit_id)
        .map((news) => ({
          id: news.news_id.toString(),
          title: news.judul,
          snippet: news.abstrak,
          date: news.createdAt.toISOString(),
          author: news.penulis?.nama_lengkap || 'Anonim',
          authorAvatar: news.penulis?.foto_url || undefined,
          link: `/berita/${news.news_id}`,
          source: 'Internal Organisasi',
          penulis: {
            nama_lengkap: news.penulis?.nama_lengkap || null,
            foto_url: news.penulis?.foto_url || null,
          },
        })).slice(0, 5);

      aggregatedStats[key] = {
        id: key,
        namaWilayahAsli: ou.nama_wilayah || '',
        namaSatkerLengkap: ou.nama_satker_lengkap || '',
        alamat: ou.alamat_kantor,
        telepon: ou.telepon_kantor,
        web: ou.homepage_satker,
        kepalaNama: ou.kepala?.nama_lengkap || null,
        kepalaNIP: ou.kepala?.nip_baru || null,
        pejabatStruktural: pejabatList,
        jumlahPegawai: personnelInUnit.length,
        jumlahPegawaiPNS: personnelInUnit.filter((p) => p.status_kepegawaian === 'PNS').length,
        jumlahPegawaiNonPNS: personnelInUnit.filter((p) => p.status_kepegawaian !== 'PNS').length,
        jumlahPensiunTahunIni: personnelInUnit.filter((p) => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() === currentYear).length,
        jumlahPensiun5TahunKedepan: personnelInUnit.filter((p) => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() > currentYear && new Date(p.tanggal_pensiun).getFullYear() <= currentYear + 5).length,
        totalABK: key === '0000' ? 10000 : 500,
        persenTerhadapABK: 0,
        rataUmurSatker: calculateAverage(personnelInUnit.map((p) => calculateAge(p.tanggal_lahir))),
        rataKJKSatker: { jam: 0, menit: 0 },
        berita: newsForUnit,
        daftarTimKerja: timKerjaList,
        fungsionalMuda: categorized.fungsionalMuda,
        fungsionalPertama: categorized.fungsionalPertama,
        fungsionalTerampil: categorized.fungsionalTerampil,
        pelaksanaDanStaf: categorized.pelaksanaDanStaf,
        subtextABK: 'Target Tahunan',
        _umurList: [],
      };
    });

    // --- Finalisasi Perhitungan & Data Peta ---
    for (const key in aggregatedStats) {
      const stats = aggregatedStats[key];
      stats.persenTerhadapABK = stats.totalABK > 0 ? (stats.jumlahPegawai / stats.totalABK) * 100 : 0;
      delete stats._umurList;
    }

    const dataUntukPeta: StatistikData = {};
    for (const kodeProv in aggregatedStats) {
      if (kodeProv !== '0000' && aggregatedStats[kodeProv].id) {
        const stats = aggregatedStats[kodeProv];
        dataUntukPeta[stats.id] = {
          nilai: stats.persenTerhadapABK,
          detail: `ABK: ${stats.persenTerhadapABK.toFixed(2)}%`,
        };
      }
    }

    // --- PERBAIKAN: DATA NASIONAL ---
    // Gabungkan semua pegawai dari semua unit menjadi satu array
    const allPersonnelFromUnits = organizationUnits.flatMap(ou => ou.pegawai);
    const nationalCategorized = categorizePersonnel(allPersonnelFromUnits as PegawaiDetail[]);

    const nationalStats: AggregatedUnitDataWithTemp = {
      id: "NASIONAL",
      namaWilayahAsli: "Nasional",
      namaSatkerLengkap: "Badan Pusat Statistik",
      jumlahPegawai: allPersonnelFromUnits.length,
      jumlahPegawaiPNS: allPersonnelFromUnits.filter(p => p.status_kepegawaian === 'PNS').length,
      jumlahPegawaiNonPNS: allPersonnelFromUnits.filter(p => p.status_kepegawaian !== 'PNS').length,
      jumlahPensiunTahunIni: allPersonnelFromUnits.filter(p => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() === currentYear).length,
      jumlahPensiun5TahunKedepan: allPersonnelFromUnits.filter(p => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() > currentYear && new Date(p.tanggal_pensiun).getFullYear() <= currentYear + 5).length,
      totalABK: Object.values(aggregatedStats).reduce((sum, unit) => sum + unit.totalABK, 0),
      persenTerhadapABK: 0,
      rataUmurSatker: calculateAverage(allPersonnelFromUnits.map(p => calculateAge(p.tanggal_lahir))),
      rataKJKSatker: { jam: 0, menit: 0 },
      pejabatStruktural: Object.values(aggregatedStats).flatMap(unit => unit.pejabatStruktural),
      berita: allNews.map((news) => ({
        id: news.news_id.toString(),
        title: news.judul,
        snippet: news.abstrak,
        date: news.createdAt.toISOString(),
        author: news.penulis?.nama_lengkap || 'Anonim',
        authorAvatar: news.penulis?.foto_url || undefined,
        link: `/berita/${news.news_id}`,
        source: 'Internal',
        penulis: {
          nama_lengkap: news.penulis?.nama_lengkap || null,
          foto_url: news.penulis?.foto_url || null,
        },
      })).slice(0, 5),
      daftarTimKerja: Object.values(aggregatedStats).flatMap(unit => unit.daftarTimKerja || []),
      fungsionalMuda: nationalCategorized.fungsionalMuda,
      fungsionalPertama: nationalCategorized.fungsionalPertama,
      fungsionalTerampil: nationalCategorized.fungsionalTerampil,
      pelaksanaDanStaf: nationalCategorized.pelaksanaDanStaf,
      subtextABK: 'Target Nasional',
      _umurList: [],
    };
    nationalStats.persenTerhadapABK = nationalStats.totalABK > 0 ? (nationalStats.jumlahPegawai / nationalStats.totalABK) * 100 : 0;
    delete nationalStats._umurList;
    aggregatedStats['0000'] = nationalStats;

    // --- PERBAIKAN: DAFTAR PEGAWAI PENSIUN ---
    const daftarPegawaiPensiun = allPersonnelFromUnits // Gunakan sumber data yang sudah ada
      .filter((user) => {
        if (!user.tanggal_pensiun) return false;
        const pensionYear = new Date(user.tanggal_pensiun).getFullYear();
        return pensionYear >= currentYear && pensionYear <= currentYear + 5;
      })
      .sort((a, b) => (a.tanggal_pensiun?.getTime() || 0) - (b.tanggal_pensiun?.getTime() || 0))
      .map((p) => ({
        ...p,
        unit_kerja: p.unit_kerja,
        tanggal_pensiun_formatted: p.tanggal_pensiun ? format(p.tanggal_pensiun, 'dd MMMM yyyy', { locale: id }) : null,
      })) as PegawaiDetail[];

    // --- KIRIM RESPON ---
    const serializedResponse = JSON.parse(JSON.stringify({
      dataStatistikLengkap: aggregatedStats,
      dataUntukPeta: dataUntukPeta,
      daftarPegawaiPensiun: daftarPegawaiPensiun,
    }, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return res.status(200).json(serializedResponse);

  } catch (error) {
    console.error("API /organisasi/dashboard-data error:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: `Gagal mengambil data organisasi: ${error.message}` });
    }
    return res.status(500).json({ message: 'Gagal mengambil data organisasi.' });
  }
}