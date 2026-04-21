import React, { ReactNode, useMemo } from "react";
import { useCommentSection } from "@replyke/react-js";
import LoadedComments from "./loaded-comments";
import FetchingCommentsSkeletons from "./fetching-comments-skeletons";
import NoCommentsPlaceHolder from "./no-comments-placeholder";

const CommentsFeed = React.memo(
  ({ children: customNoCommentsView }: { children?: ReactNode }) => {
    const { comments, newComments, loading, highlightedComment } =
      useCommentSection();

    const mergedComments = useMemo(() => {
      let combinedComments = [...(newComments ?? []), ...(comments ?? [])];

      if (highlightedComment) {
        const { comment, parentComment } = highlightedComment;
        combinedComments = combinedComments.filter(
          (item) => item.id !== comment.id && item.id !== parentComment?.id
        );
      }

      return combinedComments;
    }, [comments, newComments, highlightedComment]);

    const showLoadedComments = mergedComments.length > 0 || highlightedComment;
    const showFetchingSkeletons =
      loading && mergedComments.length === 0 && !highlightedComment;
    const showNoComments =
      !loading && mergedComments.length === 0 && !highlightedComment;

    return (
      <div className="flex-1">
        {showLoadedComments && <LoadedComments data={mergedComments} />}
        {showFetchingSkeletons && <FetchingCommentsSkeletons />}
        {showNoComments && (customNoCommentsView ?? <NoCommentsPlaceHolder />)}
      </div>
    );
  }
);

export default CommentsFeed;
