import React from "react";
import ArticleContent from "@/components/Berita/TampilBerita/ArticleContent";  
import Sidebar from "@/components/Berita/TampilBerita/Sidebar";  
import MenuBerita from "@/components/Berita/TampilBerita/MenuBerita"; 
import styles from "./TampilBerita.module.css";  

const TampilBerita = () => {
  return (
    <div className={styles.container}>
      <MenuBerita />  {/* Menampilkan menu berita */}
      
      <div className={styles.mainContent}>
        <div className={styles.articleContent}>
          <ArticleContent />  {/* Konten Artikel */}
        </div>

        <div className={styles.sidebarContainer}>
          <Sidebar />  {/* Sidebar */}
        </div>
      </div>
    </div>
  );
};

export default TampilBerita;
