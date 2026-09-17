import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      err?.statusCode || 500,
      err?.message || "Internal server error",
      err?.errors || [],
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    errors: error.errors || [],
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default errorHandler;
