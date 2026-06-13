import express from "express"; //importing express module`
import {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router(); //create productRouter using express router

productRouter.get("/", getProducts); //route to get all product

productRouter.post("/", saveProduct); //route to save a product

productRouter.delete("/:productId", deleteProduct); //delete product  (productId is endpoint of URL)

productRouter.put("/:productId", updateProduct); //update product

productRouter.get("/:productId", getProductById); //get one product

export default productRouter; //exporting productRouter to use in other files
