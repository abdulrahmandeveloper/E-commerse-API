import { Product } from "@/models/products.js";
import { Review } from "@/models/review.js";
import { User } from "@/models/users.js";
import { errorResponses } from "@/utils/errors.js";
import mongoose from "mongoose";
import { ReviewFilters } from "@/types/reviewTypes.js";

export class ReviewService {
  // create new review.
  async createReview(reviewData: any) {
    const { user, product, rating, comment, isVerifiedPurchase } = reviewData;

    const existingReview = await Review.findOne({ user, product });
    if (existingReview) {
      throw new errorResponses("You have already reviewed this product", 400);
    }

    const productExists = await Product.findById(product);
    const userExists = await User.findById(user);
    if (!productExists) throw new errorResponses("Product not found", 404);
    if (!userExists) throw new errorResponses("User not found", 404);

    const review = new Review({
      user,
      product,
      rating,
      comment,
      isVerifiedPurchase: isVerifiedPurchase || false,
    });

    await review.save();

    await review.populate([
      { path: "user", select: "name email" },
      { path: "product", select: "name price" },
    ]);

    return { review };
  }

  //get reviews
  async getProductReviews(productId: string, filters: ReviewFilters) {
    const { page = 1, limit = 10, sort = "-createdAt" } = filters;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new errorResponses("Invalid product ID", 400);
    }

    const query = { product: productId };

    const reviews = await Review.find(query)
      .populate("user", "name")
      .populate("products", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // get customers review
  async getUserReviews(userId: string, filters: ReviewFilters) {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const query = { user: userId };

    const reviews = await Review.find(query)
      .populate("products", "name price images")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  //get one review
  async getReviewById(reviewId: string) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new errorResponses("Invalid review ID", 400);
    }

    const review = await Review.findById(reviewId)
      .populate("user", "name email")
      .populate("products", "name price");

    if (!review) {
      throw new errorResponses("Review not found", 404);
    }

    return { review };
  }

  //customer edits a review
  async updateReview(reviewId: string, userId: string, updateData: any) {
    const { rating, comment } = updateData;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new errorResponses("Invalid review ID", 400);
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new errorResponses("Review not found", 404);
    }

    if (review.user.toString() !== userId) {
      throw new errorResponses("it is not your review!", 403);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate([
      { path: "user", select: "name email" },
      { path: "product", select: "name price" },
    ]);

    return { review: updatedReview };
  }

  ////////////////////////////////////////////////////////////////
  // admin specific part

  //admin - get all reviews
  async getAllReviews(filters: ReviewFilters) {
    const { page = 1, limit = 10, sort = "-createdAt", rating } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (rating) {
      query.rating = rating;
    }

    const reviews = await Review.find(query)
      .populate("user", "name email")
      .populate("products", "name price")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // delete review
  async deleteReview(reviewId: string, userId: string, userRole: string) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Business Rule: Only the review author or admin can delete the review
    if (review.user.toString() !== userId && userRole !== "admin") {
      throw new AppError("You can only delete your own reviews", 403);
    }

    await Review.findByIdAndDelete(reviewId);

    return { message: "Review deleted successfully" };
  }

  // get ratings
  async getProductRatingStats(productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new errorResponses("Invalid product ID", 400);
    }

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
      {
        $addFields: {
          averageRating: { $round: ["$averageRating", 2] },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const stat = stats[0];

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stat.ratingDistribution.forEach((rating: number) => {
      distribution[rating as keyof typeof distribution]++;
    });

    return {
      totalReviews: stat.totalReviews,
      averageRating: stat.averageRating,
      ratingDistribution: distribution,
    };
  }
}
