import { Category } from "@/models/category.js";
import { CategoryQuery } from "@/types/categoryTypes.js";

export class CategoryService {
  static async getPublicCategories(query: CategoryQuery) {
    const {
      page = "1",
      limit = "10",
      search,
      parentCategory,
      sortBy = "name",
      sortOrder = "asc",
    } = query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (parentCategory) {
      filter.parentCategory = parentCategory === "null" ? null : parentCategory;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("parentCategory", "name slug")
        .lean(),
      Category.countDocuments(filter),
    ]);

    return {
      categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPage: Math.ceil(total / Number(limit)),
      },
    };
  }

  static async getCategoryDetails(id: string) {
    const category = await Category.findOne({
      $or: [{ _id: id }, { slug: id }],
      isActive: true,
    }).populate("parentCategory", "name slug");

    if (!category) throw new Error("Category not found");

    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    }).select("name slug description");

    return { ...category.toObject(), subcategories };
  }

  static async getAllCategories(query: CategoryQuery) {
    const {
      page = "1",
      limit = "10",
      search,
      parentCategory,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (parentCategory) {
      filter.parentCategory = parentCategory === "null" ? null : parentCategory;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("parentCategory", "name slug")
        .lean(),
      Category.countDocuments(filter),
    ]);

    return {
      categories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPage: Math.ceil(total / limitNum),
      },
    };
  }

  static async createCategory(categoryData: any) {
    const { name, description, slug, parentCategory } = categoryData;

    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: slug.trim() }],
    });

    if (existingCategory) {
      throw new Error("Category with this name or slug already exists");
    }

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) throw new Error("Parent category not found");
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim(),
      slug: slug.trim(),
      parentCategory: parentCategory || undefined,
    });

    const savedCategory = await category.save();
    return await savedCategory.populate("parentCategory", "name slug");
  }

  static async updateCategory(id: string, updateData: any) {
    const { name, description, slug, parentCategory, isActive } = updateData;

    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    // Check for duplicates
    if (name || slug) {
      const duplicateQuery: any = { _id: { $ne: id }, $or: [] };

      if (name && name.trim() !== category.name) {
        duplicateQuery.$or.push({ name: name.trim() });
      }
      if (slug && slug.trim() !== category.slug) {
        duplicateQuery.$or.push({ slug: slug.trim() });
      }

      if (duplicateQuery.$or.length > 0) {
        const existingCategory = await Category.findOne(duplicateQuery);
        if (existingCategory) {
          throw new Error("Category with this name or slug already exists");
        }
      }
    }

    // Validate parent category
    if (
      parentCategory &&
      parentCategory !== category.parentCategory?.toString()
    ) {
      if (parentCategory === id) {
        throw new Error("Category cannot be its own parent");
      }

      const parent = await Category.findById(parentCategory);
      if (!parent) throw new Error("Parent category not found");

      const isCircular = await this.checkCircularDependency(parentCategory, id);
      if (isCircular)
        throw new Error("This would create a circular dependency");
    }

    // Update fields
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (slug) category.slug = slug.trim();
    if (parentCategory !== undefined) {
      category.parentCategory = parentCategory || undefined;
    }
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    const updatedCategory = await category.save();
    return await updatedCategory.populate("parentCategory", "name slug");
  }

  static async deleteCategory(id: string) {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    const subcategoriesCount = await Category.countDocuments({
      parentCategory: id,
      isActive: true,
    });

    if (subcategoriesCount > 0) {
      throw new Error("Cannot delete category with active subcategories");
    }

    category.isActive = false;
    return await category.save();
  }

  static async checkCircularDependency(
    parentId: string,
    childId: string
  ): Promise<boolean> {
    const parent = await Category.findById(parentId);
    if (!parent) return false;
    if (parent.parentCategory?.toString() === childId) return true;
    if (parent.parentCategory) {
      return await this.checkCircularDependency(
        parent.parentCategory.toString(),
        childId
      );
    }
    return false;
  }
}
