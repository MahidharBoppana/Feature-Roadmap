import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (user) {
      req.user = user;
    }
  } catch {
    // Invalid/expired token should not prevent public access.
  }

  next();
};
