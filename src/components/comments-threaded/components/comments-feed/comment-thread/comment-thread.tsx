import { useEffect, useMemo, useState } from "react";
import { Comment, useCommentSection, useReplies } from "@replyke/react-js";
import SingleComment from "./single-comment";
import CommentReplies from "./comment-replies";

interface CommentThreadProps {
  comment: Comment;
  depth: number;
  isLastReply?: boolean;
}

function CommentThread({ comment, depth, isLastReply = false }: CommentThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const { sortBy } = useCommentSection();

  const { replies, newReplies, loading, setPage } = useReplies({
    commentId: comment.id,
    sortBy: (sortBy as "top" | "new" | "old") || "new",
  });

  useEffect(() => {
    setPage(1);
  }, [setPage]);

  const initialVisibleReplies = 3;

  const allReplies = useMemo(() => {
    return [...(newReplies || []), ...(replies || [])];
  }, [newReplies, replies]);

  const visibleReplies = useMemo(() => {
    return showAllReplies
      ? allReplies
      : allReplies.slice(0, initialVisibleReplies);
  }, [showAllReplies, allReplies]);

  const hiddenRepliesCount = Math.max(0, allReplies.length - initialVisibleReplies);

  const hasReplies = allReplies.length > 0;
  const replyCount = allReplies.length;

  return (
    <>
      <SingleComment
        comment={comment}
        depth={depth}
        hasReplies={hasReplies}
        isCollapsed={isCollapsed}
        replyCount={replyCount}
        isLastReply={isLastReply}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <CommentReplies
        depth={depth}
        isCollapsed={isCollapsed}
        loading={loading}
        visibleReplies={visibleReplies}
        hiddenRepliesCount={hiddenRepliesCount}
        showAllReplies={showAllReplies}
        onShowAllReplies={() => setShowAllReplies(true)}
        CommentThreadComponent={CommentThread}
      />
    </>
  );
}

export default CommentThread;
