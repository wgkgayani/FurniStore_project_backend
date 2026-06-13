import mongoose from "mongoose"; //importing mongoose

//product schema (sructur of product)
const productSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  altNames: [{ type: String }],
  description: {
    type: String,
    required: true,
  },
  images: [{ type: String }],
  labelledPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
});

//create product model
const Product = mongoose.model("products", productSchema); // "products" is name of collection, when automaticaly create in the db.therefor it is not product, it is products
//to connect to product collection

export default Product; //exporting product model
