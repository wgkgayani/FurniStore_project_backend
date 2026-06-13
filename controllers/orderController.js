import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login and try again",
      });
    }

    const orderInfo = req.body;

    // Generate order ID
    let orderId = "CBC00001";
    const lastOrder = await Order.findOne().sort({ date: -1 });

    if (lastOrder) {
      const lastOrderId = lastOrder.orderId;
      const lastOrderNumber = parseInt(lastOrderId.replace("CBC", ""));
      orderId = "CBC" + String(lastOrderNumber + 1).padStart(5, "0");
    }

    let total = 0;
    let labelledTotal = 0;
    const products = [];

    // Validate and calculate products
    for (const item of orderInfo.products) {
      const product = await Product.findOne({ productId: item.productId });

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`,
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          message: `Product ${item.productId} is not available`,
        });
      }

      products.push({
        productInfo: {
          productId: product.productId,
          name: product.name,
          description: product.description,
          images: product.images,
          labelledPrice: product.labelledPrice,
          price: product.price,
        },
        quantity: item.quantity,
      });

      total += product.price * item.quantity;
      labelledTotal += product.labelledPrice * item.quantity;
    }

    const order = new Order({
      orderId,
      email: req.user.email,
      name: orderInfo.name || `${req.user.firstName} ${req.user.lastName}`,
      address: orderInfo.address,
      phone: orderInfo.phone,
      products,
      labelledTotal,
      total,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
}

export async function getUserOrders(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login to view orders",
      });
    }

    const orders = await Order.find({ email: req.user.email }).sort({
      date: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check if user owns the order or is admin
    if (order.email !== req.user?.email && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized to view this order",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    // Only admin can update order status
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update order status",
      });
    }

    const { orderId } = req.params;
    const { status, reason } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const previousStatus = order.status;

    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    order.statusHistory.push({
      status,
      changedAt: new Date(),
      previousStatus,
      reason: reason || "",
    });

    // Update current status
    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
}

export async function getOrderHistory(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check authorization
    if (order.email !== req.user?.email && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized to view order history",
      });
    }

    // Return status history with cancelled orders
    const history = {
      orderId: order.orderId,
      currentStatus: order.status,
      statusHistory: order.statusHistory || [],
      cancelledOrders: (order.statusHistory || [])
        .filter((h) => h.status === "cancelled")
        .map((h) => ({
          status: h.status,
          changedAt: h.changedAt,
          previousStatus: h.previousStatus,
          reason: h.reason,
          products: order.products,
          total: order.total,
          labelledTotal: order.labelledTotal,
        })),
    };

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order history",
      error: error.message,
    });
  }
}

export async function getUserCancelledOrders(req, res) {
  try {
    // Get all orders for the user
    const orders = await Order.find({ email: req.user?.email });

    if (!orders) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

    // Extract all cancelled orders from all user orders
    const allCancelledOrders = [];

    orders.forEach((order) => {
      if (order.statusHistory && order.statusHistory.length > 0) {
        order.statusHistory
          .filter((h) => h.status === "cancelled")
          .forEach((h) => {
            allCancelledOrders.push({
              orderId: order.orderId,
              status: h.status,
              changedAt: h.changedAt,
              previousStatus: h.previousStatus,
              reason: h.reason,
              products: order.products,
              total: order.total,
              labelledTotal: order.labelledTotal,
              orderDate: order.date,
            });
          });
      }
    });

    res.json({
      totalCancelled: allCancelledOrders.length,
      cancelledOrders: allCancelledOrders.sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt),
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cancelled orders",
      error: error.message,
    });
  }
}
