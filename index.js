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
// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:3003",
  "https://furni-store-project-frontend-ubx1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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


app.use("/users", userRouter);
app.use(authMiddleware);

app.use("/products", productRouter);

app.use("/orders", orderRouter);

// Admin routes
app.use("/admin", adminRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
