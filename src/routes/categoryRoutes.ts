import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
} from "@/controllers/category.Controller.js";
import { authenticate, authorize } from "@/middlewares/auth.js";
import {
  categoryIdValidation,
  categoryQueryValidation,
  createCategoryValidation,
  updateCategoryValidation,
} from "@/middlewares/validators/category.validation.js";

const router = express.Router();

//public categories for customers
router.get(
  "/show-all",
  authenticate,
  categoryQueryValidation,
  getAllCategories
);
router.get(
  "/show-all/:id",
  authenticate,
  categoryIdValidation,
  categoryQueryValidation,
  getCategoryDetails
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createCategoryValidation,
  createCategory
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateCategoryValidation,
  categoryIdValidation,
  updateCategory
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  categoryIdValidation,
  deleteCategory
);

export default router;
