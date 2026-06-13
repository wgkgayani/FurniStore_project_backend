import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  },
  labelledTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  products: [
    {
      productInfo: {
        productId: String,
        name: String,
        description: String,
        images: [String],
        labelledPrice: Number,
        price: Number,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
      previousStatus: String,
      reason: String,
    },
  ],
});

const Order = mongoose.model("orders", orderSchema);
export default Order;
