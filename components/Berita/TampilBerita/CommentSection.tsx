"use client";

import React, { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import type { Comment } from "@/types/varia"; // Import Comment type

interface CommentSectionProps {
  articleId: number; // Pastikan tipe data ID sesuai
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]); // Use imported Comment type
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi fetchComments disesuaikan dengan endpoint Anda
  const fetchComments = async () => {
    if (!articleId) return;
    setIsLoading(true);
    // Endpoint API dari kode Anda
    const res = await fetch(`/api/comments?articleId=${articleId}`); // <-- Endpoint sudah benar
    if (res.ok) {
      const data: Comment[] = await res.json();
      setComments(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  // Logika untuk memisahkan komentar utama
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
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
                key={comment.commentId}
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
