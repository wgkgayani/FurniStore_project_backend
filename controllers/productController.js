import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProducts(req, res) {
  // use async funtion
  /* Product.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        message: "Failed to get products",
        error: err,
      });
    });*/
  // it equal below try catch

  try {
    if (isAdmin(req)) {
      const products = await Product.find();
      res.json(products); //products is db name
    } else {
      const products = await Product.find({ isAvailable: true });
      res.json(products);
    }
  } catch (err) {
    res.json({
      message: "Failed to get products",
      error: err,
    });
  }
}

export function saveProduct(req, res) {
  if (req.user == null) {
    res.status(403).json({
      // 403 means forbidden
      message: "Unauthorized", // you need to be logged in
    });
    return;
  }

  if (req.user.role != "admin") {
    // only admin can add products
    res.status(403).json({
      message: "Unauthorized you need to be an admin", // you need to be admin
    });
    return; // stop further execution
  }

  //console.log(req.body);

  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not authorized to add a product",
    });
    return;
  }

  const product = new Product(req.body);

  product //to save product data in mongodb
    .save()
    .then(() => {
      res.json({
        message: "product data saved successfully",
      });
    })
    .catch((error) => {
      res.json({
        message: "Error saving product data",
        error: error,
      });
    });
}

export async function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not authorized to delete a product",
    });
    return;
  }

  try {
    await Product.deleteOne({ productId: req.params.productId });

    res.json({
      message: "Product delete successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete product",
      error: err,
    });
  }
}

export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not authorized to update a product",
    });
    return;
  }

  const productId = req.params.productId;
  const updatingData = req.body;

  try {
    await Product.updateOne({ productId: productId }, updatingData);

    res.json({
      message: "Product updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ productId: productId });

    if (Product == null) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    if (product.isAvailable) {
      res.json(product);
    } else {
      if (!isAdmin(req)) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      } else {
        res.json(product);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
}
