import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Entity, EntityProvider, useFetchEntityByShortId } from "@replyke/react-js";
import Tweet from "../components/tweet";
import LoadingPlaceholder from "../components/loading-placeholder";
import CommentSectionSheet from "../components/comment-section-sheet";
import UserBar from "../components/user-bar";
import { Sheet } from "@/components/ui/sheet";

export default function EntityPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();
  const fetchEntityByShortId = useFetchEntityByShortId();

  const [entity, setEntity] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<unknown>(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [highlightBar, setHighlightBar] = useState(false);

  useEffect(() => {
    if (!shortId) {
      setError("No entity ID provided");
      setLoading(false);
      return;
    }

    const loadEntity = async () => {
      try {
        setLoading(true);
        const fetchedEntity = await fetchEntityByShortId({ shortId });
        if (fetchedEntity) {
          setEntity(fetchedEntity);
        } else {
          setError("Entity not found");
        }
      } catch (err) {
        console.error("Failed to fetch entity:", err);
        setError("Failed to load entity");
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [shortId, fetchEntityByShortId]);

  const backButton = (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium group"
    >
      <span className="p-1.5 rounded-full group-hover:bg-neutral-100 transition-colors">
        <ArrowLeft size={16} />
      </span>
      <span>Back</span>
    </button>
  );

  if (loading) {
    return (
      <div className="doodle-bg min-h-screen">
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-neutral-200 min-h-screen">
          <div className="p-4 border-b border-neutral-100">{backButton}</div>
          <LoadingPlaceholder />
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="doodle-bg min-h-screen">
        <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-neutral-200 min-h-screen">
          <div className="p-4 border-b border-neutral-100">{backButton}</div>
          <div className="p-12 text-center">
            <p className="text-neutral-400 text-base mb-4">{error || "Post not found"}</p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 bg-rose-600 text-white text-sm font-medium rounded-full hover:bg-rose-500 transition-colors border border-rose-500"
            >
              Return home
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="p-4 border-b border-neutral-100">{backButton}</div>

          <EntityProvider entity={entity as Entity}>
            <Tweet
              onAuthRequired={() => setHighlightBar(true)}
              handleSelectEntity={(ent) => {
                setSelectedEntity(ent);
                setCommentSheetOpen(true);
              }}
            />
          </EntityProvider>
        </div>
      </Sheet>
    </div>
  );
}
