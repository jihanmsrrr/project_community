// Interface untuk Pegawai
export interface Pegawai {
    nama: string;
    jabatan: string;
    nip?: string; // Tambahkan NIP sebagai opsional
}
  
// Interface untuk Bagian yang berisi Pegawai
export interface Bagian {
    [key: string]: Pegawai[]; // Key-nya string (nama bagian), value-nya array pegawai
}
  
// Interface untuk Pejabat
export interface Pejabat {
    nama: string;
    jabatan: string;
    nip?: string; // Tambahkan NIP sebagai opsional
}
  
// Interface untuk Data Provinsi atau BPS Pusat
export interface ProvinsiData {
    alamat: string;
    telepon: string;
    email: string;
    website: string;
    kabupatenKota?: string[]; // Opsional untuk BPS Pusat
    pegawai: Bagian;  // Data pegawai berdasarkan bagian
    pejabat: Pejabat[]; // Daftar pejabat
}
  
// Dummy Data Satker dengan Interface yang sudah didefinisikan
const satker: { bpsProvinsi: { [key: string]: ProvinsiData } } = {
    bpsProvinsi: {
        "Badan Pusat Statistik": {
            alamat: "Jl. Dr. Sutomo 6 - 8",
            telepon: "-",
            email: "bpshq@bps.go.id",
            website: "http://www.bps.go.id",
            pegawai: {
                "Biro Perencanaan": [{ nama: "Biro Perencanaan", jabatan: "Kepala Biro" }],
                "Biro Keuangan": [{ nama: "Biro Keuangan", jabatan: "Kepala Biro" }],
                "Biro Sumber Daya Manusia": [{ nama: "Biro Sumber Daya Manusia", jabatan: "Kepala Biro" }],
                "Biro Hubungan Masyarakat dan Hukum": [{ nama: "Biro Hubungan Masyarakat dan Hukum", jabatan: "Kepala Biro" }],
                "Biro Umum": [{ nama: "Biro Umum", jabatan: "Kepala Biro" }],
                "Pusat Pendidikan dan Pelatihan": [{ nama: "Pusat Pendidikan dan Pelatihan", jabatan: "Kepala Pusat" }],
                "Politeknik Statistika STIS": [{ nama: "Politeknik Statistika STIS", jabatan: "Direktur" }],
                "Direktorat Pengembangan Metodologi Sensus dan Survei": [{ nama: "Direktorat Pengembangan Metodologi Sensus dan Survei", jabatan: "Direktur" }],
                "Direktorat Diseminasi Statistik": [{ nama: "Direktorat Diseminasi Statistik", jabatan: "Direktur" }],
                "Direktorat Sistem Informasi Statistik": [{ nama: "Direktorat Sistem Informasi Statistik", jabatan: "Direktur" }],
                "Direktorat Statistik Kependudukan dan Ketenagakerjaan": [{ nama: "Direktorat Statistik Kependudukan dan Ketenagakerjaan", jabatan: "Direktur" }],
                "Direktorat Statistik Kesejahteraan Rakyat": [{ nama: "Direktorat Statistik Kesejahteraan Rakyat", jabatan: "Direktur" }],
                "Direktorat Statistik Ketahanan Sosial": [{ nama: "Direktorat Statistik Ketahanan Sosial", jabatan: "Direktur" }],
                "Direktorat Statistik Tanaman Pangan, Hortikultura, dan Perkebunan": [{ nama: "Direktorat Statistik Tanaman Pangan, Hortikultura, dan Perkebunan", jabatan: "Direktur" }],
                "Direktorat Statistik Peternakan, Perikanan, dan Kehutanan": [{ nama: "Direktorat Statistik Peternakan, Perikanan, dan Kehutanan", jabatan: "Direktur" }],
                "Direktorat Statistik Industri": [{ nama: "Direktorat Statistik Industri", jabatan: "Direktur" }],
                "Direktorat Statistik Distribusi": [{ nama: "Direktorat Statistik Distribusi", jabatan: "Direktur" }],
                "Direktorat Statistik Harga": [{ nama: "Direktorat Statistik Harga", jabatan: "Direktur" }],
                "Direktorat Statistik Keuangan, Teknologi Informasi, dan Pariwisata": [{ nama: "Direktorat Statistik Keuangan, Teknologi Informasi, dan Pariwisata", jabatan: "Direktur" }],
                "Direktorat Neraca Produksi": [{ nama: "Direktorat Neraca Produksi", jabatan: "Direktur" }],
                "Direktorat Neraca Pengeluaran": [{ nama: "Direktorat Neraca Pengeluaran", jabatan: "Direktur" }],
                "Direktorat Analisis dan Pengembangan Statistik": [{ nama: "Direktorat Analisis dan Pengembangan Statistik", jabatan: "Direktur" }],
                "Inspektorat Wilayah I": [{ nama: "Inspektorat Wilayah I", jabatan: "Inspektur" }],
                "Inspektorat Wilayah II": [{ nama: "Inspektorat Wilayah II", jabatan: "Inspektur" }],
                "Inspektorat Wilayah III": [{ nama: "Inspektorat Wilayah III", jabatan: "Inspektur" }],
            },
            pejabat: [
                { nama: "Amalia Adininggar Widyasanti S.T., M.Si., M.Eng., Ph.D", jabatan: "Kepala Badan Pusat Statistik", nip: "350001010" },
                { nama: "Dr. Sonny Harry Budiutomo Harmadi S.E., M.E.", jabatan: "Wakil Kepala Badan Pusat Statistik", nip: "607050206" },
                { nama: "Dr. Ateng Hartono SE, M.Si", jabatan: "Deputi Bidang Statistik Sosial", nip: "340013369" },
                { nama: "M. Habibullah S.Si, M.Si", jabatan: "Deputi Bidang Statistik Produksi", nip: "340012033" },
                { nama: "Dr. Pudji Ismartini M.App.Stat", jabatan: "Deputi Bidang Statistik Distribusi dan Jasa", nip: "340013738" },
                { nama: "Moh Edy Mahmud S.Si, M.P", jabatan: "Deputi Bidang Neraca dan Analisis Statistik", nip: "340013006" },
                { nama: "Dr. Dadang Hardiwan S.Si, M.Si", jabatan: "Inspektorat Utama", nip: "340015058" },
            ],
        },
    
        "Jawa Barat": {
            alamat: "Jl. Raya No. 1, Bandung",
            telepon: "022-123456",
            email: "info@bps-jawa-barat.go.id",
            website: "https://bps-jabar.go.id",
            kabupatenKota: ["Bandung", "Bekasi", "Bogor"],
            pegawai: {
                "Bagian Umum": [
                    { nama: "Budi", jabatan: "Kepala Bagian" },
                    { nama: "Siti", jabatan: "Staff Administrasi" }
                ],
            },
            pejabat: [
                { nama: "Marsudijono", jabatan: "Kepala BPS Provinsi Jawa Barat" },
                { nama: "Aris Budiyanto", jabatan: "Kepala BPS Kota Bandung" },
            ],
        },
        "DKI Jakarta": {
            alamat: "Jl. Merdeka No. 2, Jakarta",
            telepon: "021-654321",
            email: "info@bps-dki.go.id",
            website: "https://bps-dki.go.id",
            kabupatenKota: ["Jakarta Selatan", "Jakarta Utara"],
            pegawai: {
                "Bagian Umum": [
                    { nama: "Dani", jabatan: "Kepala Bagian" },
                    { nama: "Mira", jabatan: "Staff Administrasi" }
                ],
            },
            pejabat: [
                { nama: "Fikri", jabatan: "Kepala BPS DKI Jakarta" },
                { nama: "Siti Aisyah", jabatan: "Kepala BPS Kota Jakarta Selatan" },
            ],
        },
    },
};

export default satker;
