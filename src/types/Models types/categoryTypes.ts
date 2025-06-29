import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
}
