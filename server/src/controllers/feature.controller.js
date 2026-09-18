import mongoose from "mongoose";
import Feature from "../models/Feature.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const allowedCategories = ["UI/UX", "Integrations", "Performance", "General"];

const allowedStatuses = ["under_review", "planned", "in_progress", "completed"];

const allowedSorts = ["upvoted", "discussed", "newest"];

const createFeature = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    throw new ApiError(400, "Title, description and category are required");
  }

  const feature = await Feature.create({
    title,
    description,
    category,
    author: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        feature,
      },
      "Feature request created successfully",
    ),
  );
});

const getFeatures = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    status,
    sort = "newest",
    search,
  } = req.query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  if (!Number.isInteger(currentPage) || currentPage < 1) {
    throw new ApiError(400, "Page must be a positive integer");
  }

  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 50) {
    throw new ApiError(400, "Limit must be an integer between 1 and 50");
  }

  if (category && !allowedCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  if (!allowedSorts.includes(sort)) {
    throw new ApiError(400, "Invalid sort option");
  }

  const skip = (currentPage - 1) * perPage;

  //   Filtering

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  //   Search

  if (search?.trim()) {
    filter.$text = {
      $search: search.trim(),
    };
  }

  //   Sorting

  let sortOption = {};

  switch (sort) {
    case "upvoted":
      sortOption = { voteCount: -1, createdAt: -1 };
      break;

    case "discussed":
      sortOption = { commentCount: -1, createdAt: -1 };
      break;

    case "newest":
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  //   Query

  const [features, totalFeatures] = await Promise.all([
    Feature.aggregate([
      {
        $match: filter,
      },

      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "feature",
          as: "comments",
        },
      },

      {
        $addFields: {
          commentCount: {
            $size: "$comments",
          },
        },
      },

      {
        $sort: sortOption,
      },

      {
        $skip: skip,
      },

      {
        $limit: perPage,
      },

      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },

      {
        $unwind: "$author",
      },

      {
        $addFields: {
          hasVoted: req.user ? { $in: [req.user._id, "$votes"] } : false,
        },
      },

      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          hasVoted: 1,
          voteCount: 1,
          commentCount: 1,

          author: {
            _id: "$author._id",
            name: "$author.name",
          },
        },
      },
    ]),

    Feature.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalFeatures / perPage);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        features,

        pagination: {
          currentPage,
          perPage,
          totalFeatures,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        },
      },
      "Features fetched successfully",
    ),
  );
});

const getFeatureById = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  validateObjectId(featureId, "feature ID");

  const feature = await Feature.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(featureId),
      },
    },

    // Get comments for this feature
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "feature",
        as: "comments",
      },
    },

    // Calculate comment count
    {
      $addFields: {
        commentCount: {
          $size: "$comments",
        },

        hasVoted: req.user
          ? {
              $in: [req.user._id, "$votes"],
            }
          : false,
      },
    },

    // Get author
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },

    {
      $unwind: "$author",
    },

    {
      $project: {
        title: 1,
        description: 1,
        category: 1,
        status: 1,
        voteCount: 1,
        hasVoted: 1,
        commentCount: 1,
        createdAt: 1,
        updatedAt: 1,

        author: {
          _id: "$author._id",
          name: "$author.name",
        },
      },
    },
  ]);

  if (!feature.length) {
    throw new ApiError(404, "Feature not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feature: feature[0],
      },
      "Feature fetched successfully",
    ),
  );
});

const updateFeature = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  const { title, description, category } = req.body;

  validateObjectId(featureId, "feature ID");

  const feature = await Feature.findById(featureId);

  if (!feature) {
    throw new ApiError(404, "Feature not found");
  }

  const isOwner = feature.author.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to update this feature",
    );
  }

  if (title !== undefined) feature.title = title;
  if (description !== undefined) feature.description = description;
  if (category !== undefined) feature.category = category;

  await feature.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feature,
      },
      "Feature updated successfully",
    ),
  );
});

const deleteFeature = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  validateObjectId(featureId, "feature ID");

  const feature = await Feature.findById(featureId);

  if (!feature) {
    throw new ApiError(404, "Feature not found");
  }

  const isOwner = feature.author.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to delete this feature",
    );
  }

  await feature.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Feature deleted successfully"));
});

const voteFeature = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  validateObjectId(featureId, "feature ID");

  const feature = await Feature.findOneAndUpdate(
    {
      _id: featureId,
      votes: {
        $ne: req.user._id,
      },
    },
    {
      $addToSet: {
        votes: req.user._id,
      },

      $inc: {
        voteCount: 1,
      },
    },
    {
      new: true,
    },
  );

  if (!feature) {
    const existingFeature = await Feature.findById(featureId);

    if (!existingFeature) {
      throw new ApiError(404, "Feature not found");
    }

    throw new ApiError(409, "You have already voted for this feature");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        voteCount: feature.voteCount,
        hasVoted: true,
      },
      "Feature upvoted successfully",
    ),
  );
});

const unvoteFeature = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  validateObjectId(featureId, "feature ID");

  const feature = await Feature.findOneAndUpdate(
    {
      _id: featureId,
      votes: req.user._id,
    },
    {
      $pull: {
        votes: req.user._id,
      },

      $inc: {
        voteCount: -1,
      },
    },
    {
      new: true,
    },
  );

  if (!feature) {
    const existingFeature = await Feature.findById(featureId);

    if (!existingFeature) {
      throw new ApiError(404, "Feature not found");
    }

    throw new ApiError(409, "You have not voted for this feature");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        voteCount: feature.voteCount,
        hasVoted: false,
      },
      "Vote removed successfully",
    ),
  );
});

export {
  createFeature,
  getFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
  voteFeature,
  unvoteFeature,
};
