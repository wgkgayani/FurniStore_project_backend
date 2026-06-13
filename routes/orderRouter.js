import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderHistory,
  getUserCancelledOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getUserOrders);
orderRouter.get("/cancelled", getUserCancelledOrders);
orderRouter.get("/:orderId", getOrderById);
orderRouter.put("/:orderId/status", updateOrderStatus);
orderRouter.get("/:orderId/history", getOrderHistory);

export default orderRouter;
