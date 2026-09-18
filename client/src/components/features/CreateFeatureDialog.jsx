import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createFeature, updateFeature } from "@/api/feature.api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const categories = ["UI/UX", "Integrations", "Performance", "General"];

const CreateFeatureDialog = ({
  onFeatureCreated,
  onFeatureUpdated,
  mode = "create",
  feature = null,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const isEditMode = mode === "edit";

  const [internalOpen, setInternalOpen] = useState(false);

  const open = isEditMode ? controlledOpen : internalOpen;

  const setOpen = (value) => {
    if (isEditMode) {
      controlledOnOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (isEditMode && feature) {
      setFormData({
        title: feature.title || "",
        description: feature.description || "",
        category: feature.category || "General",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "General",
      });
    }

    setPreview(false);
  }, [open, isEditMode, feature]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
    });

    setPreview(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      toast.error("Feature title is required.");
      return;
    }

    if (title.length < 5) {
      toast.error("Title must be at least 5 characters.");
      return;
    }

    if (!description) {
      toast.error("Feature description is required.");
      return;
    }

    if (description.length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditMode) {
        response = await updateFeature(feature._id, {
          title,
          description,
          category: formData.category,
        });

        toast.success(response.message || "Feature updated successfully.");

        onFeatureUpdated?.(response.data.feature);
      } else {
        response = await createFeature({
          title,
          description,
          category: formData.category,
        });

        toast.success(
          response.message || "Feature request created successfully.",
        );

        onFeatureCreated?.(response.data.feature);
      }

      resetForm();
      setOpen(false);
    } catch (error) {
      if (error.isAuthError || error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");

        setOpen(false);
        resetForm();
        return;
      }

      toast.error(
        error.response?.data?.message ||
          `Unable to ${isEditMode ? "update" : "create"} feature request.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button>Create Feature</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit feature request" : "Create a feature request"}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Update your feature request. Markdown is supported."
              : "Tell the community what feature you'd like to see. You can use Markdown in the description."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              name="title"
              placeholder="Example: Add dark mode"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              required
            />

            <p className="text-xs text-muted-foreground">
              {formData.title.length}/150
            </p>
          </div>

          {/* Description */}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            {/* Write / Preview */}

            <div className="flex items-center gap-1 border-b">
              <Button
                type="button"
                variant="ghost"
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
                disabled={!formData.description.trim()}
              >
                Preview
              </Button>
            </div>

            {!preview ? (
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your feature request using Markdown..."
                rows={7}
              />
            ) : (
              <div className="min-h-[180px] rounded-md border p-4">
                {formData.description.trim() ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {formData.description}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nothing to preview.
                  </p>
                )}
              </div>
            )}

            {!preview && (
              <p className="text-xs text-muted-foreground">
                Markdown is supported. Minimum 10 characters.
              </p>
            )}
          </div>

          {/* Category */}

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Feature"
                : "Create Feature"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeatureDialog;
