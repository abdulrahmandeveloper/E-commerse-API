import { CartItem } from "@/models/cartItem.js";
import { Product } from "@/models/products.js";
import { CartSummary } from "@/types/cartTypes.js";

export class CartService {
  // Get user's cart items with pagination
  static async getUserCartItems(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [cartItems, total] = await Promise.all([
      CartItem.find({ user: userId })
        .populate("product", "name price images stock category isActive")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      CartItem.countDocuments({ user: userId }),
    ]);

    // Filter active items and remove inactive ones
    const activeItems = cartItems.filter((item: any) => item.product?.isActive);
    const inactiveItems = cartItems.filter(
      (item: any) => !item.product?.isActive
    );

    if (inactiveItems.length > 0) {
      await CartItem.deleteMany({
        _id: { $in: inactiveItems.map((item) => item._id) },
      });
    }

    return { activeItems, total };
  }

  // Add or update cart item
  static async addToCart(userId: string, productId: string, quantity: number) {
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new Error("Product not found or unavailable");
    if (product.stock < quantity)
      throw new Error(`Only ${product.stock} available`);

    const existingItem = await CartItem.findOne({
      user: userId,
      product: productId,
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error(
          `Cannot add ${quantity} more. Only ${
            product.stock - existingItem.quantity
          } available`
        );
      }
      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
      return await existingItem.save();
    }

    const cartItem = new CartItem({
      user: userId,
      product: productId,
      quantity,
      price: product.price,
    });
    return await cartItem.save();
  }

  // Update cart item quantity
  static async updateQuantity(
    userId: string,
    itemId: string,
    quantity: number
  ) {
    const cartItem = await CartItem.findOne({
      _id: itemId,
      user: userId,
    }).populate("product");
    if (!cartItem) throw new Error("Cart item not found");

    const product = cartItem.product as any;
    if (!product?.isActive) {
      await CartItem.findByIdAndDelete(itemId);
      throw new Error("Product no longer available");
    }
    if (product.stock < quantity)
      throw new Error(`Only ${product.stock} available`);

    cartItem.quantity = quantity;
    cartItem.price = product.price;
    return await cartItem.save();
  }

  // Remove cart item
  static async removeItem(userId: string, itemId: string) {
    const cartItem = await CartItem.findOneAndDelete({
      _id: itemId,
      user: userId,
    });
    if (!cartItem) throw new Error("Cart item not found");
    return cartItem;
  }

  // Clear entire cart
  static async clearCart(userId: string) {
    return await CartItem.deleteMany({ user: userId });
  }

  // Get cart summary
  static async getCartSummary(userId: string): Promise<CartSummary> {
    const cartItems = await CartItem.find({ user: userId }).populate(
      "product",
      "isActive"
    );
    const activeItems = cartItems.filter((item: any) => item.product?.isActive);

    // Clean up inactive items
    const inactiveItems = cartItems.filter(
      (item: any) => !item.product?.isActive
    );
    if (inactiveItems.length > 0) {
      await CartItem.deleteMany({
        _id: { $in: inactiveItems.map((item) => item._id) },
      });
    }

    return {
      totalItems: activeItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: activeItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      uniqueProducts: activeItems.length,
    };
  }

  // Admin analytics
  static async getAdminAnalytics(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [cartItems, total, totalUsers] = await Promise.all([
      CartItem.find({})
        .populate("user", "email name")
        .populate("product", "name price category")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      CartItem.countDocuments({}),
      CartItem.distinct("user").then((users) => users.length),
    ]);

    const totalValue = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cartItems,
      analytics: {
        totalCartItems: total,
        totalActiveUsers: totalUsers,
        totalCartValue: totalValue,
        totalItemsInAllCarts: totalItems,
        averageCartValue: totalUsers > 0 ? totalValue / totalUsers : 0,
      },
    };
  }
}
