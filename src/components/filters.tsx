import { useState, useEffect } from "react";
import { RefreshCw, Search } from "lucide-react";
import {
  EntityListSortByOptions,
  SortByReaction,
  TimeFrame,
} from "@replyke/react-js";

interface FiltersProps {
  sortBy: EntityListSortByOptions;
  setSortBy: (value: EntityListSortByOptions) => void;
  timeFrame: TimeFrame | null | undefined;
  setTimeFrame: (value: TimeFrame | null | undefined) => void;
  sortByReaction: SortByReaction;
  setSortByReaction: (value: SortByReaction) => void;
  content: string;
  setContent: (value: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const SORT_OPTIONS = [
  { value: "new", label: "New" },
  { value: "hot", label: "Hot" },
  { value: "top", label: "Top" },
];

const TIME_OPTIONS = [
  { value: "", label: "All" },
  { value: "hour", label: "1h" },
  { value: "day", label: "1d" },
  { value: "week", label: "1w" },
  { value: "month", label: "1m" },
  { value: "year", label: "1y" },
];

const REACTION_OPTIONS: { value: SortByReaction; emoji: string }[] = [
  { value: "like", emoji: "❤️" },
  { value: "love", emoji: "😍" },
  { value: "funny", emoji: "😂" },
  { value: "wow", emoji: "😮" },
  { value: "sad", emoji: "😢" },
  { value: "angry", emoji: "😡" },
  { value: "upvote", emoji: "👍" },
  { value: "downvote", emoji: "👎" },
];

export default function Filters({
  sortBy,
  setSortBy,
  timeFrame,
  setTimeFrame,
  sortByReaction,
  setSortByReaction,
  content,
  setContent,
  onRefresh,
  isRefreshing,
}: FiltersProps) {
  const [localSearch, setLocalSearch] = useState(content);

  useEffect(() => {
    const id = setTimeout(() => setContent(localSearch), 700);
    return () => clearTimeout(id);
  }, [localSearch, setContent]);

  return (
    <div className="px-4 py-2.5 border-b border-neutral-100 bg-white space-y-2.5">
      <div className="relative">
        <Search
          size={12}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-neutral-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-colors placeholder:text-neutral-400"
        />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setSortBy(opt.value as EntityListSortByOptions);
              if (opt.value === "new") setTimeFrame(null);
            }}
            className={
              "px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer " +
              (sortBy === opt.value
                ? "bg-rose-600 text-white border border-rose-500"
                : "border border-neutral-200 text-neutral-600 hover:border-rose-300 hover:text-rose-600")
            }
          >
            {opt.label}
          </button>
        ))}

        {sortBy === "top" && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {REACTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortByReaction(opt.value)}
                title={opt.value}
                className={
                  "size-7 rounded-full text-sm transition-all cursor-pointer flex items-center justify-center border " +
                  (sortByReaction === opt.value
                    ? "border-rose-500 bg-rose-50 scale-110"
                    : "border-neutral-200 hover:border-rose-300 hover:bg-rose-50")
                }
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        )}
        {sortBy !== "new" && (
          <>
            <span className="text-neutral-200 text-xs mx-0.5">|</span>
            <select
              value={timeFrame ?? ""}
              onChange={(e) =>
                setTimeFrame(
                  (e.target.value as TimeFrame | null | undefined) || null,
                )
              }
              className="px-2 py-1 rounded-full text-xs font-medium border border-neutral-200 text-neutral-600 bg-white cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors"
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        )}
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh feed"
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}
