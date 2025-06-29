import { Router } from "express";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  getUserReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getProductRatingStats,
} from "@/controllers/review.controller.js";
import {
  validateCreateReview,
  validateUpdateReview,
  validateGetProductReviews,
  validateReviewId,
  validateProductId,
  validatePagination,
  validateReviewQuery,
} from "@/middlewares/validators/review.validation.js";
import { authenticate } from "@/middlewares/auth.js"; // Middleware to verify JWT token
import { authorize } from "@/middlewares/auth.js"; // Middleware to check user roles

const router = Router();

// general routes
router.get("/:id", validateGetProductReviews, getProductReviews);
router.get("/:id/ratings", validateProductId, getProductRatingStats);

//  Get a specific review by ID
router.get("/productReview/:id", authenticate, validateReviewId, getReviewById);

//////////////////////////////////////////////////////////////////////////////

// Protected routes -customers

// Create a new review
router.post("/", authenticate, validateCreateReview, createReview);

// GET current user's reviews
router.get("/customer/", authenticate, validatePagination, getUserReviews);

// PUT  a review (only by review author)
router.put("/customer/:id", authenticate, validateUpdateReview, updateReview);

// DELETE  a review (by author or admin)
router.delete("/:id", authenticate, validateReviewId, deleteReview);

////////////////////////////////////////////////////////////////////////////////

// Admin only routes

// GET  all reviews (admin only)
router.get(
  "/admin/show-all",
  authenticate,
  authorize("admin"),
  validateReviewQuery,
  getAllReviews
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize("admin"),
  validateReviewId,
  deleteReview
);

export default router;
