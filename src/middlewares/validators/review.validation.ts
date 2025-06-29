import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { errorResponses } from "@/utils/errors.js";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new errorResponses(errorMessages.join(", "), 400);
  }
  next();
};

export const validateCreateReview = [
  body("product")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),

  body("isVerifiedPurchase")
    .optional()
    .isBoolean()
    .withMessage("isVerifiedPurchase must be a boolean"),

  handleValidationErrors,
];

export const validateUpdateReview = [
  param("reviewId")
    .isMongoId()
    .withMessage("Review ID must be a valid MongoDB ObjectId"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),

  handleValidationErrors,
];

export const validateProductId = [
  param("productId")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  handleValidationErrors,
];

export const validateReviewId = [
  param("reviewId")
    .isMongoId()
    .withMessage("Review ID must be a valid MongoDB ObjectId"),

  handleValidationErrors,
];

export const validateReviewQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),

  query("sort")
    .optional()
    .isIn([
      "createdAt",
      "-createdAt",
      "rating",
      "-rating",
      "updatedAt",
      "-updatedAt",
    ])
    .withMessage(
      "Sort must be one of: createdAt, -createdAt, rating, -rating, updatedAt, -updatedAt"
    ),

  query("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating filter must be an integer between 1 and 5"),

  handleValidationErrors,
];

export const validateGetProductReviews = [
  ...validateProductId,
  ...validateReviewQuery.slice(0, -1), // Remove the last handleValidationErrors
  handleValidationErrors,
];

export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),

  handleValidationErrors,
];
