import { useEffect, useState } from "react";
import {
  Entity,
  EntityInclude,
  EntityListFilters,
  EntityListSortByOptions,
  EntityProvider,
  SortByReaction,
  TimeFrame,
  useEntityList,
  useUser,
} from "@replyke/react-js";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";
import Tweet from "../components/tweet";
import TweetComposer from "../components/tweet-composer";
import UserBar from "../components/user-bar";
import LoadingPlaceholder from "../components/loading-placeholder";
import Filters from "../components/filters";
import { Sheet } from "../components/ui/sheet";
import CommentSectionSheet from "../components/comment-section-sheet";

import { FOR_YOU_LIST_ID, FOLLOWING_LIST_ID } from "../config/list-ids";

export default function TweetFeed() {
  const { user: currentUser } = useUser();

  const forYouList = useEntityList({ listId: FOR_YOU_LIST_ID });
  const followingList = useEntityList({ listId: FOLLOWING_LIST_ID });

  const [selectedEntity, setSelectedEntity] = useState<
    Entity | null | undefined
  >(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [highlightBar, setHighlightBar] = useState(false);
  const [feedTab, setFeedTab] = useState<"for-you" | "following">("for-you");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState<EntityListSortByOptions>("new");
  const [timeFrame, setTimeFrame] = useState<TimeFrame | null | undefined>(
    null,
  );
  const [sortByReaction, setSortByReaction] = useState<SortByReaction>("like");

  const forYouSentinelRef = useInfiniteScroll(
    forYouList.loadMore,
    forYouList.hasMore,
    forYouList.loading,
  );
  const followingSentinelRef = useInfiniteScroll(
    followingList.loadMore,
    followingList.hasMore,
    followingList.loading,
  );

  const buildFetchArgs = (followedOnly = false) => {
    const filters: EntityListFilters = {
      timeFrame,
      followedOnly: followedOnly || undefined,
    };
    if (content.length) filters.contentFilters = { includes: [content] };
    return {
      filters,
      sort: {
        sortBy,
        sortByReaction: sortBy === "top" ? sortByReaction : undefined,
      },
      options: {
        sourceId: "tweets",
        limit: 10,
        include: ["saved", "topComment", "user"] as EntityInclude[],
      },
      config: { resetFilters: true, clearImmediately: false },
    };
  };

  useEffect(() => {
    const { filters, sort, options, config } = buildFetchArgs(false);
    forYouList.fetchEntities(filters, sort, options, config);
  }, [sortBy, timeFrame, content, sortByReaction]);

  useEffect(() => {
    const { filters, sort, options, config } = buildFetchArgs(true);
    followingList.fetchEntities(filters, sort, options, config);
  }, [sortBy, timeFrame, content, sortByReaction]);

  function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    if (feedTab === "for-you") {
      const { filters, sort, options, config } = buildFetchArgs(false);
      forYouList.fetchEntities(filters, sort, options, config);
    } else {
      const { filters, sort, options, config } = buildFetchArgs(true);
      followingList.fetchEntities(filters, sort, options, config);
    }
    setTimeout(() => setIsRefreshing(false), 700);
  }

  function handleAuthRequired() {
    setHighlightBar(true);
  }

  function handleSelectEntity(ent: Entity | null | undefined) {
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

          <TweetComposer
            onAuthRequired={handleAuthRequired}
            onPost={() => setFeedTab("for-you")}
          />

          {/* Tab bar */}
          <div className="relative flex border-b border-neutral-200">
            {(["for-you", "following"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFeedTab(tab)}
                className={
                  "flex-1 py-3 text-sm font-semibold transition-colors " +
                  (feedTab === tab
                    ? "border-b-2 border-rose-500 text-rose-600"
                    : "text-neutral-500 hover:bg-neutral-50")
                }
              >
                {tab === "for-you" ? "For You" : "Following"}
              </button>
            ))}
          </div>

          <Filters
            sortBy={sortBy}
            setSortBy={setSortBy}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            sortByReaction={sortByReaction}
            setSortByReaction={setSortByReaction}
            content={content}
            setContent={setContent}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Sliding feed container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                width: "200%",
                transform:
                  feedTab === "for-you" ? "translateX(0)" : "translateX(-50%)",
              }}
            >
              {/* For You feed */}
              <div className="w-1/2">
                <div className="flex flex-col gap-3 p-4">
                  {forYouList.entities.map((entity) => (
                    <EntityProvider entity={entity} key={entity.id}>
                      <Tweet
                        listId={FOR_YOU_LIST_ID}
                        onAuthRequired={handleAuthRequired}
                        handleSelectEntity={handleSelectEntity}
                      />
                    </EntityProvider>
                  ))}
                </div>
                {forYouList.loading && <LoadingPlaceholder />}
                <div ref={forYouSentinelRef} className="h-px" />
                {!forYouList.hasMore &&
                  !forYouList.loading &&
                  forYouList.entities.length > 0 && (
                    <div className="p-6 flex justify-center items-center border-t border-neutral-100">
                      <span className="text-neutral-400 text-sm">
                        You're all caught up
                      </span>
                    </div>
                  )}
              </div>

              {/* Following feed */}
              <div className="w-1/2">
                {!currentUser ? (
                  <div className="p-12 text-center">
                    <p className="text-neutral-500 text-base font-medium mb-1">
                      Sign in to see posts from people you follow
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Follow accounts to build your personalized feed.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 p-4">
                      {followingList.entities.map((entity) => (
                        <EntityProvider entity={entity} key={entity.id}>
                          <Tweet
                            listId={FOLLOWING_LIST_ID}
                            onAuthRequired={handleAuthRequired}
                            handleSelectEntity={handleSelectEntity}
                          />
                        </EntityProvider>
                      ))}
                    </div>
                    {followingList.loading && <LoadingPlaceholder />}
                    <div ref={followingSentinelRef} className="h-px" />
                    {!followingList.hasMore &&
                      !followingList.loading &&
                      followingList.entities.length > 0 && (
                        <div className="p-6 flex justify-center items-center border-t border-neutral-100">
                          <span className="text-neutral-400 text-sm">
                            You're all caught up
                          </span>
                        </div>
                      )}
                    {!followingList.loading &&
                      followingList.entities.length === 0 && (
                        <div className="p-12 text-center">
                          <p className="text-neutral-400 text-base">
                            No posts from people you follow yet
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
