import mongoose from "mongoose";
import Product from "./models/product.js";
import "dotenv/config";

const sampleProducts = [
  {
    productId: "FURN001",
    name: "Modern Leather Sofa",
    description: "Comfortable 3-seater leather sofa with wooden legs",
    images: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25"],
    labelledPrice: 899,
    price: 699,
    stock: 15,
    category: "Sofas",
    isAvailable: true,
  },
  {
    productId: "FURN002",
    name: "Wooden Bed Frame",
    description: "Queen size wooden bed frame with storage",
    images: ["https://images.unsplash.com/photo-1505693314967-38190dae0ff0"],
    labelledPrice: 599,
    price: 449,
    stock: 10,
    category: "Beds",
    isAvailable: true,
  },
  {
    productId: "FURN003",
    name: "Dining Table",
    description: "6-seater wooden dining table with marble top",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16ebc5"],
    labelledPrice: 799,
    price: 549,
    stock: 8,
    category: "Tables",
    isAvailable: true,
  },
  {
    productId: "FURN004",
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support",
    images: ["https://images.unsplash.com/photo-1597196635267-b03b0a774382"],
    labelledPrice: 349,
    price: 249,
    stock: 20,
    category: "Chairs",
    isAvailable: true,
  },
  {
    productId: "FURN005",
    name: "Wooden Bookshelf",
    description: "5-tier wooden bookshelf for storage",
    images: ["https://images.unsplash.com/photo-1594515992428-66de1c0eb3c3"],
    labelledPrice: 449,
    price: 349,
    stock: 12,
    category: "Bookshelf",
    isAvailable: true,
  },
  {
    productId: "FURN006",
    name: "TV Console",
    description: "Modern TV console with cable management",
    images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97"],
    labelledPrice: 699,
    price: 499,
    stock: 15,
    category: "TV Console",
    isAvailable: true,
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products added");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
