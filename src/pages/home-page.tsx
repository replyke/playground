import { useEffect, useState } from "react";
import {
  EntityListFilters,
  EntityListSortByOptions,
  EntityProvider,
  SortByReaction,
  TimeFrame,
  useEntityList,
} from "@replyke/react-js";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";
import Tweet from "../components/tweet";
import TweetComposer from "../components/tweet-composer";
import UserBar from "../components/user-bar";
import LoadingPlaceholder from "../components/loading-placeholder";
import Filters from "../components/filters";
import { Sheet } from "../components/ui/sheet";
import CommentSectionSheet from "../components/comment-section-sheet";

export default function TweetFeed() {
  const {
    entities,
    fetchEntities,
    loading: loadingEntities,
    hasMore,
    loadMore,
  } = useEntityList({ listId: "home-tweets" });

  const [selectedEntity, setSelectedEntity] = useState<unknown>(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [highlightBar, setHighlightBar] = useState(false);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loadingEntities);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState<EntityListSortByOptions>("new");
  const [timeFrame, setTimeFrame] = useState<TimeFrame | null | undefined>(
    null,
  );
  const [sortByReaction, setSortByReaction] = useState<SortByReaction>("like");

  useEffect(() => {
    const filters: EntityListFilters = { timeFrame };

    if (content.length) {
      filters.contentFilters = { includes: [content] };
    }
    fetchEntities(
      filters,
      { sortBy, sortByReaction: sortBy === "top" ? sortByReaction : undefined },
      {
        sourceId: "tweets",
        limit: 10,
        include: ["saved", "topComment", "user"],
      },
      { resetFilters: true, clearImmediately: false },
    );
  }, [sortBy, timeFrame, content, sortByReaction]);

  function handleAuthRequired() {
    setHighlightBar(true);
  }

  function handleSelectEntity(ent: unknown) {
    setSelectedEntity(ent);
    setCommentSheetOpen(true);
  }

  return (
    <div className="doodle-bg min-h-screen">
      <Sheet>
        <CommentSectionSheet
          entity={selectedEntity}
          open={commentSheetOpen}
          onOpenChange={setCommentSheetOpen}
          onAuthRequired={handleAuthRequired}
        />
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-neutral-200 min-h-screen">
          <UserBar
            highlighted={highlightBar}
            onHighlightEnd={() => setHighlightBar(false)}
          />

          <TweetComposer onAuthRequired={handleAuthRequired} />

          <Filters
            sortBy={sortBy}
            setSortBy={setSortBy}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            sortByReaction={sortByReaction}
            setSortByReaction={setSortByReaction}
            content={content}
            setContent={setContent}
          />

          <div className="divide-y divide-neutral-100">
            {entities.map((entity) => (
              <EntityProvider entity={entity} key={entity.id}>
                <Tweet
                  onAuthRequired={handleAuthRequired}
                  handleSelectEntity={handleSelectEntity}
                />
              </EntityProvider>
            ))}
          </div>

          {loadingEntities && <LoadingPlaceholder />}

          <div ref={sentinelRef} className="h-px" />

          {!hasMore && !loadingEntities && entities.length > 0 && (
            <div className="p-6 flex justify-center items-center border-t border-neutral-100">
              <span className="text-neutral-400 text-sm">
                You're all caught up
              </span>
            </div>
          )}
        </div>
      </Sheet>
    </div>
  );
}
