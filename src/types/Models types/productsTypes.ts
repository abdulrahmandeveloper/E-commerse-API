import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category?: mongoose.Types.ObjectId;
  stock?: number;
  images?: string[];
  brand?: string;
  weight?: number;
  dimentions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive?: boolean;
}
