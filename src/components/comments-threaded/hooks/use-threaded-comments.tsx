import React, { ReactNode, useMemo } from "react";
import {
  CommentSectionProvider,
  Entity,
} from "@replyke/react-js";
import CommentsFeed from "../components/comments-feed/comments-feed";
import NewCommentForm from "../components/new-comment-form";
import CommentMenuModal from "../components/modals/comment-menu-modal/comment-menu-modal";
import CommentMenuModalOwner from "../components/modals/comment-menu-modal-owner/comment-menu-modal-owner";
import { UIStateProvider } from "../context/ui-state-context";

interface UseThreadedCommentsProps {
  entity?: Entity | null;
  entityId?: string | null;
  foreignId?: string | null;
  shortId?: string | null;
  createIfNotFound?: boolean;
  highlightedCommentId?: string | null;
  callbacks?: Record<string, (...args: any[]) => void>;
}

function useThreadedComments({
  entity,
  entityId,
  foreignId,
  shortId,
  createIfNotFound,
  highlightedCommentId,
  callbacks: callbacksProp,
}: UseThreadedCommentsProps) {
  const defaultCallbacks = useMemo(
    () => ({
      loginRequiredCallback: () => {
        alert("Please login to perform this action");
      },
      usernameRequiredCallback: () => {
        alert("Please set a username before interacting with comments");
      },
      commentTooShortCallback: () => {
        alert("Comment cannot be empty");
      },
      userCantBeMentionedCallback: () => {
        alert("This user cannot be mentioned (no username set)");
      },
      currentUserClickCallback: () => {
        console.log("Navigate to own profile");
      },
      otherUserClickCallback: (userId: string, foreignId?: string | null) => {
        console.log(`Navigate to user ${userId} profile`, { foreignId });
      },
    }),
    []
  );

  const MemoizedCommentSectionProvider = useMemo(() => {
    return ({ children }: { children: ReactNode }) => (
      <CommentSectionProvider
        entity={entity}
        entityId={entityId}
        foreignId={foreignId}
        shortId={shortId}
        createIfNotFound={createIfNotFound}
        callbacks={callbacksProp ?? defaultCallbacks}
        defaultSortBy="top"
        limit={10}
        highlightedCommentId={highlightedCommentId}
      >
        <UIStateProvider>
          <>
            {children}
            <CommentMenuModal />
            <CommentMenuModalOwner />
          </>
        </UIStateProvider>
      </CommentSectionProvider>
    );
  }, [
    entity,
    entityId,
    foreignId,
    shortId,
    createIfNotFound,
    callbacksProp,
    defaultCallbacks,
    highlightedCommentId,
  ]);

  return useMemo(
    () => ({
      CommentSectionProvider: MemoizedCommentSectionProvider,
      CommentsFeed,
      NewCommentForm,
    }),
    [MemoizedCommentSectionProvider]
  );
}

export default useThreadedComments;
