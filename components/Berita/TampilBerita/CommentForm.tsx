import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Definisikan tipe untuk props agar lebih jelas
type CommentFormProps = {
  articleId: number;
  parentId?: string | null;
  onCommentPosted: () => void;
};

const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  parentId = null,
  onCommentPosted,
}) => {
  const { data: session, status } = useSession();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "authenticated" || !commentText.trim() || !session?.user) {
      console.error("User tidak terotentikasi atau komentar kosong.");
      return;
    }

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId: articleId,
        text: commentText,
        parentId: parentId,
        userId: session.user.id, // Kirim userId dari sesi
        username: session.user.name, // Kirim username dari sesi
      }),
    });

    if (response.ok) {
      setCommentText("");
      onCommentPosted();
    } else {
      console.error("Gagal mengirim komentar");
    }
  };

  if (status === "loading") {
    return <p className="text-sm text-gray-400">Memuat sesi...</p>;
  }

  if (status === "unauthenticated" || !session?.user) {
    // <-- Perbaiki kondisi di sini
    return (
      <p className="text-sm text-gray-500">
        Silakan
        <Link href="/login" className="text-blue-600 hover:underline">
          login
        </Link>
        untuk berkomentar.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start space-x-3">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "Avatar"}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex-1">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Berkomentar sebagai ${session.user?.name}...`}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition"
            rows={3}
          />
          <div className="text-right">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Kirim Komentar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
