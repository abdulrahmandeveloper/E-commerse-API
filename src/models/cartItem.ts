import mongoose, { Document, Schema } from "mongoose";

export interface IcartItem extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

const cartItemSchema = new Schema<IcartItem>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, required: true, default: true },
  price: { type: Number, required: true },
});

export const CartItem = mongoose.model<IcartItem>("CardItem", cartItemSchema);
