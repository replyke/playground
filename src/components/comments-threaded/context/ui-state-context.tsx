import React, { createContext, useState, useMemo, useCallback, ReactNode } from "react";
import { Comment } from "@replyke/react-js";

export interface UIStateContextValue {
  isCommentOptionsModalOpen: boolean;
  isCommentOptionsModalOwnerOpen: boolean;
  openCommentOptionsModal: (newComment?: Comment) => void;
  closeCommentOptionsModal: () => void;
  openCommentOptionsModalOwner: (newComment?: Comment) => void;
  closeCommentOptionsModalOwner: () => void;
  optionsComment: Comment | null;
  setOptionsComment: (comment: Comment | null) => void;
}

export const UIStateContext = createContext<UIStateContextValue>({} as UIStateContextValue);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
  const [isCommentOptionsModalOpen, setIsCommentOptionsModalOpen] =
    useState(false);
  const [isCommentOptionsModalOwnerOpen, setIsCommentOptionsModalOwnerOpen] =
    useState(false);

  const [optionsComment, setOptionsComment] = useState<Comment | null>(null);

  const openCommentOptionsModal = useCallback((newComment?: Comment) => {
    if (newComment) setOptionsComment(newComment);
    setIsCommentOptionsModalOpen(true);
  }, []);

  const closeCommentOptionsModal = useCallback(() => {
    setIsCommentOptionsModalOpen(false);
    setOptionsComment(null);
  }, []);

  const openCommentOptionsModalOwner = useCallback((newComment?: Comment) => {
    if (newComment) setOptionsComment(newComment);
    setIsCommentOptionsModalOwnerOpen(true);
  }, []);

  const closeCommentOptionsModalOwner = useCallback(() => {
    setIsCommentOptionsModalOwnerOpen(false);
    setOptionsComment(null);
  }, []);

  const contextValue = useMemo<UIStateContextValue>(
    () => ({
      isCommentOptionsModalOpen,
      isCommentOptionsModalOwnerOpen,
      openCommentOptionsModal,
      closeCommentOptionsModal,
      openCommentOptionsModalOwner,
      closeCommentOptionsModalOwner,
      optionsComment,
      setOptionsComment,
    }),
    [
      isCommentOptionsModalOpen,
      isCommentOptionsModalOwnerOpen,
      openCommentOptionsModal,
      closeCommentOptionsModal,
      openCommentOptionsModalOwner,
      closeCommentOptionsModalOwner,
      optionsComment,
    ]
  );

  return (
    <UIStateContext.Provider value={contextValue}>
      {children}
    </UIStateContext.Provider>
  );
};
