import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    ProductId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "fialed" | "Refunded";
  paymentMethod: string;
  stripePaymentIntendId: string;
  shippingAdress: {
    street?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: Date;
  deliveryDate: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "failed", "Refunded"],
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    stripePaymentIntendId: String,
    shippingAdress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
