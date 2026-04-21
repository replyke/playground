import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, FolderOpen, Shuffle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth as useAuthReplyke, useUser } from "@replyke/react-js";
import { useAuth } from "../context/use-auth";
import getUserAvatar from "../utils/getUserAvatar";
import { ResponsiveDrawer } from "./ui/ResponsiveDrawer";
import CollectionsExplorer from "./collections-explorer";
import NotificationControl from "./notification-control";

interface UserBarProps {
  highlighted: boolean;
  onHighlightEnd: () => void;
}

const notificationTemplates = {
  entityComment: {
    title: "New comment on your post",
    content: "$initiatorName commented on your post",
  },
  commentReply: {
    title: "New reply to your comment",
    content: "$initiatorName replied to your comment",
  },
  entityMention: {
    title: "You were mentioned in a post",
    content: "$initiatorName mentioned you",
  },
  commentMention: {
    title: "You were mentioned in a comment",
    content: "$initiatorName mentioned you in a comment",
  },
  entityUpvote: {
    title: "Your post was liked",
    content: "$initiatorName liked your post",
  },
  commentUpvote: {
    title: "Your comment was liked",
    content: "$initiatorName liked your comment",
  },
  newFollow: {
    title: "New follower",
    content: "$initiatorName started following you",
  },
};

export default function UserBar({ highlighted, onHighlightEnd }: UserBarProps) {
  const { user } = useUser();
  const { clearUsername, setUsername: saveUsername, generateRandomUsername } = useAuth();
  const { signOut: signOutReplyke } = useAuthReplyke();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (highlighted && !user && inputRef.current) {
      inputRef.current.focus();
      const timer = setTimeout(onHighlightEnd, 1800);
      return () => clearTimeout(timer);
    }
    if (highlighted && user) {
      const timer = setTimeout(onHighlightEnd, 1800);
      return () => clearTimeout(timer);
    }
  }, [highlighted, user, onHighlightEnd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Enter a username");
      return;
    }
    if (username.length < 3) {
      setError("At least 3 characters");
      return;
    }
    if (username.length > 30) {
      setError("Max 30 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Letters, numbers, - and _ only");
      return;
    }

    saveUsername(username.trim());
    setUsername("");
    setError("");
  };

  const handleGenerateRandom = () => {
    const random = generateRandomUsername();
    setUsername(random);
    setError("");
  };

  const handleSignOut = async () => {
    clearUsername();
    await signOutReplyke();
  };

  return (
    <motion.div
      animate={
        highlighted
          ? {
              boxShadow: [
                "0 0 0 0px rgba(225,29,72,0)",
                "0 0 0 3px rgba(225,29,72,0.5)",
                "0 0 0 3px rgba(225,29,72,0.3)",
                "0 0 0 0px rgba(225,29,72,0)",
              ],
            }
          : { boxShadow: "0 0 0 0px rgba(225,29,72,0)" }
      }
      transition={{ duration: 1.2 }}
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200"
    >
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="logged-in"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-3"
            >
              <Link
                to={"/u/" + user.id}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0"
              >
                <img
                  src={getUserAvatar(user.id)}
                  className="size-8 rounded-full bg-white shadow ring-2 ring-rose-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm leading-tight truncate">
                    @{user.username}
                  </p>
                  <p className="text-xs text-neutral-400 leading-tight">Demo user</p>
                </div>
              </Link>

              <div className="flex items-center gap-1.5 shrink-0">
                <ResponsiveDrawer
                  title="My Collections"
                  trigger={
                    <button className="flex items-center gap-1.5 text-neutral-500 hover:text-rose-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 cursor-pointer">
                      <FolderOpen size={13} />
                      <span className="text-xs font-medium hidden sm:inline">Collections</span>
                    </button>
                  }
                >
                  <CollectionsExplorer />
                </ResponsiveDrawer>

                <NotificationControl
                  notificationTemplates={notificationTemplates}
                  theme="light"
                />

                <a
                  href="https://github.com/replyke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-700 transition-colors p-1.5 rounded-lg hover:bg-neutral-100"
                  title="View on GitHub"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-700 transition-colors p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logged-out"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <div className="size-5 rounded-full bg-rose-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold leading-none">R</span>
                </div>
                <span className="text-xs font-semibold text-neutral-500 tracking-wide">
                  DEMO
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 flex-1"
              >
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium pointer-events-none">
                    @
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    placeholder="pick a username"
                    className="w-full pl-7 pr-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-colors placeholder:text-neutral-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-neutral-700 cursor-pointer shrink-0"
                  title="Random username"
                >
                  <Shuffle size={14} />
                </button>

                <button
                  type="submit"
                  disabled={!username.trim() || username.length < 3}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 border border-rose-500"
                >
                  <span className="hidden sm:inline">Join</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              <a
                href="https://github.com/replyke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-700 transition-colors p-1.5 rounded-lg hover:bg-neutral-100 shrink-0"
                title="View on GitHub"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </a>

              {error && (
                <p className="text-xs text-rose-500 shrink-0">{error}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {highlighted && !user && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-2"
        >
          <p className="text-xs text-rose-500 font-medium">
            Pick a username to continue
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
