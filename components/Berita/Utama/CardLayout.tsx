import React from "react";
import { useRouter } from "next/router";
import { Eye, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";

const CardLayout = () => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/berita/tampilberita");
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick();
      }}
      className="max-w-sm w-full bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src="https://picsum.photos/500/400"
          alt="Efisiensi Anggaran Pemerintah 2025"
          className="object-cover"
          fill
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
        {/* Optional overlay if needed */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
          Efisiensi Anggaran Pemerintah 2025: Dampak dan Potensi
        </h3>
        <p className="text-gray-700 text-sm flex-grow leading-relaxed">
          Bertempat di BPS gedung 1 lantai 8 pada Selasa, 25 Februari 2025 telah
          dilakukan internalisasi hasil Survei Budaya Organisasi (SBO) untuk
          peningkatan Reformasi Birokrasi di lingkungan Inspektorat Utama.
          Internaliasi dih...
        </p>
      </div>

      {/* Footer */}
      <div className="p-5 flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center space-x-3">
          <Image
            src="https://i.pravatar.cc/150?img=120"
            alt="Author Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-gray-900 font-semibold text-sm">
              Jihan Maisaroh
            </p>
            <p className="text-gray-900 font-semibold text-sm">
              Jihan Maisaroh
            </p>
            <p className="text-gray-500 text-xs">28 Februari 2025</p>
          </div>
        </div>

        {/* Icons */}
        <div className="flex space-x-4 text-gray-600">
          <Eye className="w-5 h-5 hover:text-blue-600 transition-colors cursor-pointer" />
          <MessageSquare className="w-5 h-5 hover:text-blue-600 transition-colors cursor-pointer" />
          <Share2 className="w-5 h-5 hover:text-blue-600 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default CardLayout;
