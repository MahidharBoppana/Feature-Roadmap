import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check Route

app.use("/api/v1/healthcheck", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Feature Roadmap API is running" });
});

// Routes

import authRoutes from "./routes/auth.routes.js";
import featureRoutes from "./routes/feature.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/features", featureRoutes);

// Global Error Middleware
app.use(errorMiddleware);

export default app;
