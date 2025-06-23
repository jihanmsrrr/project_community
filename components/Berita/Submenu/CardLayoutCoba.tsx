import React from 'react';
import { Eye, MessageSquare, Share2 } from 'lucide-react'; // Change Heart to Eye icon
import styles from './CardLayoutCoba.module.css';

const CardLayoutCoba = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src="https://picsum.photos/400/200" alt="Random Image" />
      </div>
      <div className={styles.cardContent}>
        <h3>Efisiensi Anggaran Pemerintah 2025: Dampak dan Potensi</h3>
        <p>
          Bertempat di BPS gedung 1 lantai 8 pada Selasa, 25 Februari 2025 telah dilakukan internalisasi hasil Survei Budaya Organisasi (SBO) untuk peningkatan Reformasi Birokrasi di lingkungan Inspektorat Utama. Internaliasi dih...
        </p>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <div className={styles.author}>
            <img src="https://i.pravatar.cc/150?img=5" alt="Author Avatar" className={styles.authorAvatar} />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Jihan Maisaroh</span>
              <span className={styles.date}>28 Februari 2025</span>
            </div>
          </div>
        </div>
        <div className={styles.cardIcons}>
          <Eye className={styles.icon} /> {/* Replace Heart with Eye */}
          <MessageSquare className={styles.icon} />
          <Share2 className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default CardLayoutCoba;
