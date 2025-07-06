// prisma/seeds/01_organizations_users_teams.ts
import type { Prisma, PrismaClient } from '@prisma/client';

// Tipe untuk Prisma Transaction Client agar bisa di-pass dari file utama
type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

// --- Helper & Definisi Data ---
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const kotaLahir = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Yogyakarta"];
const pangkatGolonganList = ["Penata Muda, III/a", "Penata Muda Tk. I, III/b", "Penata, III/c", "Penata Tk. I, III/d", "Pembina, IV/a"];
const pendidikanList = ["SMA", "D3", "S1", "S2"];

function createCompleteUser(
    id: number, unitId: number, namaLengkap: string, jabatanStruktural: string | null, jenjangJabatanFungsional: string | null
): Prisma.usersCreateInput {
    const username = namaLengkap.toLowerCase().replace(/[^a-z0-9]/g, '') + id;
    const email = `${username}@bps.go.id`;
    const tglLahir = randomDate(new Date(1975, 0, 1), new Date(2000, 0, 1));
    const tmtPns = randomDate(new Date(tglLahir.getFullYear() + 22, 0, 1), new Date(tglLahir.getFullYear() + 25, 0, 1));
    const tmtJabatan = randomDate(new Date(tmtPns.getFullYear() + 3, 0, 1), new Date());
    const tglPensiun = new Date(tglLahir.getFullYear() + 60, tglLahir.getMonth(), tglLahir.getDate());

    return {
        user_id: id,
        nama_lengkap: namaLengkap,
        nip_baru: `19${tglLahir.getFullYear().toString().slice(2)}${(tglLahir.getMonth() + 1).toString().padStart(2, '0')}${tglLahir.getDate().toString().padStart(2, '0')}${tmtPns.getFullYear()}011${randomInt(100, 999)}`,
        nip_lama: `0${id}${randomInt(100, 999)}`,
        email: email,
        unit_kerja: { connect: { org_unit_id: unitId } },
        role: (id % 20 === 0) ? 'admin' : 'user',
        foto_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(namaLengkap)}&background=random&color=fff`,
        sso_id: `sso-${Math.random().toString(36).substring(2, 15)}`,
        tempat_lahir: randomPick(kotaLahir),
        tanggal_lahir: tglLahir,
        jenis_kelamin: randomPick(['Laki-laki', 'Perempuan']),
        status_kepegawaian: 'PNS',
        tmt_pns: tmtPns,
        pangkat_golongan: randomPick(pangkatGolonganList),
        tmt_pangkat_golongan: randomDate(new Date(tmtPns.getFullYear() + 2, 0, 1), new Date()),
        jabatan_struktural: jabatanStruktural,
        jenjang_jabatan_fungsional: jenjangJabatanFungsional,
        tmt_jabatan: tmtJabatan,
        pendidikan_terakhir: randomPick(pendidikanList),
        masa_kerja_golongan: `${new Date().getFullYear() - tmtJabatan.getFullYear()} Tahun`,
        masa_kerja_total: `${new Date().getFullYear() - tmtPns.getFullYear()} Tahun`,
        tanggal_pensiun: tglPensiun,
        sisa_masa_kerja: `${tglPensiun.getFullYear() - new Date().getFullYear()} Tahun`,
        grade: randomPick(['A', 'B', 'C', 'D']),
        unit_kerja_eselon1: 'Sekretariat Utama',
        unit_kerja_eselon2: 'Biro Hubungan Masyarakat dan Hukum',
        username: username,
        password: '$2b$10$SX9TQ/jJJUvTa.md/6.z.u6gOhvBgNL67vaU5BGpTDfzyFm3.0U5S',
    };
}

const provinceDefinitions = [
    { namaWilayah: "Aceh", kodeBps: "1100", alamat: "Jl. Tgk. H. Mohd. Daud Beureueh No.20, Banda Aceh", telepon: "(0651) 21300", web: "https://aceh.bps.go.id" },
    { namaWilayah: "Sumatera Utara", kodeBps: "1200", alamat: "Jl. Asrama No. 179, Medan", telepon: "(061) 8452342", web: "https://sumut.bps.go.id" },
    { namaWilayah: "Sumatera Barat", kodeBps: "1300", alamat: "Jl. Rasuna Said No.51, Padang", telepon: "(0751) 31730", web: "https://sumbar.bps.go.id" },
    { namaWilayah: "Riau", kodeBps: "1400", alamat: "Jl. Pattimura No. 12, Pekanbaru", telepon: "(0761) 23042", web: "https://riau.bps.go.id" },
    { namaWilayah: "Jambi", kodeBps: "1500", alamat: "Jl. Urip Sumoharjo No.40, Jambi", telepon: "(0741) 60490", web: "https://jambi.bps.go.id" },
    { namaWilayah: "Sumatera Selatan", kodeBps: "1600", alamat: "Jl. Kapt. Anwar Sastro No.1694, Palembang", telepon: "(0711) 352768", web: "https://sumsel.bps.go.id" },
    { namaWilayah: "Bengkulu", kodeBps: "1700", alamat: "Jl. Pembangunan No.10, Bengkulu", telepon: "(0736) 21090", web: "https://bengkulu.bps.go.id" },
    { namaWilayah: "Lampung", kodeBps: "1800", alamat: "Jl. Basuki Rahmat No.54, Bandar Lampung", telepon: "(0721) 485335", web: "https://lampung.bps.go.id" },
    { namaWilayah: "Kep. Bangka Belitung", kodeBps: "1900", alamat: "Komplek Perkantoran Gubernur, Pangkalpinang", telepon: "(0717) 439024", web: "https://babel.bps.go.id" },
    { namaWilayah: "Kepulauan Riau", kodeBps: "2100", alamat: "Jl. Hang Jebat Km. 3,5, Tanjung Pinang", telepon: "(0771) 21047", web: "https://kepri.bps.go.id" },
    { namaWilayah: "DKI Jakarta", kodeBps: "3100", alamat: "Jl. Salemba Raya No. 16, Jakarta Pusat", telepon: "(021) 3928221", web: "https://jakarta.bps.go.id" },
    { namaWilayah: "Jawa Barat", kodeBps: "3200", alamat: "Jl. PHH. Mustofa No. 43, Bandung", telepon: "(022) 7272595", web: "https://jabar.bps.go.id" },
    { namaWilayah: "Jawa Tengah", kodeBps: "3300", alamat: "Jl. Pahlawan No. 6, Semarang", telepon: "(024) 8413983", web: "https://jateng.bps.go.id" },
    { namaWilayah: "DI Yogyakarta", kodeBps: "3400", alamat: "Jl. Lingkar Utara, Maguwoharjo, Depok, Sleman", telepon: "(0274) 888812", web: "https://yogyakarta.bps.go.id" },
    { namaWilayah: "Jawa Timur", kodeBps: "3500", alamat: "Jl. Raya Kendangsari Industri No. 43-44, Surabaya", telepon: "(031) 8439343", web: "https://jatim.bps.go.id" },
    { namaWilayah: "Banten", kodeBps: "3600", alamat: "Jl. Syeh Nawawi Al Bantani, Serang", telepon: "(0254) 267014", web: "https://banten.bps.go.id" },
    { namaWilayah: "Bali", kodeBps: "5100", alamat: "Jl. Raya Puputan Renon, Denpasar", telepon: "(0361) 235400", web: "https://bali.bps.go.id" },
    { namaWilayah: "Nusa Tenggara Barat", kodeBps: "5200", alamat: "Jl. Dr. Soedjono No. 8, Mataram", telepon: "(0370) 632718", web: "https://ntb.bps.go.id" },
    { namaWilayah: "Nusa Tenggara Timur", kodeBps: "5300", alamat: "Jl. R. Suprapto No. 5, Kupang", telepon: "(0380) 826103", web: "https://ntt.bps.go.id" },
    { namaWilayah: "Kalimantan Barat", kodeBps: "6100", alamat: "Jl. Sutan Syahrir No. 24/VI, Pontianak", telepon: "(0561) 736209", web: "https://kalbar.bps.go.id" },
    { namaWilayah: "Kalimantan Tengah", kodeBps: "6200", alamat: "Jl. Kapten Piere Tendean No.05, Palangka Raya", telepon: "(0536) 3221008", web: "https://kalteng.bps.go.id" },
    { namaWilayah: "Kalimantan Selatan", kodeBps: "6300", alamat: "Jl. Trikora No. 8, Banjarbaru", telepon: "(0511) 4772519", web: "https://kalsel.bps.go.id" },
    { namaWilayah: "Kalimantan Timur", kodeBps: "6400", alamat: "Jl. Kemakmuran No.4, Samarinda", telepon: "(0541) 743691", web: "https://kaltim.bps.go.id" },
    { namaWilayah: "Kalimantan Utara", kodeBps: "6500", alamat: "Jl. Enggang No.26, Tanjung Selor", telepon: "(0552) 2029928", web: "https://kaltara.bps.go.id" },
    { namaWilayah: "Sulawesi Utara", kodeBps: "7100", alamat: "Jl. 17 Agustus No. 63, Manado", telepon: "(0431) 851542", web: "https://sulut.bps.go.id" },
    { namaWilayah: "Sulawesi Tengah", kodeBps: "7200", alamat: "Jl. Prof. Moh. Yamin, SH. No.65, Palu", telepon: "(0451) 421388", web: "https://sulteng.bps.go.id" },
    { namaWilayah: "Sulawesi Selatan", kodeBps: "7300", alamat: "Jl. Racing Centre No. 100, Makassar", telepon: "(0411) 453794", web: "https://sulsel.bps.go.id" },
    { namaWilayah: "Sulawesi Tenggara", kodeBps: "7400", alamat: "Jl. Sao-Sao No. 1, Kendari", telepon: "(0401) 3121491", web: "https://sultra.bps.go.id" },
    { namaWilayah: "Gorontalo", kodeBps: "7500", alamat: "Jl. Prof. Dr. H.B. Jassin No.361, Gorontalo", telepon: "(0435) 829668", web: "https://gorontalo.bps.go.id" },
    { namaWilayah: "Sulawesi Barat", kodeBps: "7600", alamat: "Jl. Martadinata No. 10, Mamuju", telepon: "(0426) 2322002", web: "https://sulbar.bps.go.id" },
    { namaWilayah: "Maluku", kodeBps: "8100", alamat: "Jl. Tanah Tinggi, Ambon", telepon: "(0911) 352484", web: "https://maluku.bps.go.id" },
    { namaWilayah: "Maluku Utara", kodeBps: "8200", alamat: "Jl. Raya No.1, Sofifi", telepon: "(0921) 3110617", web: "https://malut.bps.go.id" },
    { namaWilayah: "Papua Barat", kodeBps: "9200", alamat: "Jl. Trikora Wosi Komp. Perkantoran, Manokwari", telepon: "(0986) 211924", web: "https://papuabarat.bps.go.id" },
    { namaWilayah: "Papua", kodeBps: "9100", alamat: "Jl. Soa Siu Dok II, Jayapura", telepon: "(0967) 533659", web: "https://papua.bps.go.id" },
    { namaWilayah: "Papua Selatan", kodeBps: "9300", alamat: "Jl. Pahlawan No. 1, Merauke (Contoh)", telepon: "(0971) XXXXXX", web: "https://papuaselatan.bps.go.id" },
    { namaWilayah: "Papua Tengah", kodeBps: "9400", alamat: "Jl. Trans Nabire No. 10, Nabire (Contoh)", telepon: "(0984) XXXXXX", web: "https://papuatengah.bps.go.id" },
    { namaWilayah: "Papua Pegunungan", kodeBps: "9500", alamat: "Jl. Yos Sudarso, Wamena (Contoh)", telepon: "(0969) XXXXXX", web: "https://papuapegunungan.bps.go.id" },
    { namaWilayah: "Papua Barat Daya", kodeBps: "9600", alamat: "Jl. Basuki Rahmat Km. 10, Sorong (Contoh)", telepon: "(0951) XXXXXX", web: "https://papuabaratdaya.bps.go.id" },
];

type TimTipe = 'umum' | 'humas' | 'ipds' | 'sosial' | 'produksi' | 'distribusi' | 'nerwilis' | 'rb';

const timDefinitions: { tipe: TimTipe, nama: string, singkatan: string, deskripsi: string, penandaKetua: string, jumlahAnggota: [number, number] }[] = [
    { tipe: 'umum', nama: "Tim Bagian Umum", singkatan: "UMUM", deskripsi: "Melaksanakan urusan ketatausahaan, kepegawaian, keuangan, dan rumah tangga.", penandaKetua: 'Kepala Bagian Umum', jumlahAnggota: [4, 6] },
    { tipe: 'ipds', nama: "Tim IPDS", singkatan: "IPDS", deskripsi: "Melaksanakan kegiatan integrasi data, pengembangan sistem, pengolahan, dan diseminasi.", penandaKetua: 'Koordinator Fungsi IPDS', jumlahAnggota: [5, 7] },
    { tipe: 'sosial', nama: "Tim Statistik Sosial", singkatan: "SOS", deskripsi: "Melaksanakan statistik kependudukan, kemiskinan, pendidikan, dan kesehatan.", penandaKetua: 'Koordinator Fungsi Statistik Sosial', jumlahAnggota: [4, 6] },
    { tipe: 'produksi', nama: "Tim Statistik Produksi", singkatan: "PROD", deskripsi: "Melaksanakan statistik pertanian, industri, pertambangan, dan konstruksi.", penandaKetua: 'Koordinator Fungsi Statistik Produksi', jumlahAnggota: [4, 6] },
    { tipe: 'distribusi', nama: "Tim Statistik Distribusi", singkatan: "DIST", deskripsi: "Melaksanakan statistik harga, perdagangan, transportasi, dan pariwisata.", penandaKetua: 'Koordinator Fungsi Statistik Distribusi', jumlahAnggota: [4, 6] },
    { tipe: 'nerwilis', nama: "Tim Neraca Wilayah & Analisis Statistik", singkatan: "NERWILIS", deskripsi: "Menyusun PDRB dan melakukan analisis statistik makro.", penandaKetua: 'Koordinator Fungsi Nerwilis', jumlahAnggota: [3, 5] },
    { tipe: 'humas', nama: "Tim Humas & Pelayanan Statistik", singkatan: "HUMAS-PST", deskripsi: "Melaksanakan kegiatan kehumasan, promosi, dan pelayanan statistik.", penandaKetua: 'Staf', jumlahAnggota: [2, 4] },
    { tipe: 'rb', nama: "Tim Reformasi Birokrasi", singkatan: "RB-PI", deskripsi: "Mengkoordinasikan pelaksanaan SAKIP, ZI, dan EPSS.", penandaKetua: 'Staf', jumlahAnggota: [1, 3] },
];

const jobTitlesByTeam: Record<TimTipe, string[]> = {
    'umum': ["Analis Kepegawaian Ahli Pertama", "Pengelola Keuangan APBN", "Arsiparis Terampil", "Pengelola BMN", "Staf Tata Usaha"],
    'humas': ["Pranata Humas Ahli Pertama", "Pengelola Media Sosial", "Petugas Pelayanan Statistik Terpadu", "Pustakawan Terampil"],
    'ipds': ["Pranata Komputer Ahli Muda", "Programmer", "Administrator Jaringan", "Desainer Grafis", "Staf Pengolahan Data"],
    'sosial': ["Statistisi Ahli Muda", "Statistisi Ahli Pertama", "Surveyor Sosial", "Enumerator Sakernas"],
    'produksi': ["Statistisi Ahli Muda", "Statistisi Ahli Pertama", "Enumerator Survei Hortikultura", "Staf Statistik Produksi"],
    'distribusi': ["Statistisi Ahli Muda", "Statistisi Ahli Pertama", "Petugas Pencacah Harga", "Surveyor Transportasi"],
    'nerwilis': ["Statistisi Ahli Muda", "Analis Neraca Produksi", "Staf Analisis Lintas Sektor", "Enumerator Neraca Pengeluaran"],
    'rb': ["Analis Kebijakan Ahli Pertama", "Auditor Internal", "Agen Perubahan", "Analis Perencanaan"],
};

const originalUsers: Prisma.usersCreateInput[] = [
    { user_id: 1, nama_lengkap: 'Arianto S.Si., SE., M.Si', nip_baru: '196911091991011001', nip_lama: '1969110919', email: 'arianto@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-dzke16rm0op', foto_url: `https://ui-avatars.com/api/?name=Arianto&background=random&color=fff`, tempat_lahir: 'Jakarta', tanggal_lahir: new Date('1969-11-08T00:00:00.000Z'), jenis_kelamin: 'Laki-laki', status_kepegawaian: 'PNS', tmt_pns: new Date('1991-01-01T00:00:00.000Z'), pangkat_golongan: 'Pembina Utama Madya, IV/d', tmt_pangkat_golongan: new Date('2015-04-01T00:00:00.000Z'), jabatan_struktural: 'Kepala BPS Pusat', jenjang_jabatan_fungsional: null, tmt_jabatan: new Date('2020-01-01T00:00:00.000Z'), pendidikan_terakhir: 'S2', masa_kerja_golongan: '10 Tahun', masa_kerja_total: '34 Tahun', tanggal_pensiun: new Date('2029-11-08T00:00:00.000Z'), sisa_masa_kerja: '4 Tahun', grade: 'A', unit_kerja_eselon1: 'BPS Pusat', unit_kerja_eselon2: 'Pimpinan', password: '$2b$10$SX9TQ/jJJUvTa.md/6.z.u6gOhvBgNL67vaU5BGpTDfzyFm3.0U5S', username: 'user1', },
    { user_id: 2, nama_lengkap: 'Siti Nurdjannah SST', nip_baru: '197012191993122001', nip_lama: '1970121919', email: 'snurdjan@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-31kx0nymx2q', foto_url: `https://ui-avatars.com/api/?name=Siti+Nurdjannah&background=random&color=fff`, tempat_lahir: 'Surabaya', tanggal_lahir: new Date('1970-12-18T00:00:00.000Z'), jenis_kelamin: 'Perempuan', status_kepegawaian: 'PNS', tmt_pns: new Date('1993-12-01T00:00:00.000Z'), pangkat_golongan: 'Pembina, IV/a', tmt_pangkat_golongan: new Date('2018-10-01T00:00:00.000Z'), jabatan_struktural: 'Kepala Bagian', jenjang_jabatan_fungsional: 'Pranata Komputer Madya', tmt_jabatan: new Date('2019-05-01T00:00:00.000Z'), pendidikan_terakhir: 'D4', masa_kerja_golongan: '7 Tahun', masa_kerja_total: '32 Tahun', tanggal_pensiun: new Date('2030-12-18T00:00:00.000Z'), sisa_masa_kerja: '5 Tahun', grade: 'B', unit_kerja_eselon1: 'Sekretariat Utama', unit_kerja_eselon2: 'Biro Keuangan', password: '$2b$10$NzIq2Rsr3.1d39Iz53mpuOv2XQtK/JzECrjhKd3Gy/Fs8Wptq5F8C', username: 'user2', },
    { user_id: 3, nama_lengkap: 'Siti Nur Laelatul Badriyah SE.AK, M.Si, CA', nip_baru: '197607182011012003', nip_lama: '1976071820', email: 'sitinurlaela@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-qrotetlsh1', foto_url: 'https://ui-avatars.com/api/?name=Siti+Nur&background=random&color=fff', tempat_lahir: 'Jakarta', tanggal_lahir: new Date('1976-07-17T00:00:00.000Z'), jenis_kelamin: 'Perempuan', status_kepegawaian: 'PNS', tmt_pns: new Date('2011-01-01T00:00:00.000Z'), pangkat_golongan: 'Penata Tk. I, III/d', tmt_pangkat_golongan: new Date('2019-04-01T00:00:00.000Z'), jabatan_struktural: 'Kepala Bagian', jenjang_jabatan_fungsional: 'Analis Keuangan', tmt_jabatan: new Date('2020-02-01T00:00:00.000Z'), pendidikan_terakhir: 'S2', masa_kerja_golongan: '6 Tahun', masa_kerja_total: '14 Tahun', tanggal_pensiun: new Date('2036-07-17T00:00:00.000Z'), sisa_masa_kerja: '11 Tahun', grade: 'C', unit_kerja_eselon1: 'Sekretariat Utama', unit_kerja_eselon2: 'Biro Perencanaan', password: '$2b$10$qInPi9NumR.oYGZFohfzxuL4C2ZXoYnbOiyoEO0bsqAbAPkv36HVe', username: 'user3' },
    { user_id: 4, nama_lengkap: 'Achmad Muchlis Abdi Putra SST., MT', nip_baru: '198610142009021001', nip_lama: '1986101420', email: 'achmadmuchlis@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'admin', sso_id: 'sso-djykiyr53ip', foto_url: 'https://ui-avatars.com/api/?name=Achmad+Muchlis&background=random&color=fff', tempat_lahir: 'Medan', tanggal_lahir: new Date('1986-10-13T00:00:00.000Z'), jenis_kelamin: 'Laki-laki', status_kepegawaian: 'PNS', tmt_pns: new Date('2009-02-01T00:00:00.000Z'), pangkat_golongan: 'Penata, III/c', tmt_pangkat_golongan: new Date('2017-04-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Pranata Komputer Ahli Muda', tmt_jabatan: new Date('2018-06-01T00:00:00.000Z'), pendidikan_terakhir: 'S2', masa_kerja_golongan: '8 Tahun', masa_kerja_total: '16 Tahun', tanggal_pensiun: new Date('2046-10-13T00:00:00.000Z'), sisa_masa_kerja: '21 Tahun', grade: 'C', unit_kerja_eselon1: 'Deputi Metodologi', unit_kerja_eselon2: 'Direktorat Sistem Informasi Statistik', password: '$2b$10$rKNJeHO9qU/smZinLVGaeeT1.VvmOqyKetaX.rYrBuPyVZHKfZ2EW', username: 'admin1' },
    { user_id: 5, nama_lengkap: 'Mohamad Rivani S.IP, M.M.', nip_baru: '198103042006041001', nip_lama: '1981030420', email: 'mohamad.rivani@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-f0ai52ewgzo', foto_url: 'https://ui-avatars.com/api/?name=Mohamad+Rivani&background=random&color=fff', tempat_lahir: 'Makassar', tanggal_lahir: new Date('1981-03-03T00:00:00.000Z'), jenis_kelamin: 'Laki-laki', status_kepegawaian: 'PNS', tmt_pns: new Date('2006-04-01T00:00:00.000Z'), pangkat_golongan: 'Penata Tk. I, III/d', tmt_pangkat_golongan: new Date('2020-10-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Analis SDM Aparatur Ahli Muda', tmt_jabatan: new Date('2021-03-01T00:00:00.000Z'), pendidikan_terakhir: 'S2', masa_kerja_golongan: '5 Tahun', masa_kerja_total: '19 Tahun', tanggal_pensiun: new Date('2041-03-03T00:00:00.000Z'), sisa_masa_kerja: '16 Tahun', grade: 'C', unit_kerja_eselon1: 'Sekretariat Utama', unit_kerja_eselon2: 'Biro SDM', password: '$2b$10$NuuoWtCnXRzqRAI9lEBzBemls9/.c5s6d2PFceN9TTrekuO8.8FyW', username: 'user4' },
    { user_id: 6, nama_lengkap: 'Andri Saleh S.Si, M.I.Kom.', nip_baru: '198005162009021006', nip_lama: '1980051620', email: 'andris@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-yqsn5qcst2h', foto_url: 'https://ui-avatars.com/api/?name=Andri+Saleh&background=random&color=fff', tempat_lahir: 'Yogyakarta', tanggal_lahir: new Date('1980-05-15T00:00:00.000Z'), jenis_kelamin: 'Laki-laki', status_kepegawaian: 'PNS', tmt_pns: new Date('2009-02-01T00:00:00.000Z'), pangkat_golongan: 'Pembina, IV/a', tmt_pangkat_golongan: new Date('2022-04-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Pranata Humas Ahli Madya', tmt_jabatan: new Date('2023-01-01T00:00:00.000Z'), pendidikan_terakhir: 'S2', masa_kerja_golongan: '3 Tahun', masa_kerja_total: '16 Tahun', tanggal_pensiun: new Date('2040-05-15T00:00:00.000Z'), sisa_masa_kerja: '15 Tahun', grade: 'B', unit_kerja_eselon1: 'Sekretariat Utama', unit_kerja_eselon2: 'Biro Hubungan Masyarakat dan Hukum', password: '$2b$10$Y8BHBRohX1HyMJAOD1EyKuAvqvLxnDs5DQ7l/UnCloYjjPMYIaL1e', username: 'user5' },
    { user_id: 7, nama_lengkap: 'Muhammad Haikal Candra S.Tr.Ds.', nip_baru: '199812162022031004', nip_lama: '1998121620', email: 'haikal.candra@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-vsonvyuulc', foto_url: 'https://ui-avatars.com/api/?name=Muhammad+Haikal&background=random&color=fff', tempat_lahir: 'Jakarta', tanggal_lahir: new Date('1998-12-15T00:00:00.000Z'), jenis_kelamin: 'Laki-laki', status_kepegawaian: 'PNS', tmt_pns: new Date('2022-03-01T00:00:00.000Z'), pangkat_golongan: 'Penata Muda, III/a', tmt_pangkat_golongan: new Date('2022-03-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Pranata Komputer Ahli Pertama', tmt_jabatan: new Date('2022-04-01T00:00:00.000Z'), pendidikan_terakhir: 'D4', masa_kerja_golongan: '3 Tahun', masa_kerja_total: '3 Tahun', tanggal_pensiun: new Date('2058-12-15T00:00:00.000Z'), sisa_masa_kerja: '33 Tahun', grade: 'D', unit_kerja_eselon1: 'Deputi Statistik Sosial', unit_kerja_eselon2: 'Direktorat Statistik Kesejahteraan Rakyat', password: '$2b$10$XUHrUUTieK8qApUBqChx.e26DrJ4Y5Vg3DT7k1tGU6r4BjMD6g2gK', username: 'user6' },
    { user_id: 8, nama_lengkap: 'Bagus Ardiansyah S.Tr.Stat.', nip_baru: '199605282019121001', nip_lama: '1996052820', email: 'bagus.ardi@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-pc6spkbw0va', foto_url: 'https://ui-avatars.com/api/?name=Bagus+Ardiansyah&background=random&color=fff', tempat_lahir: 'Semarang', tanggal_lahir: new Date('1996-05-27T00:00:00.000Z'), jenis_kelamin: 'Laki-laki', status_kepegawaian: 'PNS', tmt_pns: new Date('2019-12-01T00:00:00.000Z'), pangkat_golongan: 'Penata Muda Tk. I, III/b', tmt_pangkat_golongan: new Date('2023-10-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Statistisi Ahli Pertama', tmt_jabatan: new Date('2020-01-01T00:00:00.000Z'), pendidikan_terakhir: 'D4', masa_kerja_golongan: '2 Tahun', masa_kerja_total: '6 Tahun', tanggal_pensiun: new Date('2056-05-27T00:00:00.000Z'), sisa_masa_kerja: '31 Tahun', grade: 'C', unit_kerja_eselon1: 'Deputi Statistik Produksi', unit_kerja_eselon2: 'Direktorat Statistik Pertanian', password: '$2b$10$tyEKUM1Z3mkwaGsKmVrT2OJZGZOFaf.iDje2Y14RheIozitcfFzGS', username: 'user7' },
    { user_id: 9, nama_lengkap: 'Aliyah Salsabila Hakim S.Hum.', nip_baru: '200108122024032004', nip_lama: '2001081220', email: 'aliyah.salsabila@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-eiy0p3taf1a', foto_url: 'https://ui-avatars.com/api/?name=Aliyah+Salsabila&background=random&color=fff', tempat_lahir: 'Padang', tanggal_lahir: new Date('2001-08-11T00:00:00.000Z'), jenis_kelamin: 'Perempuan', status_kepegawaian: 'PNS', tmt_pns: new Date('2024-03-01T00:00:00.000Z'), pangkat_golongan: 'Penata Muda, III/a', tmt_pangkat_golongan: new Date('2024-03-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Arsiparis Ahli Pertama', tmt_jabatan: new Date('2024-04-01T00:00:00.000Z'), pendidikan_terakhir: 'S1', masa_kerja_golongan: '1 Tahun', masa_kerja_total: '1 Tahun', tanggal_pensiun: new Date('2061-08-11T00:00:00.000Z'), sisa_masa_kerja: '36 Tahun', grade: 'D', unit_kerja_eselon1: 'Sekretariat Utama', unit_kerja_eselon2: 'Biro Umum', password: '$2b$10$GW6MyLnh3AO6/hJQqwvfZOzeoYG200FRTlfZ8PMHq6kEM0h9h9Msy', username: 'user8' },
    { user_id: 10, nama_lengkap: 'Dira Afiani S.S.', nip_baru: '200009302023032005', nip_lama: '2000093020', email: 'dira.afiani@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'user', sso_id: 'sso-lw4qtd610oi', foto_url: 'https://ui-avatars.com/api/?name=Dira+Afiani&background=random&color=fff', tempat_lahir: 'Denpasar', tanggal_lahir: new Date('2000-09-29T00:00:00.000Z'), jenis_kelamin: 'Perempuan', status_kepegawaian: 'PNS', tmt_pns: new Date('2023-03-01T00:00:00.000Z'), pangkat_golongan: 'Penata Muda, III/a', tmt_pangkat_golongan: new Date('2023-03-01T00:00:00.000Z'), jabatan_struktural: null, jenjang_jabatan_fungsional: 'Pustakawan Ahli Pertama', tmt_jabatan: new Date('2023-04-01T00:00:00.000Z'), pendidikan_terakhir: 'S1', masa_kerja_golongan: '2 Tahun', masa_kerja_total: '2 Tahun', tanggal_pensiun: new Date('2060-09-29T00:00:00.000Z'), sisa_masa_kerja: '35 Tahun', grade: 'D', unit_kerja_eselon1: 'Deputi Metodologi', unit_kerja_eselon2: 'Pusat Pendidikan dan Pelatihan', password: '$2b$10$ADpJajulmvH.J3sklFJEKOPQ0F/N.Mxzl253deD6IyN7OYCc8/6d6', username: 'user9' },
    { user_id: 11, nama_lengkap: 'Aina Sabedah Fitri S.Si, MSE', nip_baru: '197709101999122001', nip_lama: '1977091019', email: 'aina@bps.go.id', unit_kerja: { connect: { org_unit_id: 1 } }, role: 'admin', sso_id: 'sso-qn6kten948', foto_url: `https://ui-avatars.com/api/?name=Aina+Sabedah&background=random&color=fff`, tempat_lahir: 'Bandung', tanggal_lahir: new Date('1977-09-09T00:00:00.000Z'), jenis_kelamin: 'Perempuan', status_kepegawaian: 'PNS', tmt_pns: new Date('1999-12-01T00:00:00.000Z'), pangkat_golongan: 'Pembina Tk. I, IV/b', tmt_pangkat_golongan: new Date('2021-04-01T00:00:00.000Z'), jabatan_struktural: 'Kepala Biro', jenjang_jabatan_fungsional: 'Statistisi Ahli Utama', tmt_jabatan: new Date('2022-02-01T00:00:00.000Z'), pendidikan_terakhir: 'S2', masa_kerja_golongan: '4 Tahun', masa_kerja_total: '26 Tahun', tanggal_pensiun: new Date('2037-09-09T00:00:00.000Z'), sisa_masa_kerja: '12 Tahun', grade: 'A', unit_kerja_eselon1: 'Sekretariat Utama', unit_kerja_eselon2: 'Biro Hubungan Masyarakat dan Hukum', password: '$2b$10$l6wasOijORgKX6ayix.JGeoRkL2sjhJa54EvI.5wqn.TuHGRn6z5W', username: 'admin2', },
];

export async function seedOrganizationsAndUsers(tx: TransactionClient) {
    console.log(`- Membersihkan data lama (tim, anggota, user generate, unit provinsi)...`);
    await tx.team_memberships.deleteMany({});
    await tx.teams.deleteMany({});
    await tx.users.deleteMany({ where: { user_id: { notIn: originalUsers.map(u => u.user_id as number) } } });
    await tx.organization_units.deleteMany({ where: { org_unit_id: { not: 1 } } });

    console.log(`- Membuat ulang unit organisasi...`);
    const pusatUnit = await tx.organization_units.upsert({
        where: { kode_bps: '0000' },
        update: { nama_satker_lengkap: 'BPS Republik Indonesia' },
        create: { org_unit_id: 1, nama_wilayah: 'Nasional', kode_bps: '0000', nama_satker_lengkap: 'BPS Republik Indonesia', alamat_kantor: 'Jl. Dr. Sutomo No. 6-8, Jakarta Pusat', telepon_kantor: '(021) 3841195', homepage_satker: 'https://www.bps.go.id' }
    });
    for (const prov of provinceDefinitions) {
        await tx.organization_units.create({
            data: {
                nama_wilayah: prov.namaWilayah,
                kode_bps: prov.kodeBps,
                nama_satker_lengkap: `BPS Provinsi ${prov.namaWilayah}`,
                parent_unit_id: pusatUnit.org_unit_id,
                alamat_kantor: prov.alamat,
                telepon_kantor: prov.telepon,
                homepage_satker: prov.web,
            }
        });
    }

    console.log(`-> Memasukkan user...`);
    for (const userData of originalUsers) {
        await tx.users.upsert({ where: { user_id: userData.user_id }, update: userData, create: userData });
    }
    
    let userIdCounter = 12;
    const allProvincialUnits = await tx.organization_units.findMany({ where: { parent_unit_id: pusatUnit.org_unit_id } });

    for (const unit of allProvincialUnits) {
        const usersToCreate = [
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Dr. Kepala ${unit.nama_wilayah}`, 'Kepala BPS Provinsi', null),
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Kabag Umum ${unit.nama_wilayah}`, 'Kepala Bagian Umum', null),
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Koordinator IPDS ${unit.nama_wilayah}`, null, 'Koordinator Fungsi IPDS'),
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Koordinator Sosial ${unit.nama_wilayah}`, null, 'Koordinator Fungsi Statistik Sosial'),
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Koordinator Produksi ${unit.nama_wilayah}`, null, 'Koordinator Fungsi Statistik Produksi'),
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Koordinator Distribusi ${unit.nama_wilayah}`, null, 'Koordinator Fungsi Statistik Distribusi'),
            createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Koordinator Nerwilis ${unit.nama_wilayah}`, null, 'Koordinator Fungsi Nerwilis'),
        ];
        for (let i = 0; i < 15; i++) {
            usersToCreate.push(createCompleteUser(userIdCounter++, Number(unit.org_unit_id), `Staf Pelaksana ${unit.nama_wilayah} ${i + 1}`, null, 'Staf'));
        }
        
        // FIX: Menggunakan perulangan upsert, bukan createMany
        for (const userData of usersToCreate) {
            await tx.users.upsert({
                where: { user_id: userData.user_id },
                update: userData,
                create: userData,
            });
        }
    }
    
    console.log(`-> Menetapkan pimpinan & membuat tim...`);
    await tx.organization_units.update({ where: { org_unit_id: 1 }, data: { kepala_id: 1 } });

    const allGeneratedUsers = await tx.users.findMany({ where: { user_id: { gte: 12 } } });
    for (const unit of allProvincialUnits) {
        const kepala = allGeneratedUsers.find(u => u.unit_kerja_id === unit.org_unit_id && u.jabatan_struktural === 'Kepala BPS Provinsi');
        if (kepala) {
            await tx.organization_units.update({ where: { org_unit_id: unit.org_unit_id }, data: { kepala_id: kepala.user_id } });
        }
    }

    const allUnits = await tx.organization_units.findMany();
    const allUsers = await tx.users.findMany();
    for (const unit of allUnits) {
        const usersInUnit = allUsers.filter(u => u.unit_kerja_id === unit.org_unit_id);
        if (usersInUnit.length < 5) continue;
        
        const assignedLeaderIds = new Set<bigint>();
        for (const timDef of timDefinitions) {
            const ketuaTim = usersInUnit.find(u => !assignedLeaderIds.has(u.user_id) && (u.jabatan_struktural === timDef.penandaKetua || u.jenjang_jabatan_fungsional === timDef.penandaKetua || (timDef.penandaKetua === 'Staf' && u.jenjang_jabatan_fungsional === 'Staf')));
            if (!ketuaTim) continue;

            assignedLeaderIds.add(ketuaTim.user_id);
            const namaTim = `${timDef.nama} ${unit.nama_wilayah === 'Nasional' ? 'Pusat' : unit.nama_wilayah}`;

            const tim = await tx.teams.create({
                data: {
                    nama_tim: namaTim, singkatan: timDef.singkatan, deskripsi: timDef.deskripsi,
                    org_unit_id: unit.org_unit_id, ketua_tim_id: ketuaTim.user_id,
                }
            });
            
            const anggotaPool = usersInUnit.filter(u => u.user_id !== ketuaTim.user_id);
            const jumlahAnggota = Math.min(anggotaPool.length, randomInt(timDef.jumlahAnggota[0], timDef.jumlahAnggota[1]));
            const selectedAnggota = anggotaPool.slice(0, jumlahAnggota);

            if (selectedAnggota.length > 0) {
                const membershipsToCreate = selectedAnggota.map(anggota => ({
                    team_id: tim.team_id, user_id: anggota.user_id, posisi: randomPick(jobTitlesByTeam[timDef.tipe])
                }));
                await tx.team_memberships.createMany({ data: membershipsToCreate, skipDuplicates: true });
            }
        }
    }
    console.log(`✅ Seeding Organisasi, User, & Tim selesai.`);
}

export {};
