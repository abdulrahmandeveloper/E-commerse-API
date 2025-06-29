import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Reviews", reviewSchema);
