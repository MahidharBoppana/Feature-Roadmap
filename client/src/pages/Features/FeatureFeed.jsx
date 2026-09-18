import { useEffect, useState } from "react";
import { getFeatures } from "@/api/feature.api";
import { toast } from "sonner";
import FeatureCard from "@/components/features/FeatureCard";
import CreateFeatureDialog from "@/components/features/CreateFeatureDialog";
import FeatureFilters from "@/components/features/FeatureFilters";
import { Skeleton } from "@/components/ui/skeleton";

const FeatureFeed = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const fetchFeatures = async () => {
    try {
      setLoading(true);

      const response = await getFeatures({
        page: 1,
        limit: 10,
        sort,
        category: category || undefined,
        status: status || undefined,
        search: search.trim() || undefined,
      });

      setFeatures(response.data.features);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load feature requests.",
      );
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

  const handleFeatureDeleted = (featureId) => {
    setFeatures((currentFeatures) =>
      currentFeatures.filter((feature) => feature._id !== featureId),
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFeatures();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search, sort, category, status]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Feature Requests
          </h1>

          <p className="mt-2 text-muted-foreground">
            Share ideas, vote for features, and help shape what we build next.
          </p>
        </div>

        <CreateFeatureDialog
          onFeatureCreated={(feature) => {
            setFeatures((previous) => [feature, ...previous]);
          }}
        />
      </div>

      {/* Filters */}
      <FeatureFilters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
      />

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-4 h-20 w-full" />
              <Skeleton className="mt-5 h-4 w-24" />
              <Skeleton className="mt-6 h-px w-full" />
              <Skeleton className="mt-4 h-8 w-full" />
            </div>
          ))}
        </div>
      ) : features.length === 0 ? (
        <div className="rounded-xl border py-20 text-center">
          <h2 className="text-lg font-semibold">No feature requests found</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
    </main>
  );
};

export default FeatureFeed;
