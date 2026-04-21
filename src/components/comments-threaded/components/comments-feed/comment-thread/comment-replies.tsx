import React from "react";
import { Comment } from "@replyke/react-js";

interface CommentRepliesProps {
  depth: number;
  isCollapsed: boolean;
  loading: boolean;
  visibleReplies: Comment[];
  hiddenRepliesCount: number;
  showAllReplies: boolean;
  onShowAllReplies: () => void;
  CommentThreadComponent: React.ComponentType<{ comment: Comment; depth: number; isLastReply: boolean }>;
}

function CommentReplies({
  depth,
  isCollapsed,
  visibleReplies,
  hiddenRepliesCount,
  showAllReplies,
  onShowAllReplies,
  CommentThreadComponent,
}: CommentRepliesProps) {
  if (isCollapsed || visibleReplies.length === 0) return null;

  return (
    <div>
      {visibleReplies.map((reply, index) => (
        <CommentThreadComponent
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          isLastReply={index === visibleReplies.length - 1}
        />
      ))}

      {hiddenRepliesCount > 0 && !showAllReplies && (
        <div className="mt-3 ml-1">
          <button
            onClick={onShowAllReplies}
            className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-500 font-medium transition-all duration-150 px-2 py-1 rounded-full bg-transparent border-none cursor-pointer hover:text-blue-700 dark:hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {hiddenRepliesCount} more{" "}
            {hiddenRepliesCount === 1 ? "reply" : "replies"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentReplies;
