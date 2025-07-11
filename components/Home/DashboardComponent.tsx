"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, MessageSquare, X, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// --- Tipe Data Dinamis ---
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
  user_id: bigint;
  nama_lengkap: string | null;
  foto_url: string | null;
  jabatan_struktural?: string | null;
  count?: number;
}

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

// --- Komponen Skeleton ---
const NewsCardSkeleton = () => (
  <div className="bg-surface-card rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="w-full aspect-[16/9] bg-ui-border/50"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-ui-border/50 rounded-md"></div>
      <div className="h-4 w-full bg-ui-border/50 rounded-md"></div>
      <div className="h-4 w-5/6 bg-ui-border/50 rounded-md"></div>
    </div>
  </div>
);
const SidebarSectionSkeleton = () => (
  <div className="bg-surface-card rounded-xl shadow-lg p-4 animate-pulse">
    <div className="h-6 w-1/2 bg-ui-border/50 rounded-md mb-4"></div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ui-border/50 flex-shrink-0"></div>
          <div className="h-4 w-full bg-ui-border/50 rounded-md"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardComponent() {
  // State untuk data dinamis
  const [news, setNews] = useState<NewsItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [topContributors, setTopContributors] = useState<UserItem[]>([]);
  const [topCommentators, setTopCommentators] = useState<UserItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk UI
  const [selectedEmployee, setSelectedEmployee] = useState<UserItem | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isKomentarOpen, setIsKomentarOpen] = useState(true);
  const [isPegawaiOnlineOpen, setIsPegawaiOnlineOpen] = useState(true);
  const [isTopKomentatorOpen, setIsTopKomentatorOpen] = useState(true);
  const [isTopKontributorOpen, setIsTopKontributorOpen] = useState(true);
  const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const NEWS_TO_SHOW = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/main");
        if (!res.ok) throw new Error("Gagal memuat data dashboard");
        const data = await res.json();
        setNews(data.latestNews || []);
        setComments(data.recentComments || []);
        setTopContributors(data.topContributors || []);
        setTopCommentators(data.topCommentators || []);
        setOnlineUsers(data.onlineUsers || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (news.length < NEWS_TO_SHOW) {
      setDisplayedNews(news);
      return;
    }
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) =>
        prev + NEWS_TO_SHOW >= news.length ? 0 : prev + NEWS_TO_SHOW
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [news]);

  useEffect(() => {
    if (news.length === 0) return;
    const newDisplayedNews = [];
    for (let i = 0; i < NEWS_TO_SHOW; i++) {
      if (news[(currentNewsIndex + i) % news.length]) {
        newDisplayedNews.push(news[(currentNewsIndex + i) % news.length]);
      }
    }
    setDisplayedNews(newDisplayedNews);
  }, [currentNewsIndex, news]);

  const handleEmployeeClick = (employee: UserItem) => {
    setSelectedEmployee(employee);
    setIsPopupOpen(true);
  };

  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  return (
    <section className="bg-surface-page p-3 sm:p-4 md:p-6 rounded-xl max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-ui-border pb-3 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 bg-brand-primary rounded-sm" />
              <h2 className="text-text-primary font-semibold text-xl">
                Berita Terbaru
              </h2>
            </div>
            <Link href="/berita" legacyBehavior>
              <a className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors px-3 py-1.5 rounded-md hover:bg-brand-primary/10">
                Lihat Semua &rarr;
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="sync">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))
                : displayedNews.map((newsItem, index) => (
                    <motion.article
                      key={newsItem.id}
                      layout
                      variants={newsCardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-surface-card rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 ease-in-out hover:-translate-y-1"
                    >
                      <Link href={`/berita/${newsItem.id}`} passHref>
                        <a className="flex flex-col h-full">
                          <div className="relative w-full aspect-[16/9]">
                            <Image
                              src={newsItem.image}
                              alt={newsItem.title}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 639px) 100vw, 50vw"
                              priority={index < 2}
                            />
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-semibold text-base text-text-primary line-clamp-2 mb-2 hover:text-brand-primary transition-colors">
                              {newsItem.title}
                            </h3>
                            <p className="text-text-secondary text-sm line-clamp-3 mb-3 flex-grow">
                              {newsItem.summary}
                            </p>
                            <div className="flex justify-between items-center text-xs text-text-secondary opacity-80 mt-auto pt-2 border-t border-ui-border/50">
                              <span className="truncate max-w-[60%]">
                                {newsItem.date}
                              </span>
                              <span className="flex items-center gap-2 flex-shrink-0">
                                <Eye className="w-3.5 h-3.5" /> {newsItem.views}
                                <MessageSquare className="w-3.5 h-3.5" />{" "}
                                {newsItem.comments}
                              </span>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </motion.article>
                  ))}
            </AnimatePresence>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          {loading ? (
            <>
              <SidebarSectionSkeleton />
              <SidebarSectionSkeleton />
            </>
          ) : (
            <>
              <SidebarSection
                title="Komentar Terbaru"
                isOpen={isKomentarOpen}
                setIsOpen={() => toggleSection(setIsKomentarOpen)}
              >
                {comments.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={listItemVariants}
                    className="p-3 bg-surface-page rounded-lg shadow-inner"
                  >
                    <p className="font-semibold text-text-primary text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-text-secondary text-xs line-clamp-2">
                      {item.text}
                    </p>
                  </motion.li>
                ))}
              </SidebarSection>

              <SidebarSection
                title="Pegawai Terbaru"
                isOpen={isPegawaiOnlineOpen}
                setIsOpen={() => toggleSection(setIsPegawaiOnlineOpen)}
              >
                {onlineUsers.map((item) => (
                  <motion.li
                    key={String(item.user_id)}
                    variants={listItemVariants}
                  >
                    <a
                      onClick={() => handleEmployeeClick(item)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      <Image
                        src={
                          item.foto_url ||
                          `https://i.pravatar.cc/150?u=${item.user_id}`
                        }
                        alt={item.nama_lengkap || ""}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {item.nama_lengkap}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {item.jabatan_struktural || "Pegawai"}
                        </p>
                      </div>
                    </a>
                  </motion.li>
                ))}
              </SidebarSection>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <SidebarSection
                  title="Top Kontributor"
                  isOpen={isTopKontributorOpen}
                  setIsOpen={() => toggleSection(setIsTopKontributorOpen)}
                >
                  {topContributors.map((item) => (
                    <motion.li
                      key={String(item.user_id)}
                      variants={listItemVariants}
                    >
                      <Link href={`/profil/${item.user_id}`} passHref>
                        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                          <Image
                            src={
                              item.foto_url ||
                              `https://i.pravatar.cc/150?u=${item.user_id}`
                            }
                            alt={item.nama_lengkap || ""}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-text-secondary truncate">
                            {item.nama_lengkap}
                          </span>
                        </a>
                      </Link>
                    </motion.li>
                  ))}
                </SidebarSection>
                <SidebarSection
                  title="Top Komentator"
                  isOpen={isTopKomentatorOpen}
                  setIsOpen={() => toggleSection(setIsTopKomentatorOpen)}
                >
                  {topCommentators.map((item) => (
                    <motion.li
                      key={String(item.user_id)}
                      variants={listItemVariants}
                    >
                      <Link href={`/profil/${item.user_id}`} passHref>
                        <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                          <Image
                            src={
                              item.foto_url ||
                              `https://i.pravatar.cc/150?u=${item.user_id}`
                            }
                            alt={item.nama_lengkap || ""}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-text-secondary truncate">
                            {item.nama_lengkap}
                          </span>
                        </a>
                      </Link>
                    </motion.li>
                  ))}
                </SidebarSection>
              </div>
            </>
          )}
        </aside>
      </div>

      <AnimatePresence>
        {isPopupOpen && selectedEmployee && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              className="bg-surface-card rounded-xl shadow-2xl p-6 w-full max-w-sm text-text-primary relative flex flex-col items-center"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-3 right-3 text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-ui-border"
              >
                <X size={20} />
              </button>
              <Image
                src={
                  selectedEmployee.foto_url ||
                  `https://i.pravatar.cc/150?u=${selectedEmployee.user_id}`
                }
                alt={selectedEmployee.nama_lengkap || ""}
                width={72}
                height={72}
                className="rounded-full object-cover mb-4 border-2 border-brand-primary p-0.5"
              />
              <h3 className="text-lg font-semibold text-center">
                {selectedEmployee.nama_lengkap}
              </h3>
              <p className="text-sm text-text-secondary mb-4 text-center">
                {selectedEmployee.jabatan_struktural || "Pegawai BPS"}
              </p>
              <Link href={`/profil/${selectedEmployee.user_id}`} legacyBehavior>
                <a
                  onClick={() => setIsPopupOpen(false)}
                  className="inline-flex items-center justify-center text-center gap-2 bg-brand-primary text-text-on-brand px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-primary-hover transition-colors w-full"
                >
                  Lihat Profil Lengkap <ExternalLink size={16} />
                </a>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Komponen Sidebar Section yang bisa diciutkan
const SidebarSection = ({
  title,
  isOpen,
  setIsOpen,
  children,
}: {
  title: string;
  isOpen: boolean;
  setIsOpen: () => void;
  children: React.ReactNode;
}) => {
  return (
    <section className="bg-surface-card rounded-xl shadow-lg p-4 flex flex-col">
      <button
        onClick={setIsOpen}
        className="flex justify-between items-center w-full text-left mb-2"
      >
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className="border-b border-ui-border mb-3"></div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <motion.ul
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-1"
            >
              {children}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
