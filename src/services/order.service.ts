import { Order } from "@/models/order.js";

export class OrderService {
  static async createOrder(userId: string, orderData: any) {
    const order = new Order({
      user: userId,
      ...orderData,
    });
    return await order.save();
  }

  static async getOrdersByUser(userId: string) {
    return await Order.find({ user: userId });
  }

  static async getAllOrders() {
    return await Order.find().populate("user", "name email");
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.status = status;
    return await order.save();
  }

  static async deleteOrder(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    return await order.remove();
  }
}
