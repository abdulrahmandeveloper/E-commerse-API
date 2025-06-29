import express from "express";
import {
  getAllCartItems,
  addToCart,
  updateOneCartItemQuantity,
  removeItemCart,
  clearCart,
  getAllCustomerCartSummary,
} from "@/controllers/cart.controller.js";
//admin import
import {
  getAdminCartAnalytics,
  getAdminCartSummary,
} from "@/controllers/cart.controller.js";
import { authenticate, authorize } from "@/middlewares/auth.js";
import {
  handleValidationError,
  validateAddToCart,
  validateRemoveItem,
  validateUpdateQuantity,
} from "@/middlewares/validators/cartItem.validation.js";

const router = express.Router();

// customer crud
router.get("/show-all", authenticate, handleValidationError, getAllCartItems);
router.get(
  "/summary",
  authenticate,
  handleValidationError,
  getAllCustomerCartSummary
);
router.post(
  "/",
  authenticate,
  validateAddToCart,
  handleValidationError,
  addToCart
);
router.put(
  "/:id",
  authenticate,
  validateUpdateQuantity,
  updateOneCartItemQuantity
);
router.delete(
  "/:id",
  authenticate,
  validateRemoveItem,
  handleValidationError,
  removeItemCart
);
router.delete(
  "/clear",
  authenticate,
  validateRemoveItem,
  handleValidationError,
  clearCart
);

//admin routes
router.get(
  "/admin/show-all",
  authenticate,
  authorize("admin"),
  handleValidationError,
  getAdminCartSummary
);
router.get(
  "/admin/analytics",
  authenticate,
  authorize("admin"),
  handleValidationError,
  getAdminCartAnalytics
);

export default router;
