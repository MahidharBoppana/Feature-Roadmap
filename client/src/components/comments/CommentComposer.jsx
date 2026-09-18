import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { createComment } from "@/api/comment.api";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const CommentComposer = ({
  featureId,
  parentComment = null,
  onCommentCreated,
  onCancel,
}) => {
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

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
      setPreview(false);

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
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        <Button
          type="button"
          variant={!preview ? "ghost" : "ghost"}
          size="sm"
          className={
            !preview
              ? "rounded-b-none border-b-2"
              : "rounded-b-none text-muted-foreground"
          }
          onClick={() => setPreview(false)}
        >
          Write
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={
            preview
              ? "rounded-b-none border-b-2"
              : "rounded-b-none text-muted-foreground"
          }
          onClick={() => setPreview(true)}
          disabled={!content.trim()}
        >
          Preview
        </Button>
      </div>

      {/* Editor / Preview */}
      {!preview ? (
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            parentComment
              ? "Write a reply using Markdown..."
              : "Share your thoughts using Markdown..."
          }
          rows={5}
          disabled={loading}
        />
      ) : (
        <div className="min-h-[120px] rounded-md border p-4">
          {content.trim() ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview.</p>
          )}
        </div>
      )}

      {!preview && (
        <p className="text-xs text-muted-foreground">
          Markdown is supported. Maximum 2000 characters.
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setContent("");
            setPreview(false);
            onCancel?.();
          }}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading || !content.trim()}>
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
