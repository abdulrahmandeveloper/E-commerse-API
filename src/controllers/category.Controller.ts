import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CategoryService } from "@/services/category.service.js";
import { CategoryQuery } from "@/types/categoryTypes.js";

export const getPublicCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const result = await CategoryService.getPublicCategories(
      req.query as CategoryQuery
    );
    res.json({ success: true, ...result });
  } catch (e) {
    console.error("Error getting public categories:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCategoryDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const category = await CategoryService.getCategoryDetails(req.params.id);
    res.json({ success: true, data: category });
  } catch (e: any) {
    if (e.message === "Category not found") {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    if (e.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }
    console.error("Error getting category details:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const result = await CategoryService.getAllCategories(
      req.query as CategoryQuery
    );
    res.json({ success: true, ...result });
  } catch (e) {
    console.error("Error getting all categories:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (e: any) {
    if (e.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: e.message });
    }
    if (e.message === "Parent category not found") {
      return res.status(400).json({ success: false, message: e.message });
    }
    console.error("Error creating category:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const category = await CategoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (e: any) {
    if (e.message === "Category not found") {
      return res.status(404).json({ success: false, message: e.message });
    }
    if (
      e.message.includes("already exists") ||
      e.message.includes("cannot be") ||
      e.message.includes("circular")
    ) {
      return res.status(400).json({ success: false, message: e.message });
    }
    if (e.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }
    console.error("Error updating category:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    await CategoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (e: any) {
    if (e.message === "Category not found") {
      return res.status(404).json({ success: false, message: e.message });
    }
    if (e.message.includes("Cannot delete")) {
      return res.status(400).json({ success: false, message: e.message });
    }
    if (e.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }
    console.error("Error deleting category:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
