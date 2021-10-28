const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("productId", getProductById);

//all of actual routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  // [
  //   check("name", "name should be at least 3 char").isLength({ min: 3 }),
  //   check("description", "description is required").isString({min:5}),
  //   check("price", "price is required").isInt({min:10}),
  //   check("category", "category is required").isString({min:2}),
  //   check("stock", "stock is required").isInt({min:1})
  // ],
  createProduct
);

//get routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);
//update route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//listing route
router.get("/products", getAllProducts);

//get all unique categories route
router.get("/products/categories",getAllUniqueCategories);

module.exports = router;
