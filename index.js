import "dotenv/config"; // Add at top
import express from "express";
import bodyParser from "body-parser"; // body-parser use to parse json data (to create data well structur)
import mongoose from "mongoose"; //import mongoose to connect mongodb
import cors from "cors";
import jwt from "jsonwebtoken"; //import jwt from "jsonwebtoken";

import authMiddleware from "./middleware/auth.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
// Admin routes
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      "https://furni-store-project-frontend-ubx1.vercel.app", // Your frontend URL
    credentials: true,
  }),
);

app.use(bodyParser.json()); //to parse json data

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running Successfully 🚀",
  });
});

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Routes
app.use(authMiddleware);

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Admin routes
app.use("/api/admin", adminRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
