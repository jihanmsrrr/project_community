"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Heart, Bookmark, BookMarked, Loader2 } from "lucide-react";

const getUserId = (): string => {
  let userId = localStorage.getItem("appUserId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("appUserId", userId);
  }
  return userId;
};

interface ArticleActionsProps {
  articleId: number;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({ articleId }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || getUserId(); // Gunakan ID sesi jika ada, jika tidak gunakan ID lokal

  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLikeStatus = useCallback(async () => {
    if (!articleId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/likes?articleId=${articleId}&userId=${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Gagal mengambil status like:", error);
    } finally {
      setIsLoading(false);
    }
  }, [articleId, userId]);

  const toggleLike = async () => {
    if (!articleId) return;
    const currentLiked = isLiked;
    setIsLiked(!currentLiked);
    setLikeCount((current) => (currentLiked ? current - 1 : current + 1));

    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, articleId }),
    });
  };

  const fetchSaveStatus = useCallback(async () => {
    console.log("Fetching save status. Session:", session); // <-- Tambahkan baris ini
    if (!articleId || !session?.user?.id) return; // Hanya fetch jika user login
    try {
      const res = await fetch(
        `/api/berita/bookmarks?userId=${session?.user?.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.savedArticles.includes(articleId));
      }
    } catch (error) {
      console.error("Gagal mengambil status simpan:", error);
    }
  }, [articleId, session]);

  const toggleSave = async () => {
    console.log("Toggle Save triggered. Session:", session); // <-- Tambahkan baris ini
    if (!articleId || !session?.user?.id) {
      alert("Anda perlu login untuk menyimpan artikel.");
      return;
    }
    setIsSaved(!isSaved);
    await fetch("/api/berita/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, articleId }),
    });
  };

  useEffect(() => {
    fetchLikeStatus();
    if (session?.user?.id) {
      fetchSaveStatus();
    }
  }, [fetchLikeStatus, fetchSaveStatus, session?.user?.id]);

  return (
    <div className="flex items-center gap-4 py-4 border-y dark:border-slate-700 justify-between">
      <button
        onClick={toggleLike}
        disabled={isLoading}
        className={`flex items-center gap-1.5 transition-colors duration-200 hover:text-red-500 focus:outline-none ${
          isLiked ? "text-red-500" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        )}
        <span className="text-sm font-medium">
          {isLoading ? "..." : likeCount} Suka
        </span>
      </button>

      <button
        onClick={toggleSave}
        className={`flex items-center gap-1.5 transition-colors duration-200 hover:text-blue-500 focus:outline-none ${
          isSaved ? "text-blue-500" : "text-slate-500 dark:text-slate-400"
        }`}
        aria-label={isSaved ? "Hapus dari simpanan" : "Simpan artikel"}
      >
        {isSaved ? <BookMarked size={18} /> : <Bookmark size={18} />}
        <span className="text-sm font-medium">
          {isSaved ? "Disimpan" : "Simpan"}
        </span>
      </button>
    </div>
  );
};

export default ArticleActions;
