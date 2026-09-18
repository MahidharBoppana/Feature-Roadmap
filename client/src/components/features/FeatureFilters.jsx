import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const FeatureFilters = ({
  search,
  setSearch,
  sort,
  setSort,
  category,
  setCategory,
  status,
  setStatus,
}) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search feature requests..."
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="upvoted">Most Upvoted</SelectItem>
            <SelectItem value="discussed">Most Discussed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={category || "all"}
          onValueChange={(value) => setCategory(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="UI/UX">UI/UX</SelectItem>
            <SelectItem value="Integrations">Integrations</SelectItem>
            <SelectItem value="Performance">Performance</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status || "all"}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FeatureFilters;
