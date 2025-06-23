import React, { JSX, useState } from "react";

// --- SVG Icon Components ---
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const BeritaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
    />
  </svg>
);

const OrganisasiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.126-1.263-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.126-1.263.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const RuangBacaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v11.494m0 0a8.485 8.485 0 0011.02-7.004A8.485 8.485 0 0012 6.253zM12 6.253A8.485 8.485 0 00.98 13.257a8.485 8.485 0 0011.02 7.004z"
    />
  </svg>
);

const ReformasiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const AdminIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const RekapBeritaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-yellow-600 group-hover:text-yellow-800"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
      clipRule="evenodd"
    />
  </svg>
);

const BeritaBelumTayangIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-yellow-600 group-hover:text-yellow-800"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13zM7 12a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z"
      clipRule="evenodd"
    />
  </svg>
);

const BeritaTayangIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-yellow-600 group-hover:text-yellow-800"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

const TambahBeritaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-yellow-600 group-hover:text-yellow-800"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const UploadGambarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3 text-yellow-600 group-hover:text-yellow-800"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Component Props Interfaces ---
interface NavItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
  isActive?: boolean;
  className?: string;
}

interface Berita {
  no: number;
  judul: string;
  penulis: string;
  tanggal: string;
}

interface BeritaTableProps {
  data: Berita[];
}

// --- Reusable Components ---
const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  className,
}) => (
  <a
    href={href}
    className={`flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 ${
      isActive
        ? "bg-sky-700 text-white"
        : "text-slate-300 hover:bg-sky-600 hover:text-white"
    } ${className}`}
  >
    {icon}
    {label}
  </a>
);

const AdminBeritaNavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  className,
}) => (
  <a
    href={href}
    className={`flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 group ${
      isActive
        ? "text-yellow-700 bg-yellow-200"
        : "text-yellow-700 hover:bg-yellow-400 hover:text-yellow-900"
    } ${className}`}
  >
    {icon}
    {label}
  </a>
);

// --- Main Components ---
const Sidebar: React.FC = () => {
  const navItems = [
    { href: "#", icon: <HomeIcon />, label: "Home" },
    { href: "#", icon: <EmailIcon />, label: "Email" },
    { href: "#", icon: <BeritaIcon />, label: "Berita", isActive: true },
    { href: "#", icon: <OrganisasiIcon />, label: "Organisasi" },
    { href: "#", icon: <RuangBacaIcon />, label: "Ruang Baca" },
    { href: "#", icon: <ReformasiIcon />, label: "Reformasi Birokrasi" },
    { href: "#", icon: <AdminIcon />, label: "Admin" },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 p-6 space-y-6 shadow-lg fixed h-full">
      <div className="text-2xl font-semibold text-center">
        <span className="text-sky-400">Admin</span>Net
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-700">
        <div className="flex items-center mb-3">
          <img
            src="https://placehold.co/40x40/60A5FA/FFFFFF?text=A"
            alt="Avatar Pengguna"
            className="w-10 h-10 rounded-full mr-3 border-2 border-sky-400"
          />
          <div>
            <p className="text-sm font-medium">Aina</p>
            <p className="text-xs text-slate-400">2 Juni 2025</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-slate-300 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-150">
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
};

const BeritaTable: React.FC<BeritaTableProps> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            No.
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Judul
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Penulis/Kontributor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tanggal
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Hapus
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.no}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {item.no}
            </td>
            <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs break-words">
              {item.judul}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {item.penulis}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {item.tanggal}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <a
                href="#"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Ya
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination: React.FC = () => (
  <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
    <p className="text-sm text-gray-700 mb-4 sm:mb-0">
      Baris <span className="font-medium">1</span> sampai{" "}
      <span className="font-medium">10</span> dari{" "}
      <span className="font-medium">2292</span> baris
    </p>
    <nav className="flex items-center space-x-1">
      {["First", "Previous", "1", "2", "3", "4", "5", "Next", "Last"].map(
        (item, index) => (
          <a
            key={index}
            href="#"
            className={`px-3 py-2 text-sm rounded-md transition duration-150 ${
              item === "1"
                ? "text-sky-600 bg-sky-50 border border-sky-300 hover:bg-sky-100 z-10"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {item}
          </a>
        )
      )}
    </nav>
  </div>
);

const MainContent: React.FC = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const beritaData: Berita[] = [
    {
      no: 1,
      judul:
        "POLICY BRIEF Urgensi Anggaran Pengawasan untuk Mendukung Akuntabilitas dan Reformasi Birokrasi. Studi atas Pagu Anggaran Inspektorat Utama BPS Tahun Anggaran 2020.",
      penulis: "Siti Nur Laelatul Badriyah SE AK, M.SI, CA",
      tanggal: "27-05-2025",
    },
    {
      no: 2,
      judul:
        "Meningkatkan Kualitas Indikator Statistik Melalui Strategi Validasi Data yang Sistematik dan Mitigasi Risiko Terintegrasi",
      penulis: "Siti Nur Laelatul Badriyah SE AK, M.SI, CA",
      tanggal: "27-05-2025",
    },
    {
      no: 3,
      judul: "Buka-Bukaan Yuki Sarpono: From Zero to Hero",
      penulis: "Sarip Utoyo SST, M.S",
      tanggal: "20-05-2025",
    },
    {
      no: 4,
      judul: "Permenperin 13/2025: Pelaporan Data Industri Triwulanan",
      penulis: "Arianto S.Si, SE M.S",
      tanggal: "15-04-2025",
    },
    {
      no: 5,
      judul:
        "BREAKING NEWS: Berkah Ramadhan! Jurnal FORMASI Resmi Terakreditasi SINTA 4",
      penulis: "Arianto S.Si, SE M.SI",
      tanggal: "27-03-2025",
    },
  ];

  // Filter data based on searchTerm (simple example, can be more complex)
  const filteredData = beritaData.filter(
    (berita) =>
      berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.penulis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      <div className="bg-sky-600 text-white p-6 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-semibold">
          Daftar Berita yang Belum Ditayangkan
        </h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="showEntries" className="text-sm text-gray-600">
              Perlihatkan
            </label>
            <select
              id="showEntries"
              name="showEntries"
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-600">baris</span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 pl-10 text-sm w-full sm:w-64 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
            <SearchIcon />
          </div>
        </div>

        <BeritaTable data={filteredData.slice(0, parseInt(showEntries))} />
        <Pagination />
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Copyright &copy; 2025 Community Badan Pusat Statistik</p>
        <p>IP Anda: 10.0.39.254, Browser Anda: Google Chrome</p>
      </footer>
    </main>
  );
};

const AdminBeritaSidebar: React.FC = () => {
  const adminNavItems = [
    { href: "#", icon: <RekapBeritaIcon />, label: "Rekap Berita" },
    {
      href: "#",
      icon: <BeritaBelumTayangIcon />,
      label: "Berita Belum Tayang",
      isActive: true,
    },
    { href: "#", icon: <BeritaTayangIcon />, label: "Berita Tayang" },
    { href: "#", icon: <TambahBeritaIcon />, label: "Tambah Berita" },
    { href: "#", icon: <UploadGambarIcon />, label: "Upload Gambar" },
  ];
  return (
    <aside className="w-72 bg-yellow-50 p-6 rounded-lg shadow-lg fixed right-4 top-24 bottom-24 overflow-y-auto border border-yellow-300">
      <h2 className="text-xl font-semibold text-yellow-800 mb-4 border-b-2 border-yellow-300 pb-2">
        Admin Berita
      </h2>
      <nav className="space-y-2">
        {adminNavItems.map((item) => (
          <AdminBeritaNavItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
};

// --- App Component ---
const App: React.FC = () => {
  // Load Tailwind CSS and Inter font dynamically for the preview environment
  // In a real project, these would typically be in your index.html or main CSS file.
  React.useEffect(() => {
    const tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindScript);

    const interFontLink = document.createElement("link");
    interFontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    interFontLink.rel = "stylesheet";
    document.head.appendChild(interFontLink);

    const customScrollbarStyle = document.createElement("style");
    customScrollbarStyle.innerHTML = `
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F3F4F6; /* bg-gray-100 */
        }
    `;
    document.head.appendChild(customScrollbarStyle);

    return () => {
      document.head.removeChild(tailwindScript);
      document.head.removeChild(interFontLink);
      document.head.removeChild(customScrollbarStyle);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MainContent />
      <AdminBeritaSidebar />
    </div>
  );
};

export default App;
