import express from "express";
import {
  getPublicProducts,
  createNewProduct,
  getProductDetails,
  removeProduct,
  updateExistingProduct,
} from "@/controllers/product.Controller.js";
import { authonticateCustomer } from "@/middlewares/productMiddlewares.js";
import { authorize } from "@/middlewares/auth.js";
import {
  createProductValidation,
  productIdValidation,
  productQueryValidation,
  updateProductValidation,
} from "@/middlewares/validators/products.validation.js";

const router = express.Router();

//general access

//show all public routes
router.get("/show-all", productQueryValidation, getPublicProducts);

// show single product
router.get("/:id", productIdValidation, getProductDetails);

/*********************************************** */
//costomer

//show all public routes
router.get(
  "/customer/show-all",
  authonticateCustomer,
  productQueryValidation,
  getPublicProducts
);

// show single product
router.get(
  "/customer/:id",
  authonticateCustomer,
  productIdValidation,
  getProductDetails
);

/****************************** */
//admin side

//Read all the products
router.get(
  "/admin/show-all",
  authorize("admin"),
  productQueryValidation,
  getPublicProducts
);

// creating new products
router.post(
  "/admin",
  authorize("admin"),
  createProductValidation,
  createNewProduct
);

//admin update product
router.put(
  "/admin/:id",
  authorize("admin"),
  updateProductValidation,
  productIdValidation,
  updateExistingProduct
);

//admin delete product, simply making it disactive
router.delete(
  "/admin/:id",
  authorize("admin"),
  productIdValidation,
  removeProduct
);

export default router;
