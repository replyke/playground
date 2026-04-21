import { useState } from "react";
import { Send } from "lucide-react";
import { useEntityList, useUser } from "@replyke/react-js";
import getUserAvatar from "../utils/getUserAvatar";

interface TweetComposerProps {
  onAuthRequired: () => void;
}

export default function TweetComposer({ onAuthRequired }: TweetComposerProps) {
  const { user } = useUser();
  const { createEntity } = useEntityList({ listId: "home-tweets" });
  const [content, setContent] = useState("");
  const maxLength = 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onAuthRequired();
      return;
    }
    if (content.trim().length > 0 && content.length <= maxLength) {
      createEntity({ content: content.trim() });
      setContent("");
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isDisabled = content.trim().length === 0 || isOverLimit;

  return (
    <div className="px-4 py-4 border-b border-neutral-100">
      <form onSubmit={handleSubmit} className="flex gap-3">
        {user && (
          <img
            src={getUserAvatar(user.id)}
            className="size-9 rounded-full shrink-0 mt-0.5 shadow-sm ring-2 ring-rose-100"
          />
        )}

        <div className="flex-1 flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={() => { if (!user) onAuthRequired(); }}
            placeholder={user ? "What's happening?" : "Join to share your thoughts..."}
            className="w-full resize-none border-none outline-none text-[15px] placeholder-neutral-400 bg-transparent min-h-14 leading-relaxed"
            rows={2}
          />

          <div className="flex items-center justify-between">
            <span
              className={
                "text-xs font-medium tabular-nums " +
                (isOverLimit
                  ? "text-red-500"
                  : remainingChars <= 20
                  ? "text-amber-500"
                  : "text-neutral-300")
              }
            >
              {remainingChars < 60 ? remainingChars : ""}
            </span>

            <button
              type="submit"
              disabled={isDisabled && !!user}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm cursor-pointer border border-rose-500"
            >
              <Send size={13} />
              <span>Post</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
