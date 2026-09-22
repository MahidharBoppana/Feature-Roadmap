import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getFeatures } from "@/api/feature.api";
import { updateFeatureStatus } from "@/api/admin.api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import CreateFeatureDialog from "@/components/features/CreateFeatureDialog";
import { deleteFeature } from "@/api/feature.api";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const STATUS_OPTIONS = [
  {
    value: "under_review",
    label: "Under Review",
  },
  {
    value: "planned",
    label: "Planned",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const AdminDashboard = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchFeatures = async () => {
    try {
      setLoading(true);

      const response = await getFeatures({
        page,
        limit: 10,
        sort: "newest",
      });

      setFeatures(response.data.features || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load features.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureUpdated = (updatedFeature) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature) =>
        feature._id === updatedFeature._id
          ? {
              ...feature,
              title: updatedFeature.title,
              description: updatedFeature.description,
              category: updatedFeature.category,
            }
          : feature,
      ),
    );
  };

  const handleDelete = async () => {
    if (!selectedFeature || deleting) return;

    setDeleting(true);

    try {
      await deleteFeature(selectedFeature._id);

      setFeatures((currentFeatures) =>
        currentFeatures.filter(
          (feature) => feature._id !== selectedFeature._id,
        ),
      );

      toast.success("Feature deleted successfully.");
      setDeleteOpen(false);
      setSelectedFeature(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete feature.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [page]);

  const handleStatusChange = async (featureId, status) => {
    setUpdatingId(featureId);

    try {
      await updateFeatureStatus(featureId, status);

      setFeatures((currentFeatures) =>
        currentFeatures.map((feature) =>
          feature._id === featureId
            ? {
                ...feature,
                status,
              }
            : feature,
        ),
      );

      toast.success("Feature status updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update feature status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status) => {
    return (
      STATUS_OPTIONS.find((option) => option.value === status)?.label || status
    );
  };

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      !search || feature.title?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || feature.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || feature.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Manage feature requests and update their roadmap status.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_OPTIONS.map((status) => {
          const count = features.filter(
            (feature) => feature.status === status.value,
          ).length;

          return (
            <Card key={status.value}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {status.label}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature list */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Requests ({features.length})</CardTitle>
        </CardHeader>

        <div className="border-b px-6 pb-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>

                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                <SelectItem value="UI/UX">UI/UX</SelectItem>
                <SelectItem value="Integrations">Integrations</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent>
          {filteredFeatures.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {features.length === 0
                ? "No feature requests found."
                : "No features match your filters."}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeatures.map((feature) => (
                <div
                  key={feature._id}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  {/* Feature information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{feature.title}</h3>

                      <Badge variant="secondary">{feature.category}</Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.author?.name || "Unknown User"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.voteCount || 0} votes
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {/* View */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/features/${feature._id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>

                    {/* Edit */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFeature(feature);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedFeature(feature);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  {/* Status change */}
                  <div className="w-full md:w-48">
                    <Select
                      value={feature.status}
                      onValueChange={(value) =>
                        handleStatusChange(feature._id, value)
                      }
                      disabled={updatingId === feature._id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      )}
      {selectedFeature && (
        <CreateFeatureDialog
          mode="edit"
          feature={selectedFeature}
          open={editOpen}
          onOpenChange={setEditOpen}
          onFeatureUpdated={handleFeatureUpdated}
        />
      )}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feature?</DialogTitle>

            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{selectedFeature?.title}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Feature"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
