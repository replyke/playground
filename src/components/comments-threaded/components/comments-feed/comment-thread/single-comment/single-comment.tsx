import React, { useState } from "react";
import {
  Comment,
  getUserName,
  useCommentSection,
  useUser,
} from "@replyke/react-js";
import {
  parseContentWithMentions,
  UserAvatar,
} from "@replyke/ui-core-react-js";
import VoteButtons from "./vote-buttons";
import ActionMenu from "../action-menu";
import NewReplyForm from "../new-reply-form";
import ToggleRepliesVisibility from "./toggle-replies-visibility";
import IndentationThreadingLines from "./indentation-threading-lines";
import ReplyButtonAndInfo from "./reply-button-and-info";
import { cn } from "@/lib/utils";

interface SingleCommentProps {
  comment: Comment;
  depth: number;
  hasReplies: boolean;
  isCollapsed: boolean;
  replyCount: number;
  isLastReply?: boolean;
  onToggleCollapse: () => void;
}

function SingleComment({
  comment: commentFromSection,
  depth,
  hasReplies,
  isCollapsed,
  replyCount,
  isLastReply = false,
  onToggleCollapse,
}: SingleCommentProps) {
  const { user } = useUser();
  const { callbacks, highlightedComment } = useCommentSection();
  const [comment, setComment] = useState<Comment>(commentFromSection);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const maxDepth = 6;
  const actualDepth = Math.min(depth, maxDepth);
  const indentationPx = actualDepth * 24;

  return (
    <div
      className={cn(
        "relative",
        highlightedComment?.comment.id === comment.id &&
          "bg-blue-100 dark:bg-blue-900"
      )}
      style={{ marginLeft: `${indentationPx}px` }}
    >
      {actualDepth > 0 && (
        <IndentationThreadingLines isLastReply={isLastReply} />
      )}

      <div className="py-2 rounded-md transition-colors duration-150">
        <div className="flex">
          <div className="shrink-0 mr-3 relative mt-1">
            <div
              className="relative z-10 cursor-pointer"
              onClick={() => {
                if (user?.id === comment.user?.id) {
                  callbacks?.currentUserClickCallback?.();
                } else {
                  callbacks?.otherUserClickCallback?.(
                    comment.user?.id ?? "",
                    comment.user?.foreignId
                  );
                }
              }}
            >
              <UserAvatar user={comment.user} borderRadius={24} size={24} />
            </div>
            {hasReplies && !isCollapsed && (
              <div
                className="absolute w-px bg-gray-300 dark:bg-gray-500 z-0"
                style={{ left: "50%", top: "20px", height: "calc(100% + 10px)" }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span
                  className="font-medium text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:underline"
                  onClick={() => {
                    if (user?.id === comment.user?.id) {
                      callbacks?.currentUserClickCallback?.();
                    } else {
                      callbacks?.otherUserClickCallback?.(
                        comment.user?.id ?? "",
                        comment.user?.foreignId
                      );
                    }
                  }}
                >
                  {getUserName(comment.user ?? {})}
                </span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                {isCollapsed && hasReplies && (
                  <span className="text-blue-500 dark:text-blue-400 text-xs">
                    ({replyCount} {replyCount === 1 ? "reply" : "replies"})
                  </span>
                )}
                {hasReplies && (
                  <ToggleRepliesVisibility
                    isCollapsed={isCollapsed}
                    onToggleCollapse={onToggleCollapse}
                  />
                )}
              </div>
              <ActionMenu comment={comment} />
            </div>

            {!isCollapsed && (
              <>
                {comment.content && (
                  <p className="text-xs text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                    {parseContentWithMentions(
                      comment.content,
                      comment.mentions
                        .filter((m) => m.type === "user")
                        .map((m) => ({
                          id: m.id,
                          username: (m as { type: "user"; id: string; foreignId?: string | null; username: string }).username,
                          foreignId: (m as { type: "user"; id: string; foreignId?: string | null; username: string }).foreignId ?? undefined,
                        })),
                      user?.id,
                      callbacks?.currentUserClickCallback,
                      callbacks?.otherUserClickCallback
                    )}
                  </p>
                )}

                {comment.gif && (
                  <img
                    src={comment.gif.gifUrl}
                    alt={comment.gif.altText}
                    className="rounded overflow-hidden object-cover mb-3"
                    style={{
                      width:
                        comment.gif.aspectRatio > 1
                          ? 200
                          : 200 * comment.gif.aspectRatio,
                      height:
                        comment.gif.aspectRatio < 1
                          ? 200
                          : 200 / comment.gif.aspectRatio,
                    }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <ReplyButtonAndInfo
                    hasReplies={hasReplies}
                    replyCount={replyCount}
                    setShowReplyForm={setShowReplyForm}
                  />
                  <div className="shrink-0">
                    <VoteButtons
                      comment={comment}
                      setComment={setComment}
                      size="small"
                    />
                  </div>
                </div>

                {showReplyForm && (
                  <NewReplyForm
                    comment={comment}
                    setShowReplyForm={setShowReplyForm}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleComment;
