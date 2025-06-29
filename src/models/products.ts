import mongoose, { Document, Schema } from "mongoose";
import { Category } from "./category.js";
import { IProduct } from "@/types/Models types/productsTypes.js";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: Category },
    stock: { type: Number, required: true, default: 0 },
    images: [String],
    brand: String,
    weight: Number,
    dimentions: {
      lnength: Number,
      width: Number,
      height: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Products", productSchema);
