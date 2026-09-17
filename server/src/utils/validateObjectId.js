import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

export const validateObjectId = (id, fieldName = "ID") => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};
