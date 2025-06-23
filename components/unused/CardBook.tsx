import React, { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton";
import styles from "./cardBook.module.css";

const CardBook = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulasi loading 2 detik
    return () => clearTimeout(timer); // Membersihkan timer saat komponen unmount
  }, []);

  return (
    <div className={styles.cardContainer}>
      {loading ? (
        <>
          <Skeleton width="100%" height="200px" />
          <Skeleton width="60%" height="20px" />
          <Skeleton width="80%" height="16px" />
        </>
      ) : (
        <div className={styles.cardContents}>
          <div className={styles.image}></div>
          <div className={styles.content}>
            <p className={styles.small}>Serum for Skin</p>
            <h1 className={styles.title}>
              Healthy, Premium Skincare Serum
            </h1>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
              Excepturi maxime dignissimos perferendis quod mollitia officiis 
              sit, obcaecati nemo incidunt iusto voluptates, nobis consequuntur 
              culpa corporis optio recusandae assumenda explicabo? Dicta.
            </p>
            <div className={styles.costContainer}>
              <h2 className={styles.discount}>$79.99</h2>
              <p className={styles.originalPrice}>$129.99</p>
            </div>
            <button className={styles.button}>
              <p className={styles.cartText}>Add to Cart</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardBook;
