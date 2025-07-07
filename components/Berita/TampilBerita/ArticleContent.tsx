import React from "react";
// --- PERUBAHAN: Impor komponen Image dari Next.js ---
import Image from "next/image";
import { Calendar, MessageCircle, Tag } from "lucide-react";

const ArticleContent = () => {
  return (
    <div className="flex justify-center p-5">
      <article className="bg-gray-100 rounded-lg shadow-md max-w-5xl w-full p-10 flex flex-col">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-900">
            Efisiensi Anggaran Pemerintah 2025: Dampak dan Solusi Teknologi Open
            Source
          </h2>
        </header>

        {/* --- PERUBAHAN: Menggunakan komponen Image dari Next.js --- */}
        <Image
          src="https://picsum.photos/1200/600?meet=88"
          alt="Rapat kerja pemerintah"
          className="w-full max-w-[720px] mx-auto rounded-xl mb-8 object-cover"
          width={720}
          height={360}
        />

        <div className="prose prose-blue max-w-full mx-auto text-justify">
          <p>
            Pemerintah Indonesia melalui Peraturan Presiden Nomor 7 Tahun 2025,
            telah menegaskan pengoptimalan penggunaan teknologi open source demi
            efisiensi anggaran dan peningkatan kedaulatan digital nasional.
          </p>
          <p>
            Dengan adanya kebijakan ini, setiap instansi wajib melakukan
            penyesuaian terhadap TI mereka yang selama ini bergantung pada
            perangkat lunak berpemilik.
          </p>
          <p>
            Beberapa solusi open source seperti Linux, LibreOffice, dan GIMP
            menjadi alternatif yang tidak hanya hemat biaya, namun juga
            meningkatkan keamanan data dan kontrol penuh terhadap sistem
            informasi pemerintah.
          </p>
          <ul>
            <li>
              <strong>Penggunaan Linux:</strong> Sistem operasi yang bebas biaya
              lisensi dan lebih aman digunakan pada server pemerintah.
            </li>
            <li>
              <strong>LibreOffice:</strong> Alternatif open source untuk
              aplikasi pengolah dokumen yang mendukung berbagai format file.
            </li>
            <li>
              <strong>GIMP:</strong> Alat pengedit gambar open source yang bisa
              digunakan untuk desain grafis oleh pemerintah.
            </li>
          </ul>
          <p>
            Untuk lebih lanjut,{" "}
            <a href="#" className="text-blue-900 font-semibold hover:underline">
              baca artikel terkait di sini
            </a>
            .
          </p>
        </div>

        {/* Footer dengan ikon */}
        <footer className="flex justify-center items-center space-x-8 mt-12 text-gray-600 text-sm">
          <span className="flex items-center space-x-1">
            <Calendar className="text-blue-900" size={16} />
            <span>26 Februari 2025</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageCircle className="text-blue-900" size={16} />
            <span>Komentar: 5</span>
          </span>
          <span className="flex items-center space-x-1">
            <Tag className="text-blue-900" size={16} />
            <span>Category: Opini & Komunitas</span>
          </span>
        </footer>
      </article>
    </div>
  );
};

export default ArticleContent;
