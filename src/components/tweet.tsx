import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useEntity,
  useEntityList,
  useUser,
  useReactionToggle,
} from "@replyke/react-js";
import {
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  SmilePlus,
} from "lucide-react";
import { ResponsiveDrawer } from "./ui/ResponsiveDrawer";
import UserHoverCard from "./user-hover-card";
import getUserAvatar from "../utils/getUserAvatar";
import CollectionsDialog from "./collections-dialog";
import ReportDialog from "./report-dialog";
import { Dialog } from "./ui/dialog";

const REACTION_TYPES = [
  "upvote",
  "downvote",
  "like",
  "love",
  "wow",
  "sad",
  "angry",
  "funny",
] as const;
type ReactionType = (typeof REACTION_TYPES)[number];

const REACTION_EMOJIS: Record<ReactionType, string> = {
  upvote: "👍",
  downvote: "👎",
  like: "❤️",
  love: "😍",
  wow: "😮",
  sad: "😢",
  angry: "😡",
  funny: "😂",
};

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 2) return "Just now";
  if (minutes < 60) return minutes + "m";
  if (hours < 24) return hours + "h";
  return days + "d";
};

interface TweetProps {
  onAuthRequired: () => void;
  handleSelectEntity: (entity: unknown) => void;
}

export default function Tweet({
  onAuthRequired,
  handleSelectEntity,
}: TweetProps) {
  const { user } = useUser();
  const { entity } = useEntity();

  const { currentReaction, reactionCounts, toggleReaction } = useReactionToggle(
    {
      targetType: "entity",
      targetId: entity?.id,
      initialReaction: entity?.userReaction,
      initialReactionCounts: entity?.reactionCounts,
    },
  );

  const isAuthor = user?.id === entity?.user?.id;
  const { deleteEntity } = useEntityList({ listId: "home-tweets" });

  const [isEntitySaved, setIsEntitySaved] = useState<boolean>(
    entity?.isSaved ?? false,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const reactionRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pickerHoverRef = useRef(false);

  const totalReactions = Object.values(reactionCounts ?? {}).reduce(
    (sum, n) => sum + (n ?? 0),
    0,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteConfirm = () => {
    if (entity?.id) {
      deleteEntity({ entityId: entity.id });
      setShowDeleteConfirm(false);
    }
  };

  const handleBookmarkClick = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setIsBookmarkDrawerOpen(true);
  };

  const handleReactionClick = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    toggleReaction({
      reactionType: (currentReaction as ReactionType) ?? "like",
    });
  };

  const handleReactionSelect = (type: ReactionType) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    toggleReaction({ reactionType: type });
    setShowReactionPicker(false);
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => setShowReactionPicker(true), 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleReactionMouseLeave = () => {
    setTimeout(() => {
      if (!pickerHoverRef.current) setShowReactionPicker(false);
    }, 100);
  };

  return (
    <div className="px-4 py-3.5 hover:bg-neutral-50/70 transition-colors duration-150">
      <div className="flex gap-3">
        <UserHoverCard user={(entity?.user as Record<string, unknown>) || {}}>
          <Link
            to={"/u/" + (entity?.user?.id || "")}
            className="hover:opacity-80 transition-opacity shrink-0"
          >
            <img
              src={getUserAvatar(entity?.user?.id || "")}
              className="size-9 rounded-full bg-white shadow-sm ring-1 ring-neutral-100"
            />
          </Link>
        </UserHoverCard>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <UserHoverCard
                user={(entity?.user as Record<string, unknown>) || {}}
              >
                <Link
                  to={"/u/" + (entity?.user?.id || "")}
                  className="font-semibold text-neutral-900 text-sm hover:underline leading-tight"
                >
                  @{entity?.user?.username}
                </Link>
              </UserHoverCard>
              <span className="text-neutral-300 text-xs">·</span>
              <span className="text-neutral-400 text-xs">
                {entity && formatTimestamp(new Date(entity.createdAt))}
              </span>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
              >
                <MoreHorizontal size={14} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-8 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-10 min-w-36 overflow-hidden">
                  {isAuthor ? (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete post
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowReportDialog(true);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Report post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-neutral-800 text-sm leading-relaxed mb-2.5">
            {entity?.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Reaction button */}
              <div
                ref={reactionRef}
                className="relative"
                onMouseEnter={() => setShowReactionPicker(true)}
                onMouseLeave={handleReactionMouseLeave}
              >
                <button
                  onClick={handleReactionClick}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  className={
                    "flex items-center gap-1.5 transition-colors group cursor-pointer " +
                    (currentReaction
                      ? "text-rose-500"
                      : "text-neutral-400 hover:text-rose-500")
                  }
                >
                  <div
                    className={
                      "p-1.5 rounded-full transition-colors text-base leading-none " +
                      (currentReaction
                        ? "bg-rose-50"
                        : "group-hover:bg-rose-50")
                    }
                  >
                    {currentReaction ? (
                      REACTION_EMOJIS[currentReaction as ReactionType]
                    ) : (
                      <SmilePlus size={14} />
                    )}
                  </div>
                  <span className="text-xs font-medium">
                    {totalReactions > 0 ? totalReactions : ""}
                  </span>
                </button>

                {showReactionPicker && (
                  <div
                    className="absolute bottom-full left-0 mb-2 flex items-center gap-0.5 bg-white border border-neutral-200 rounded-full shadow-xl px-2 py-1.5 z-20"
                    onMouseEnter={() => {
                      pickerHoverRef.current = true;
                    }}
                    onMouseLeave={() => {
                      pickerHoverRef.current = false;
                      setShowReactionPicker(false);
                    }}
                  >
                    {REACTION_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleReactionSelect(type)}
                        title={type}
                        className={
                          "text-lg p-1 rounded-full transition-all hover:scale-125 hover:bg-neutral-100 " +
                          (currentReaction === type
                            ? "scale-110 bg-neutral-100"
                            : "")
                        }
                      >
                        {REACTION_EMOJIS[type]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSelectEntity(entity)}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-emerald-600 transition-colors group cursor-pointer"
              >
                <div className="p-1.5 rounded-full group-hover:bg-emerald-50 transition-colors">
                  <MessageCircle size={14} />
                </div>
                <span className="text-xs font-medium">
                  {entity?.repliesCount || ""}
                </span>
              </button>
            </div>

            {user ? (
              <ResponsiveDrawer
                open={isBookmarkDrawerOpen}
                onOpenChange={setIsBookmarkDrawerOpen}
                title="Add to Collection"
                trigger={
                  <button
                    className={
                      "transition-colors group cursor-pointer " +
                      (isEntitySaved
                        ? "text-blue-500"
                        : "text-neutral-400 hover:text-blue-500")
                    }
                  >
                    <div
                      className={
                        "p-1.5 rounded-full transition-colors " +
                        (isEntitySaved
                          ? "bg-blue-50"
                          : "group-hover:bg-blue-50")
                      }
                    >
                      <Bookmark
                        size={14}
                        fill={isEntitySaved ? "currentColor" : "none"}
                      />
                    </div>
                  </button>
                }
              >
                <CollectionsDialog setIsEntitySaved={setIsEntitySaved} />
              </ResponsiveDrawer>
            ) : (
              <button
                onClick={handleBookmarkClick}
                className="text-neutral-400 hover:text-blue-500 transition-colors group cursor-pointer"
              >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                  <Bookmark size={14} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl border border-neutral-100">
            <h3 className="text-base font-semibold text-neutral-900 mb-1.5">
              Delete post?
            </h3>
            <p className="text-neutral-500 text-sm mb-5">
              This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-neutral-700 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <ReportDialog
          setShowReportPostDialog={setShowReportDialog}
          entity={entity ?? null}
        />
      </Dialog>
    </div>
  );
}
