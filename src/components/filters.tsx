import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface FiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  timeFrame: string | null;
  setTimeFrame: (value: string | null) => void;
  content: string;
  setContent: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: "new", label: "New" },
  { value: "hot", label: "Hot" },
  { value: "top", label: "Top" },
  { value: "controversial", label: "Controversial" },
];

const TIME_OPTIONS = [
  { value: "", label: "All" },
  { value: "hour", label: "1h" },
  { value: "day", label: "1d" },
  { value: "week", label: "1w" },
  { value: "month", label: "1m" },
  { value: "year", label: "1y" },
];

export default function Filters({ sortBy, setSortBy, timeFrame, setTimeFrame, content, setContent }: FiltersProps) {
  const [localSearch, setLocalSearch] = useState(content);

  useEffect(() => {
    const id = setTimeout(() => setContent(localSearch), 700);
    return () => clearTimeout(id);
  }, [localSearch, setContent]);

  return (
    <div className="px-4 py-2.5 border-b border-neutral-100 bg-white space-y-2.5">
      <div className="relative">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search posts..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-neutral-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-colors placeholder:text-neutral-400"
        />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setSortBy(opt.value);
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

        {sortBy !== "new" && (
          <>
            <span className="text-neutral-200 text-xs mx-0.5">|</span>
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeFrame(opt.value || null)}
                className={
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer " +
                  ((timeFrame ?? "") === opt.value
                    ? "bg-neutral-800 text-white border border-neutral-700"
                    : "border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700")
                }
              >
                {opt.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
