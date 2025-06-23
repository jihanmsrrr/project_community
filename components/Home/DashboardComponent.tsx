"use client";

import React, { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, MessageSquare, X, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// --- Tipe Data ---
interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  views: number;
  comments: number;
}
interface CommentItem {
  id: number;
  name: string;
  text: string;
}
interface UserItem {
  id: number;
  name: string;
  avatarId: number;
  date?: string;
}

// --- Dummy Data ---
const allTopNews: NewsItem[] = [
  {
    id: 1,
    title: "Efisiensi Anggaran Pemerintah 2025: Fokus Utama dan Proyeksi",
    summary:
      "Pembahasan mendalam di BPS mengenai langkah efisiensi belanja negara 2025 untuk stabilitas fiskal.",
    image: "https://picsum.photos/id/1015/600/400",
    date: "20 Feb 2025",
    author: "Tim Ekonomi BPS",
    views: 120,
    comments: 10,
  },
  {
    id: 2,
    title: "AI dalam Statistik Publik: Implementasi dan Etika Penggunaan Data",
    summary:
      "Bagaimana AI mempercepat pengolahan data publik dengan tetap menjaga privasi dan kualitas data.",
    image: "https://picsum.photos/id/1016/600/400",
    date: "22 Feb 2025",
    author: "Divisi TI",
    views: 150,
    comments: 15,
  },
  {
    id: 3,
    title: "Workshop Big Data untuk Analis Statistik Muda Angkatan V",
    summary:
      "Analis muda BPS dilatih teknik terbaru dalam pengolahan dan visualisasi big data.",
    image: "https://picsum.photos/id/1018/600/400",
    date: "18 Feb 2025",
    author: "Pusdiklat BPS",
    views: 90,
    comments: 7,
  },
  {
    id: 4,
    title: "Peluncuran Indikator Kesejahteraan Digital Nasional Terbaru",
    summary:
      "BPS merilis serangkaian indikator baru untuk mengukur tingkat kesejahteraan digital masyarakat Indonesia.",
    image: "https://picsum.photos/id/1019/600/400",
    date: "25 Feb 2025",
    author: "Deputi Sosial",
    views: 200,
    comments: 20,
  },
  {
    id: 5,
    title:
      "Rakorwil Cirebon: Sinkronisasi Data Daerah Menuju Satu Data Indonesia",
    summary:
      "Evaluasi dan strategi sinkronisasi data statistik antar daerah di wilayah Cirebon Raya.",
    image: "https://picsum.photos/id/1020/600/400",
    date: "15 Feb 2025",
    author: "BPS Jawa Barat",
    views: 75,
    comments: 5,
  },
  {
    id: 6,
    title: "Kunjungan Studi Banding Statistik dari Negara Sahabat ke BPS",
    summary:
      "BPS menerima kunjungan dari perwakilan badan statistik negara sahabat untuk berbagi pengalaman.",
    image: "https://picsum.photos/id/1021/600/400",
    date: "28 Feb 2025",
    author: "Hub Internasional",
    views: 60,
    comments: 3,
  },
  {
    id: 7,
    title: "Metodologi Sensus Penduduk Online 2025: Uji Coba Tahap Akhir",
    summary:
      "Persiapan akhir dan uji coba sistem untuk Sensus Penduduk Online 2025 yang lebih efisien.",
    image: "https://picsum.photos/id/1022/600/400",
    date: "02 Mar 2025",
    author: "Tim Sensus",
    views: 180,
    comments: 18,
  },
  {
    id: 8,
    title: "Data Pertanian Terintegrasi: Pilot Project di 5 Provinsi",
    summary:
      "Pengembangan sistem data pertanian terintegrasi untuk mendukung ketahanan pangan nasional.",
    image: "https://picsum.photos/id/1023/600/400",
    date: "14 Feb 2025",
    author: "Deputi Produksi",
    views: 130,
    comments: 9,
  },
];
const recentComments: CommentItem[] = [
  { id: 1, name: "Ellsmartrx", text: "Tampilan dashboardnya keren!" },
  { id: 2, name: "Cassia", text: "AI untuk statistik, mantap!" },
  { id: 3, name: "James_Stat", text: "Workshopnya ada rekaman?" },
  { id: 4, name: "SarahDevi", text: "Efisiensi anggaran, penting." },
];
const topCommentators: UserItem[] = [
  { id: 1, name: "Ellsmartrx", avatarId: 13 },
  { id: 2, name: "Cassia", avatarId: 15 },
  { id: 3, name: "James_Stat", avatarId: 22 },
  { id: 4, name: "OliviaInsight", avatarId: 30 },
];
const onlineEmployees: UserItem[] = [
  {
    id: 1,
    name: "Arianto S.Si., SE., M.Si",
    date: "Aktif 5 menit lalu",
    avatarId: 12,
  },
  { id: 2, name: "Dr. John Doe", date: "Aktif 10 menit lalu", avatarId: 20 },
  { id: 3, name: "Jane Smith, M.Stat", date: "Aktif 1 jam lalu", avatarId: 26 },
  { id: 4, name: "Budi Santoso, ST", date: "Aktif 2 menit lalu", avatarId: 35 },
];
const topContributors: UserItem[] = [
  { id: 1, name: "Arianto S.Si., SE., M.Si", avatarId: 12 },
  { id: 2, name: "Dr. John Doe", avatarId: 20 },
  { id: 3, name: "Jane Smith, M.Stat", avatarId: 26 },
  { id: 4, name: "Siti Aminah, S.Kom", avatarId: 40 },
];

const getAvatar = (id: number) => `https://i.pravatar.cc/150?img=${id}`;

// --- Varian Animasi ---
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};
const listItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 },
  },
};
const newsCardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const sectionContentVariants: Variants = {
  hidden: { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    marginTop: "0.75rem",
    marginBottom: "1rem",
    transition: {
      opacity: { duration: 0.3, delay: 0.1 },
      height: { duration: 0.3, type: "spring", stiffness: 150, damping: 20 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: { opacity: { duration: 0.2 }, height: { duration: 0.3 } },
  },
};

export default function Dashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState<UserItem | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isKomentarOpen, setIsKomentarOpen] = useState(true);
  const [isPegawaiOnlineOpen, setIsPegawaiOnlineOpen] = useState(true);
  const [isTopKomentatorOpen, setIsTopKomentatorOpen] = useState(true);
  const [isTopKontributorOpen, setIsTopKontributorOpen] = useState(true);

  const NEWS_TO_SHOW = 4;
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [displayedNews, setDisplayedNews] = useState<NewsItem[]>(
    allTopNews.slice(0, NEWS_TO_SHOW)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => {
        const nextIndex = prevIndex + NEWS_TO_SHOW;
        return nextIndex >= allTopNews.length ? 0 : nextIndex;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []); // NEWS_TO_SHOW adalah konstanta, tidak perlu jadi dependensi

  useEffect(() => {
    const newDisplayedNews = [];
    for (let i = 0; i < NEWS_TO_SHOW; i++) {
      newDisplayedNews.push(
        allTopNews[(currentNewsIndex + i) % allTopNews.length]
      );
    }
    setDisplayedNews(newDisplayedNews);
  }, [currentNewsIndex]); // NEWS_TO_SHOW adalah konstanta

  const handleEmployeeClick = (employee: UserItem) => {
    setSelectedEmployee(employee);
    setIsPopupOpen(true);
  };
  const closePopup = () => setIsPopupOpen(false);
  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  // Tipe generik untuk Sidebar Section agar renderItem lebih aman
  type SidebarSectionType<T> = {
    id: string;
    title: string;
    items: T[];
    isOpen: boolean;
    setIsOpen: () => void;
    renderItem: (item: T) => JSX.Element; // item sekarang memiliki tipe T
  };

  const sidebarPrimarySections: Array<
    SidebarSectionType<CommentItem> | SidebarSectionType<UserItem>
  > = [
    {
      id: "komentar-terbaru",
      title: "Komentar Terbaru",
      items: recentComments,
      isOpen: isKomentarOpen,
      setIsOpen: () => toggleSection(setIsKomentarOpen),
      renderItem: (item: CommentItem) => (
        <motion.li
          key={item.id}
          variants={listItemVariants}
          className="p-2.5 bg-surface-page rounded-lg shadow-inner break-words"
          title={item.text}
        >
          <p className="font-semibold text-text-primary text-sm truncate">
            {item.name}
          </p>
          <p className="text-text-secondary text-xs line-clamp-2 break-words">
            {item.text}
          </p>
        </motion.li>
      ),
    },
    {
      id: "pegawai-online",
      title: "Pegawai Online",
      items: onlineEmployees,
      isOpen: isPegawaiOnlineOpen,
      setIsOpen: () => toggleSection(setIsPegawaiOnlineOpen),
      renderItem: (item: UserItem) => (
        <motion.li
          key={item.id}
          variants={listItemVariants}
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-page cursor-pointer transition select-none break-words"
          onClick={() => handleEmployeeClick(item)}
        >
          <Image
            src={getAvatar(item.avatarId)}
            alt={item.name}
            width={36}
            height={36}
            className="rounded-full object-cover flex-shrink-0"
            priority={false}
          />
          <div className="overflow-hidden flex-grow min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-text-primary text-sm truncate">
                {item.name}
              </p>
              <span className="relative flex h-2 w-2 mt-0.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-green"></span>
              </span>
            </div>
            <p className="text-xs text-text-secondary truncate">{item.date}</p>
          </div>
        </motion.li>
      ),
    },
  ];

  const sidebarSecondarySections: Array<SidebarSectionType<UserItem>> = [
    // Semua item di sini adalah UserItem
    {
      id: "top-komentator",
      title: "Top Komentator",
      items: topCommentators,
      isOpen: isTopKomentatorOpen,
      setIsOpen: () => toggleSection(setIsTopKomentatorOpen),
      renderItem: (item: UserItem) => (
        <motion.li
          key={item.id}
          variants={listItemVariants}
          className="flex items-center gap-2.5 break-words p-0.5 sm:p-1 hover:bg-surface-page rounded-md transition"
        >
          <Image
            src={getAvatar(item.avatarId)}
            alt={item.name}
            width={28}
            height={28}
            className="rounded-full object-cover flex-shrink-0"
            priority={false}
          />
          <span className="text-xs sm:text-sm font-medium text-text-secondary truncate min-w-0">
            {item.name}
          </span>
        </motion.li>
      ),
    },
    {
      id: "top-kontributor",
      title: "Top Kontributor",
      items: topContributors,
      isOpen: isTopKontributorOpen,
      setIsOpen: () => toggleSection(setIsTopKontributorOpen),
      renderItem: (item: UserItem) => (
        <motion.li
          key={item.id}
          variants={listItemVariants}
          className="flex items-center gap-2.5 break-words p-0.5 sm:p-1 hover:bg-surface-page rounded-md transition"
        >
          <Image
            src={getAvatar(item.avatarId)}
            alt={item.name}
            width={28}
            height={28}
            className="rounded-full object-cover flex-shrink-0"
            priority={false}
          />
          <span className="text-xs sm:text-sm font-medium text-text-secondary truncate min-w-0">
            {item.name}
          </span>
        </motion.li>
      ),
    },
  ];

  return (
    <section className="bg-surface-page p-3 sm:p-4 md:p-6 rounded-xl max-w-7xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* Grid utama: 1 kolom di mobile, 3 kolom di layar besar (lg), sidebar turun di tablet (md) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Kolom Utama (Berita): mengambil 2 bagian di lg */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-ui-border pb-2.5 sm:pb-3 mb-1 sm:mb-2">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className="w-1 sm:w-1.5 h-6 sm:h-7 bg-brand-primary rounded-sm inline-block"
                  aria-hidden="true"
                />
                <h2 className="text-text-primary font-semibold text-lg sm:text-xl">
                  Berita Terbaru
                </h2>
              </div>
            </div>
            <Link href="/berita" legacyBehavior>
              <a className="text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-brand-primary/10 focus-visible:ring-2 focus-visible:ring-brand-primary">
                Lihat Semua &rarr;
              </a>
            </Link>
          </div>
          {/* Grid untuk card berita: 1 kolom di layar < sm, 2 kolom di >= sm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence mode="sync">
              {displayedNews.map((news, index) => (
                <motion.article
                  key={news.id}
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={newsCardVariants}
                  className="bg-surface-card rounded-lg sm:rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:ring-1 hover:ring-brand-primary hover:ring-offset-1 hover:ring-offset-surface-page"
                >
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-lg sm:rounded-t-xl" // Sesuaikan dengan lengkungan card
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" // Optimasi sizes untuk Next Image
                      priority={index < 2} // Prioritaskan 2 gambar pertama
                    />
                    {/* Ukuran badge disesuaikan untuk layar kecil (xs) jika ada, atau default lebih kecil */}
                    <span className="absolute top-2 right-2 bg-status-orange text-text-on-brand text-[0.65rem] px-1.5 py-0.5 xs:text-xs xs:px-2 xs:py-1 rounded-full select-none">
                      TERBARU
                    </span>
                  </div>
                  {/* Padding dan ukuran font konten card disesuaikan */}
                  {/* Asumsi `mobile-L` adalah breakpoint kustom. Jika tidak ada, styling sebelum `sm:` akan berlaku. */}
                  <div className="p-2.5 mobile-L:p-3 sm:p-4 flex flex-col flex-grow min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-text-primary line-clamp-2 mb-1 sm:mb-1.5 hover:text-brand-primary transition-colors break-words">
                      {news.title}
                    </h3>
                    {/* Line-clamp disesuaikan: 2 baris di mobile, 3 baris di mobile-L ke atas */}
                    <p className="text-text-secondary text-xs sm:text-sm line-clamp-2 mobile-L:line-clamp-3 mb-2 sm:mb-3 flex-grow break-words">
                      {news.summary}
                    </p>
                    <div className="flex justify-between items-center text-[0.7rem] sm:text-xs text-text-secondary opacity-80 select-none mt-auto pt-1.5 sm:pt-2 border-t border-ui-border/30">
                      {/* Max-width untuk tanggal & penulis sedikit disesuaikan */}
                      <span className="whitespace-nowrap truncate max-w-[45%] mobile-L:max-w-[50%] sm:max-w-[60%]">
                        {news.date} - {news.author}
                      </span>
                      <span className="flex items-center gap-1 mobile-L:gap-1.5 sm:gap-2 flex-shrink-0">
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{" "}
                        {news.views}
                        <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{" "}
                        {news.comments}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Kanan */}
        <aside className="flex flex-col gap-4 md:gap-6">
          {sidebarPrimarySections.map((section) => (
            <section
              key={section.id}
              className="bg-surface-card rounded-xl shadow-lg p-3 sm:p-4 flex flex-col"
            >
              <button
                onClick={section.setIsOpen}
                className="flex justify-between items-center w-full text-left focus-visible:ring-1 focus-visible:ring-brand-primary rounded-md p-1 -m-1 mb-1"
                aria-expanded={section.isOpen}
                aria-controls={`${section.id}-content`}
              >
                <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                  {section.title}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-text-secondary transition-transform duration-200 ${
                    section.isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="border-b border-ui-border mb-2 sm:mb-3"></div>
              <AnimatePresence initial={false}>
                {section.isOpen && (
                  <motion.div
                    id={`${section.id}-content`}
                    key={`${section.id}-content-wrapper`}
                    variants={sectionContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    {/* Pemanggilan renderItem lebih aman karena tipe 'item' diketahui dari 'section' */}
                    <motion.ul
                      key={`${section.id}-list`} // Key unik
                      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-ui-border scrollbar-track-surface-page scrollbar-thumb-rounded-full ${
                        // Contoh kondisi styling list, misalnya untuk pegawai online
                        section.id === "pegawai-online"
                          ? "flex flex-col gap-1.5"
                          : "space-y-2"
                      }`}
                      style={{ maxHeight: "180px" }}
                      variants={listContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {/*
                        Karena `sidebarPrimarySections` adalah array dari union type,
                        TypeScript tidak bisa secara otomatis menyempitkan tipe `section` di dalam map.
                        Kita perlu type assertion atau type guard jika ingin 100% type safe di sini.
                        Namun, definisi `SidebarSectionType<T>` sudah membuat `renderItem(item: T)` aman.
                      */}
                      {section.id === "komentar-terbaru"
                        ? (section.items as CommentItem[]).map((item) =>
                            (
                              section as SidebarSectionType<CommentItem>
                            ).renderItem(item)
                          )
                        : (section.items as UserItem[]).map((item) =>
                            (
                              section as SidebarSectionType<UserItem>
                            ).renderItem(item)
                          )}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          ))}

          {/* Grid untuk Top Komentator & Kontributor: 1 kolom di mobile, 2 kolom di tablet (md) ke atas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {sidebarSecondarySections.map(
              (
                section // section di sini sudah pasti SidebarSectionType<UserItem>
              ) => (
                <section
                  key={section.id}
                  className="bg-surface-card rounded-xl shadow-lg p-3 sm:p-4 flex-1 flex flex-col"
                >
                  <button
                    onClick={section.setIsOpen}
                    className="flex justify-between items-center w-full text-left focus-visible:ring-1 focus-visible:ring-brand-primary rounded-md p-1 -m-1 mb-1"
                    aria-expanded={section.isOpen}
                    aria-controls={`${section.id}-content`}
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                      {section.title}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-text-secondary transition-transform duration-200 ${
                        section.isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div className="border-b border-ui-border mb-2 sm:mb-3"></div>
                  <AnimatePresence initial={false}>
                    {section.isOpen && (
                      <motion.div
                        id={`${section.id}-content`}
                        key={`${section.id}-content-wrapper-secondary`}
                        variants={sectionContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <motion.ul
                          key={`${section.id}-list-secondary`} // Key unik
                          className="flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-ui-border scrollbar-track-surface-page scrollbar-thumb-rounded-full"
                          style={{ maxHeight: "120px" }}
                          variants={listContainerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Di sini, section.renderItem sudah tahu item adalah UserItem */}
                          {section.items.map((item) =>
                            section.renderItem(item)
                          )}
                        </motion.ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              )
            )}
          </div>
        </aside>
      </div>

      {/* Popup Info Pegawai */}
      <AnimatePresence>
        {isPopupOpen && selectedEmployee && (
          <motion.div
            key="employee-popup-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closePopup}
          >
            <motion.div
              key="employee-popup-content"
              className="bg-surface-card rounded-xl shadow-2xl p-5 sm:p-6 w-full max-w-xs sm:max-w-sm text-text-primary relative flex flex-col items-center" // max-w disesuaikan
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} // Agar klik di konten tidak menutup popup
            >
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-ui-border focus-visible:ring-1 focus-visible:ring-brand-primary"
              >
                <X size={18} className="sm:size-20" />
              </button>
              <Image
                src={getAvatar(selectedEmployee.avatarId)}
                alt={selectedEmployee.name}
                width={64} // Ukuran avatar disesuaikan untuk mobile
                height={64}
                className="sm:w-[72px] sm:h-[72px] rounded-full object-cover mb-3 border-2 border-brand-primary p-0.5"
              />
              <h3 className="text-base sm:text-lg font-semibold mb-0.5 text-center">
                {selectedEmployee.name}
              </h3>
              <p className="text-xs text-text-secondary mb-3 sm:mb-4 text-center">
                {selectedEmployee.date || "Status tidak tersedia"}
              </p>
              <div className="my-2 sm:my-3 border-t border-ui-border w-3/4"></div>
              <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 text-center">
                Informasi lebih lanjut mengenai pegawai ini akan ditampilkan di
                sini.
              </p>
              <Link href="/organisasi" legacyBehavior>
                <a
                  onClick={closePopup}
                  className="inline-flex items-center justify-center text-center gap-2 bg-brand-primary text-text-on-brand px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-brand-primary-hover transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card w-full" // w-full untuk mobile
                >
                  Lihat Struktur Organisasi{" "}
                  <ExternalLink size={14} className="sm:size-16" />
                </a>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
