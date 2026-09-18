import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getFeatures } from "@/api/feature.api";
import FeatureCard from "@/components/features/FeatureCard";
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  {
    status: "planned",
    title: "Planned",
  },
  {
    status: "in_progress",
    title: "In Progress",
  },
  {
    status: "completed",
    title: "Completed",
  },
];

const Roadmap = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);

      const response = await getFeatures({
        limit: 50,
        sort: "newest",
      });

      setFeatures(response.data.features || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load roadmap.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const getColumnFeatures = (status) => {
    return features.filter((feature) => feature.status === status);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Roadmap</h1>

        <p className="mt-2 text-muted-foreground">
          See what we're planning, building, and have completed.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.status} className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const columnFeatures = getColumnFeatures(column.status);

            return (
              <section key={column.status} className="min-w-0">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{column.title}</h2>

                  <span className="text-sm text-muted-foreground">
                    {columnFeatures.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {columnFeatures.length > 0 ? (
                    columnFeatures.map((feature) => (
                      <FeatureCard key={feature._id} feature={feature} />
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No features yet.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
