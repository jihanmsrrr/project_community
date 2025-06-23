import React from "react";
import styles from './Breadcrumb.module.css'; // Your custom styles

const Breadcrumb = ({ activeItem }: { activeItem: string }) => {
  return (
    <div className={styles.breadcrumb}>
      {/* Always show "Berita" */}
      <span className={`${styles.breadcrumbItem} ${activeItem === "Berita" ? styles.active : ''}`}>Berita</span>

      {activeItem && activeItem !== "Berita" && (
        <>
          <span className={styles.arrow}> &gt; </span>
          <span className={`${styles.breadcrumbItem} ${activeItem !== "Berita" ? styles.active : ''}`}>
            {activeItem}
          </span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
