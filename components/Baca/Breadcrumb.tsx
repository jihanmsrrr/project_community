import React from "react";

interface BreadcrumbProps {
  kategori?: string;
  subKategori?: string;
  modul?: string;
  onNavigate?: (level: "kategori" | "subKategori" | "modul") => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  kategori,
  subKategori,
  modul,
  onNavigate,
}) => {
  return (
    <nav
      className="text-sm mb-6 px-4 sm:px-0"
      aria-label="Breadcrumb"
    >
      <ol className="list-none flex flex-wrap items-center space-x-2 text-blue-600">
        {/* Home / Beranda */}
        <li>
          <button
            onClick={() => onNavigate && onNavigate("kategori")}
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-current={!(kategori && subKategori && modul) ? "page" : undefined}
          >
            Beranda
          </button>
        </li>

        {/* Separator */}
        {kategori && <li aria-hidden="true">/</li>}

        {/* Kategori */}
        {kategori && (
          <li>
            <button
              onClick={() => onNavigate && onNavigate("kategori")}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-current={!(subKategori && modul) ? "page" : undefined}
            >
              {kategori}
            </button>
          </li>
        )}

        {/* Separator */}
        {subKategori && <li aria-hidden="true">/</li>}

        {/* Subkategori */}
        {subKategori && (
          <li>
            <button
              onClick={() => onNavigate && onNavigate("subKategori")}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-current={!modul ? "page" : undefined}
            >
              {subKategori}
            </button>
          </li>
        )}

        {/* Separator */}
        {modul && <li aria-hidden="true">/</li>}

        {/* Modul (current page, no button) */}
        {modul && (
          <li
            aria-current="page"
            className="text-gray-700 font-semibold truncate max-w-xs"
            title={modul}
          >
            {modul}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
