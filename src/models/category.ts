import mongoose, { Schema } from "mongoose";
import { ICategory } from "@/types/Models types/categoryTypes.js";

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: String,
  slug: { type: String, required: true, unique: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
  isActive: { type: Boolean, default: true },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
