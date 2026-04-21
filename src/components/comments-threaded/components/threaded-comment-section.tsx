import React, { ReactNode } from "react";
import { Entity } from "@replyke/react-js";
import useThreadedComments from "../hooks/use-threaded-comments";
import CommentsFeed from "./comments-feed/comments-feed";
import NewCommentForm from "./new-comment-form";
import { deepEqual, warnPropChanges } from "../utils/prop-comparison";

interface ThreadedCommentSectionProps {
  entity?: Entity | null;
  entityId?: string | null;
  foreignId?: string | null;
  shortId?: string | null;
  isVisible?: boolean;
  highlightedCommentId?: string | null;
  callbacks?: Record<string, (...args: any[]) => void>;
  children?: ReactNode;
}

const arePropsEqual = (
  prevProps: ThreadedCommentSectionProps,
  nextProps: ThreadedCommentSectionProps
) => {
  warnPropChanges(
    "ThreadedCommentSection",
    prevProps as Record<string, unknown>,
    nextProps as Record<string, unknown>,
    ["entity"]
  );

  if (
    prevProps.entityId !== nextProps.entityId ||
    prevProps.foreignId !== nextProps.foreignId ||
    prevProps.shortId !== nextProps.shortId ||
    prevProps.isVisible !== nextProps.isVisible ||
    prevProps.highlightedCommentId !== nextProps.highlightedCommentId ||
    prevProps.callbacks !== nextProps.callbacks
  ) {
    return false;
  }

  if (!deepEqual(prevProps.entity, nextProps.entity)) return false;
  if (prevProps.children !== nextProps.children) return false;

  return true;
};

function ThreadedCommentSectionInner({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 py-2">
        <CommentsFeed>{children}</CommentsFeed>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
        {isVisible && <NewCommentForm />}
      </div>
    </div>
  );
}

function ThreadedCommentSection({
  entity,
  entityId,
  foreignId,
  shortId,
  isVisible = true,
  highlightedCommentId,
  callbacks,
  children,
}: ThreadedCommentSectionProps) {
  const { CommentSectionProvider } = useThreadedComments({
    entity,
    entityId,
    foreignId,
    shortId,
    highlightedCommentId,
    callbacks,
  });

  return (
    <CommentSectionProvider>
      <ThreadedCommentSectionInner isVisible={isVisible}>
        {children}
      </ThreadedCommentSectionInner>
    </CommentSectionProvider>
  );
}

export default React.memo(ThreadedCommentSection, arePropsEqual);
