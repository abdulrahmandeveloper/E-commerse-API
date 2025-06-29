import { apiResponse } from "@/types/cartTypes.js";
import { NextFunction } from "express";
import { body, param } from "express-validator";

export const validateAddToCart = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

export const validateUpdateQuantity = [
  param("id")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isMongoId()
    .withMessage("Invalid cart item ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

export const validateRemoveItem = [
  param("id")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isMongoId()
    .withMessage("Invalid cart item ID"),
];

export function handleValidationError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    } as apiResponse);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    } as apiResponse);
  }

  next(error);
}
