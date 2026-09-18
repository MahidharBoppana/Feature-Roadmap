import { useState } from "react";
import { toast } from "sonner";

import { createComment } from "@/api/comment.api";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CommentComposer = ({
  featureId,
  parentComment = null,
  onCommentCreated,
  onCancel,
}) => {
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please login to comment.");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (content.trim().length > 2000) {
      toast.error("Comment cannot exceed 2000 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await createComment(
        featureId,
        content.trim(),
        parentComment,
      );

      setContent("");

      onCommentCreated?.(response.data.comment);

      toast.success("Comment added successfully.");

      onCancel?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={
          parentComment ? "Write a reply..." : "Share your thoughts..."
        }
        rows={4}
        disabled={loading}
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={loading}>
          {loading
            ? "Posting..."
            : parentComment
              ? "Post Reply"
              : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentComposer;
