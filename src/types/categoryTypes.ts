//  response types
export interface apiResponse {
  success: boolean;
  message?: string;
  data?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  errors?: any[];
}

//  query filter interface
export interface CategoryFilter {
  isActive?: boolean;
  parentCategory?: string | null;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
  $text?: { $search: string };
}

//  query parameters
export interface CategoryQuery {
  page?: string;
  limit?: string;
  search?: string;
  parentCategory?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/* // Interface for category query parameters
export interface CategoryQuery {
  page?: string;
  limit?: string;
  search?: string;
  parentCategory?: string;
  sortBy?: string;
  sortOrder?: string;
} */

//  creation/update request body
export interface CategoryRequestBody {
  name: string;
  description?: string;
  slug: string;
  parentCategory?: string;
  isActive?: boolean;
}

export interface CategoryWithChildren {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  children: CategoryWithChildren[];
  createdAt: Date;
  updatedAt: Date;
}
