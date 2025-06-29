// validation/productValidation.ts
import { body, param, query } from "express-validator";

export const createProductValidation = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .trim(),

  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters")
    .trim(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (images && images.length > 10) {
        throw new Error("Maximum 10 images allowed");
      }
      return true;
    }),

  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),

  body("brand")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Brand name cannot exceed 50 characters")
    .trim(),

  body("weight")
    .optional()
    .isNumeric()
    .withMessage("Weight must be a number")
    .isFloat({ min: 0 })
    .withMessage("Weight must be greater than or equal to 0"),

  body("dimentions.length")
    .optional()
    .isNumeric()
    .withMessage("Length must be a number")
    .isFloat({ min: 0 })
    .withMessage("Length must be greater than or equal to 0"),

  body("dimentions.width")
    .optional()
    .isNumeric()
    .withMessage("Width must be a number")
    .isFloat({ min: 0 })
    .withMessage("Width must be greater than or equal to 0"),

  body("dimentions.height")
    .optional()
    .isNumeric()
    .withMessage("Height must be a number")
    .isFloat({ min: 0 })
    .withMessage("Height must be greater than or equal to 0"),
];

export const updateProductValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters")
    .trim(),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (images && images.length > 10) {
        throw new Error("Maximum 10 images allowed");
      }
      return true;
    }),

  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),

  body("brand")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Brand name cannot exceed 50 characters")
    .trim(),

  body("weight")
    .optional()
    .isNumeric()
    .withMessage("Weight must be a number")
    .isFloat({ min: 0 })
    .withMessage("Weight must be greater than or equal to 0"),

  body("dimentions.length")
    .optional()
    .isNumeric()
    .withMessage("Length must be a number")
    .isFloat({ min: 0 })
    .withMessage("Length must be greater than or equal to 0"),

  body("dimentions.width")
    .optional()
    .isNumeric()
    .withMessage("Width must be a number")
    .isFloat({ min: 0 })
    .withMessage("Width must be greater than or equal to 0"),

  body("dimentions.height")
    .optional()
    .isNumeric()
    .withMessage("Height must be a number")
    .isFloat({ min: 0 })
    .withMessage("Height must be greater than or equal to 0"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const productIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),
];

export const productQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters")
    .trim(),

  query("minPrice")
    .optional()
    .isNumeric()
    .withMessage("Minimum price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),

  query("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Maximum price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),

  query("sortBy")
    .optional()
    .isIn(["name", "price", "createdAt", "updatedAt", "stock"])
    .withMessage(
      "Sort by must be one of: name, price, createdAt, updatedAt, stock"
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

// Validation middleware to check for validation errors
export const handleValidationErrors = (req: any, res: any, next: any) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};
