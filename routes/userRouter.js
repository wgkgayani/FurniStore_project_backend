import express from "express";
import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  getCart,
  updateCart,
  clearCart,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.put("/profile", updateProfile);
userRouter.get("/cart", verifyToken, getCart);
userRouter.put("/cart", verifyToken, updateCart);
userRouter.delete("/cart", verifyToken, clearCart);

export default userRouter;
