import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowBigUp, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { getFeatureById, voteFeature, unvoteFeature } from "@/api/feature.api";
import CommentList from "@/components/comments/CommentList";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownContent from "@/components/comments/MarkdownContent";

const statusLabels = {
  under_review: "Under Review",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

const FeatureDetails = () => {
  const { featureId } = useParams();
  const { isAuthenticated } = useAuth();

  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fetchFeature = async () => {
    try {
      setLoading(true);

      const response = await getFeatureById(featureId);

      setFeature(response.data.feature);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load feature request.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeature();
  }, [featureId]);

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to vote.");
      return;
    }

    if (voting) return;

    const previousVoteState = {
      voteCount: feature.voteCount,
      hasVoted: feature.hasVoted,
    };

    const nextHasVoted = !feature.hasVoted;

    setFeature((previous) => ({
      ...previous,
      hasVoted: nextHasVoted,
      voteCount: previous.voteCount + (nextHasVoted ? 1 : -1),
    }));

    setVoting(true);

    try {
      const response = feature.hasVoted
        ? await unvoteFeature(featureId)
        : await voteFeature(featureId);

      setFeature((previous) => ({
        ...previous,
        voteCount: response.data.voteCount,
        hasVoted: response.data.hasVoted,
      }));
    } catch (error) {
      setFeature((previous) => ({
        ...previous,
        ...previousVoteState,
      }));

      toast.error(
        error.response?.data?.message || "Unable to update your vote.",
      );
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-8 h-10 w-3/4" />
        <Skeleton className="mt-4 h-24 w-full" />
        <Skeleton className="mt-6 h-10 w-32" />
      </main>
    );
  }

  if (!feature) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Feature request not found</h1>

        <Button asChild className="mt-6">
          <Link to="/features">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Features
          </Link>
        </Button>
      </main>
    );
  }

  const authorName = feature.author?.name || "Unknown User";

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/features">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Features
        </Link>
      </Button>

      {/* Feature */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {feature.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{feature.category}</Badge>

                <Badge variant="outline">
                  {statusLabels[feature.status] || feature.status}
                </Badge>
              </div>
            </div>

            {/* Vote */}
            <Button
              variant={feature.hasVoted ? "default" : "outline"}
              onClick={handleVote}
              disabled={voting}
              className="shrink-0 gap-2"
            >
              <ArrowBigUp className="h-4 w-4" />

              {feature.hasVoted ? "Upvoted" : "Upvote"}

              <span>{feature.voteCount}</span>
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold">Description</h2>

            <div className="mt-3">
              <MarkdownContent content={feature.description} />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span>
              Created by{" "}
              <span className="font-medium text-foreground">{authorName}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              {feature.commentCount || 0} comments
            </span>

            <span>
              {new Date(feature.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Discussion */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Discussion</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Share your thoughts and discuss this feature request.
          </p>
        </div>

        <CommentList
          featureId={featureId}
          onCommentCountChange={(updateCount) => {
            setFeature((previous) => ({
              ...previous,
              commentCount:
                typeof updateCount === "function"
                  ? updateCount(previous.commentCount || 0)
                  : updateCount,
            }));
          }}
        />
      </section>
    </main>
  );
};

export default FeatureDetails;
