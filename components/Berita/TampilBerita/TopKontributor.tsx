import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image"; // Import the Image component

const contributors = [
  {
    name: "Fanni Budi Darmawan SST",
    imgUrl: "https://i.pravatar.cc/150?img=5",
    email: "fanni.darmawan@bps.go.id",
  },
  {
    name: "Rina Fitriani",
    imgUrl: "https://i.pravatar.cc/150?img=6",
    email: "rina.fitriani@bps.go.id",
  },
  {
    name: "Adi Kurniawan",
    imgUrl: "https://i.pravatar.cc/150?img=7",
    email: "adi.kurniawan@bps.go.id",
  },
  {
    name: "Budi Santoso",
    imgUrl: "https://i.pravatar.cc/150?img=8",
    email: "budi.santoso@bps.go.id",
  },
  {
    name: "Dewi Amalia",
    imgUrl: "https://i.pravatar.cc/150?img=9",
    email: "dewi.amalia@bps.go.id",
  },
  {
    name: "Eka Pratama",
    imgUrl: "https://i.pravatar.cc/150?img=10",
    email: "eka.pratama@bps.go.id",
  },
  {
    name: "Hadi Prasetyo",
    imgUrl: "https://i.pravatar.cc/150?img=11",
    email: "hadi.prasetyo@bps.go.id",
  },
  {
    name: "Kurniawan Dwi",
    imgUrl: "https://i.pravatar.cc/150?img=12",
    email: "kurniawan.dwi@bps.go.id",
  },
];

const TopKontributor: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState<"left" | "right">("right");
  const avatarsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Cek posisi avatar dan atur posisi popup (kiri atau kanan)
  useEffect(() => {
    if (activeIndex !== null && avatarsRef.current[activeIndex]) {
      const rect = avatarsRef.current[activeIndex]!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (viewportWidth - rect.right < 320) {
        setPopupPosition("left");
      } else {
        setPopupPosition("right");
      }
    }
  }, [activeIndex]);

  // Tutup popup saat klik di luar popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeIndex !== null) {
        const popup = document.getElementById("contributor-popup");
        if (popup && !popup.contains(event.target as Node)) {
          setActiveIndex(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIndex]);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {contributors.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              avatarsRef.current[i] = el;
            }}
            className={`relative cursor-pointer rounded-full transition-transform duration-300 ${
              activeIndex === i
                ? "scale-110 ring-4 ring-blue-500 shadow-lg z-20"
                : "hover:scale-105 hover:shadow-md"
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
            tabIndex={0}
            aria-describedby={
              activeIndex === i ? "contributor-popup" : undefined
            }
          >
            {/* Replace img tag with Image component */}
            <Image
              src={c.imgUrl}
              alt={c.name}
              width={64} // Assuming w-16 in Tailwind corresponds to 64px (16 * 4)
              height={64} // Assuming h-16 in Tailwind corresponds to 64px (16 * 4)
              className="rounded-full object-cover border border-gray-300"
            />

            {activeIndex === i && (
              <div
                id="contributor-popup"
                role="dialog"
                aria-modal="true"
                className={`absolute top-1/2 -translate-y-1/2 w-72 max-w-xs bg-white rounded-xl shadow-xl p-5 z-30 animate-slideFade
                  ${
                    popupPosition === "right"
                      ? "left-full ml-4"
                      : "right-full mr-4"
                  }
                `}
                style={{ minWidth: 280 }}
              >
                {/* Panah kecil */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-t border-gray-300 rotate-45
                    ${popupPosition === "right" ? "-left-1.5" : "-right-1.5"}
                  `}
                ></div>

                <button
                  onClick={() => setActiveIndex(null)}
                  aria-label="Tutup profil"
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
                >
                  <X size={20} />
                </button>

                <div className="bg-gray-100 p-3 rounded-md font-semibold text-center text-gray-800 mb-4">
                  {c.name}
                </div>

                <div className="border-t border-gray-300 mb-4"></div>

                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="font-semibold">Nama Lengkap</span>
                  <span>{c.name}</span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="font-semibold">Email</span>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {c.email}
                  </a>
                </div>
                <div className="flex justify-between text-gray-700 mb-4">
                  <span className="font-semibold">Satuan Kerja</span>
                  <span>BPS Provinsi</span>
                </div>

                <button
                  type="button"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                  Lihat Profil
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideFade {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideFade {
          animation: slideFade 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default TopKontributor;
