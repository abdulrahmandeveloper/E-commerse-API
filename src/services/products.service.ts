import { Product } from "@/models/products.js";
import {
  createNewProduct,
  productFilter,
  ProductQuery,
  updateExistingProduct,
} from "@/types/productTypes.js";
import { sendResponse } from "@/utils/response.js";

export class ProductService {
  static async getPublicProducts(query: ProductQuery) {
    const {
      page = "1",
      limit = "10",
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "asc",
      isActive,
    } = query;

    const filter: productFilter = { isActive };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name"),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      displayDetails: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPage: Math.ceil(total / Number(limit)),
      },
    };
  }

  static async getProductDetailsByID(productId: string) {
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    }).populate("category", "name");

    if (!product) {
      throw new Error("product not found");
    }

    return product;
  }

  static async createNewProduct(productData: createNewProduct) {
    const { name } = productData;

    const existingProducts = await Product.findOne({ name: name.trim() });

    if (existingProducts) {
      throw new Error("ئەو بەرهەمە بە هەمان ناو وجودی هەیە!");
    }
    const product = new Product({
      name: productData.name.trim(),
      description: productData.description.trim(),
      price: Number(productData.price),
      category: productData.category,
      stock: Number(productData.stock || 0),
      images: productData.images || [],
      brand: productData.brand,
      weight: Number(productData.weight) || 0,
      dimentions: productData.dimentions,
    });

    const savedProducts = await product.save();
    await savedProducts.populate("category", "name");

    return savedProducts;
  }

  static async updateExistingProduct(
    productId: string,
    updateData: updateExistingProduct
  ) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("cant be found?!");
    }

    const { name } = updateData;

    if (name && name.trim() !== product.name) {
      const existingProduct = await Product.findOne({
        name: name.trim(),
        _id: { $ne: productId },
      });

      if (existingProduct) {
        throw new Error("بەرهەمێکی دیکە بە هەمان ناو یان ئایدی وجەدی هەیە؟١");
      }
    }

    if (updateData.name) product.name = updateData.name.trim();
    if (updateData.description)
      product.description = updateData.description.trim();
    if (updateData.price !== undefined)
      product.price = Number(updateData.price);
    if (updateData.category) product.category = updateData.category;
    if (updateData.stock !== undefined)
      product.stock = Number(updateData.stock);
    if (updateData.images) product.images = updateData.images;
    if (updateData.brand !== undefined) product.brand = updateData.brand;
    if (updateData.weight !== undefined)
      product.weight = Number(updateData.weight);
    if (updateData.dimentions !== undefined)
      product.dimentions = updateData.dimentions;
    if (updateData.isActive !== undefined)
      product.isActive = Boolean(updateData.isActive);

    const updatedProduct = await product.save();
    await updatedProduct.populate("category", "name");

    return updatedProduct;
  }

  static async removeProduct(res: Response, productid: string) {
    const product = await Product.findById(productid);

    if (!product) {
      throw new Error("product nya?");
    }

    product.isActive = false;
    await product.save();

    return sendResponse(res, 200, product);
  }

  static async getAllProductsForAdmin(res: Response, query: ProductQuery) {
    const {
      page = "1",
      limit = "10",
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      isActive,
    } = query;

    const filter: productFilter = {};

    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };
    if (isActive !== undefined) filter.isActive = Boolean(isActive);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name"),
      Product.countDocuments(filter),
    ]);

    return sendResponse(res, 200, {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPage: Math.ceil(total / Number(limit)),
      },
    });
  }
}
