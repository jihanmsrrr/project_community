// pages/api/organisasi/dashboard-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import type { PegawaiDetail, StatistikData, AggregatedUnitData, DashboardDataApi, Pejabat, NewsItem, TimKerja } from '@/types/pegawai';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const prisma = new PrismaClient();

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

const calculateAverage = (arr: number[]): number => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardDataApi | { message: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 1. Ambil semua data yang dibutuhkan dalam beberapa query efisien
    const organizationUnits = await prisma.organization_units.findMany({
      include: {
        kepala: true,
        pegawai: {
          select: {
            tanggal_lahir: true,
            tanggal_pensiun: true,
            status_kepegawaian: true,
            jenjang_jabatan_fungsional: true, // Tambahkan ini untuk kategorisasi
          },
        },
      },
    });

    const allUsers = await prisma.users.findMany({
      include: {
        unit_kerja: true,
      },
    });

    const allTeams = await prisma.teams.findMany({
      include: {
        ketua_tim: true,
        anggota: {
          include: {
            pengguna: true,
          },
        },
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

    // --- PROSES TRANSFORMASI & AGREGASI DATA ---
    const aggregatedStats: { [key: string]: AggregatedUnitDataWithTemp } = {};
    const currentYear = new Date().getFullYear();

    organizationUnits.forEach(ou => {
      const key = ou.kode_bps || ou.org_unit_id.toString();

      // Transformasi data kepala unit menjadi tipe Pejabat
      const pejabatList: Pejabat[] = ou.kepala ? [{
        user_id: ou.kepala.user_id,
        nama_lengkap: ou.kepala.nama_lengkap,
        nip_baru: ou.kepala.nip_baru,
        foto_url: ou.kepala.foto_url,
        jabatan_struktural: ou.kepala.jabatan_struktural,
      }] : [];

      // Transformasi data tim dari database menjadi tipe TimKerja
      const timKerjaList: TimKerja[] = allTeams
        .filter(team => team.org_unit_id === ou.org_unit_id && team.ketua_tim)
        .map(team => {
          if (!team.ketua_tim) {
            return null;
          }
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
            anggotaLain: team.anggota.map(membership => ({
              id: membership.pengguna.user_id.toString(),
              nama: membership.pengguna.nama_lengkap || '',
              nip: membership.pengguna.nip_baru || '',
              posisi: membership.posisi || 'Anggota',
              fotoUrl: membership.pengguna.foto_url || undefined,
            })),
          };
        }).filter(Boolean) as TimKerja[];

      // Transformasi data berita menjadi tipe NewsItem
      const newsForUnit: NewsItem[] = allNews
        .filter(news => news.penulis?.unit_kerja_id === ou.org_unit_id)
        .map(news => ({
          id: news.news_id.toString(),
          title: news.judul,
          snippet: news.abstrak,
          date: news.createdAt.toISOString(),
          author: news.penulis?.nama_lengkap || 'Anonim',
          // --- PERBAIKAN DI SINI ---
          authorAvatar: news.penulis?.foto_url === null ? undefined : news.penulis?.foto_url,
          // --- AKHIR PERBAIKAN ---
          link: `/berita/${news.news_id}`,
          source: 'Internal Organisasi',
          penulis: {
            nama_lengkap: news.penulis?.nama_lengkap || null,
            foto_url: news.penulis?.foto_url || null,
          },
        })).slice(0, 5);

      const personnelInUnit = allUsers.filter(u => u.unit_kerja_id === ou.org_unit_id);
      const categorized = categorizePersonnel(personnelInUnit as unknown as PegawaiDetail[]);


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
        jumlahPegawai: ou.pegawai.length,
        jumlahPegawaiPNS: ou.pegawai.filter(p => p.status_kepegawaian === 'PNS').length,
        jumlahPegawaiNonPNS: ou.pegawai.filter(p => p.status_kepegawaian !== 'PNS').length,
        jumlahPensiunTahunIni: ou.pegawai.filter(p => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() === currentYear).length,
        jumlahPensiun5TahunKedepan: ou.pegawai.filter(p => p.tanggal_pensiun && new Date(p.tanggal_pensiun).getFullYear() > currentYear && new Date(p.tanggal_pensiun).getFullYear() <= currentYear + 5).length,
        totalABK: key === '0000' ? 10000 : 500,
        persenTerhadapABK: 0,
        rataUmurSatker: calculateAverage(ou.pegawai.map(p => calculateAge(p.tanggal_lahir))),
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

    // Finalisasi perhitungan
    for (const key in aggregatedStats) {
      const stats = aggregatedStats[key];
      stats.persenTerhadapABK = stats.totalABK > 0 ? (stats.jumlahPegawai / stats.totalABK) * 100 : 0;
      delete stats._umurList;
    }

    // --- DATA UNTUK PETA (STATISTIK DATA) ---
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

    // --- DATA NASIONAL ---
    const nationalStats: AggregatedUnitDataWithTemp = {
      id: "NASIONAL",
      namaWilayahAsli: "Nasional",
      namaSatkerLengkap: "Badan Pusat Statistik",
      jumlahPegawai: Object.values(aggregatedStats).reduce((sum, unit) => sum + unit.jumlahPegawai, 0),
      jumlahPegawaiPNS: Object.values(aggregatedStats).reduce((sum, unit) => sum + (unit.jumlahPegawaiPNS || 0), 0),
      jumlahPegawaiNonPNS: Object.values(aggregatedStats).reduce((sum, unit) => sum + (unit.jumlahPegawaiNonPNS || 0), 0),
      jumlahPensiunTahunIni: Object.values(aggregatedStats).reduce((sum, unit) => sum + unit.jumlahPensiunTahunIni, 0),
      jumlahPensiun5TahunKedepan: Object.values(aggregatedStats).reduce((sum, unit) => sum + unit.jumlahPensiun5TahunKedepan, 0),
      totalABK: 10000,
      persenTerhadapABK: 0,
      rataUmurSatker: calculateAverage(
        Object.values(organizationUnits).flatMap(ou =>
          ou.pegawai.map(p => calculateAge(p.tanggal_lahir))
        )
      ),
      rataKJKSatker: { jam: 0, menit: 0 },
      pejabatStruktural: Object.values(aggregatedStats).flatMap(unit => unit.pejabatStruktural),
      berita: allNews.map(news => ({ // Ambil semua berita untuk nasional
        id: news.news_id.toString(),
        title: news.judul,
        snippet: news.abstrak,
        date: news.createdAt.toISOString(),
        author: news.penulis?.nama_lengkap || 'Anonim',
        // --- PERBAIKAN DI SINI ---
        authorAvatar: news.penulis?.foto_url === null ? undefined : news.penulis?.foto_url,
        // --- AKHIR PERBAIKAN ---
        link: `/berita/${news.news_id}`,
        source: 'Internal',
        penulis: {
          nama_lengkap: news.penulis?.nama_lengkap || null,
          foto_url: news.penulis?.foto_url || null,
        },
      })).slice(0, 5),
      daftarTimKerja: Object.values(aggregatedStats).flatMap(unit => unit.daftarTimKerja || []),
      fungsionalMuda: categorizePersonnel(allUsers as unknown as PegawaiDetail[]).fungsionalMuda,
      fungsionalPertama: categorizePersonnel(allUsers as unknown as PegawaiDetail[]).fungsionalPertama,
      fungsionalTerampil: categorizePersonnel(allUsers as unknown as PegawaiDetail[]).fungsionalTerampil,
      pelaksanaDanStaf: categorizePersonnel(allUsers as unknown as PegawaiDetail[]).pelaksanaDanStaf,
      subtextABK: 'Target Nasional',
      _umurList: [],
    };
    nationalStats.persenTerhadapABK = nationalStats.totalABK > 0 ? (nationalStats.jumlahPegawai / nationalStats.totalABK) * 100 : 0;
    delete nationalStats._umurList;
    aggregatedStats['0000'] = nationalStats;

    // --- DAFTAR PEGAWAI PENSIUN ---
    const daftarPegawaiPensiun = allUsers
      .filter(user => {
        if (!user.tanggal_pensiun) return false;
        const pensionYear = new Date(user.tanggal_pensiun).getFullYear();
        return pensionYear >= currentYear && pensionYear <= currentYear + 5;
      })
      .sort((a, b) => (a.tanggal_pensiun?.getTime() || 0) - (b.tanggal_pensiun?.getTime() || 0))
      .map(p => ({
        ...p,
        unit_kerja: p.unit_kerja || null,
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
  } finally {
    await prisma.$disconnect();
  }
}

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