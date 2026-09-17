import Feature from "../models/Feature.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Feature.aggregate([
    {
      $match: {
        status: {
          $in: ["planned", "in_progress", "completed"],
        },
      },
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
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        category: 1,
        status: 1,
        voteCount: 1,
        createdAt: 1,
        updatedAt: 1,

        author: {
          _id: "$author._id",
          name: "$author.name",
        },
      },
    },

    {
      $sort: {
        voteCount: -1,
        createdAt: -1,
      },
    },
  ]);

  const result = {
    planned: [],
    in_progress: [],
    completed: [],
  };

  for (const feature of roadmap) {
    result[feature.status].push(feature);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        roadmap: result,
      },
      "Roadmap fetched successfully",
    ),
  );
});

export { getRoadmap };
