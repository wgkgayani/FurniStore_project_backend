import "dotenv/config"; // Add at top
import express from "express";
import bodyParser from "body-parser"; // body-parser use to parse json data (to create data well structur)
import mongoose from "mongoose"; //import mongoose to connect mongodb
import cors from "cors";

import authMiddleware from "./middleware/auth.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import jwt from "jsonwebtoken"; //import jwt from "jsonwebtoken";
// Admin routes
import adminRouter from "./routes/adminRoutes.js"; // Add this

const app = express(); //create express app

// Use environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add CORS middleware at the top
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3003", // Your frontend URL
    credentials: true,
  }),
);

app.use(bodyParser.json()); //to parse json data

// Use auth middleware
app.use(authMiddleware);

//
//
// use routes

app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
//
//add admin routes
app.use("/admin", adminRouter); // Add this
//
//

//nodemon - to automatically restart server on code changes
