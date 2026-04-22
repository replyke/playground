import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Entity, useUser } from "@replyke/react-js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ThreadedCommentSection } from "./comments-threaded";
import { SocialCommentSection } from "./comments-social";

interface CommentSectionSheetProps {
  entity: Entity | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthRequired: () => void;
}

function CommentSectionSheet({
  entity,
  open,
  onOpenChange,
  onAuthRequired,
}: CommentSectionSheetProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [highlightedCommentId, setHighlightedCommentId] = useState<
    string | null
  >(null);

  const callbacks = useMemo(
    () => ({
      loginRequiredCallback: onAuthRequired,
      otherUserClickCallback: (userId: string) => {
        navigate("/u/" + userId);
      },
      currentUserClickCallback: () => {
        if (user) navigate("/u/" + user.id);
      },
    }),
    [],
  );

  useEffect(() => {
    const commentId = searchParams.get("commentId");
    if (commentId) {
      onOpenChange(true);
      setHighlightedCommentId(commentId);
    }
  }, [searchParams]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white flex flex-col">
        <Tabs defaultValue="threaded" className="flex-1">
          <SheetHeader className="border-b border-gray-300">
            <VisuallyHidden>
              <SheetTitle>Comment section</SheetTitle>
              <SheetDescription>
                Users can leave comments on this sandbox
              </SheetDescription>
            </VisuallyHidden>
            <TabsList>
              <TabsTrigger value="threaded">Threaded style</TabsTrigger>
              <TabsTrigger value="social">Social style</TabsTrigger>
            </TabsList>
          </SheetHeader>
          <TabsContent value="threaded" className="p-2">
            <ThreadedCommentSection
              entity={entity as Entity | null}
              highlightedCommentId={highlightedCommentId ?? undefined}
              callbacks={callbacks}
            />
          </TabsContent>
          <TabsContent value="social">
            <SocialCommentSection
              entity={entity as Entity | null}
              highlightedCommentId={highlightedCommentId ?? undefined}
              callbacks={callbacks}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default CommentSectionSheet;
