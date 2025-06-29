import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "@/controllers/order.controller.js";
import { authenticate, authorize } from "@/middlewares/auth.js";
import {
  createOrderValidation,
  orderIdValidation,
  updateOrderStatusValidation,
} from "@/middlewares/validators/order.validation.js";

const router = express.Router();

//* Customer Routes
router.post("/customer", authenticate, createOrderValidation, createOrder);
router.get("/customer/get", authenticate, getMyOrders);

//* Admin Routes
router.get("/admin", authenticate, authorize("admin"), getAllOrders);
router.put(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  updateOrderStatusValidation,
  orderIdValidation,
  updateOrderStatus
);
router.delete(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  orderIdValidation,
  deleteOrder
);

export default router;
