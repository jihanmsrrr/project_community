import React from "react";
import { ArrowRightCircle } from "lucide-react";

const SmallNewsWidget: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-5 font-sans">
      <div className="flex items-center font-bold text-gray-800 text-base mb-2">
        <span className="mr-2 text-blue-700">
          <ArrowRightCircle size={20} />
        </span>
        <span>Bersungguh-sungguh kah BPS dalam...</span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Badan Pusat Statistik (BPS) merupakan lembaga pemerintah yang memiliki peran strategis dalam pembangunan...
      </p>
      <button
        type="button"
        className="bg-blue-700 text-white py-1.5 px-5 rounded-full text-sm hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Baca Selengkapnya
      </button>
    </div>
  );
};

export default SmallNewsWidget;
