import { body, param } from "express-validator";

export const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),
  body("items.*.ProductId").isMongoId().withMessage("Invalid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be positive"),
  body("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be positive"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  body("shippingAdress.street").notEmpty().withMessage("Street is required"),
  body("shippingAdress.city").notEmpty().withMessage("City is required"),
  body("shippingAdress.state").notEmpty().withMessage("State is required"),
  body("shippingAdress.zipCode").notEmpty().withMessage("Zip code is required"),
  body("shippingAdress.country").notEmpty().withMessage("Country is required"),
  body("deliveryDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid delivery date"),
];

export const updateOrderStatusValidation = [
  param("id").isMongoId().withMessage("Invalid order ID"),
  body("status")
    .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status"),
];

export const orderIdValidation = [
  param("id").isMongoId().withMessage("Invalid order ID"),
];

// i think i dont need any validation error handler?
