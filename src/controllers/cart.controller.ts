import { Request, Response } from "express";
import { CartService } from "@/services/cartItem.service.js";
import { apiResponse, CartQuery } from "@/types/cartTypes.js";

// Customer Controllers
export const getAllCartItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { page = "1", limit = "20" } = req.query as CartQuery;

    const { activeItems, total } = await CartService.getUserCartItems(
      userId,
      Number(page),
      Number(limit)
    );
    const summary = await CartService.getCartSummary(userId);

    const response: apiResponse = {
      success: true,
      message: `Cart retrieved for user: ${req.user?.email}`,
      data: activeItems,
      summary,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error getting cart items:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving cart",
    } as apiResponse);
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user!.id;

    const cartItem = await CartService.addToCart(userId, productId, quantity);
    await cartItem.populate("product", "name price images stock category");

    const response: apiResponse = {
      success: true,
      message: "Item added to cart successfully",
      data: cartItem,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    } as apiResponse);
  }
};

export const updateOneCartItemQuantity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.id;

    const updatedItem = await CartService.updateQuantity(userId, id, quantity);
    await updatedItem.populate("product", "name price images stock category");

    const response: apiResponse = {
      success: true,
      message: "Cart item quantity updated successfully",
      data: updatedItem,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    } as apiResponse);
  }
};

export const removeItemCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const removedItem = await CartService.removeItem(userId, id);

    const response: apiResponse = {
      success: true,
      message: "Item removed from cart successfully",
      data: { removedItem },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    } as apiResponse);
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = await CartService.clearCart(userId);

    const response: apiResponse = {
      success: true,
      message: `Cart cleared successfully. ${result.deletedCount} items removed`,
      data: { deletedCount: result.deletedCount },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    } as apiResponse);
  }
};

export const getAllCustomerCartSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const summary = await CartService.getCartSummary(userId);

    const response: apiResponse = {
      success: true,
      message: "Cart summary retrieved successfully",
      summary,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error getting cart summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving cart summary",
    } as apiResponse);
  }
};

// Admin Controllers
export const getAdminCartSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const summary = await CartService.getCartSummary(userId);

    const response: apiResponse = {
      success: true,
      message: "Cart summary retrieved successfully",
      summary,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error getting cart summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving cart summary",
    } as apiResponse);
  }
};

export const getAdminCartAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = "1", limit = "50" } = req.query as CartQuery;
    const { cartItems, analytics } = await CartService.getAdminAnalytics(
      Number(page),
      Number(limit)
    );

    const response: apiResponse = {
      success: true,
      message: `Cart analytics retrieved by admin: ${req.user?.email}`,
      data: cartItems,
      summary: analytics,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error getting admin analytics:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving analytics",
    } as apiResponse);
  }
};
