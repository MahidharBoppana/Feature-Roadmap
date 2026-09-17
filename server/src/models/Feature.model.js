import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Feature title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Feature description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: ["UI/UX", "Integrations", "Performance", "General"],
      required: [true, "Category is required"],
    },

    status: {
      type: String,
      enum: ["under_review", "planned", "in_progress", "completed"],
      default: "under_review",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    voteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

featureSchema.index({ author: 1 });
featureSchema.index({ status: 1 });
featureSchema.index({ category: 1 });
featureSchema.index({ createdAt: -1 });

featureSchema.index({
  title: "text",
  description: "text",
});

const Feature = mongoose.model("Feature", featureSchema);

export default Feature;
