import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getFeatureComments } from "@/api/feature.api";

import CommentItem from "./CommentItem";
import CommentComposer from "./CommentComposer";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CommentList = ({ featureId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await getFeatureComments(featureId);

      setComments(response.data.comments);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [featureId]);

  const handleCommentCreated = (comment) => {
    setComments((previous) => [...previous, comment]);

    onCommentCountChange?.((count) => count + 1);
  };

  const handleReplyCreated = (reply) => {
    setComments((previous) => [...previous, reply]);

    onCommentCountChange?.((count) => count + 1);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((previous) =>
      previous.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment,
      ),
    );
  };

  const handleCommentDeleted = (deletedIds) => {
    setComments((previous) =>
      previous.filter((comment) => !deletedIds.includes(comment._id)),
    );

    onCommentCountChange?.((count) => Math.max(0, count - deletedIds.length));
  };

  const getReplies = (parentId) => {
    return comments.filter(
      (comment) =>
        comment.parentComment === parentId ||
        comment.parentComment?._id === parentId,
    );
  };

  const rootComments = comments.filter((comment) => !comment.parentComment);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* New comment */}
        <CommentComposer
          featureId={featureId}
          onCommentCreated={handleCommentCreated}
        />

        <Separator className="my-6" />

        {/* Comments */}
        {rootComments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the discussion.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                featureId={featureId}
                replies={getReplies(comment._id)}
                getReplies={getReplies}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
                onReplyCreated={handleReplyCreated}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentList;
