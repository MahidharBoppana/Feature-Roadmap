import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    feature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({
  feature: 1,
  createdAt: -1,
});

commentSchema.index({
  parentComment: 1,
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
