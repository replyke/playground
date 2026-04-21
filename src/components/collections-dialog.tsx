import { useState } from "react";
import { useEntity, useCollections } from "@replyke/react-js";
import type { Collection } from "@replyke/react-js";
import {
  Plus,
  Check,
  ChevronRight,
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface CollectionsDialogProps {
  setIsEntitySaved: (saved: boolean) => void;
}

function CollectionsDialog({ setIsEntitySaved }: CollectionsDialogProps) {
  const {
    createCollection,
    deleteCollection,
    updateCollection,
    subCollections,
    openCollection,
    goBack,
    currentCollection,
    isEntitySaved,
    addToCollection,
    removeFromCollection,
  } = useCollections();

  const { entity } = useEntity();

  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Collection | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    setIsCreatingCollection(true);
    try {
      await createCollection({ collectionName: newCollectionName.trim() });
      setNewCollectionName("");
    } catch (error) {
      console.error("Failed to create collection:", error);
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleAddToCollection = async (entityId: string) => {
    try {
      setIsSaving(true);
      await addToCollection({ entityId });
      setIsEntitySaved(true);
    } catch (error) {
      console.error("Failed to add to collection:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromCollection = async (entityId: string) => {
    try {
      await removeFromCollection({ entityId });
    } catch (error) {
      console.error("Failed to remove from collection:", error);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection.id);
    setEditName(collection.name);
  };

  const handleSaveEdit = async (collectionId: string) => {
    if (!editName.trim()) return;

    try {
      await updateCollection({ collectionId, update: { name: editName.trim() } });
      setEditingCollection(null);
      setEditName("");
    } catch (error) {
      console.error("Failed to update collection:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
    setEditName("");
  };

  const handleDeleteCollection = async (collection: Collection) => {
    try {
      await deleteCollection({ collection });
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  return (
    <div className="space-y-4">
      {currentCollection && currentCollection.parentId && (
        <div className="flex items-center pb-3 border-b">
          <Button size="sm" variant="ghost" onClick={goBack} className="h-8 px-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} className="mr-1" />
            {currentCollection.name}
          </Button>
        </div>
      )}

      {currentCollection && entity?.id && (
        <div className="pb-3 border-b">
          <Button
            onClick={async () => {
              const result = await isEntitySaved({ entityId: entity.id });
              if (result.inSpecificCollection) {
                handleRemoveFromCollection(entity.id);
              } else {
                handleAddToCollection(entity.id);
              }
            }}
            variant="outline"
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
                Saving..
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Save to {currentCollection.name}
              </>
            )}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {!currentCollection && <h3 className="font-medium text-gray-900">My Collections</h3>}

        {subCollections && subCollections.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {subCollections.map((collection) => {
              const isEditing = editingCollection === collection.id;

              return (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {isEditing ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(collection.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(collection.id)} disabled={!editName.trim()}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                        onClick={() => openCollection(collection)}
                      >
                        <span className="font-medium text-gray-900">{collection.name}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditCollection(collection)}>
                            <Edit size={14} className="mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(collection)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">No collections yet</div>
            <div className="text-sm">Create your first collection below</div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t flex items-center gap-2">
        <Input
          placeholder="New collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
          className="flex-1"
        />
        <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim() || isCreatingCollection} size="sm">
          {isCreatingCollection ? "Creating..." : <Plus size={16} />}
        </Button>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Collection</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => handleDeleteCollection(deleteConfirm!)} variant="destructive" className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionsDialog;
