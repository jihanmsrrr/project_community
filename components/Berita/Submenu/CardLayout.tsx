import React, { useState } from 'react';
import { useRouter } from 'next/router';  // Mengimpor useRouter untuk navigasi
import { Eye, MessageSquare, Share2 } from 'lucide-react'; // Mengimpor ikon yang dibutuhkan
import styles from './CardLayout.module.css';

// Dummy data generator
const getRandomData = (index: number) => ({
  title: `Strategi Keuangan untuk Pemerintah di 2025`,
  content: `Dengan meningkatnya tantangan ekonomi global, penerapan strategi keuangan yang efektif sangat diperlukan. Tahun 2025 menghadirkan peluang baru dalam optimasi anggaran dan manajemen fiskal, yang harus diadaptasi dengan cepat oleh pemerintah. Diperlukan kolaborasi antar sektor untuk memastikan keuangan publik yang lebih baik dan transparan, dengan fokus pada efisiensi dan pengelolaan sumber daya yang bijaksana.`,
  author: `Jihan Maisaroh`,
  date: `28 Februari 2025`,
  image: `https://picsum.photos/400/200?random=${index}`,
});

const CardLayout = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const cardsPerPage = 12; // 3 columns * 3 rows
  const totalCards = 50; // Total number of cards
  const totalPages = Math.ceil(totalCards / cardsPerPage); // Calculate the number of pages
  const router = useRouter();  // Initialize useRouter hook

  // Generate the cards based on the current page
  const getPaginatedCards = () => {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return new Array(totalCards).fill(null).slice(start, end).map((_, index) => {
      const { title, content, author, date, image } = getRandomData(start + index);
      
      // Function to handle card click and navigate
      const handleCardClick = () => {
        router.push('/berita/tampilberita');  // Navigate to the specific article page
      };

      return (
        <div key={index} className={styles.card} onClick={handleCardClick}>
          <div className={styles.cardImage}>
            <img src={image} alt="Random Image" />
          </div>
          <div className={styles.cardContent}>
            <h3>{title}</h3>
            <p>{content}</p>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.footerLeft}>
              <div className={styles.author}>
                <img
                  src={`https://i.pravatar.cc/150?img=${index + 5}`}
                  alt="Author Avatar"
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{author}</span>
                  <span className={styles.date}>{date}</span>
                </div>
              </div>
            </div>
            <div className={styles.cardIcons}>
              <Eye className={styles.icon} />
              <MessageSquare className={styles.icon} />
              <Share2 className={styles.icon} />
            </div>
          </div>
        </div>
      );
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className={styles.cardContainer}>
        {getPaginatedCards()}
      </div>

      {/* Pagination Buttons */}
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {currentPage > 2 && <span onClick={() => handlePageChange(1)} className={styles.pageNumber}>1</span>}
        {currentPage > 3 && <span>...</span>}
        {pageNumbers
          .slice(currentPage - 2, currentPage + 1) // Show 3 pages around current page
          .map(page => (
            <span
              key={page}
              className={styles.pageNumber + (page === currentPage ? ` ${styles.active}` : '')}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </span>
          ))}
        {currentPage < totalPages - 2 && <span>...</span>}
        {currentPage < totalPages - 1 && (
          <span onClick={() => handlePageChange(totalPages)} className={styles.pageNumber}>
            {totalPages}
          </span>
        )}

        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CardLayout;
