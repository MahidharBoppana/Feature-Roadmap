import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { getMyFeatures } from "@/api/user.api";

import FeatureCard from "@/components/features/FeatureCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user } = useAuth();

  const [features, setFeatures] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 6;

  const fetchMyFeatures = async () => {
    try {
      setLoading(true);

      const response = await getMyFeatures({
        page,
        limit,
      });

      setFeatures(response.data.features);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load your feature requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFeatures();
  }, [page]);

  const handleFeatureUpdated = (updatedFeature) => {
    setFeatures((current) =>
      current.map((feature) =>
        feature._id === updatedFeature._id
          ? {
              ...feature,
              ...updatedFeature,
            }
          : feature,
      ),
    );
  };

  const handleFeatureDeleted = (featureId) => {
    setFeatures((current) =>
      current.filter((feature) => feature._id !== featureId),
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <h1 className="text-2xl font-semibold">{user?.name}</h1>

          <p className="text-muted-foreground">{user?.email}</p>

          {user?.createdAt && (
            <p className="mt-2 text-sm text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Feature Requests */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">My Feature Requests</h2>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : features.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No feature requests yet</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                You haven't created any feature requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <FeatureCard
                key={feature._id}
                feature={feature}
                onFeatureUpdated={handleFeatureUpdated}
                onFeatureDeleted={handleFeatureDeleted}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
};

export default Profile;
