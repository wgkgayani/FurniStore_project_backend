import express from "express";
import Order from "../models/order.js";
import User from "../models/user.js";
import { isAdmin } from "../controllers/userController.js";

const router = express.Router();

// Middleware to check if user is admin
router.use((req, res, next) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }
  next();
});

// Order routes
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

router.patch("/orders/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true },
    );
    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// User routes
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

router.patch("/users/:userId/block", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
});

router.patch("/users/:userId/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true },
    ).select("-password");
    res.json({
      message: "User role updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user role",
      error: error.message,
    });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

export default router;
