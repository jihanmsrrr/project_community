// data/statistikProvinsi.ts

import type {
  DetailPegawaiData,
  Pejabat,
  NewsItem,
  TimKerja, // Impor tipe baru
  AnggotaTim  // Impor tipe baru
} from '@/types/pegawai';

export interface DataStatistikNasional {
  nasional: DetailPegawaiData;
  [kodeProvinsiAbbr: string]: DetailPegawaiData;
}

// Fungsi helper (randomInt, randomFloat, generateDummyOrganizationalNews) tetap sama...
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const generateDummyOrganizationalNews = (wilayahId: string, namaWilayah: string, count: number = randomInt(1,3)): NewsItem[] => {
  // ... (implementasi tetap sama)
  const news: NewsItem[] = [];
  const randomNames = ["Agus Setiawan", "Siti Aminah", "Budi Prasetyo", "Retno Wulandari", "Eko Cahyono", "Dewi Lestari", "Joko Susilo"];
  const eventTemplates = [
    { type: "Pelantikan", titleTemplate: "Pelantikan Pejabat di Lingkungan BPS {NAMA_WILAYAH}", snippetTemplate: "Kepala BPS melantik pejabat eselon untuk BPS {NAMA_WILAYAH}.", authorBase: "Bagian SDM", linkBase: "/organisasi/berita/" },
    { type: "Rilis Data", titleTemplate: "BPS {NAMA_WILAYAH} Rilis Angka Kemiskinan Terbaru", snippetTemplate: "Angka kemiskinan di {NAMA_WILAYAH} menunjukkan tren penurunan.", authorBase: "Tim Diseminasi", linkBase: "/rilis/berita/" },
    { type: "Peringatan Hari", titleTemplate: "Peringatan Hari Statistik Nasional di BPS {NAMA_WILAYAH}", snippetTemplate: "BPS {NAMA_WILAYAH} mengadakan serangkaian kegiatan untuk HSN.", authorBase: "Panitia HSN", linkBase: "/organisasi/berita/" },
  ];
  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= count; i++) {
    const template = eventTemplates[randomInt(0, eventTemplates.length - 1)];
    const randomDay = randomInt(1, 28);
    const randomMonth = randomInt(0, 11); 
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const date = `${randomDay} ${months[randomMonth]} ${currentYear}`;
    const randomPegawaiName = randomNames[randomInt(0, randomNames.length - 1)];
    const title = template.titleTemplate.replace(/{NAMA_WILAYAH}/g, namaWilayah).replace(/{NAMA_PEGAWAI}/g, randomPegawaiName);
    const snippet = template.snippetTemplate.replace(/{NAMA_WILAYAH}/g, namaWilayah).replace(/{NAMA_PEGAWAI}/g, randomPegawaiName);
    const authorNameForAvatar = (template.authorBase + (namaWilayah === "Nasional" ? " Pusat" : " " + namaWilayah)).trim();
    const nameParts = authorNameForAvatar.split(" ");
    let nameForApi = nameParts[0];
    if (nameParts.length > 1) nameForApi += `+${nameParts[1]}`;
    const r = randomInt(200, 255).toString(16).padStart(2, '0');
    const g = randomInt(200, 255).toString(16).padStart(2, '0');
    const b = randomInt(200, 255).toString(16).padStart(2, '0');
    const bgColorForAvatar = `${r}${g}${b}`;
    const authorAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForApi)}&size=36&background=${bgColorForAvatar}&color=333333&font-size=0.4&bold=true&rounded=true`;
    news.push({
      id: `${wilayahId}-orgnews-${i}-${randomDay}-${randomMonth + 1}`, title, snippet, date,
      author: `${template.authorBase}${namaWilayah === "Nasional" || namaWilayah === "Pusat" ? "" : " BPS " + namaWilayah}`,
      authorAvatar: authorAvatarUrl, link: `${template.linkBase}${wilayahId.toLowerCase()}/${i}`, source: "Internal Organisasi"
    });
  }
  return news;
};


// Fungsi getPejabatUntukSatker tetap sama seperti sebelumnya (fokus pada pimpinan dan koordinator fungsi)
const getPejabatUntukSatker = (kodeSatkerIdNumeric: string, namaWilayahSingkat: string): Pejabat[] => {
    const idPrefix = kodeSatkerIdNumeric;
    if (kodeSatkerIdNumeric === "NASIONAL") {
        return [
            { id: "kepala-nas", nama: "Dr. Amalia Adininggar Widyasanti, S.T., M.Si., M.Eng., Ph.D.", jabatan: "Plt. Kepala Badan Pusat Statistik", fotoUrl: "/avatars/amalia-aw.png" },
            { id: "sesma-nas", nama: "Atqo Mardiyanto, S.Si., M.M.", jabatan: "Sekretaris Utama", fotoUrl: "/avatars/atqo-mardiyanto.png" },
            { id: "deputi-sosial", nama: "Dr. Eng. M. Habibullah Jimad, S.Si., M.Sc.", jabatan: "Deputi Bidang Statistik Sosial", fotoUrl: "/avatars/m-habibullah-jimad.png" },
            { id: "deputi-produksi", nama: "Dr. M. Edy Mahmud, S.Si., M.Si.", jabatan: "Deputi Bidang Statistik Produksi", fotoUrl: "/avatars/edy-mahmud.png" },
            { id: "deputi-distribusi", nama: "Dr. Pudji Ismartini, S.Si., M.App.Stat.", jabatan: "Deputi Bidang Statistik Distribusi dan Jasa", fotoUrl: "/avatars/pudji-ismartini.png" },
            { id: "deputi-neraca", nama: "Dr. Mohamad Edy Mahmud, S.Si., M.Si.", jabatan: "Deputi Bidang Neraca dan Analisis Statistik", fotoUrl: "/avatars/edy-mahmud-neraca.png" },
            { id: "deputi-metodologi", nama: "Dr. Imam Machdi, M.Si.", jabatan: "Deputi Bidang Metodologi dan Informasi Statistik", fotoUrl: "/avatars/imam-machdi.png" },
        ];
    }
    const namaKepala = `Dr. ${namaWilayahSingkat.startsWith('Papua') ? 'Yohanes' : 'Ahmad'} Suryono, S.Si, M.Stat.`;
    const namaKabagUmum = `Dra. Hj. ${namaWilayahSingkat === 'Aceh' ? 'Cut' : 'Rini'} Wulandari, M.Ak.`;
    return [
        { id: `${idPrefix}-kpl`, nama: namaKepala, jabatan: "Kepala BPS Provinsi", fotoUrl: `https://ui-avatars.com/api/?name=K+${namaWilayahSingkat.substring(0,1)}&background=0D47A1&color=fff&bold=true&size=128&font-size=0.4` },
        { id: `${idPrefix}-kabagum`, nama: namaKabagUmum, jabatan: "Kepala Bagian Umum", fotoUrl: `https://ui-avatars.com/api/?name=KU+${namaWilayahSingkat.substring(0,1)}&background=1565C0&color=fff&bold=true&size=128&font-size=0.4` },
        { id: `${idPrefix}-kfsos`, nama: "Budi Prasetyo, S.ST., M.Si.", jabatan: "Statistisi Ahli Madya / Koordinator Fungsi Statistik Sosial", fotoUrl: `https://ui-avatars.com/api/?name=SOS+${namaWilayahSingkat.substring(0,1)}&background=1E88E5&color=fff&bold=true&size=128&font-size=0.33` },
        { id: `${idPrefix}-kfprod`, nama: "Siti Aminah, S.P., M.Sc.", jabatan: "Statistisi Ahli Madya / Koordinator Fungsi Statistik Produksi", fotoUrl: `https://ui-avatars.com/api/?name=PROD+${namaWilayahSingkat.substring(0,1)}&background=1976D2&color=fff&bold=true&size=128&font-size=0.3` },
        { id: `${idPrefix}-kfdist`, nama: "Eko Wahyudi, S.E., M.Ec.Dev.", jabatan: "Statistisi Ahli Madya / Koordinator Fungsi Statistik Distribusi", fotoUrl: `https://ui-avatars.com/api/?name=DIST+${namaWilayahSingkat.substring(0,1)}&background=0288D1&color=fff&bold=true&size=128&font-size=0.3` },
        { id: `${idPrefix}-kfner`, nama: "Agus Hidayat, S.Stat., M.E.K.", jabatan: "Statistisi Ahli Madya / Koordinator Fungsi Nerwilis", fotoUrl: `https://ui-avatars.com/api/?name=NER+${namaWilayahSingkat.substring(0,1)}&background=0277BD&color=fff&bold=true&size=128&font-size=0.33` },
        { id: `${idPrefix}-kfipds`, nama: "Retno Lestari, S.Kom., M.T.I.", jabatan: "Pranata Komputer Ahli Madya / Koordinator Fungsi IPDS", fotoUrl: `https://ui-avatars.com/api/?name=IPDS+${namaWilayahSingkat.substring(0,1)}&background=01579B&color=fff&bold=true&size=128&font-size=0.3`},
    ];
};

// --- FUNGSI BARU UNTUK GENERATE TIM KERJA ---
const generatePlaceholderAnggotaTim = (jumlah: number, timPrefix: string, satkerId: string): AnggotaTim[] => {
  const anggota: AnggotaTim[] = [];
  const firstNamesM = ["Bayu", "Eko", "Surya", "Dimas", "Reza", "Doni", "Rian", "Fahmi"];
  const firstNamesF = ["Bella", "Cindy", "Gita", "Hana", "Lia", "Ani", "Eva", "Ida"];
  const lastNames = ["Wijaya", "Kusuma", "Lestari", "Pratama", "Setiawan", "Nugroho"];
  const posisiFungsional = [
    "Statistisi Ahli Muda", "Statistisi Ahli Pertama", "Statistisi Terampil",
    "Pranata Komputer Ahli Muda", "Pranata Komputer Ahli Pertama", "Pranata Komputer Terampil",
  ];
  const posisiPelaksana = ["Staf Pelaksana Administrasi", "Staf Pendukung Teknis", "Pengolah Data"];

  for (let i = 0; i < jumlah; i++) {
    const isPria = Math.random() > 0.5;
    const namaDepan = isPria ? firstNamesM[randomInt(0, firstNamesM.length - 1)] : firstNamesF[randomInt(0, firstNamesF.length - 1)];
    const namaBelakang = lastNames[randomInt(0, lastNames.length - 1)];
    const namaLengkap = `${namaDepan} ${namaBelakang}`;
    
    let posisi;
    if (i < Math.floor(jumlah / 2)) { // Setengahnya fungsional
        posisi = posisiFungsional[randomInt(0, posisiFungsional.length - 1)];
    } else { // Setengahnya pelaksana/staff
        posisi = posisiPelaksana[randomInt(0, posisiPelaksana.length - 1)];
    }

    anggota.push({
      id: `${satkerId}-${timPrefix}-anggota-${i + 1}`,
      nama: namaLengkap,
      posisi: posisi,
      nip: `NIP-TIM-${satkerId.slice(-4)}-${randomInt(1000, 9999)}`, // NIP Placeholder
      fotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(namaLengkap)}&background=random&color=fff&size=96`
    });
  }
  return anggota;
};

const generateDaftarTimKerja = (satkerId: string, namaWilayahSingkat: string, pejabatStruktural: Pejabat[]): TimKerja[] => {
  const daftarTim: TimKerja[] = [];

  // Ambil beberapa pejabat struktural untuk dijadikan ketua tim jika relevan
  const kabagUmum = pejabatStruktural.find(p => p.jabatan.toLowerCase().includes("kepala bagian umum"));
  const koordSosial = pejabatStruktural.find(p => p.jabatan.toLowerCase().includes("sosial"));
  const koordProduksi = pejabatStruktural.find(p => p.jabatan.toLowerCase().includes("produksi"));
  const koordDistribusi = pejabatStruktural.find(p => p.jabatan.toLowerCase().includes("distribusi"));
  const koordNerwilis = pejabatStruktural.find(p => p.jabatan.toLowerCase().includes("nerwilis"));
  const koordIpds = pejabatStruktural.find(p => p.jabatan.toLowerCase().includes("ipds"));

  // Tim Umum
  if (kabagUmum) {
    daftarTim.push({
      id: `${satkerId}-tim-umum`,
      namaTim: "Tim Bagian Umum",
      singkatan: "UMUM",
      deskripsi: `Melaksanakan urusan ketatausahaan, kepegawaian, keuangan, rumah tangga, perlengkapan, dan pengelolaan barang milik negara di lingkungan BPS ${namaWilayahSingkat}.`,
      ketuaTim: { id: kabagUmum.id, nama: kabagUmum.nama, posisi: kabagUmum.jabatan, fotoUrl: kabagUmum.fotoUrl, nip: `NIP-PJBT-${randomInt(100,999)}` },
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(3,5), "umum", satkerId),
    });
  }

  // Tim Humas, Pojok Statistik, PSS (Bisa digabung atau dipecah)
  // Untuk sederhana, kita buat satu tim Humas & Layanan Statistik
  const ketuaTimHumas: AnggotaTim = {
    id: `${satkerId}-kthumas`,
    nama: `Humas ${namaWilayahSingkat} Utama`, // Placeholder
    posisi: "Pranata Humas Ahli Muda",
    nip: `NIP-TIM-${satkerId.slice(-4)}-001H`,
    fotoUrl: `https://ui-avatars.com/api/?name=Humas+${namaWilayahSingkat.substring(0,1)}&background=4CAF50&color=fff&size=96`
  };
  daftarTim.push({
    id: `${satkerId}-tim-humas`,
    namaTim: "Tim Humas dan Pelayanan Statistik Terpadu (PST)",
    singkatan: "HUMAS-PST",
    deskripsi: `Melaksanakan kegiatan kehumasan, promosi statistik, pengelolaan pojok statistik, dan pelayanan statistik terpadu (PSS/PST) untuk BPS ${namaWilayahSingkat}.`,
    ketuaTim: ketuaTimHumas,
    anggotaLain: generatePlaceholderAnggotaTim(randomInt(2,4), "humas", satkerId),
  });

  // Tim IPDS
  if (koordIpds) {
    daftarTim.push({
      id: `${satkerId}-tim-ipds`,
      namaTim: "Tim Integrasi Pengolahan dan Diseminasi Statistik (IPDS)",
      singkatan: "IPDS",
      deskripsi: `Melaksanakan kegiatan integrasi data, pengembangan sistem informasi, pengolahan data, dan diseminasi hasil statistik di BPS ${namaWilayahSingkat}.`,
      ketuaTim: { id: koordIpds.id, nama: koordIpds.nama, posisi: koordIpds.jabatan, fotoUrl: koordIpds.fotoUrl, nip: `NIP-PJBT-${randomInt(100,999)}` },
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(4,6), "ipds", satkerId),
    });
  }
  
  // Tim Statistik Sosial
  if (koordSosial) {
    daftarTim.push({
      id: `${satkerId}-tim-sosial`,
      namaTim: "Tim Statistik Sosial",
      singkatan: "SOS",
      deskripsi: `Melaksanakan kegiatan statistik di bidang kependudukan, kemiskinan, ketenagakerjaan, pendidikan, kesehatan, dan sosial budaya lainnya di BPS ${namaWilayahSingkat}.`,
      ketuaTim: { id: koordSosial.id, nama: koordSosial.nama, posisi: koordSosial.jabatan, fotoUrl: koordSosial.fotoUrl, nip: `NIP-PJBT-${randomInt(100,999)}` },
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(3,5), "sos", satkerId),
    });
  }

  // Tim Statistik Produksi
  if (koordProduksi) {
    daftarTim.push({
      id: `${satkerId}-tim-produksi`,
      namaTim: "Tim Statistik Produksi",
      singkatan: "PROD",
      deskripsi: `Melaksanakan kegiatan statistik di bidang pertanian, industri, pertambangan, energi, dan konstruksi di BPS ${namaWilayahSingkat}.`,
      ketuaTim: { id: koordProduksi.id, nama: koordProduksi.nama, posisi: koordProduksi.jabatan, fotoUrl: koordProduksi.fotoUrl, nip: `NIP-PJBT-${randomInt(100,999)}` },
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(3,5), "prod", satkerId),
    });
  }
  
  // Tim Statistik Distribusi
  if (koordDistribusi) {
    daftarTim.push({
      id: `${satkerId}-tim-distribusi`,
      namaTim: "Tim Statistik Distribusi",
      singkatan: "DIST",
      deskripsi: `Melaksanakan kegiatan statistik di bidang harga konsumen & produsen, perdagangan, transportasi, dan pariwisata di BPS ${namaWilayahSingkat}.`,
      ketuaTim: { id: koordDistribusi.id, nama: koordDistribusi.nama, posisi: koordDistribusi.jabatan, fotoUrl: koordDistribusi.fotoUrl, nip: `NIP-PJBT-${randomInt(100,999)}` },
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(3,5), "dist", satkerId),
    });
  }

  // Tim Nerwilis
  if (koordNerwilis) {
    daftarTim.push({
      id: `${satkerId}-tim-nerwilis`,
      namaTim: "Tim Neraca Wilayah dan Analisis Statistik (Nerwilis)",
      singkatan: "NERWILIS",
      deskripsi: `Menyusun neraca produksi (PDRB), neraca pengeluaran, dan melakukan analisis statistik ekonomi makro di BPS ${namaWilayahSingkat}.`,
      ketuaTim: { id: koordNerwilis.id, nama: koordNerwilis.nama, posisi: koordNerwilis.jabatan, fotoUrl: koordNerwilis.fotoUrl, nip: `NIP-PJBT-${randomInt(100,999)}` },
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(2,4), "ner", satkerId),
    });
  }

  // Tim SAKIP, ZI, EPSS (Tim Khusus/Adhoc atau bagian dari Umum/Perencanaan)
  // Untuk contoh ini, kita buat sebagai tim terpisah
  const ketuaTimRB: AnggotaTim = {
    id: `${satkerId}-ktrb`,
    nama: `Penggerak RB ${namaWilayahSingkat}`, // Placeholder
    posisi: "Analis Kebijakan Ahli Muda", // Atau Perencana
    nip: `NIP-TIM-${satkerId.slice(-4)}-002R`,
    fotoUrl: `https://ui-avatars.com/api/?name=RB+${namaWilayahSingkat.substring(0,1)}&background=FF9800&color=fff&size=96`
  };
   daftarTim.push({
      id: `${satkerId}-tim-rb`,
      namaTim: "Tim Reformasi Birokrasi dan Penilaian Internal",
      singkatan: "RB-PI",
      deskripsi: `Mengkoordinasikan pelaksanaan SAKIP, pembangunan Zona Integritas (ZI), dan Evaluasi Penyelenggaraan Statistik Sektoral (EPSS) di BPS ${namaWilayahSingkat}.`,
      ketuaTim: ketuaTimRB,
      anggotaLain: generatePlaceholderAnggotaTim(randomInt(1,3), "rb", satkerId),
    });


  return daftarTim;
};
// --- AKHIR FUNGSI GENERATE TIM ---


const provinceDefinitions: { key: string; namaWilayah: string; kodeBps: string; namaSatkerBagian: string; emailPrefix: string; alamat: string; telepon: string; web: string }[] = [
    // ... (definisi provinsi tetap sama) ...
    { key: "IDAC", namaWilayah: "Aceh", kodeBps: "1100", namaSatkerBagian: "Provinsi Aceh", emailPrefix: "bps1100", alamat: "Jl. Tgk. H. Mohd. Daud Beureueh No.20, Banda Aceh", telepon: "(0651) 21300", web: "https://aceh.bps.go.id" },
    { key: "IDSU", namaWilayah: "Sumatera Utara", kodeBps: "1200", namaSatkerBagian: "Provinsi Sumatera Utara", emailPrefix: "bps1200", alamat: "Jl. Asrama No. 179, Medan", telepon: "(061) 8452342", web: "https://sumut.bps.go.id" },
    { key: "IDSB", namaWilayah: "Sumatera Barat", kodeBps: "1300", namaSatkerBagian: "Provinsi Sumatera Barat", emailPrefix: "bps1300", alamat: "Jl. Rasuna Said No.51, Padang", telepon: "(0751) 31730", web: "https://sumbar.bps.go.id" },
    { key: "IDRI", namaWilayah: "Riau", kodeBps: "1400", namaSatkerBagian: "Provinsi Riau", emailPrefix: "bps1400", alamat: "Jl. Pattimura No. 12, Pekanbaru", telepon: "(0761) 23042", web: "https://riau.bps.go.id" },
    { key: "IDJA", namaWilayah: "Jambi", kodeBps: "1500", namaSatkerBagian: "Provinsi Jambi", emailPrefix: "bps1500", alamat: "Jl. Urip Sumoharjo No.40, Jambi", telepon: "(0741) 60490", web: "https://jambi.bps.go.id" },
    { key: "IDSS", namaWilayah: "Sumatera Selatan", kodeBps: "1600", namaSatkerBagian: "Provinsi Sumatera Selatan", emailPrefix: "bps1600", alamat: "Jl. Kapt. Anwar Sastro No.1694, Palembang", telepon: "(0711) 352768", web: "https://sumsel.bps.go.id" },
    { key: "IDBE", namaWilayah: "Bengkulu", kodeBps: "1700", namaSatkerBagian: "Provinsi Bengkulu", emailPrefix: "bps1700", alamat: "Jl. Pembangunan No.10, Bengkulu", telepon: "(0736) 21090", web: "https://bengkulu.bps.go.id" },
    { key: "IDLA", namaWilayah: "Lampung", kodeBps: "1800", namaSatkerBagian: "Provinsi Lampung", emailPrefix: "bps1800", alamat: "Jl. Basuki Rahmat No.54, Bandar Lampung", telepon: "(0721) 485335", web: "https://lampung.bps.go.id" },
    { key: "IDBB", namaWilayah: "Kep. Bangka Belitung", kodeBps: "1900", namaSatkerBagian: "Provinsi Kep. Bangka Belitung", emailPrefix: "bps1900", alamat: "Komplek Perkantoran Gubernur, Pangkalpinang", telepon: "(0717) 439024", web: "https://babel.bps.go.id" },
    { key: "IDKR", namaWilayah: "Kepulauan Riau", kodeBps: "2100", namaSatkerBagian: "Provinsi Kepulauan Riau", emailPrefix: "bps2100", alamat: "Jl. Hang Jebat Km. 3,5, Tanjung Pinang", telepon: "(0771) 21047", web: "https://kepri.bps.go.id" },
    { key: "IDJK", namaWilayah: "DKI Jakarta", kodeBps: "3100", namaSatkerBagian: "Provinsi DKI Jakarta", emailPrefix: "bps3100", alamat: "Jl. Salemba Raya No. 16, Jakarta Pusat", telepon: "(021) 3928221", web: "https://jakarta.bps.go.id" },
    { key: "IDJB", namaWilayah: "Jawa Barat", kodeBps: "3200", namaSatkerBagian: "Provinsi Jawa Barat", emailPrefix: "bps3200", alamat: "Jl. PHH. Mustofa No. 43, Bandung", telepon: "(022) 7272595", web: "https://jabar.bps.go.id" },
    { key: "IDJT", namaWilayah: "Jawa Tengah", kodeBps: "3300", namaSatkerBagian: "Provinsi Jawa Tengah", emailPrefix: "bps3300", alamat: "Jl. Pahlawan No. 6, Semarang", telepon: "(024) 8413983", web: "https://jateng.bps.go.id" },
    { key: "IDYO", namaWilayah: "DI Yogyakarta", kodeBps: "3400", namaSatkerBagian: "Provinsi DI Yogyakarta", emailPrefix: "bps3400", alamat: "Jl. Lingkar Utara, Maguwoharjo, Depok, Sleman", telepon: "(0274) 888812", web: "https://yogyakarta.bps.go.id" },
    { key: "IDJI", namaWilayah: "Jawa Timur", kodeBps: "3500", namaSatkerBagian: "Provinsi Jawa Timur", emailPrefix: "bps3500", alamat: "Jl. Raya Kendangsari Industri No. 43-44, Surabaya", telepon: "(031) 8439343", web: "https://jatim.bps.go.id" },
    { key: "IDBT", namaWilayah: "Banten", kodeBps: "3600", namaSatkerBagian: "Provinsi Banten", emailPrefix: "bps3600", alamat: "Jl. Syeh Nawawi Al Bantani, Serang", telepon: "(0254) 267014", web: "https://banten.bps.go.id" },
    { key: "IDBA", namaWilayah: "Bali", kodeBps: "5100", namaSatkerBagian: "Provinsi Bali", emailPrefix: "bps5100", alamat: "Jl. Raya Puputan Renon, Denpasar", telepon: "(0361) 235400", web: "https://bali.bps.go.id" },
    { key: "IDNB", namaWilayah: "Nusa Tenggara Barat", kodeBps: "5200", namaSatkerBagian: "Provinsi Nusa Tenggara Barat", emailPrefix: "bps5200", alamat: "Jl. Dr. Soedjono No. 8, Mataram", telepon: "(0370) 632718", web: "https://ntb.bps.go.id" },
    { key: "IDNT", namaWilayah: "Nusa Tenggara Timur", kodeBps: "5300", namaSatkerBagian: "Provinsi Nusa Tenggara Timur", emailPrefix: "bps5300", alamat: "Jl. R. Suprapto No. 5, Kupang", telepon: "(0380) 826103", web: "https://ntt.bps.go.id" },
    { key: "IDKB", namaWilayah: "Kalimantan Barat", kodeBps: "6100", namaSatkerBagian: "Provinsi Kalimantan Barat", emailPrefix: "bps6100", alamat: "Jl. Sutan Syahrir No. 24/VI, Pontianak", telepon: "(0561) 736209", web: "https://kalbar.bps.go.id" },
    { key: "IDKT", namaWilayah: "Kalimantan Tengah", kodeBps: "6200", namaSatkerBagian: "Provinsi Kalimantan Tengah", emailPrefix: "bps6200", alamat: "Jl. Kapten Piere Tendean No.05, Palangka Raya", telepon: "(0536) 3221008", web: "https://kalteng.bps.go.id" },
    { key: "IDKS", namaWilayah: "Kalimantan Selatan", kodeBps: "6300", namaSatkerBagian: "Provinsi Kalimantan Selatan", emailPrefix: "bps6300", alamat: "Jl. Trikora No. 8, Banjarbaru", telepon: "(0511) 4772519", web: "https://kalsel.bps.go.id" },
    { key: "IDKI", namaWilayah: "Kalimantan Timur", kodeBps: "6400", namaSatkerBagian: "Provinsi Kalimantan Timur", emailPrefix: "bps6400", alamat: "Jl. Kemakmuran No.4, Samarinda", telepon: "(0541) 743691", web: "https://kaltim.bps.go.id" },
    { key: "IDKU", namaWilayah: "Kalimantan Utara", kodeBps: "6500", namaSatkerBagian: "Provinsi Kalimantan Utara", emailPrefix: "bps6500", alamat: "Jl. Enggang No.26, Tanjung Selor", telepon: "(0552) 2029928", web: "https://kaltara.bps.go.id" },
    { key: "IDSA", namaWilayah: "Sulawesi Utara", kodeBps: "7100", namaSatkerBagian: "Provinsi Sulawesi Utara", emailPrefix: "bps7100", alamat: "Jl. 17 Agustus No. 63, Manado", telepon: "(0431) 851542", web: "https://sulut.bps.go.id" },
    { key: "IDST", namaWilayah: "Sulawesi Tengah", kodeBps: "7200", namaSatkerBagian: "Provinsi Sulawesi Tengah", emailPrefix: "bps7200", alamat: "Jl. Prof. Moh. Yamin, SH. No.65, Palu", telepon: "(0451) 421388", web: "https://sulteng.bps.go.id" },
    { key: "IDSG", namaWilayah: "Sulawesi Selatan", kodeBps: "7300", namaSatkerBagian: "Provinsi Sulawesi Selatan", emailPrefix: "bps7300", alamat: "Jl. Racing Centre No. 100, Makassar", telepon: "(0411) 453794", web: "https://sulsel.bps.go.id" },
    { key: "IDSN", namaWilayah: "Sulawesi Tenggara", kodeBps: "7400", namaSatkerBagian: "Provinsi Sulawesi Tenggara", emailPrefix: "bps7400", alamat: "Jl. Sao-Sao No. 1, Kendari", telepon: "(0401) 3121491", web: "https://sultra.bps.go.id" },
    { key: "IDGO", namaWilayah: "Gorontalo", kodeBps: "7500", namaSatkerBagian: "Provinsi Gorontalo", emailPrefix: "bps7500", alamat: "Jl. Prof. Dr. H.B. Jassin No.361, Gorontalo", telepon: "(0435) 829668", web: "https://gorontalo.bps.go.id" },
    { key: "IDSR", namaWilayah: "Sulawesi Barat", kodeBps: "7600", namaSatkerBagian: "Provinsi Sulawesi Barat", emailPrefix: "bps7600", alamat: "Jl. Martadinata No. 10, Mamuju", telepon: "(0426) 2322002", web: "https://sulbar.bps.go.id" },
    { key: "IDMA", namaWilayah: "Maluku", kodeBps: "8100", namaSatkerBagian: "Provinsi Maluku", emailPrefix: "bps8100", alamat: "Jl. Tanah Tinggi, Ambon", telepon: "(0911) 352484", web: "https://maluku.bps.go.id" },
    { key: "IDMU", namaWilayah: "Maluku Utara", kodeBps: "8200", namaSatkerBagian: "Provinsi Maluku Utara", emailPrefix: "bps8200", alamat: "Jl. Raya No.1, Sofifi", telepon: "(0921) 3110617", web: "https://malut.bps.go.id" },
    { key: "IDPB", namaWilayah: "Papua Barat", kodeBps: "9200", namaSatkerBagian: "Provinsi Papua Barat", emailPrefix: "bps9200", alamat: "Jl. Trikora Wosi Komp. Perkantoran, Manokwari", telepon: "(0986) 211924", web: "https://papuabarat.bps.go.id" },
    { key: "IDPA", namaWilayah: "Papua", kodeBps: "9100", namaSatkerBagian: "Provinsi Papua", emailPrefix: "bps9100", alamat: "Jl. Soa Siu Dok II, Jayapura", telepon: "(0967) 533659", web: "https://papua.bps.go.id" },
    { key: "IDPS", namaWilayah: "Papua Selatan", kodeBps: "9300", namaSatkerBagian: "Provinsi Papua Selatan", emailPrefix: "bps9300", alamat: "Jl. Pahlawan No. 1, Merauke (Contoh)", telepon: "(0971) XXXXXX", web: "https://papuaselatan.bps.go.id" },
    { key: "IDPT", namaWilayah: "Papua Tengah", kodeBps: "9400", namaSatkerBagian: "Provinsi Papua Tengah", emailPrefix: "bps9400", alamat: "Jl. Trans Nabire No. 10, Nabire (Contoh)", telepon: "(0984) XXXXXX", web: "https://papuatengah.bps.go.id" },
    { key: "IDPP", namaWilayah: "Papua Pegunungan", kodeBps: "9500", namaSatkerBagian: "Provinsi Papua Pegunungan", emailPrefix: "bps9500", alamat: "Jl. Yos Sudarso, Wamena (Contoh)", telepon: "(0969) XXXXXX", web: "https://papuapegunungan.bps.go.id" },
    { key: "IDPBD", namaWilayah: "Papua Barat Daya", kodeBps: "9600", namaSatkerBagian: "Provinsi Papua Barat Daya", emailPrefix: "bps9600", alamat: "Jl. Basuki Rahmat Km. 10, Sorong (Contoh)", telepon: "(0951) XXXXXX", web: "https://papuabaratdaya.bps.go.id" },
];


const createProvincialSatkerData = (): { [key: string]: DetailPegawaiData } => {
    const provincialData: { [key: string]: DetailPegawaiData } = {};
    provinceDefinitions.forEach(prov => {
        const defaultPropertiesForSatker: Omit<DetailPegawaiData, "id" | "nama" | "namaSatkerLengkap" | "namaWilayahAsli" | "satuanKerjaId" | "satuanKerjaNama" | "alamatKantor" | "teleponKantor" | "homepageSatker" | "email" | "totalPegawai" | "persenTerhadapABK" | "rataUmurSatker" | "rataKJKSatker" | "pejabatStruktural" | "berita" | "daftarTimKerja" > = {
          nipLama: "N/A",
          nipBaru: "N/A",
          fotoUrl: undefined,
          tempatLahir: undefined,
          tanggalLahir: undefined,
          jenisKelamin: undefined,
          statusKepegawaian: undefined,
          TMT_PNS: undefined,
          pangkatGolongan: undefined,
          tmtPangkatGolongan: undefined,
          jabatanStruktural: undefined,
          jenjangJabatanFungsional: undefined,
          tmtJabatan: undefined,
          pendidikanTerakhir: undefined,
          masaKerjaGolongan: undefined,
          masaKerjaTotal: undefined,
          tanggalPensiun: undefined,
          sisaMasaKerja: undefined,
          grade: undefined,
          bmnDipegang: [],
          unitKerjaEselon1: undefined,
          unitKerjaEselon2: undefined,
          subtextABK: `Target ${prov.namaWilayah} ${new Date().getFullYear()}`,
          infoABK: `Perka BPS No. XX Tahun ${new Date().getFullYear()}`,
          subtextKJK: `KJK ${prov.namaWilayah} tidak termasuk bulan ini`,
          anggotaTim: [], // Mungkin tidak lagi digunakan jika daftarTimKerja lebih detail
          riwayatPendidikan: [],
          riwayatJabatan: [],
          kompetensi: [],
          prestasi: [],
          role: ''
        };
        
        const pejabatStrukturalProv = getPejabatUntukSatker(prov.kodeBps, prov.namaWilayah);

        provincialData[prov.key] = {
            ...defaultPropertiesForSatker,
            id: prov.key,
            nama: `BPS ${prov.namaSatkerBagian}`,
            namaSatkerLengkap: `Badan Pusat Statistik ${prov.namaSatkerBagian}`,
            namaWilayahAsli: prov.namaWilayah,
            satuanKerjaId: prov.kodeBps,
            satuanKerjaNama: prov.namaWilayah,
            email: `${prov.emailPrefix}@bps.go.id`,
            alamatKantor: prov.alamat,
            teleponKantor: prov.telepon,
            homepageSatker: prov.web,
            totalPegawai: randomInt(80, 450) + (pejabatStrukturalProv.length -1 /* Koordinator */) * 4 /* Anggota per tim */, // Estimasi kasar
            persenTerhadapABK: randomFloat(45, 85),
            rataUmurSatker: randomFloat(38, 45),
            rataKJKSatker: { jam: randomInt(0, 1), menit: randomInt(0, 59) },
            pejabatStruktural: pejabatStrukturalProv,
            berita: generateDummyOrganizationalNews(prov.key, prov.namaWilayah, randomInt(2,4)),
            daftarTimKerja: generateDaftarTimKerja(prov.kodeBps, prov.namaWilayah, pejabatStrukturalProv), // Generate daftar tim kerja
        };
    });
    return provincialData;
};


export const dataStatistikLengkap: DataStatistikNasional = {
  nasional: {
    id: "NASIONAL",
    nama: "Badan Pusat Statistik RI",
    // ... (field nasional lainnya tetap sama) ...
    nipBaru: "N/A",
    email: "humas@bps.go.id",
    namaSatkerLengkap: "Badan Pusat Statistik Republik Indonesia",
    namaWilayahAsli: "Nasional",
    satuanKerjaId: "NASIONAL",
    satuanKerjaNama: "Pusat",
    alamatKantor: "Jl. Dr. Sutomo No. 6-8, Jakarta Pusat 10710, Indonesia",
    teleponKantor: "(021) 3841195, 3842508, 3810291",
    homepageSatker: "https://www.bps.go.id",
    totalPegawai: 17593,
    persenTerhadapABK: 75.8,
    subtextABK: `Target Nasional ${new Date().getFullYear()}`,
    infoABK: `Peraturan Kepala BPS No. 182 Tahun ${new Date().getFullYear() - 1}`,
    rataUmurSatker: 40.2,
    rataKJKSatker: { jam: 0, menit: 35 },
    subtextKJK: "KJK Nasional tidak termasuk bulan ini",
    nipLama: "N/A",
    fotoUrl: "/logos/bps-logo.png",
    jabatanStruktural: "Lembaga Pemerintah Nonkementerian",
    unitKerjaEselon1: "Badan Pusat Statistik",
    pejabatStruktural: getPejabatUntukSatker("NASIONAL", "Nasional"),
    berita: generateDummyOrganizationalNews("NASIONAL", "Nasional", randomInt(3, 5)),
    // Generate daftar tim kerja juga untuk Nasional
    daftarTimKerja: generateDaftarTimKerja("NASIONAL", "Nasional", getPejabatUntukSatker("NASIONAL", "Nasional")),
    // ... (field opsional lainnya di-set undefined atau N/A)
    tempatLahir: undefined, tanggalLahir: undefined, jenisKelamin: undefined, statusKepegawaian: undefined,
    TMT_PNS: undefined, pangkatGolongan: undefined, tmtPangkatGolongan: undefined, jenjangJabatanFungsional: undefined,
    tmtJabatan: undefined, pendidikanTerakhir: undefined, masaKerjaGolongan: undefined, masaKerjaTotal: undefined,
    tanggalPensiun: undefined, sisaMasaKerja: undefined, grade: undefined, bmnDipegang: [], unitKerjaEselon2: undefined,
    anggotaTim: [], riwayatPendidikan: [], riwayatJabatan: [], kompetensi: [], prestasi: [],
    role: ''
  },
  ...createProvincialSatkerData(),
};