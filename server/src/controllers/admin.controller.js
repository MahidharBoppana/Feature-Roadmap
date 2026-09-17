import Feature from "../models/Feature.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const allowedStatuses = ["under_review", "planned", "in_progress", "completed"];

const updateFeatureStatus = asyncHandler(async (req, res) => {
  const { featureId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid feature status");
  }

  const feature = await Feature.findById(featureId);

  if (!feature) {
    throw new ApiError(404, "Feature not found");
  }

  feature.status = status;

  await feature.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { feature }, "Feature status updated successfully"),
    );
});

export { updateFeatureStatus };
