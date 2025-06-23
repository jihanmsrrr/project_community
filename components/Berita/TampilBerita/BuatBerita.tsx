import React from "react";
import { Edit } from "lucide-react";
import { useRouter } from "next/router";

const BuatBerita: React.FC = () => {
  const router = useRouter();

  const handleCreateArticle = () => {
    router.push("/upload-article");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-5 flex flex-col items-center text-center max-w-sm mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Buat Berita</h2>
      <button
        onClick={handleCreateArticle}
        className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
      >
        <Edit size={16} className="mr-3" />
        <span className="text-sm font-medium">Upload Artikel</span>
      </button>
    </div>
  );
};

export default BuatBerita;
