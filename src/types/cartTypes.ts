export interface CartQuery {
  page?: string;
  limit?: string;
}

/* export interface CartItemRequest {
  productId: string;
  quantity: number;
} */

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  uniqueProducts: number;
}

export interface apiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  summary?: CartSummary;
}
