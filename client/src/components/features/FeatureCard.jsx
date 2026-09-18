import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigUp, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { voteFeature, unvoteFeature, deleteFeature } from "@/api/feature.api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MarkdownContent from "@/components/comments/MarkdownContent";
import CreateFeatureDialog from "./CreateFeatureDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusLabels = {
  under_review: "Under Review",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

const FeatureCard = ({ feature, onFeatureUpdated, onFeatureDeleted }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [voteCount, setVoteCount] = useState(feature.voteCount || 0);

  const [hasVoted, setHasVoted] = useState(feature.hasVoted ?? false);

  const [voting, setVoting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id?.toString() === feature.author?._id?.toString();

  const isAdmin = user?.role === "admin";

  const canModify = isOwner || isAdmin;

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to vote.");

      navigate("/login", {
        state: {
          from: {
            pathname: "/",
          },
        },
      });

      return;
    }

    if (voting) return;

    const previousVoteCount = voteCount;
    const previousHasVoted = hasVoted;

    // Optimistic update
    setHasVoted(!hasVoted);
    setVoteCount((current) => (hasVoted ? current - 1 : current + 1));

    setVoting(true);

    try {
      const response = hasVoted
        ? await unvoteFeature(feature._id)
        : await voteFeature(feature._id);

      setVoteCount(response.data.voteCount);
      setHasVoted(response.data.hasVoted);
    } catch (error) {
      setVoteCount(previousVoteCount);
      setHasVoted(previousHasVoted);

      toast.error(
        error.response?.data?.message || "Unable to update your vote.",
      );
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      await deleteFeature(feature._id);

      toast.success("Feature deleted successfully");

      setDeleteOpen(false);

      onFeatureDeleted?.(feature._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete feature.");
    } finally {
      setDeleting(false);
    }
  };

  const authorName = feature.author?.name || "Unknown User";

  return (
    <>
      <Card
        className="h-full cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => navigate(`/features/${feature._id}`)}
      >
        <CardContent className="flex h-full flex-col p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">
                {feature.title}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="outline">
                {statusLabels[feature.status] || feature.status}
              </Badge>

              {canModify && (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-3">
            <div className="max-h-24 overflow-hidden text-sm text-muted-foreground">
              <MarkdownContent
                content={feature.description}
                className="prose-p:my-1 prose-headings:my-1 prose-ul:my-1"
              />
            </div>

            <Button
              variant="link"
              size="sm"
              className="mt-2 h-auto px-0 font-bold"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/features/${feature._id}`);
              }}
            >
              View more
            </Button>
          </div>
          {/* Category */}
          <div className="mt-4">
            <Badge variant="secondary">{feature.category}</Badge>
          </div>

          <div className="mt-auto pt-5">
            <Separator />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0 text-sm text-muted-foreground">
                <p className="truncate">{authorName}</p>

                <div className="mt-1 flex items-center gap-3">
                  <span>
                    {new Date(feature.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {feature.commentCount || 0}
                  </span>
                </div>
              </div>

              {/* Upvote */}
              <Button
                variant={hasVoted ? "default" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote();
                }}
              >
                <ArrowBigUp className="mr-1 h-4 w-4" />
                {voteCount}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {canModify && (
        <CreateFeatureDialog
          mode="edit"
          feature={feature}
          open={editOpen}
          onOpenChange={setEditOpen}
          onFeatureUpdated={onFeatureUpdated}
        />
      )}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete feature request?</DialogTitle>

            <DialogDescription>
              This action cannot be undone. This feature request and its
              associated discussions will be deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Feature"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeatureCard;
