import { useState } from "react";
import { toast } from "sonner";

import { createFeature } from "@/api/feature.api";

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

const categories = ["UI/UX", "Integrations", "Performance", "General"];

const CreateFeatureDialog = ({ onFeatureCreated }) => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const [loading, setLoading] = useState(false);

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Feature title is required.");
      return;
    }

    if (formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Feature description is required.");
      return;
    }

    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await createFeature({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
      });

      toast.success(
        response.message || "Feature request created successfully.",
      );

      resetForm();
      setOpen(false);

      onFeatureCreated?.(response.data.feature);
    } catch (error) {
      if (error.isAuthError || error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");

        setOpen(false);
        resetForm();

        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to create feature request.",
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
      <DialogTrigger asChild>
        <Button>Create Feature</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a feature request</DialogTitle>

          <DialogDescription>
            Tell the community what feature you'd like to see. You can use
            Markdown in the description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              placeholder="Describe the feature you would like to see..."
              value={formData.description}
              onChange={handleChange}
              rows={7}
              maxLength={5000}
              required
            />

            <p className="text-xs text-muted-foreground">Markdown supported.</p>
          </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Feature"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeatureDialog;
