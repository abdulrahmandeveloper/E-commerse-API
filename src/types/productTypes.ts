export interface ProductQuery {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: string;
}

export interface productFilter {
  isActive: boolean;
  category?: string;
  $text?: { $search: string };
  price?: {
    $gte?: number;
    $lte?: number;
  };
}

export interface paginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface apiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: paginationResponse;
}

//export default {ProductQuery,productFilter,paginationResponse}

export interface createNewProduct {
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  images?: string[];
  brand?: string;
  weight?: number;
  dimentions?: {
    length?: number;
    width?: number;
    height?: number;
  };
}

export interface updateExistingProduct {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  images?: string[];
  brand?: string;
  weight?: number;
  dimentions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive: boolean;
}
