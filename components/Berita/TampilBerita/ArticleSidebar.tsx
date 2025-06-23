"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Share2, Bookmark, Loader2, Heart } from "lucide-react";
import type { ArtikelBerita } from "@/types/varia";
import { useSession } from "next-auth/react"; // Import useSession

// Impor komponen widget yang sudah kita buat
import UserActivityWidget from "./UserActivityWidget";

// Fungsi helper untuk mendapatkan ID pengguna dari LocalStorage
const getUserId = (): string | null => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("appUserId");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      localStorage.setItem("appUserId", userId);
    }
    return userId;
  }
  return null;
};

// Tipe data untuk hasil fetch dari API aktivitas
interface ActivityData {
  bookmarked: ArtikelBerita[];
  liked: ArtikelBerita[];
}

const ArticleSidebar: React.FC<{ artikel: ArtikelBerita }> = ({ artikel }) => {
  // --- STATE UNTUK AKSI DI ARTIKEL INI ---
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(true);
  const [copyStatus, setCopyStatus] = useState("Bagikan");
  const [likeCount, setLikeCount] = useState<number>(0); // State untuk jumlah like

  // --- STATE UNTUK DATA AKTIVITAS PENGGUNA ---
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const articleId = artikel.id;
  const session = useSession();
  const userId = session?.data?.user?.id || getUserId(); // Gunakan ID sesi jika ada, jika tidak gunakan ID lokal

  // --- EFFECT UNTUK MENGAMBIL JUMLAH LIKE ---
  useEffect(() => {
    if (!articleId) return;
    const fetchLikeCount = async () => {
      try {
        const res = await fetch(`/api/likes?articleId=${articleId}`);
        if (res.ok) {
          const data = await res.json();
          setLikeCount(data.likeCount);
        }
      } catch (error) {
        console.error("Gagal mengambil jumlah like:", error);
      }
    };
    fetchLikeCount();
  }, [articleId]);

  // --- EFFECT UNTUK MENGAMBIL SEMUA DATA YANG DIPERLUKAN SIDEBAR ---
  useEffect(() => {
    if (!userId) {
      setIsLoadingSave(false);
      setIsLoadingActivity(false);
      return;
    }

    const fetchSidebarData = async () => {
      // Definisikan semua promise fetch
      const checkSaveStatus = fetch(
        `/api/berita/bookmarks?userId=${userId}`
      ).then((res) => res.json());
      const fetchActivity = fetch(`/api/user-activity?userId=${userId}`).then(
        (res) => res.json()
      );

      // Jalankan keduanya secara bersamaan untuk efisiensi
      try {
        const [saveStatusResult, activityResult] = await Promise.all([
          checkSaveStatus,
          fetchActivity,
        ]);

        // Proses hasil status simpan
        if (
          saveStatusResult.savedArticles &&
          saveStatusResult.savedArticles.includes(articleId)
        ) {
          setIsSaved(true);
        }

        // Proses hasil data aktivitas
        if (activityResult) {
          setActivityData(activityResult);
        }
      } catch (error) {
        console.error("Gagal mengambil data sidebar:", error);
      } finally {
        // Hentikan semua loading state
        setIsLoadingSave(false);
        setIsLoadingActivity(false);
      }
    };

    fetchSidebarData();
  }, [articleId, userId]);

  // --- FUNGSI-FUNGSI HANDLER ---
  const handleSave = async () => {
    if (!userId) {
      alert("Anda perlu login untuk menyimpan artikel.");
      return;
    }
    setIsLoadingSave(true);
    try {
      await fetch("/api/berita/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, articleId }),
      });
      setIsSaved((current) => !current); // Toggle status
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: artikel.judul,
      text: artikel.abstrak,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyStatus("Tautan Disalin!");
      setTimeout(() => setCopyStatus("Bagikan"), 2000);
    }
  };

  return (
    <aside className="lg:col-span-4 sticky top-24 h-fit">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 divide-y divide-slate-200 dark:divide-slate-700">
        {/* Bagian Info Penulis & Aksi Artikel */}
        <div className="pb-5 space-y-5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Tentang Artikel
          </h3>

          <div className="flex items-center gap-4">
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                artikel.namaPenulis
              )}&background=random&size=64&color=fff&font-size=0.4`}
              alt={artikel.namaPenulis}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {artikel.namaPenulis}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dipublikasikan pada
                <br />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {new Date(artikel.savedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" fill="currentColor" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {likeCount} Suka
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium px-3 py-2 rounded-md transition-colors"
              >
                <Share2 size={16} /> {copyStatus}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoadingSave}
                className={`flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-colors disabled:opacity-50 ${
                  isSaved
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                }`}
              >
                {isLoadingSave ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Bookmark
                    size={16}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                )}
                {isLoadingSave ? "..." : isSaved ? "Tersimpan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        {/* Bagian Baru: Aktivitas Saya */}
        <div className="pt-5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            Aktivitas Saya
          </h3>
          {isLoadingActivity ? (
            <div className="space-y-2">
              <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
            </div>
          ) : activityData ? (
            <div className="space-y-4">
              <UserActivityWidget
                title="Berita Disimpan"
                articles={activityData.bookmarked}
              />
              <UserActivityWidget
                title="Berita Disukai"
                articles={activityData.liked}
                className="mt-4"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Anda belum punya aktivitas.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ArticleSidebar;
