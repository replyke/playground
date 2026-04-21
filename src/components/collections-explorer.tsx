import { useState } from "react";
import { Link } from "react-router-dom";
import { useCollections, useCollectionEntitiesWrapper } from "@replyke/react-js";
import type { Entity } from "@replyke/react-js";
import {
  ArrowLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { Button } from "../components/ui/button";

function EntitySkeleton() {
  return (
    <div className="flex items-start space-x-2 p-2 rounded-md border animate-pulse">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center space-x-3">
          <div className="h-2.5 bg-gray-200 rounded w-8" />
          <div className="h-2.5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function CollectionsExplorer() {
  const { subCollections, openCollection, goBack, currentCollection, removeFromCollection } = useCollections();
  const { entities, loading: loadingEntities } = useCollectionEntitiesWrapper({});
  const [confirmingRemoveId, setConfirmingRemoveId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleRemoveFromCollection = async (entityId: string) => {
    try {
      setRemoving(true);
      await removeFromCollection({ entityId });
      setConfirmingRemoveId(null);
    } catch (error) {
      console.error("Failed to remove from collection:", error);
    } finally {
      setRemoving(false);
    }
  };

  const collections = subCollections || [];

  return (
    <div className="space-y-3">
      {currentCollection && (
        <div className="pb-2 border-b">
          <div className="flex items-center space-x-2">
            {currentCollection.parentId && (
              <Button
                size="sm"
                variant="ghost"
                onClick={goBack}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={14} />
              </Button>
            )}
            <h2 className="text-base font-medium text-gray-900">
              {currentCollection.name === "root" ? "Root" : currentCollection.name}
            </h2>
            {!loadingEntities && (
              <span className="text-xs text-gray-500">
                {entities.length} {entities.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {collections.length > 0 ? (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {collections.map((list) => (
              <div
                key={list.id}
                className="flex items-center justify-between px-3 py-2 rounded-md border hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openCollection(list)}
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{list.name}</span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <FolderOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <div className="text-xs">No collections yet</div>
          </div>
        )}
      </div>

      {currentCollection && (
        <div className="space-y-2 pt-3 border-t">
          {loadingEntities ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <EntitySkeleton />
              <EntitySkeleton />
            </div>
          ) : entities.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {entities.map((entity) => {
                const isConfirming = confirmingRemoveId === entity.id;
                return (
                  <div
                    key={entity.id}
                    className="flex items-start space-x-2 p-2 rounded-md border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {entity.content && entity.content.length > 80
                              ? entity.content.substring(0, 80) + "..."
                              : entity.content}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1.5">
                            <Link
                              to={"/e/" + entity.shortId}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            >
                              <ExternalLink size={10} />
                              <span>View</span>
                            </Link>
                            {entity.createdAt && (
                              <span className="text-xs text-gray-400">
                                {new Date(entity.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {isConfirming ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setConfirmingRemoveId(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                              disabled={removing}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleRemoveFromCollection(entity.id)}
                              className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors disabled:opacity-50"
                              disabled={removing}
                            >
                              {removing ? "..." : "Remove"}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmingRemoveId(entity.id)}
                            className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded transition-colors shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="text-xs">No items in this collection</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollectionsExplorer;
