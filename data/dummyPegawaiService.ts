// src/data/dummyPegawaiService.ts
import type {
  DetailPegawaiData,
  RiwayatPendidikanItem,
  RiwayatJabatanItem,
  KompetensiItem,
  PrestasiItem,
  Pejabat, // Pastikan tipe Pejabat di sini sudah diupdate di pegawai.ts dengan nipUntukDetail?
  // AnggotaTim,
  // NewsItem
} from '@/types/pegawai';

// Impor dataStatistikLengkap yang "mentah" dan alias sebagai rawDataStatistikLengkap
// Hapus impor duplikat
import { dataStatistikLengkap as rawDataStatistikLengkap, DataStatistikNasional } from './statistikProvinsi';

// --- Helper Arrays & Functions (Sama seperti yang Anda berikan, sudah lengkap) ---
const firstNamesM = ["Agus", "Budi", "Eka", "Fajar", "Gilang", "Hari", "Indra", "Joko", "Muhammad", "Putu", "Rizki", "Tono", "Umar", "Wahyu", "Zaki", "Bayu", "Eko", "Surya", "Dimas", "Reza", "Doni", "Rian", "Fahmi", "Ivan", "Kevin", "Adi", "Arif", "Dedi", "Hendra", "Lukman"];
const firstNamesF = ["Citra", "Dewi", "Fitri", "Kartika", "Lina", "Nurul", "Retno", "Sari", "Vina", "Yulia", "Sri", "Rina", "Dian", "Ayu", "Ratna", "Indah", "Maya", "Siti", "Putri", "Eka", "Bella", "Cindy", "Gita", "Hana", "Lia", "Ani", "Eva", "Ida", "Lusi", "Nina"];
const lastNames = ["Santoso", "Wijaya", "Kusuma", "Lestari", "Pratama", "Setiawan", "Nugroho", "Wulandari", "Hidayat", "Putri", "Rahman", "Halim", "Siregar", "Utami", "Firmansyah", "Saputra", "Gunawan", "Hasanah", "Purnama", "Abdullah", "Maulana", "Sinaga", "Tambunan", "Nasution", "Pangaribuan", "Simanjuntak", "Lubis", "Daulay"];
const gelarDepanGlobal = ["", "Dr.", "Ir.", "Drs.", "Dra.", "Prof. Dr. Ir. H.", "Prof. Dra. Hj.", "H.", "Hj."];
const gelarBelakangGlobal = ["", "S.Stat.", "S.Si.", "S.E.", "S.Kom.", "S.Sos.", "S.H.", "S.IP.", "S.Pt.", "S.P.", "S.T.", "M.Stat.", "M.Si.", "M.M.", "M.Ec.Dev.", "M.Sc.", "Ph.D.", "M.Eng.", "M.Kom.", "M.H.", "A.Md.Stat.", "A.Md.Ak.", "A.Md.Kom."];

const jenjangJabatanFungsionalOptionsGlobal = [
    "Statistisi Ahli Pertama", "Statistisi Ahli Muda", "Statistisi Ahli Madya", "Statistisi Ahli Utama",
    "Statistisi Terampil Pelaksana", "Statistisi Terampil Pelaksana Lanjutan", "Statistisi Terampil Penyelia",
    "Pranata Komputer Ahli Pertama", "Pranata Komputer Ahli Muda", "Pranata Komputer Ahli Madya", "Pranata Komputer Ahli Utama",
    "Pranata Komputer Terampil Pelaksana", "Pranata Komputer Terampil Pelaksana Lanjutan", "Pranata Komputer Terampil Penyelia",
    "Analis SDM Aparatur Ahli Pertama", "Analis SDM Aparatur Ahli Muda", "Analis SDM Aparatur Ahli Madya",
    "Perencana Ahli Pertama", "Perencana Ahli Muda", "Perencana Ahli Madya",
    "Auditor Ahli Pertama", "Auditor Ahli Muda", "Auditor Ahli Madya",
    "Arsiparis Terampil", "Arsiparis Ahli Pertama", "Arsiparis Ahli Muda", "Arsiparis Penyelia",
    "Pranata Humas Ahli Pertama", "Pranata Humas Ahli Muda",
    "Analis Anggaran Ahli Muda", "Analis Pengelolaan Keuangan APBN Ahli Muda", "Bendahara",
];

const pangkatGolonganOptionsGlobal = [
    { pangkat: "Juru Muda", golongan: "I/a" }, { pangkat: "Juru Muda Tk. I", golongan: "I/b" }, { pangkat: "Juru", golongan: "I/c" }, { pangkat: "Juru Tk. I", golongan: "I/d" },
    { pangkat: "Pengatur Muda", golongan: "II/a" }, { pangkat: "Pengatur Muda Tk. I", golongan: "II/b" }, { pangkat: "Pengatur", golongan: "II/c" }, { pangkat: "Pengatur Tk. I", golongan: "II/d" },
    { pangkat: "Penata Muda", golongan: "III/a" }, { pangkat: "Penata Muda Tk. I", golongan: "III/b" }, { pangkat: "Penata", golongan: "III/c" }, { pangkat: "Penata Tk. I", golongan: "III/d" },
    { pangkat: "Pembina", golongan: "IV/a" }, { pangkat: "Pembina Tk. I", golongan: "IV/b" }, { pangkat: "Pembina Utama Muda", golongan: "IV/c" }, { pangkat: "Pembina Utama Madya", golongan: "IV/d" }, { pangkat: "Pembina Utama", golongan: "IV/e" }
];

const statusKepegawaianOptionsGlobal = ["PNS", "CPNS", "PPPK"] as NonNullable<DetailPegawaiData['statusKepegawaian']>[];
const jenisKelaminOptionsGlobal = ["Laki-laki", "Perempuan"] as NonNullable<DetailPegawaiData['jenisKelamin']>[];
const kotaLahirOptionsGlobal = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Makassar", "Palembang", "Padang", "Denpasar", "Banda Aceh", "Pekanbaru", "Jambi", "Pontianak", "Banjarmasin", "Samarinda", "Manado", "Ambon", "Jayapura", "Mataram"];

type JenjangPendidikanType = NonNullable<RiwayatPendidikanItem['jenjang']>;
const jenjangPendidikanInternalOrder: JenjangPendidikanType[] = ["SMA/SMK", "D-I", "D-II", "D-III", "D-IV", "S1", "S2", "S3", "Profesi", "Sp-I", "Sp-II"];

const institusiPendidikanGlobal: Record<JenjangPendidikanType, string[]> = {
    "SMA/SMK": ["SMA Negeri 1 Kota X", "SMK Negeri 2 Jurusan Y", "MAN Model Z"],
    "D-I": ["PKN STAN (D-I Kebendaharaan Negara)", "Politeknik APP (D-I Administrasi Bisnis)"],
    "D-II": ["Akademi Meteorologi dan Geofisika (D-II Instrumentasi)", "Politeknik Kesehatan (D-II Gizi)"],
    "D-III": ["Politeknik Statistika STIS (D-III Statistika)", "Politeknik Negeri Jakarta (D-III Akuntansi)", "Universitas Terbuka (D-III Perpajakan)"],
    "D-IV": ["Politeknik Statistika STIS (D-IV Komputasi Statistik)", "Politeknik Keuangan Negara STAN (D-IV Akuntansi)", "Universitas Gadjah Mada (D-IV Metrologi)"],
    "S1": ["Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada", "Institut Pertanian Bogor", "Universitas Airlangga", "Universitas Diponegoro", "Universitas Padjadjaran", "Universitas Brawijaya", "Universitas Sebelas Maret"],
    "S2": ["Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada", "Institut Pertanian Bogor", "Australian National University", "University of Tokyo"],
    "S3": ["Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada", "Harvard University", "Stanford University", "Massachusetts Institute of Technology"],
    "Profesi": ["Program Profesi Insinyur ITB", "Pendidikan Profesi Akuntan UI"],
    "Sp-I": ["Spesialis Penyakit Dalam FKUI", "Spesialis Anak FK UGM"],
    "Sp-II": ["Subspesialis Kardiovaskular FKUI"],
};

const jurusanPendidikanGlobal: Partial<Record<JenjangPendidikanType, string[]>> = {
    "SMA/SMK": ["IPA", "IPS", "Bahasa", "Teknik Komputer Jaringan", "Akuntansi", "Multimedia"],
    "D-III": ["Statistika", "Komputerisasi Akuntansi", "Manajemen Informatika", "Teknik Sipil", "Keperawatan"],
    "D-IV": ["Komputasi Statistik", "Statistika Ekonomi", "Akuntansi Sektor Publik", "Manajemen Rekayasa Konstruksi"],
    "S1": ["Statistika", "Matematika", "Ilmu Komputer", "Sistem Informasi", "Ekonomi Pembangunan", "Manajemen", "Akuntansi", "Sosiologi", "Ilmu Pemerintahan", "Hukum", "Teknik Informatika", "Agribisnis"],
    "S2": ["Statistika Terapan", "Ilmu Ekonomi", "Magister Manajemen", "Ilmu Komputer", "Kebijakan Publik"],
    "S3": ["Ilmu Ekonomi", "Statistika", "Sociology", "Public Policy"],
    "Profesi": ["Insinyur", "Akuntan", "Apoteker"],
    "Sp-I": ["Penyakit Dalam", "Anak", "Bedah Umum"],
    "Sp-II": ["Kardiovaskular", "Onkologi Bedah"],
};

const kompetensiListGlobal = ["Analisis Big Data dengan Spark", "Manajemen Proyek Agile (Scrum Master)", "Python untuk Sains Data (Advanced)", "Tableau Data Visualization", "Microsoft Excel (Expert Level)", "Audit Kinerja Sektor Publik", "Penyusunan Naskah Akademik", "Fasilitasi Pelatihan", "Structural Equation Modeling (SEM)", "Machine Learning Operations (MLOps)", "Cloud Computing (AWS Certified Solutions Architect)"];
const penyelenggaraKompetensiGlobal = ["Pusdiklat BPS", "LSPN (Lembaga Sertifikasi Profesi Nasional)", "Coursera", "Udemy", "EdX", "Project Management Institute (PMI)", "Google Cloud", "Amazon Web Services", "Microsoft Learning"];
const prestasiListGlobal = ["Pegawai Teladan Tingkat Nasional", "Inovasi Layanan Publik Terbaik", "Juara I Lomba Karya Tulis Ilmiah BPS", "Satyalancana Karya Satya X Tahun", "Satyalancana Karya Satya XX Tahun", "Satyalancana Karya Satya XXX Tahun", "Penghargaan Tim Terbaik Proyek Sensus Penduduk", "Auditor Terbaik Inspektorat"];
const tingkatPrestasiGlobal = ["Instansi", "Kabupaten/Kota", "Provinsi", "Nasional", "Internasional"] as NonNullable<PrestasiItem['tingkat']>[];

const unitKerjaEselon1BPSRIGlobal: string[] = [
    "Sekretariat Utama",
    "Deputi Bidang Statistik Sosial",
    "Deputi Bidang Statistik Produksi",
    "Deputi Bidang Statistik Distribusi dan Jasa",
    "Deputi Bidang Neraca dan Analisis Statistik",
    "Deputi Bidang Metodologi dan Informasi Statistik",
    "Inspektorat Utama",
    "Pusat Pendidikan dan Pelatihan",
];
const unitKerjaEselon2BPSRIGlobal: Record<string, string[]> = {
    "Sekretariat Utama": ["Biro Kepegawaian", "Biro Keuangan", "Biro Perencanaan", "Biro Hukum dan Organisasi", "Biro Umum dan Pengadaan"],
    "Deputi Bidang Statistik Sosial": ["Direktorat Statistik Kependudukan dan Ketenagakerjaan", "Direktorat Statistik Kesejahteraan Rakyat", "Direktorat Statistik Ketahanan Sosial"],
    "Deputi Bidang Statistik Produksi": ["Direktorat Statistik Tanaman Pangan, Hortikultura, dan Perkebunan", "Direktorat Statistik Peternakan, Perikanan, dan Kehutanan", "Direktorat Statistik Industri"],
    "Deputi Bidang Statistik Distribusi dan Jasa": ["Direktorat Statistik Harga", "Direktorat Statistik Distribusi", "Direktorat Statistik Jasa dan Pariwisata"],
    "Deputi Bidang Neraca dan Analisis Statistik": ["Direktorat Neraca Produksi", "Direktorat Neraca Pengeluaran", "Direktorat Analisis dan Pengembangan Statistik"],
    "Deputi Bidang Metodologi dan Informasi Statistik": ["Direktorat Pengembangan Metodologi Sensus dan Survei", "Direktorat Diseminasi Statistik", "Direktorat Sistem Informasi Statistik"],
    "Inspektorat Utama": ["Inspektorat Wilayah I", "Inspektorat Wilayah II", "Inspektorat Wilayah III"],
    "Pusat Pendidikan dan Pelatihan": ["Bidang Penyelenggaraan Diklat Teknis dan Fungsional", "Bidang Program dan Evaluasi Diklat"]
};

const bulanAngkat = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const formatDate = (date: Date): string => `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
const randomDate = (startYear: number, endYear: number, startMonth: number = 0, endMonth: number = 11, startDay: number = 1, endDay: number = 28) => {
    const year = randomInt(startYear, endYear);
    const month = randomInt(startMonth, endMonth);
    const day = randomInt(startDay, endDay);
    return new Date(year, month, day);
};

const generateNip = (tanggalLahir: Date, jenisKelaminCode: string, tahunAngkat: number, bulanAngkatPNS: string): string => {
  const yl = tanggalLahir.getFullYear().toString();
  const ml = (tanggalLahir.getMonth() + 1).toString().padStart(2, '0');
  const dl = tanggalLahir.getDate().toString().padStart(2, '0');
  const ta = String(tahunAngkat).slice(-4);
  const nomorUrut = randomInt(1, 999).toString().padStart(3, '0');
  return `${yl}${ml}${dl}${ta}${bulanAngkatPNS}${jenisKelaminCode}${nomorUrut}`;
};

const getAvatar = (name: string): string => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=random&color=fff&font-size=0.33&bold=true&rounded=true`;

// Implementasi fungsi generateRiwayat... (diasumsikan sudah lengkap dan benar dari sebelumnya)
const generateRiwayatPendidikan = (pegawaiId: string, tahunLahir: number): RiwayatPendidikanItem[] => { /* ... (implementasi lengkap) ... */ 
    const riwayat: RiwayatPendidikanItem[] = [];
    let currentYear = tahunLahir + 18; 
    let lastJenjangIndex = jenjangPendidikanInternalOrder.indexOf("SMA/SMK");
    if (lastJenjangIndex === -1) lastJenjangIndex = 0; // Fallback

    const jenjangSMA: JenjangPendidikanType = "SMA/SMK";
    const institusiSMA = institusiPendidikanGlobal[jenjangSMA] || ["Sekolah Menengah Atas"];
    const jurusanSMAOptions = jurusanPendidikanGlobal[jenjangSMA] || ["Umum"];
    const namaSekolahSMA = randomElement(institusiSMA);
    const jurusanSMA = randomElement(jurusanSMAOptions);
    riwayat.push({
        id: `${pegawaiId}-pend-0`,
        jenjang: jenjangSMA,
        namaSekolahInstitusi: namaSekolahSMA,
        jurusan: jurusanSMA,
        pendidikan: `${jenjangSMA} ${jurusanSMA} - ${namaSekolahSMA}`,
        tahunLulus: String(currentYear),
        tanggalIjazah: formatDate(new Date(currentYear, randomInt(5,7), randomInt(1,28)))
    });

    const maxJenjangPendidikanTinggi = randomInt(1,3); 
    for (let i = 0; i < maxJenjangPendidikanTinggi; i++) {
        const randomDuration = jenjangPendidikanInternalOrder[lastJenjangIndex + 1]?.startsWith('D') ? randomInt(2,3) : randomInt(3,4);
        currentYear += randomDuration; 
        if (currentYear > new Date().getFullYear() -1 ) break; 

        let nextJenjangIndex = randomInt(lastJenjangIndex + 1, jenjangPendidikanInternalOrder.indexOf("S1"));
        if (i > 0) { 
            nextJenjangIndex = randomInt(Math.max(lastJenjangIndex + 1, jenjangPendidikanInternalOrder.indexOf("S1")), jenjangPendidikanInternalOrder.indexOf("S3"));
        }
        if (nextJenjangIndex >= jenjangPendidikanInternalOrder.length || nextJenjangIndex <= lastJenjangIndex) {
             // Jika index tidak valid atau tidak naik, coba cari jenjang yang lebih tinggi sedikit saja
            nextJenjangIndex = lastJenjangIndex + 1;
            if (nextJenjangIndex >= jenjangPendidikanInternalOrder.length) break; // Stop jika sudah S3 atau jenjang tertinggi
        }

        const jenjang = jenjangPendidikanInternalOrder[nextJenjangIndex];
        const institusiOptions = institusiPendidikanGlobal[jenjang];
        const jurusanOptions = jurusanPendidikanGlobal[jenjang];

        if (!institusiOptions || institusiOptions.length === 0) continue;

        const namaInstitusi = randomElement(institusiOptions);
        const jurusan = jurusanOptions && jurusanOptions.length > 0 ? randomElement(jurusanOptions) : "Studi Umum";
        
        riwayat.unshift({ 
            id: `${pegawaiId}-pend-${i+1}`,
            jenjang: jenjang,
            namaSekolahInstitusi: namaInstitusi,
            jurusan: jurusan,
            pendidikan: `${jenjang} ${jurusan} - ${namaInstitusi}`,
            tahunLulus: String(currentYear),
            tanggalIjazah: formatDate(new Date(currentYear, randomInt(6,9), randomInt(1,28))) // Ijazah biasanya setelah pertengahan tahun
        });
        lastJenjangIndex = nextJenjangIndex;
        if (jenjang === "S3") break;
    }
    return riwayat;
};
const generateRiwayatJabatan = (pegawaiId: string, tmtPnsTahun: number, namaSatkerLengkapAwal: string, jabatanStrukturalSaatIni?: string, jenjangFungsionalSaatIni?: string): RiwayatJabatanItem[] => { /* ... (implementasi lengkap) ... */
    const riwayat: RiwayatJabatanItem[] = [];
    let currentYear = tmtPnsTahun;
    const today = new Date();
    const endYearLimit = today.getFullYear();

    let jabatanAwal = randomElement(jenjangJabatanFungsionalOptionsGlobal.filter(j => j.includes("Pertama") || j.includes("Terampil") || j.includes("Pelaksana")));
    if (Math.random() < 0.2) jabatanAwal = "Calon Pegawai Negeri Sipil";

    const tmtAwal = new Date(currentYear, randomInt(0,5), randomInt(1,28));
    riwayat.push({
        id: `${pegawaiId}-jab-0`,
        jabatan: jabatanAwal,
        unitKerja: namaSatkerLengkapAwal,
        periodeMulai: formatDate(tmtAwal),
        periodeSelesai: (jabatanStrukturalSaatIni || jenjangFungsionalSaatIni) ? formatDate(new Date(currentYear + randomInt(2,4), randomInt(0,11), randomInt(1,28))) : "Sekarang",
        noSK: `SK.${randomInt(100,999)}/${randomInt(1,12)}/${currentYear}`,
        tmt: formatDate(tmtAwal)
    });
    currentYear += randomInt(3,5);

    const jumlahJabatanLain = randomInt(0,3); // Bisa jadi tidak ada riwayat lain
    for (let i = 1; i <= jumlahJabatanLain && currentYear < endYearLimit; i++) {
        if (currentYear >= endYearLimit -1) break; // Beri jeda 1 tahun sebelum tahun ini
        
        const isLastLoopPlanned = i === jumlahJabatanLain;
        let jabatanBerikutnya: string;

        if (isLastLoopPlanned && (jabatanStrukturalSaatIni || jenjangFungsionalSaatIni)) {
            jabatanBerikutnya = jabatanStrukturalSaatIni || jenjangFungsionalSaatIni!;
        } else {
            if (Math.random() < 0.7) { // Lebih banyak fungsional
                jabatanBerikutnya = randomElement(jenjangJabatanFungsionalOptionsGlobal.filter(j => !j.toLowerCase().includes(jabatanAwal.toLowerCase()))); // coba cari jabatan berbeda
            } else {
                const eselon = randomElement(["Kepala Subbagian", "Kepala Seksi", "Kepala Bidang", "Kepala Balai"]);
                const bagian = randomElement(["Umum dan Kepegawaian", "Statistik Sosial", "Statistik Produksi", "IPDS", "Neraca Wilayah", "Teknis dan Metodologi"]);
                jabatanBerikutnya = `${eselon} ${bagian}`;
            }
        }
        if(jabatanBerikutnya === riwayat[0].jabatan) jabatanBerikutnya = randomElement(jenjangJabatanFungsionalOptionsGlobal); // minimal ganti jika sama persis


        const periodeMulaiDate = new Date(currentYear, randomInt(0,11), randomInt(1,28));
        let periodeSelesaiJabatan: string | undefined = "Sekarang";
        const nextJabatanStartYear = currentYear + randomInt(2,5);


        if (isLastLoopPlanned && (jabatanStrukturalSaatIni || jenjangFungsionalSaatIni)) {
            periodeSelesaiJabatan = "Sekarang";
        } else if (nextJabatanStartYear < endYearLimit) {
             periodeSelesaiJabatan = formatDate(new Date(nextJabatanStartYear -1 , 11, 31)); // Akhir tahun sebelum jabatan baru
        } else {
            periodeSelesaiJabatan = "Sekarang";
        }
        
        if (riwayat.length > 0 && riwayat[0].periodeSelesai === "Sekarang" && periodeSelesaiJabatan !== "Sekarang") {
            const tglMulaiJabatanSebelumnya = new Date(riwayat[0].periodeMulai.split('-').reverse().join('-'));
            let tglSelesaiJabatanSebelumnya = new Date(periodeMulaiDate.getFullYear(), periodeMulaiDate.getMonth(), periodeMulaiDate.getDate() -1);
             if (tglSelesaiJabatanSebelumnya < tglMulaiJabatanSebelumnya) {
                tglSelesaiJabatanSebelumnya = new Date(periodeMulaiDate.getFullYear(), periodeMulaiDate.getMonth() > 0 ? periodeMulaiDate.getMonth()-1 : 11, randomInt(20,28));
                 if (tglSelesaiJabatanSebelumnya < tglMulaiJabatanSebelumnya && periodeMulaiDate.getFullYear() > tglMulaiJabatanSebelumnya.getFullYear()) {
                    tglSelesaiJabatanSebelumnya = new Date(periodeMulaiDate.getFullYear()-1, 11, randomInt(20,28));
                 }
            }
            riwayat[0].periodeSelesai = formatDate(tglSelesaiJabatanSebelumnya);
        }

        riwayat.unshift({
            id: `${pegawaiId}-jab-${i}`,
            jabatan: jabatanBerikutnya,
            unitKerja: namaSatkerLengkapAwal, // Untuk sederhana, unit kerja diasumsikan sama
            periodeMulai: formatDate(periodeMulaiDate),
            periodeSelesai: periodeSelesaiJabatan,
            noSK: `SK.${randomInt(50,800)}/${randomInt(1,12)}/${periodeMulaiDate.getFullYear()}`,
            tmt: formatDate(periodeMulaiDate)
        });
        
        if (periodeSelesaiJabatan === "Sekarang") break;
        currentYear = nextJabatanStartYear;
    }
    return riwayat;
};
const generateKompetensi = (pegawaiId: string, jumlah: number = randomInt(0,3)): KompetensiItem[] => { /* ... (implementasi lengkap) ... */ 
    const kompetensi: KompetensiItem[] = [];
    if (jumlah === 0) return kompetensi;
    const usedKompetensi: Set<string> = new Set();

    for (let i = 0; i < jumlah; i++) {
        let namaKompetensi = randomElement(kompetensiListGlobal);
        let attempts = 0;
        while(usedKompetensi.has(namaKompetensi) && attempts < kompetensiListGlobal.length) {
            namaKompetensi = randomElement(kompetensiListGlobal);
            attempts++;
        }
        if (usedKompetensi.has(namaKompetensi) && attempts >= kompetensiListGlobal.length) break;
        usedKompetensi.add(namaKompetensi);

        const tahunPerolehan = randomInt(new Date().getFullYear() - 10, new Date().getFullYear());
        const tanggalPerolehan = randomDate(tahunPerolehan, tahunPerolehan, 0,11,1,28); // Any month, any day
        const berlaku = Math.random() < 0.3 ? "Seumur Hidup" : formatDate(randomDate(tahunPerolehan + 2, tahunPerolehan + 5, tanggalPerolehan.getMonth(), 11, tanggalPerolehan.getDate()));
        
        kompetensi.push({
            id: `${pegawaiId}-komp-${i}`,
            tanggal: formatDate(tanggalPerolehan),
            namaKompetensi,
            penyelenggara: randomElement(penyelenggaraKompetensiGlobal),
            nomorSertifikat: `SERT/${randomInt(1000,9999)}/${pegawaiId.substring(Math.max(0, pegawaiId.length - 4))}/${tahunPerolehan}`,
            berlakuSampai: berlaku
        });
    }
    return kompetensi.sort((a,b) => new Date(b.tanggal.split('-').reverse().join('-')).getTime() - new Date(a.tanggal.split('-').reverse().join('-')).getTime());

};
const generatePrestasi = (pegawaiId: string, jumlah: number = randomInt(0,1)): PrestasiItem[] => { /* ... (implementasi lengkap) ... */
    const prestasi: PrestasiItem[] = [];
    if (jumlah === 0) return prestasi;
    const usedPrestasi: Set<string> = new Set();

    for (let i = 0; i < jumlah; i++) {
        let namaPrestasi = randomElement(prestasiListGlobal);
        let attempts = 0;
        while(usedPrestasi.has(namaPrestasi) && attempts < prestasiListGlobal.length) {
            namaPrestasi = randomElement(prestasiListGlobal);
            attempts++;
        }
        if (usedPrestasi.has(namaPrestasi) && attempts >= prestasiListGlobal.length) break; 
        usedPrestasi.add(namaPrestasi);

        const tahunPerolehan = randomInt(new Date().getFullYear() - 15, new Date().getFullYear() -1);
        
        prestasi.push({
            id: `${pegawaiId}-pres-${i}`,
            tahun: String(tahunPerolehan),
            namaPrestasi,
            tingkat: randomElement(tingkatPrestasiGlobal),
            pemberiPenghargaan: namaPrestasi.includes("Satyalancana") ? "Presiden Republik Indonesia" : `Kepala BPS ${randomElement(["RI", "Provinsi", "Pusat"])}`
        });
    }
    return prestasi.sort((a,b) => parseInt(b.tahun) - parseInt(a.tahun));
};

// --- Fungsi Utama Generator Pegawai (generateFullDummyPegawaiList) ---
// Diasumsikan implementasi generateFullDummyPegawaiList sudah benar dan lengkap dari sebelumnya
// dan menggunakan rawDataStatistikLengkap sebagai dataSatkerSource
const generateFullDummyPegawaiList = (
  dataSatkerSource: DataStatistikNasional, // Menggunakan rawDataStatistikLengkap
  jumlahTotalPegawai: number = 200 // Default jumlah pegawai
): DetailPegawaiData[] => {
  const generatedPegawaiList: DetailPegawaiData[] = [];
  // Ambil semua kunci satker kecuali 'nasional' untuk penugasan staf umum
  const allSatkerEntries = Object.values(dataSatkerSource); // Untuk distribusi pegawai yang lebih merata
  const processedNipsGlobal: Set<string> = new Set();

  // 1. Proses Pejabat Struktural dari dataSatkerSource
  Object.keys(dataSatkerSource).forEach(satkerKey => {
    const infoSatker = dataSatkerSource[satkerKey as keyof DataStatistikNasional];
    if (!infoSatker || !infoSatker.pejabatStruktural || infoSatker.pejabatStruktural.length === 0) return;

    infoSatker.pejabatStruktural.forEach((pejabat: Pejabat) => {
      const jenisKelamin = randomElement(jenisKelaminOptionsGlobal);
      const jkCode = jenisKelamin === "Laki-laki" ? "1" : "2";
      const usiaPejabat = (infoSatker.id === "NASIONAL" || satkerKey === "nasional") ? randomInt(48, 59) : randomInt(45, 58);
      const tahunLahir = new Date().getFullYear() - usiaPejabat;
      const tanggalLahir = randomDate(tahunLahir, tahunLahir);
      
      const minTahunAngkat = tanggalLahir.getFullYear() + 20;
      const maxTahunAngkat = Math.min(tanggalLahir.getFullYear() + 30, new Date().getFullYear() - (usiaPejabat - 40 < 10 ? 10 : usiaPejabat - 40)); // Pastikan masuk akal
      const tahunAngkat = randomInt(minTahunAngkat, maxTahunAngkat < minTahunAngkat ? minTahunAngkat : maxTahunAngkat);

      const bulanAngkatPNS = randomElement(bulanAngkat);
      let nip = generateNip(tanggalLahir, jkCode, tahunAngkat, bulanAngkatPNS);
      let attempt = 0;
      while(processedNipsGlobal.has(nip) && attempt < 20) { // Tingkatkan attempt
        nip = generateNip(tanggalLahir, jkCode, randomInt(minTahunAngkat, maxTahunAngkat < minTahunAngkat ? minTahunAngkat : maxTahunAngkat), randomElement(bulanAngkat));
        attempt++;
      }
      if (processedNipsGlobal.has(nip)) {
        console.warn(`Gagal generate NIP unik untuk pejabat ${pejabat.nama}`);
        return; 
      }
      processedNipsGlobal.add(nip);

      const tmtPns = new Date(tahunAngkat, parseInt(bulanAngkatPNS) - 1, randomInt(1,28));
      const pangkatOptionsForPejabat = pangkatGolonganOptionsGlobal.filter(p => {
        const golAngka = parseInt(p.golongan.split('/')[0]);
        return (infoSatker.id === "NASIONAL" || satkerKey === "nasional") ? golAngka >= 3 : golAngka >=2 ; // Pejabat pusat min Gol III, daerah min Gol II atau III
      });
      const pangkatInfo = randomElement(pangkatOptionsForPejabat.length > 0 ? pangkatOptionsForPejabat : pangkatGolonganOptionsGlobal);
      
      const riwayatPendidikan = generateRiwayatPendidikan(nip, tahunLahir);
      const pendidikanTerakhirItem = riwayatPendidikan.length > 0 ? riwayatPendidikan[0] : undefined;
      const pendidikanTerakhirText = pendidikanTerakhirItem ? `${pendidikanTerakhirItem.jenjang} ${pendidikanTerakhirItem.jurusan || ''} - ${pendidikanTerakhirItem.namaSekolahInstitusi}`.trim() : "S1/Sederajat";

      const jenjangFungsionalPejabat = (pejabat.jabatan.toLowerCase().includes("statistisi") || pejabat.jabatan.toLowerCase().includes("pranata komputer") || pejabat.jabatan.toLowerCase().includes("koordinator fungsi"))
                                      ? randomElement(jenjangJabatanFungsionalOptionsGlobal.filter(j => j.includes("Madya") || j.includes("Utama")))
                                      : undefined;
      
      // Nama pejabat sudah lengkap dengan gelar dari `getPejabatUntukSatker`
      // `dummyPegawaiService` tidak perlu menambahkan gelar lagi untuk pejabat ini.
      const namaFinalPejabat = pejabat.nama; 
      
      // Tentukan unitKerjaEselon1 terlebih dahulu
      const unitKerjaEselon1 = (infoSatker.id === "NASIONAL" || satkerKey === "nasional")
        ? (unitKerjaEselon1BPSRIGlobal.find(u => pejabat.jabatan.toLowerCase().includes(u.split(" ")[1]?.toLowerCase() || "___")) || randomElement(unitKerjaEselon1BPSRIGlobal))
        : undefined;
      const unitKerjaEselon2 = (infoSatker.id === "NASIONAL" || satkerKey === "nasional") && unitKerjaEselon1 && unitKerjaEselon2BPSRIGlobal[unitKerjaEselon1]
        ? randomElement(unitKerjaEselon2BPSRIGlobal[unitKerjaEselon1])
        : undefined;

      const pegawaiData: DetailPegawaiData = {
        id: nip,
        nama: namaFinalPejabat,
        nipLama: `NIPLAMA-P-${nip.substring(nip.length - 7, nip.length -3)}`,
        nipBaru: nip,
        email: `${namaFinalPejabat.split(" ")[1]?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'pejabat'}.${namaFinalPejabat.split(" ")[0]?.toLowerCase().replace(/[^a-z0-9.,]/g,'')}@bps.go.id`.substring(0,40),
        fotoUrl: pejabat.fotoUrl || getAvatar(namaFinalPejabat),
        tempatLahir: randomElement(kotaLahirOptionsGlobal),
        tanggalLahir: formatDate(tanggalLahir),
        jenisKelamin: jenisKelamin,
        statusKepegawaian: "PNS",
        TMT_PNS: formatDate(tmtPns),
        pangkatGolongan: `${pangkatInfo.pangkat} (${pangkatInfo.golongan})`,
        tmtPangkatGolongan: formatDate(randomDate(tmtPns.getFullYear() + randomInt(3,10) , Math.max(tmtPns.getFullYear() + 3, new Date().getFullYear() - 1))),
        jabatanStruktural: pejabat.jabatan,
        jenjangJabatanFungsional: jenjangFungsionalPejabat,
        tmtJabatan: formatDate(randomDate(tmtPns.getFullYear() + randomInt(1, usiaPejabat - 25 > 0 ? usiaPejabat - 25 : 1) , Math.max(tmtPns.getFullYear()+1, new Date().getFullYear()))),
        
        satuanKerjaId: infoSatker.satuanKerjaId || infoSatker.id,
        satuanKerjaNama: infoSatker.namaWilayahAsli,
        namaSatkerLengkap: infoSatker.namaSatkerLengkap,
        unitKerjaEselon1: unitKerjaEselon1, // Eselon 1 hanya untuk BPS Pusat
        unitKerjaEselon2: unitKerjaEselon2,

        alamatKantor: infoSatker.alamatKantor,
        teleponKantor: infoSatker.teleponKantor,
        homepageSatker: infoSatker.homepageSatker,
        pendidikanTerakhir: pendidikanTerakhirText,
        masaKerjaGolongan: `${randomInt(1,10)} thn ${randomInt(0,11)} bln`,
        masaKerjaTotal: `${Math.max(0, new Date().getFullYear() - tmtPns.getFullYear())} thn ${randomInt(0,11)} bln`,
        tanggalPensiun: formatDate(new Date(tahunLahir + 60, tanggalLahir.getMonth(), tanggalLahir.getDate())),
        sisaMasaKerja: `${Math.max(0, (tahunLahir + 60) - new Date().getFullYear() -1)} thn`,
        grade: `GR-${randomInt(13,17)}`, // Grade pejabat biasanya lebih tinggi
        bmnDipegang: randomInt(0,1) ? ["Mobil Dinas Jabatan", "Laptop Inventaris"] : ["Laptop Inventaris"],
        namaWilayahAsli: infoSatker.namaWilayahAsli,

        riwayatPendidikan,
        riwayatJabatan: generateRiwayatJabatan(nip, tmtPns.getFullYear(), infoSatker.namaSatkerLengkap, pejabat.jabatan, jenjangFungsionalPejabat),
        kompetensi: generateKompetensi(nip, randomInt(2,4)),
        prestasi: generatePrestasi(nip, randomInt(1,2)),
      };
      generatedPegawaiList.push(pegawaiData);
    });
  });

  // 2. Generate Pegawai Acak Lainnya (Staf)
  const countRemaining = Math.max(0, jumlahTotalPegawai - generatedPegawaiList.length);
  for (let i = 0; i < countRemaining; i++) {
    const jenisKelamin = randomElement(jenisKelaminOptionsGlobal);
    const jkCode = jenisKelamin === "Laki-laki" ? "1" : "2";
    const usiaStaf = randomInt(23, 55); // Usia staf hingga 55
    const tahunLahir = new Date().getFullYear() - usiaStaf;
    const tanggalLahir = randomDate(tahunLahir, tahunLahir);
    
    const minTahunAngkatStaf = tanggalLahir.getFullYear() + 20; // Minimal usia 20 saat diangkat
    const maxTahunAngkatStaf = new Date().getFullYear() - 1; // Minimal sudah 1 tahun kerja
    const tahunAngkat = randomInt(minTahunAngkatStaf, Math.max(minTahunAngkatStaf, maxTahunAngkatStaf));

    const bulanAngkatPNS = randomElement(bulanAngkat);
    let nip = generateNip(tanggalLahir, jkCode, tahunAngkat, bulanAngkatPNS);
    let attempt = 0;
    while(processedNipsGlobal.has(nip) && attempt < 20) {
        nip = generateNip(tanggalLahir, jkCode, randomInt(minTahunAngkatStaf, Math.max(minTahunAngkatStaf, maxTahunAngkatStaf)), randomElement(bulanAngkat));
        attempt++;
    }
    if (processedNipsGlobal.has(nip)) continue;
    processedNipsGlobal.add(nip);

    const gd = randomElement(gelarDepanGlobal.filter(g => !g.toLowerCase().includes("prof"))); // Staf jarang profesor
    const fn = randomElement(jenisKelamin === "Laki-laki" ? firstNamesM : firstNamesF);
    const ln = randomElement(lastNames);
    const gb = randomElement(gelarBelakangGlobal.filter(g => !g.toLowerCase().includes("ph.d."))); // Staf jarang Ph.D
    const namaLengkap = `${gd ? gd + " " : ""}${fn} ${ln}${gb ? ", " + gb : ""}`.trim().replace(/\s+/g, ' ');

    // Distribusi pegawai ke satker daerah atau pusat secara acak
    const randomSatkerEntry = randomElement(allSatkerEntries);
    const infoSatkerPegawai = randomSatkerEntry;

    const tmtPns = new Date(tahunAngkat, parseInt(bulanAngkatPNS) - 1, randomInt(1,28));
    const pangkatOptionsForStaff = pangkatGolonganOptionsGlobal.filter(p => parseInt(p.golongan.split('/')[0]) < 4); // Gol I-III
    const pangkatInfo = randomElement(pangkatOptionsForStaff.length > 0 ? pangkatOptionsForStaff : pangkatGolonganOptionsGlobal);
    const jenjangFungsional = randomElement(jenjangJabatanFungsionalOptionsGlobal.filter(j => !j.includes("Utama") && !j.includes("Madya") && !j.toLowerCase().includes("koordinator")));
    
    const riwayatPendidikan = generateRiwayatPendidikan(nip, tahunLahir);
    const pendidikanTerakhirItem = riwayatPendidikan.length > 0 ? riwayatPendidikan[0] : undefined;
    const pendidikanTerakhirText = pendidikanTerakhirItem ? `${pendidikanTerakhirItem.jenjang} ${pendidikanTerakhirItem.jurusan || ''} - ${pendidikanTerakhirItem.namaSekolahInstitusi}`.trim() : "Belum Terdata";

    const unitKerjaEselon1 = infoSatkerPegawai.id === "NASIONAL" ? randomElement(unitKerjaEselon1BPSRIGlobal) : undefined;
    const unitKerjaEselon2 = infoSatkerPegawai.id === "NASIONAL" && unitKerjaEselon1 && unitKerjaEselon2BPSRIGlobal[unitKerjaEselon1]
      ? randomElement(unitKerjaEselon2BPSRIGlobal[unitKerjaEselon1])
      : undefined;

    const statusKepegawaian = randomElement(statusKepegawaianOptionsGlobal);
    const usiaPensiun = statusKepegawaian === "PPPK" ? 58 : 60;

    const pegawaiData: DetailPegawaiData = {
      id: nip,
      nama: namaLengkap,
      nipLama: `NIPLAMA-S-${nip.substring(nip.length - 7, nip.length -3)}`,
      nipBaru: nip,
      email: `${fn.toLowerCase().replace(/[^a-z0-9]/g, '')}.${ln.toLowerCase().replace(/[^a-z0-9]/g, '')}${randomInt(1,99)}@bps.go.id`.substring(0,40),
      fotoUrl: getAvatar(namaLengkap),
      tempatLahir: randomElement(kotaLahirOptionsGlobal),
      tanggalLahir: formatDate(tanggalLahir),
      jenisKelamin: jenisKelamin,
      statusKepegawaian: statusKepegawaian,
      TMT_PNS: formatDate(tmtPns),
      pangkatGolongan: `${pangkatInfo.pangkat} (${pangkatInfo.golongan})`,
      tmtPangkatGolongan: formatDate(randomDate(tmtPns.getFullYear() + randomInt(1,5) , Math.max(tmtPns.getFullYear()+1, new Date().getFullYear() -1))),
      jenjangJabatanFungsional: jenjangFungsional,
      tmtJabatan: formatDate(randomDate(tmtPns.getFullYear() + randomInt(1, (new Date().getFullYear() - tmtPns.getFullYear())) , new Date().getFullYear())),
      
      satuanKerjaId: infoSatkerPegawai.satuanKerjaId || infoSatkerPegawai.id,
      satuanKerjaNama: infoSatkerPegawai.namaWilayahAsli,
      namaSatkerLengkap: infoSatkerPegawai.namaSatkerLengkap,
      unitKerjaEselon1: unitKerjaEselon1,
      unitKerjaEselon2: unitKerjaEselon2,

      alamatKantor: infoSatkerPegawai.alamatKantor,
      teleponKantor: infoSatkerPegawai.teleponKantor,
      homepageSatker: infoSatkerPegawai.homepageSatker,
      pendidikanTerakhir: pendidikanTerakhirText,
      masaKerjaGolongan: `${randomInt(0, Math.max(0, new Date().getFullYear() - (tmtPns.getFullYear() + randomInt(1,5))))} thn ${randomInt(0,11)} bln`,
      masaKerjaTotal: `${Math.max(0,new Date().getFullYear() - tmtPns.getFullYear())} thn ${randomInt(0,11)} bln`,
      tanggalPensiun: formatDate(new Date(tahunLahir + usiaPensiun , tanggalLahir.getMonth(), tanggalLahir.getDate())),
      sisaMasaKerja: `${Math.max(0,usiaPensiun - usiaStaf -1)} thn`,
      grade: `GR-${randomInt(5,12)}`,
      bmnDipegang: randomInt(0,1) ? ["Laptop Inventaris"] : undefined,
      namaWilayahAsli: infoSatkerPegawai.namaWilayahAsli, // Diambil dari satker tempat dia ditugaskan
      
      riwayatPendidikan,
      riwayatJabatan: generateRiwayatJabatan(nip, tmtPns.getFullYear(), infoSatkerPegawai.namaSatkerLengkap, undefined, jenjangFungsional),
      kompetensi: generateKompetensi(nip, randomInt(0,3)),
      prestasi: generatePrestasi(nip, randomInt(0,1)),
    };
    generatedPegawaiList.push(pegawaiData);
  }

  return generatedPegawaiList;
};


// --- BAGIAN BARU: Memperkaya Data Pejabat Struktural dengan NIP ---
export const allDummyPegawai: DetailPegawaiData[] = generateFullDummyPegawaiList(rawDataStatistikLengkap, 750);

function enrichPejabatDataWithNips(
  sourceDataStatistik: DataStatistikNasional,
  allPegawaiList: DetailPegawaiData[]
): DataStatistikNasional {
  // Buat deep clone untuk menghindari mutasi objek asli dari modul lain
  const enrichedData: DataStatistikNasional = JSON.parse(JSON.stringify(sourceDataStatistik));

  Object.keys(enrichedData).forEach(satkerKey => {
    const satkerEntry = enrichedData[satkerKey as keyof DataStatistikNasional];
    if (satkerEntry.pejabatStruktural && Array.isArray(satkerEntry.pejabatStruktural)) {
      satkerEntry.pejabatStruktural.forEach((pejabatDalamStruktur: Pejabat) => {
        const foundPegawaiLengkap = allPegawaiList.find(detailPegawai => {
          // Pencocokan:
          // 1. Nama pejabat dari struktur harus terkandung dalam nama lengkap pegawai (yang mungkin ada gelar tambahan)
          const isNameMatch = detailPegawai.nama.includes(pejabatDalamStruktur.nama);
          // 2. Jabatan struktural harus sama persis
          const isJabatanMatch = detailPegawai.jabatanStruktural === pejabatDalamStruktur.jabatan;
          // 3. Konteks Satker harus cocok
          let isSatkerMatch = false;
          if (satkerEntry.id === "NASIONAL") { // id Satker dari dataStatistikLengkap (mis: "NASIONAL", "IDAC")
            isSatkerMatch = detailPegawai.satuanKerjaId === "NASIONAL"; // satuanKerjaId di DetailPegawaiData
          } else {
            // Untuk provinsi, satkerEntry.satuanKerjaId adalah kode numerik (misal "1100")
            isSatkerMatch = detailPegawai.satuanKerjaId === satkerEntry.satuanKerjaId;
          }
          return isNameMatch && isJabatanMatch && isSatkerMatch;
        });

        if (foundPegawaiLengkap && foundPegawaiLengkap.nipBaru) {
          // Karena `pejabatDalamStruktur` adalah hasil JSON.parse, TypeScript mungkin tidak tahu field barunya.
          // Kita bisa menggunakan type assertion jika yakin.
          (pejabatDalamStruktur as Pejabat & { nipUntukDetail?: string }).nipUntukDetail = foundPegawaiLengkap.nipBaru;
        } else {
          // console.warn(`NIP tidak ditemukan untuk memperkaya pejabat ${pejabatDalamStruktur.nama} (${pejabatDalamStruktur.jabatan}) di ${satkerEntry.namaWilayahAsli}`);
        }
      });
    }
  });
  return enrichedData;
}

// Ekspor data statistik yang sudah diperkaya dengan NIP pada pejabat strukturalnya
export const processedDataStatistikLengkap: DataStatistikNasional = enrichPejabatDataWithNips(
  rawDataStatistikLengkap,
  allDummyPegawai
);


export type { DataStatistikNasional };
// Untuk verifikasi cepat (opsional, bisa di-uncomment saat development)
// console.log("Contoh Pejabat Nasional setelah enrichment:", processedDataStatistikLengkap.nasional.pejabatStruktural?.[0]);
// console.log("Contoh Pejabat Aceh setelah enrichment:", processedDataStatistikLengkap.IDAC?.pejabatStruktural?.[0]);