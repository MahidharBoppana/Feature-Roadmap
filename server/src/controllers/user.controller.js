import Feature from "../models/Feature.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getMyFeatures = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
    50,
  );

  const skip = (page - 1) * limit;

  const [features, total] = await Promise.all([
    Feature.aggregate([
      {
        $match: {
          author: req.user._id,
        },
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
          hasVoted: {
            $in: [req.user._id, "$votes"],
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
        $sort: {
          createdAt: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },

      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          status: 1,
          votes: 1,
          voteCount: 1,
          hasVoted: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            _id: 1,
            name: 1,
          },
        },
      },
    ]),

    Feature.countDocuments({
      author: req.user._id,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        features,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      "Your features fetched successfully",
    ),
  );
});
