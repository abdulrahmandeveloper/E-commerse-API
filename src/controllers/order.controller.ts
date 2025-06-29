import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { OrderService } from "@/services/order.service.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const order = await OrderService.createOrder(req.user._id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (e) {
    console.error("Error creating order:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getOrdersByUser(req.user._id);
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const order = await OrderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res
      .status(200)
      .json({ success: true, message: "Status updated", data: order });
  } catch (e) {
    if (e.message === "Order not found") {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    await OrderService.deleteOrder(req.params.id);
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (e) {
    if (e.message === "Order not found") {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
