import Image from "next/image"; // 🔹 Import Image
import Link from "next/link";
import styles from "./Recommendation.module.css";

const recommendations = [
  { title: "Rekomendasi 1", image: "/recommend1.jpg", link: "/artikel/1" },
  { title: "Rekomendasi 2", image: "/recommend2.jpg", link: "/artikel/2" },
  { title: "Rekomendasi 3", image: "/recommend3.jpg", link: "/artikel/3" },
];

const Recommendation = () => {
  return (
    <div className={styles.recommendation}>
      <h2>Rekomendasi untuk Anda</h2>
      <div className={styles.list}>
        {recommendations.map((item, i) => (
          <Link href={item.link} key={i} className={styles.item}>
            <Image src={item.image} alt={item.title} width={400} height={250} priority />
            <p>{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;
