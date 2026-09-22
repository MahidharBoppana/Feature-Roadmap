import { useState } from "react";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { updateComment, deleteComment } from "@/api/comment.api";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CommentComposer from "./CommentComposer";
import MarkdownContent from "./MarkdownContent";

const CommentItem = ({
  comment,
  featureId,
  replies,
  getReplies,
  onCommentUpdated,
  onCommentDeleted,
  onReplyCreated,
  depth = 0,
}) => {
  const { user } = useAuth();

  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const isOwner = user?.id?.toString() === comment.author?._id?.toString();

  const isAdmin = user?.role === "admin";

  const canModify = isOwner || isAdmin;

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (editContent.trim().length > 2000) {
      toast.error("Comment cannot exceed 2000 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateComment(comment._id, editContent.trim());

      onCommentUpdated?.(response.data.comment);

      setEditing(false);

      toast.success("Comment updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update comment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);

      const response = await deleteComment(comment._id);

      onCommentDeleted?.(response.data.deletedIds);

      toast.success("Comment deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete comment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex min-w-0 gap-2 sm:gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="break-words text-sm font-medium">
                {comment.author?.name || "Unknown User"}
              </span>

              <span className="ml-1 block text-xs text-muted-foreground sm:ml-2 sm:inline">
                {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {canModify && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditContent(comment.content);
                      setEditing(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Content */}
          {editing ? (
            <div className="mt-3 space-y-2">
              <Textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                rows={3}
                disabled={saving}
              />

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2 min-w-0 max-w-full overflow-hidden break-words">
              <MarkdownContent content={comment.content} />
            </div>
          )}

          {/* Reply */}
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 gap-2 px-2"
              onClick={() => setReplying((value) => !value)}
            >
              <MessageCircle className="h-4 w-4" />
              Reply
            </Button>
          )}

          {replying && (
            <div className="mt-3 min-w-0 max-w-full">
              <CommentComposer
                featureId={featureId}
                parentComment={comment._id}
                onCommentCreated={onReplyCreated}
                onCancel={() => setReplying(false)}
              />
            </div>
          )}

          {/* Recursive replies */}
          {replies?.length > 0 && (
            <div className="mt-5 ml-2 space-y-5 border-l pl-3 sm:ml-4 sm:pl-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  featureId={featureId}
                  replies={getReplies(reply._id)}
                  getReplies={getReplies}
                  onCommentUpdated={onCommentUpdated}
                  onCommentDeleted={onCommentDeleted}
                  onReplyCreated={onReplyCreated}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
