import React from "react";
import styles from "./cardd.module.css";

interface CardProps {
  title: string;
  description: string;
  author: string;
  date: string;
}

const Cardd: React.FC<CardProps> = ({ title, description, author, date }) => {
  return (
    <div className={styles.card}>
      <img
        src="/meeting.jpg" // Ganti dengan path gambar Anda
        alt="Meeting"
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.author}>{author}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default Cardd;
