import Comment from "../models/Comment.model.js";
import Feature from "../models/Feature.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { featureId } = req.params;
  const { content, parentComment } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const feature = await Feature.findById(featureId);

  if (!feature) {
    throw new ApiError(404, "Feature not found");
  }

  if (parentComment) {
    const parent = await Comment.findOne({
      _id: parentComment,
      feature: featureId,
    });

    if (!parent) {
      throw new ApiError(404, "Parent comment not found");
    }
  }

  const comment = await Comment.create({
    feature: featureId,
    author: req.user._id,
    content: content.trim(),
    parentComment: parentComment || null,
  });

  await Feature.findByIdAndUpdate(featureId, {
    $inc: {
      commentCount: 1,
    },
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    "author",
    "name",
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        comment: populatedComment,
      },
      "Comment created successfully",
    ),
  );
});

const getFeatureComments = asyncHandler(async (req, res) => {
  const { featureId } = req.params;

  const feature = await Feature.exists({
    _id: featureId,
  });

  if (!feature) {
    throw new ApiError(404, "Feature not found");
  }

  const comments = await Comment.find({
    feature: featureId,
  })
    .populate("author", "name")
    .sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
      },
      "Comments fetched successfully",
    ),
  );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const isOwner = comment.author.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to edit this comment");
  }

  comment.content = content.trim();

  await comment.save();

  const updatedComment = await Comment.findById(comment._id).populate(
    "author",
    "name",
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comment: updatedComment,
      },
      "Comment updated successfully",
    ),
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const isOwner = comment.author.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment",
    );
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { createComment };
