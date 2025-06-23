import React, { useState } from "react";
import CommentForm from "./CommentForm";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Comment } from "@/types/varia"; // Import Comment type

// Tipe untuk props dari komponen CommentItem
type CommentItemProps = {
  comment: Comment; // Use imported Comment type
  allComments: Comment[]; // Use imported Comment type
  articleId: number;
  onCommentPosted: () => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  articleId,
  onCommentPosted,
}) => {
  const [isReplying, setIsReplying] = useState(false);

  const replies = allComments.filter(
    (replyComment) => replyComment.parentId === comment.commentId
  );

  const timeAgo = formatDistanceToNow(new Date(comment.timestamp), {
    addSuffix: true,
    locale: id,
  });

  return (
    <div
      className="flex space-x-3"
      style={{ marginLeft: comment.parentId ? "2rem" : "0" }}
    >
      <Image
        src={`https://ui-avatars.com/api/?name=${comment.userId}&background=random`}
        alt={`Avatar for user ${comment.userId}`}
        width={40}
        height={40}
        className="rounded-full mt-1"
      />
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
              {comment.userId} {/* Sementara tampilkan userId */}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 mt-1">
            {comment.text}
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
            articleId={articleId}
            parentId={comment.commentId}
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
                key={reply.commentId}
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
