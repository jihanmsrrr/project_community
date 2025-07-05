"use client";

import React, { useState, useEffect, useCallback } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import type { Comment } from "@/types/varia"; // Import tipe Comment yang sudah diperbarui

interface CommentSectionProps {
  articleId: bigint; // PERBAIKAN: articleId (news_id) harus BigInt
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi fetchComments disesuaikan dengan endpoint Anda
  const fetchComments = useCallback(async () => {
    // PERBAIKAN: Konversi articleId ke string untuk URL
    if (!articleId) return;
    setIsLoading(true);
    const res = await fetch(`/api/comments?articleId=${articleId.toString()}`); // Mengirim BigInt sebagai string di URL
    if (res.ok) {
      const data: Comment[] = await res.json();
      setComments(data);
    } else {
      console.error("Failed to fetch comments:", res.status, res.statusText);
      setComments([]); // Pastikan state comments kosong jika ada error
    }
    setIsLoading(false);
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [articleId, fetchComments]);

  // Logika untuk memisahkan komentar utama
  // PERBAIKAN: Gunakan comment.parent_id untuk filtering
  const topLevelComments = comments.filter(
    (comment) => comment.parent_id === null
  );

  return (
    <div className="mt-16 pt-12 border-t dark:border-slate-800">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        {comments.length} Komentar
      </h2>
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <CommentForm articleId={articleId} onCommentPosted={fetchComments} />

        <div className="mt-8 space-y-6">
          {isLoading ? (
            <p className="dark:text-slate-400 text-center">
              Memuat komentar...
            </p>
          ) : topLevelComments.length > 0 ? (
            topLevelComments.map((comment) => (
              <CommentItem
                key={comment.comment_id.toString()} // PERBAIKAN: Gunakan comment_id dan konversi ke string untuk key
                comment={comment}
                allComments={comments}
                articleId={articleId}
                onCommentPosted={fetchComments}
              />
            ))
          ) : (
            <p className="dark:text-slate-400 text-center py-4">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
