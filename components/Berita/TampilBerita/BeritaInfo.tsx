import React, { useState } from "react";
// --- PERUBAHAN: Impor komponen Image dari Next.js ---
import Image from "next/image";
import { Share, Save, MessageCircle, Plus, X } from "lucide-react";

const BeritaInfo: React.FC = () => {
  const [showAuthorInfo, setShowAuthorInfo] = useState(false);

  const keywords = [
    "Efisiensi",
    "Anggaran",
    "Luxury Travel",
    "Travel Log",
    "Paradise Island",
    "Travel Info",
  ];

  const toggleAuthorInfo = () => setShowAuthorInfo((prev) => !prev);
  const closeAuthorInfo = () => setShowAuthorInfo(false);

  return (
    <div className="max-w-xl mx-auto bg-gray-100 p-5 rounded-xl relative font-sans">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        {/* --- PERUBAHAN: Menggunakan komponen Image dari Next.js --- */}
        <Image
          src="https://i.pravatar.cc/150?img=9"
          alt="Penulis"
          className="rounded-full object-cover"
          width={56} // w-14 di Tailwind secara default adalah 56px
          height={56} // h-14 di Tailwind secara default adalah 56px
        />
        <button
          onClick={toggleAuthorInfo}
          className="text-lg font-semibold text-gray-800 hover:text-blue-700 transition-colors cursor-pointer"
          aria-expanded={showAuthorInfo}
          aria-controls="author-popup"
        >
          Fanni Budi Darmawan SST
        </button>
      </div>

      {/* Author Popup */}
      {showAuthorInfo && (
        <div
          id="author-popup"
          className="absolute top-20 left-0 w-full bg-white rounded-lg shadow-lg p-6 z-20 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={closeAuthorInfo}
            className="absolute top-3 right-3 p-1 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
            aria-label="Close author info"
          >
            <X size={20} />
          </button>

          <div className="bg-gray-100 text-gray-800 font-semibold p-3 rounded mb-4 text-center text-lg">
            Fanni Budi Darmawan SST
          </div>

          <div className="border-t border-gray-300 mt-2 mb-4"></div>

          <div className="space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Nama Lengkap</span>
              <span>Fanni Budi Darmawan SST</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">NIP</span>
              <span>340057726 - 199504132017011002</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Email</span>
              <a
                href="mailto:fanni.darmawan@bps.go.id"
                className="text-blue-700 hover:underline"
              >
                fanni.darmawan@bps.go.id
              </a>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Satuan Kerja</span>
              <span>BPS Provinsi</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Telepon/Ext</span>
              <span>-</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Alamat Kantor</span>
              <span>
                BPS Propinsi Nusa Tenggara Barat Jl. Dr. Soedjono No. 74
              </span>
            </div>
          </div>

          <button
            onClick={toggleAuthorInfo}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} />
            <span>Lihat Profil</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-5 overflow-x-auto">
        {[
          { Icon: Share, label: "Bagikan" },
          { Icon: Save, label: "Simpan" },
          { Icon: MessageCircle, label: "Komentar" },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1 bg-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-300 transition"
            type="button"
            aria-label={label}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Keywords */}
      <div className="mt-6">
        <h3 className="text-gray-800 font-semibold mb-2">Kata Kunci</h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="bg-gray-300 text-gray-800 rounded-full px-3 py-1 text-sm select-none"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default BeritaInfo;
