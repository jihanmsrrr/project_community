import React, { useState } from "react";
import CommentForm from "./CommentForm"; // Komponen CommentForm
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Comment } from "@/types/varia"; // Tipe Comment dari varia.ts

// Tipe untuk props dari komponen CommentItem
type CommentItemProps = {
  comment: Comment;
  allComments: Comment[];
  articleId: bigint; // articleId (news_id) bertipe BigInt
  onCommentPosted: () => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  articleId,
  onCommentPosted,
}) => {
  const [isReplying, setIsReplying] = useState(false);

  // Filter balasan berdasarkan parent_id yang cocok dengan comment_id saat ini
  const replies = allComments.filter(
    (replyComment) => replyComment.parent_id === comment.comment_id
  );

  // Gunakan tanggal_komentar dan pastikan itu objek Date
  const timeAgo = comment.tanggal_komentar
    ? formatDistanceToNow(new Date(comment.tanggal_komentar), {
        addSuffix: true,
        locale: id,
      })
    : "Beberapa waktu lalu"; // Fallback jika tanggal_komentar null

  // Ambil nama pengguna dan ID untuk avatar
  const displayUserName =
    comment.pengguna?.nama_lengkap ||
    comment.username ||
    `Pengguna ${comment.user_id?.toString() || "Anonim"}`;
  const avatarName =
    comment.pengguna?.nama_lengkap || `User ${comment.user_id?.toString()}`;
  const avatarBackground = comment.pengguna?.user_id ? "random" : "gray";

  return (
    <div
      className="flex space-x-3"
      style={{ marginLeft: comment.parent_id ? "2rem" : "0" }}
    >
      <Image
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          avatarName
        )}&background=${avatarBackground}`}
        alt={`Avatar for ${displayUserName}`}
        width={40}
        height={40}
        className="rounded-full mt-1"
      />
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
              {displayUserName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 mt-1">
            {comment.isi_komentar}
          </p>
        </div>

        <div className="mt-1">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {isReplying ? "Batal" : "Balas"}
          </button>
        </div>

        {isReplying && (
          <CommentForm
            articleId={articleId} // articleId (bigint) diteruskan langsung
            parentId={comment.comment_id} // parentId (bigint) diteruskan langsung
            onCommentPosted={() => {
              setIsReplying(false);
              onCommentPosted();
            }}
          />
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.comment_id.toString()} // key harus string
                comment={reply}
                allComments={allComments}
                articleId={articleId}
                onCommentPosted={onCommentPosted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
