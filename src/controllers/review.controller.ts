import { Request, Response } from "express";
import { ReviewService } from "@/services/review.service.js";
import { sendResponse, sendError } from "@/utils/response.js";

const reviewService = new ReviewService();

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewData = {
      ...req.body,
      user: req.user?.id, // From auth middleware
    };

    const result = await reviewService.createReview(reviewData);

    sendResponse(res, 201, {
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Get reviews for a specific product
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page, limit, sort } = req.query;

    const result = await reviewService.getProductReviews(productId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sort as string,
    });

    sendResponse(res, 200, {
      message: "Product reviews retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Get all reviews (admin only)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit, sort, rating } = req.query;

    const result = await reviewService.getAllReviews({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sort as string,
      rating: rating ? Number(rating) : undefined,
    });

    sendResponse(res, 200, {
      message: "All reviews retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Get user's own reviews
export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await reviewService.getUserReviews(req.user?.id, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    sendResponse(res, 200, {
      message: "User reviews retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Get a specific review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewService.getReviewById(reviewId);

    sendResponse(res, 200, {
      message: "Review retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Update a review (only by the review author)
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewService.updateReview(
      reviewId,
      req.user?.id,
      req.body
    );

    sendResponse(res, 200, {
      message: "Review updated successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Delete a review (by author or admin)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewService.deleteReview(
      reviewId,
      req.user?.id,
      req.user?.role
    );

    sendResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// Get product rating statistics
export const getProductRatingStats = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await reviewService.getProductRatingStats(productId);

    sendResponse(res, 200, {
      message: "Product rating statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};
