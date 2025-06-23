import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Download,
  Share2,
  FileText,
  CheckCircle,
  Search,
} from "lucide-react";

// --- DATA & TYPE DEFINITIONS (SUDAH DIPERBAIKI) ---

// Data Modul Anda
export const modulData = [
  {
    kategori: "pembinaan-statistik",
    tahun: 2023,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Tata Laksana Penyelenggaraan Statistik",
            deskripsi:
              "Panduan lengkap tata laksana penyelenggaraan statistik sesuai standar BPS.",
            ukuran: "4,92 MB",
            hits: 975,
            fileName: "modul1.pdf",
            slug: "tata-laksana-penyelenggaraan-statistik",
          },
          {
            judul: "Langkah Praktis dalam Survei dan Kompromin",
            deskripsi:
              "Teknik dan langkah praktis yang diterapkan dalam survei serta koordinasi pemasaran dan informasi.",
            ukuran: "6,63 MB",
            hits: 666,
            fileName: "modul-2.pdf",
            slug: "langkah-praktis-survei-kompromin",
          },
        ],
      },
      {
        nama: "topik-2",
        modul: [
          {
            judul: "Metodologi Survei Statistik",
            deskripsi:
              "Metode dan teknik survei yang efektif dan akurat dalam pengumpulan data statistik.",
            ukuran: "5,10 MB",
            hits: 432,
            fileName: "metodologi-survei.pdf",
            slug: "metodologi-survei-statistik",
          },
          {
            judul: "Teknik Sampling dan Pengolahan Data",
            deskripsi:
              "Penjelasan lengkap teknik sampling dan pengolahan data untuk hasil statistik yang valid.",
            ukuran: "8,75 MB",
            hits: 389,
            fileName: "sampling-pengolahan.pdf",
            slug: "teknik-sampling-pengolahan-data",
          },
        ],
      },
      {
        nama: "topik-3",
        modul: [
          {
            judul: "Statistik Pertanian",
            deskripsi:
              "Analisis dan metodologi pengumpulan data statistik di sektor pertanian.",
            ukuran: "9,01 MB",
            hits: 415,
            fileName: "statistik-pertanian.pdf",
            slug: "statistik-pertanian",
          },
        ],
      },
    ],
  },
  {
    kategori: "metodologi-sensus-survei",
    tahun: 2023,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Metode Sensus dan Survei Terpadu",
            deskripsi: "Panduan metodologi sensus dan survei terpadu terbaru.",
            ukuran: "7,5 MB",
            hits: 275,
            fileName: "metode-sensus.pdf",
            slug: "metode-sensus-survei-terpadu",
          },
          {
            judul: "Teknik Pengolahan Data Sensus",
            deskripsi: "Teknik pengolahan dan validasi data hasil sensus.",
            ukuran: "6,1 MB",
            hits: 298,
            fileName: "teknik-pengolahan-sensus.pdf",
            slug: "teknik-pengolahan-data-sensus",
          },
        ],
      },
    ],
  },
  {
    kategori: "paparan",
    tahun: 2023,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Paparan Hasil Survei Nasional",
            deskripsi: "Paparan lengkap hasil survei nasional terbaru.",
            ukuran: "4,3 MB",
            hits: 112,
            fileName: "paparan-hasil.pdf",
            slug: "paparan-hasil-survei-nasional",
          },
        ],
      },
    ],
  },
  {
    kategori: "kompetisi-inovasi",
    tahun: 2023,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Panduan Kompetisi Inovasi BPS 2023",
            deskripsi:
              "Peraturan dan panduan lengkap untuk kompetisi inovasi BPS.",
            ukuran: "3,5 MB",
            hits: 150,
            fileName: "kompetisi-inovasi.pdf",
            slug: "panduan-kompetisi-inovasi-bps-2023",
          },
          {
            judul: "Ide dan Proposal Inovasi",
            deskripsi:
              "Cara menyiapkan ide dan proposal inovasi untuk kompetisi.",
            ukuran: "4,1 MB",
            hits: 123,
            fileName: "ide-proposal.pdf",
            slug: "ide-dan-proposal-inovasi",
          },
        ],
      },
    ],
  },
  {
    kategori: "monev",
    tahun: 2023,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Metodologi Monitoring dan Evaluasi",
            deskripsi:
              "Pendekatan dan teknik monitoring dan evaluasi program statistik.",
            ukuran: "7,3 MB",
            hits: 198,
            fileName: "metodologi-monev.pdf",
            slug: "metodologi-monitoring-evaluasi",
          },
          {
            judul: "Pelaporan Hasil Evaluasi",
            deskripsi:
              "Cara menyusun laporan hasil evaluasi yang sistematis dan efektif.",
            ukuran: "5,1 MB",
            hits: 174,
            fileName: "laporan-evaluasi.pdf",
            slug: "pelaporan-hasil-evaluasi",
          },
        ],
      },
    ],
  },
  {
    kategori: "akuntabilitas-kinerja",
    tahun: 2024,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Dasar-dasar Akuntabilitas Kinerja",
            deskripsi:
              "Pengertian dan prinsip utama sistem akuntabilitas kinerja di instansi pemerintah.",
            ukuran: "5,6 MB",
            hits: 234,
            fileName: "dasar-akuntabilitas.pdf",
            slug: "dasar-akuntabilitas-kinerja",
          },
          {
            judul: "Pengukuran dan Evaluasi Kinerja",
            deskripsi:
              "Metode dan indikator pengukuran kinerja yang tepat untuk akuntabilitas.",
            ukuran: "7,9 MB",
            hits: 190,
            fileName: "pengukuran-kinerja.pdf",
            slug: "pengukuran-dan-evaluasi-kinerja",
          },
        ],
      },
    ],
  },
  {
    kategori: "regulasi",
    tahun: 2023,
    subKategori: [
      {
        nama: "topik-1",
        modul: [
          {
            judul: "Undang-Undang Statistik",
            deskripsi:
              "Regulasi dasar yang mengatur penyelenggaraan statistik nasional.",
            ukuran: "3,9 MB",
            hits: 210,
            fileName: "undang-undang-statistik.pdf",
            slug: "undang-undang-statistik",
          },
          {
            judul: "Peraturan Menteri Terkait Statistik",
            deskripsi:
              "Peraturan teknis pelaksanaan penyelenggaraan statistik dari kementerian terkait.",
            ukuran: "4,5 MB",
            hits: 189,
            fileName: "permen-statistik.pdf",
            slug: "peraturan-menteri-statistik",
          },
        ],
      },
    ],
  },
];

interface Modul {
  judul: string;
  deskripsi: string;
  ukuran: string;
  hits: number;
  fileName: string;
  slug: string;
}

interface SubKategori {
  nama: string;
  modul: Modul[];
}

interface Kategori {
  kategori: string;
  tahun: number;
  subKategori: SubKategori[];
}

// --- KOMPONEN-KOMPONEN ---

// Komponen untuk notifikasi (menggantikan alert)
// PERBAIKAN 1 & 2 DI SINI: Memberikan tipe eksplisit pada props
const Toast = ({ message, show }: { message: string; show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-xl animate-fade-in-up flex items-center gap-2 z-50">
      <CheckCircle size={20} />
      <span>{message}</span>
    </div>
  );
};

// Komponen untuk menampilkan satu item modul
const ModulItem = ({
  modul,
  onShare,
}: {
  modul: Modul;
  onShare: (message: string) => void;
}) => {
  const fileUrl = `/files/${modul.fileName}`; // Asumsi file ada di public/files

  const handleShareClick = () => {
    const shareText = `Lihat modul ini: ${modul.judul}. Anda bisa membacanya di ${window.location.origin}${fileUrl}`;
    navigator.clipboard.writeText(shareText);
    onShare("Tautan berhasil disalin!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          {modul.judul}
        </h4>
        <p className="text-sm text-gray-600 mb-4">{modul.deskripsi}</p>
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-medium text-gray-500">
            {modul.ukuran}
          </span>
          <span className="text-xs font-medium text-gray-500">
            Dilihat: {modul.hits} kali
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-3 transition-colors duration-300"
          >
            <BookOpen size={16} />
            <span>Baca</span>
          </a>
          <a
            href={fileUrl}
            download={modul.fileName}
            className="flex items-center justify-center gap-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-md py-2 px-3 transition-colors duration-300"
          >
            <Download size={16} />
            <span>Unduh</span>
          </a>
          <button
            onClick={handleShareClick}
            className="flex items-center justify-center gap-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md py-2 px-3 transition-colors duration-300"
          >
            <Share2 size={16} />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk menampilkan daftar modul dalam sebuah kategori
const ModulList = ({
  data,
  onShare,
}: {
  data: Kategori;
  onShare: (message: string) => void;
}) => {
  return (
    <div>
      {data.subKategori.map((sub, i) => (
        <div key={i} className="mb-8">
          <div className="flex items-baseline gap-4">
            <h3 className="text-xl font-bold text-gray-700 capitalize">
              {sub.nama.replace("-", " ")}
            </h3>
            <p className="text-sm text-gray-500">({data.tahun})</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {sub.modul.map((modul, index) => (
              <ModulItem key={index} modul={modul} onShare={onShare} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Komponen utama aplikasi
export default function App() {
  const [activeKategori, setActiveKategori] = useState<string>(
    modulData[0].kategori
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [toastInfo, setToastInfo] = useState({ message: "", show: false });

  const activeData = modulData.find((d) => d.kategori === activeKategori);

  const filteredData = useMemo(() => {
    if (!activeData) return null;
    if (!searchQuery.trim()) return activeData;

    const lowercasedQuery = searchQuery.toLowerCase();
    const newActiveData = JSON.parse(JSON.stringify(activeData));

    newActiveData.subKategori = newActiveData.subKategori
      // PERBAIKAN 3 DI SINI: Menggunakan interface SubKategori, bukan 'any'
      .map((sub: SubKategori) => {
        sub.modul = sub.modul.filter(
          (modul) =>
            modul.judul.toLowerCase().includes(lowercasedQuery) ||
            modul.deskripsi.toLowerCase().includes(lowercasedQuery)
        );
        return sub;
      })
      // PERBAIKAN 4 DI SINI: Tipe untuk 'sub' sekarang sudah benar
      .filter((sub: SubKategori) => sub.modul.length > 0);

    return newActiveData;
  }, [activeData, searchQuery]);

  const handleShowToast = (message: string) => {
    setToastInfo({ message, show: true });
    setTimeout(() => setToastInfo({ message: "", show: false }), 3000);
  };

  const hasResults = filteredData && filteredData.subKategori.length > 0;

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <FileText className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="text-4xl font-extrabold text-gray-800 mt-2">
            Pustaka Modul
          </h1>
          <p className="text-md text-gray-600 mt-2">
            Jelajahi, baca, dan unduh modul terbaru.
          </p>
        </header>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="search"
              placeholder="Cari modul berdasarkan judul atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 border-b-2 border-gray-200 pb-4">
          {modulData.map((item) => (
            <button
              key={item.kategori}
              onClick={() => setActiveKategori(item.kategori)}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeKategori === item.kategori
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-blue-100"
              }`}
            >
              {item.kategori
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        <main>
          {hasResults ? (
            <ModulList data={filteredData} onShare={handleShowToast} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                Tidak ada modul yang cocok dengan pencarian Anda.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Coba gunakan kata kunci yang lain.
              </p>
            </div>
          )}
        </main>
      </div>

      <Toast message={toastInfo.message} show={toastInfo.show} />
    </div>
  );
}
