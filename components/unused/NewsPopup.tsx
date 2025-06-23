import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import styles from "./newspopup.module.css";

const newsData = [
    { id: 1, title: "Berita 1", desc: "Ini adalah berita pertama.", image: "/news1.jpg" },
    { id: 2, title: "Berita 2", desc: "Ini adalah berita kedua.", image: "/news2.jpg" },
    { id: 3, title: "Berita 3", desc: "Ini adalah berita ketiga.", image: "/news3.jpg" },
];

const NewsPopup = ({ onClose }: { onClose: () => void }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>
                <button className={styles.closeButton} onClick={onClose}>✖</button>

                <Swiper
                    modules={[Navigation, Pagination, EffectCoverflow]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView="auto"
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className={styles.swiperContainer}
                >
                    {newsData.map((news, index) => (
                        <SwiperSlide key={news.id} className={styles.swiperSlide}>
                            <div className={`${styles.card} ${index === activeIndex ? styles.active : ""}`}>
                                <img src={news.image} alt={news.title} className={styles.image} />
                                <h2 className={styles.title}>{news.title}</h2>
                                <p className={styles.desc}>{news.desc}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default NewsPopup;
