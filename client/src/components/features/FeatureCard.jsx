import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigUp, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { voteFeature, unvoteFeature } from "@/api/feature.api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MarkdownContent from "@/components/comments/MarkdownContent";

const statusLabels = {
  under_review: "Under Review",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

const FeatureCard = ({ feature }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [voteCount, setVoteCount] = useState(feature.voteCount || 0);

  const [hasVoted, setHasVoted] = useState(feature.hasVoted ?? false);

  const [voting, setVoting] = useState(false);

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
  const authorName = feature.author?.name || "Unknown User";

  return (
    <Card
      className="h-full cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/features/${feature._id}`)}
    >
      <CardContent className="flex h-full flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">
            {feature.title}
          </h2>

          <Badge variant="outline" className="shrink-0">
            {statusLabels[feature.status] || feature.status}
          </Badge>
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
              {feature.voteCount}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
