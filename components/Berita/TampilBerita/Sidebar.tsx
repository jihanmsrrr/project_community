import React from "react";
import BeritaInfo from "./BeritaInfo";
import SmallNewsWidget from "./SmallNewsWidget";
import BuatBerita from "./BuatBerita";
import TopKontributor from "./TopKontributor";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full max-w-xs rounded-xl mt-[-20px] px-4 md:px-0">
      <div className="mb-5">
        <BeritaInfo />
      </div>

      <div className="mb-5">
        <SmallNewsWidget />
      </div>

      <div className="mb-5">
        <BuatBerita />
      </div>

      <div className="mt-5">
        <TopKontributor />
      </div>
    </aside>
  );
};

export default Sidebar;
