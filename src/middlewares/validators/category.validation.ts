import { body, param, query } from "express-validator";

export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID"),
];

export const updateCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid category ID"),
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
  body("slug")
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const categoryIdValidation = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];

export const categoryQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Search term too long"),
  query("parentCategory")
    .optional()
    .custom((value) => {
      if (value === "null") return true;
      if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("Invalid parent category ID");
      }
      return true;
    }),
  query("sortBy")
    .optional()
    .isIn(["name", "createdAt", "updatedAt"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];
