import product, { Product } from "@/models/products";
import { validationResult } from "express-validator/lib/validation-result.js";
import { Request, Response } from "express";
//import { error } from "console";
import {
  ProductQuery,
  productFilter,
  // paginationResponse,
  apiResponse,
} from "@/types/productTypes.js";
import { ProductService } from "@/services/products.service.js";
import mongoose from "mongoose";

//*  for customers only , they only can get the products */
export const getPublicProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as ProductQuery;
    const result = await ProductService.getPublicProducts(query);

    const response: apiResponse = {
      success: true,
      pagination: result.pagination,
      data: result.products,
    };

    res.json({
      success: true,
      data: result.products,
      display: result.displayDetails,
    });
  } catch (error) {
    console.error("Error fetching public products:", error);

    const errorResponse: apiResponse = {
      success: false,
      message: "Failed to fetch products",
    };

    res.status(500).json(errorResponse);
  }
};

// get one product detail
export const getProductDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await ProductService.getProductDetailsByID(id);

    const response: apiResponse = {
      success: true,
      data: product,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error fetching product details:", error);

    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
    });
  }
};

//****************************************/

/* CRUD functionality for the admin */

// creating new products
export const createNewProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct = await ProductService.createNewProduct(productData);

    const response: apiResponse = {
      success: true,
      message: "Product created successfully",
      data: newProduct,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error creating product:", error);

    if (error.message === "Product with this name already exists") {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// PUT existing product
export const updateExistingProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const updatedProduct = await ProductService.updateExistingProduct(
      id,
      updateData
    );

    const response: apiResponse = {
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error updating product:", error);

    /* if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (error.message === "Product with this name already exists") {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists",
      });
    } */

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      message: error.message,
    });
  }
};

//DELETE THE SELECTED PRODUCT
export const removeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const result = await ProductService.removeProduct(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Error removing product:", error);

    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};
