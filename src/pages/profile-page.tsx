import { useEffect, useState } from "react";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";
import { useParams, Link } from "react-router-dom";
import {
  EntityProvider,
  useEntityList,
  useFetchUser,
  useFollowManager,
  useUser,
} from "@replyke/react-js";
import { ArrowLeft, Edit2, Check, X, Calendar, UserIcon } from "lucide-react";
import Tweet from "../components/tweet";
import LoadingPlaceholder from "../components/loading-placeholder";
import Filters from "../components/filters";
import UserBar from "../components/user-bar";
import { Sheet } from "../components/ui/sheet";
import CommentSectionSheet from "../components/comment-section-sheet";
import getUserAvatar from "../utils/getUserAvatar";
import { generateProfileBanner } from "../utils/getProfileBanner";

interface ProfileUser {
  id: string;
  username?: string;
  bio?: string;
  birthdate?: Date | string | null;
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, updateUser } = useUser();
  const fetchUser = useFetchUser();
  const { isFollowing, isLoading, toggleFollow } = useFollowManager({ userId: userId ?? "" });

  const {
    entities,
    fetchEntities,
    loading: loadingEntities,
    hasMore,
    loadMore,
  } = useEntityList({ listId: "profile-tweets-" + userId });

  const [selectedEntity, setSelectedEntity] = useState<unknown>(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [highlightBar, setHighlightBar] = useState(false);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loadingEntities);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("new");
  const [timeFrame, setTimeFrame] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editBirthdate, setEditBirthdate] = useState("");

  const avatar = profileUser ? getUserAvatar(profileUser.id) : null;
  const bannerStyle = userId ? generateProfileBanner(userId) : null;

  useEffect(() => {
    if (!userId) return;
    const filters: Record<string, unknown> = { sortBy, timeFrame, userId: [userId] };
    if (content.length) filters.contentFilters = { includes: [content] };
    fetchEntities(
      filters,
      {},
      { sourceId: "tweets", limit: 10 },
      { resetFilters: true, clearImmediately: false }
    );
  }, [userId, sortBy, timeFrame, content]);

  useEffect(() => {
    if (userId === currentUser?.id) {
      setProfileUser(currentUser as ProfileUser);
    } else if (userId) {
      fetchUser({ userId }).then((u) => setProfileUser(u as ProfileUser));
    }
  }, [userId, currentUser]);

  useEffect(() => {
    if (profileUser) {
      setEditBio(profileUser.bio || "");
      setEditBirthdate(
        profileUser.birthdate
          ? new Date(profileUser.birthdate as string).toISOString().split("T")[0]
          : ""
      );
    }
  }, [profileUser]);

  const isCurrentUser = currentUser?.id === userId;

  const handleBioSave = async () => {
    try {
      await updateUser({ bio: editBio });
      if (profileUser) setProfileUser({ ...profileUser, bio: editBio });
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };

  const handleBioCancel = () => {
    setEditBio(profileUser?.bio || "");
    setIsEditingBio(false);
  };

  const handleBirthdateSave = async () => {
    try {
      const birthdateObj = editBirthdate ? new Date(editBirthdate) : null;
      await updateUser({ birthdate: birthdateObj });
      if (profileUser) setProfileUser({ ...profileUser, birthdate: birthdateObj });
      setIsEditingBirthdate(false);
    } catch (error) {
      console.error("Failed to update birthdate:", error);
    }
  };

  const handleBirthdateCancel = () => {
    setEditBirthdate(
      profileUser?.birthdate
        ? new Date(profileUser.birthdate as string).toISOString().split("T")[0]
        : ""
    );
    setIsEditingBirthdate(false);
  };

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
          onAuthRequired={() => setHighlightBar(true)}
        />
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-neutral-200 min-h-screen">
          <UserBar
            highlighted={highlightBar}
            onHighlightEnd={() => setHighlightBar(false)}
          />

          <div className="sticky top-14.25 bg-white/95 backdrop-blur-sm border-b border-neutral-200 px-4 py-3 flex items-center gap-4 z-10">
            <Link
              to="/"
              className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-base font-bold text-neutral-900 leading-tight">
                {profileUser?.username ? `@${profileUser.username}` : "Profile"}
              </h1>
              {entities.length > 0 && (
                <p className="text-xs text-neutral-400">{entities.length} posts</p>
              )}
            </div>
          </div>

          {profileUser && avatar && (
            <div className="border-b border-neutral-100">
              <div className="relative h-36">
                <div
                  className="h-36 overflow-hidden"
                  style={{
                    backgroundImage: bannerStyle?.backgroundImage || "linear-gradient(135deg, #fb7185 0%, #818cf8 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute -bottom-10 left-5">
                  <img
                    src={avatar}
                    className="size-20 rounded-full border-4 border-white shadow-lg bg-white ring-2 ring-rose-100"
                  />
                </div>
              </div>

              <div className="pt-12 pb-5 px-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-neutral-900 mb-1">
                      @{profileUser.username}
                    </h1>

                    <div className="mb-3">
                      {isEditingBio ? (
                        <div className="flex items-start gap-2">
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder="Add a bio..."
                            className="flex-1 p-2 border border-neutral-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400"
                            rows={2}
                            maxLength={160}
                          />
                          <button
                            onClick={handleBioSave}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleBioCancel}
                            className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between group">
                          <div className="flex-1">
                            {profileUser.bio ? (
                              <p className="text-neutral-700 text-sm leading-relaxed">{profileUser.bio}</p>
                            ) : (
                              <div className="flex items-center gap-2 text-neutral-400">
                                <UserIcon size={13} />
                                <span className="text-sm italic">
                                  {isCurrentUser ? "Add a bio to tell people about yourself" : "No bio yet"}
                                </span>
                              </div>
                            )}
                          </div>
                          {isCurrentUser && (
                            <button
                              onClick={() => setIsEditingBio(true)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all ml-2 cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      {isEditingBirthdate ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={editBirthdate}
                            onChange={(e) => setEditBirthdate(e.target.value)}
                            className="flex-1 p-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400"
                          />
                          <button
                            onClick={handleBirthdateSave}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleBirthdateCancel}
                            className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-neutral-400" />
                            {profileUser.birthdate ? (
                              <span className="text-neutral-600 text-sm">
                                Born{" "}
                                {new Date(profileUser.birthdate as string).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-sm italic">
                                {isCurrentUser ? "Add your birthdate" : "Birthdate not set"}
                              </span>
                            )}
                          </div>
                          {isCurrentUser && (
                            <button
                              onClick={() => setIsEditingBirthdate(true)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                      <span>
                        <span className="font-semibold text-neutral-900">{entities.length}</span> posts
                      </span>
                      <span>
                        Joined{" "}
                        {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {!isCurrentUser && currentUser && (
                    <button
                      onClick={toggleFollow}
                      disabled={isLoading}
                      className={
                        "px-4 py-2 text-sm font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ml-3 border " +
                        (isFollowing
                          ? "text-neutral-700 border-neutral-300 bg-neutral-100 hover:bg-neutral-200"
                          : "text-white bg-rose-600 border-rose-500 hover:bg-rose-500")
                      }
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <Filters
            sortBy={sortBy}
            setSortBy={setSortBy}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            content={content}
            setContent={setContent}
          />

          <div className="divide-y divide-neutral-100">
            {entities.map((entity) => (
              <EntityProvider entity={entity} key={entity.id}>
                <Tweet
                  onAuthRequired={() => setHighlightBar(true)}
                  handleSelectEntity={handleSelectEntity}
                />
              </EntityProvider>
            ))}
          </div>

          {loadingEntities && <LoadingPlaceholder />}

          {entities.length === 0 && !loadingEntities && (
            <div className="p-12 text-center">
              <p className="text-neutral-400 text-base">No posts yet</p>
            </div>
          )}

          <div ref={sentinelRef} className="h-px" />

          {!hasMore && !loadingEntities && entities.length > 0 && (
            <div className="p-6 flex justify-center border-t border-neutral-100">
              <span className="text-neutral-400 text-sm">You're all caught up</span>
            </div>
          )}
        </div>
      </Sheet>
    </div>
  );
}
