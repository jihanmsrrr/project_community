// components/Berita/TampilBerita/CommentForm.tsx
// Ini adalah contoh, sesuaikan dengan kode asli CommentForm Anda.

import React, { useState } from "react";
// import { PrismaClient } from '@prisma/client'; // Contoh: jika Anda berinteraksi dengan DB di sini

// Definisikan tipe untuk props CommentForm
interface CommentFormProps {
  articleId: bigint; // PERBAIKAN: Ubah dari number ke bigint
  parentId?: bigint; // PERBAIKAN: Ubah dari string ke bigint (dan opsional)
  onCommentPosted: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  parentId,
  onCommentPosted,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Jangan submit komentar kosong

    setIsSubmitting(true);
    try {
      // Data yang akan dikirim ke API
      const commentData = {
        newsId: articleId.toString(), // PERBAIKAN: Konversi bigint ke string untuk pengiriman API
        parentId: parentId ? parentId.toString() : null, // PERBAIKAN: Konversi bigint ke string, atau null
        userId: 1000n, // Contoh: ID user yang sedang login (Anda perlu mengambil ini dari sesi/konteks)
        username: "Dummy User", // Contoh: Username user yang sedang login
        isiKomentar: commentText,
      };

      // Contoh: Panggil API endpoint untuk mengirim komentar
      const response = await fetch("/api/comments", {
        // Ganti dengan API endpoint Anda
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Gagal memposting komentar");
      }

      setCommentText(""); // Bersihkan form
      onCommentPosted(); // Panggil callback untuk memberitahu parent
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        className="w-full p-2 border rounded-md resize-y min-h-[60px] text-sm"
        placeholder="Tulis komentar atau balasan..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting || !commentText.trim()}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
