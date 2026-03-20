import apiClient from "@/lib/axios";
import type {
  ProductListResponse,
  ProductDetailResponse,
  ApproveProductPayload,
  ApproveProductResponse,
  UpdateProductStatusPayload,
  UpdateProductStatusResponse,
} from "@/types/product";

// Removed getToken since apiClient handles authorization cookies automatically

export const productService = {
  // GET /api/v1/products
  getProducts: async (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
  ): Promise<ProductListResponse> => {
    const { data } = await apiClient.get<ProductListResponse>(
      "/api/v1/products",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          ...(params.status && { status: params.status }),
          ...(params.search && { search: params.search }),
        },
      },
    );
    return data;
  },

  // GET /api/v1/products/{productId}
  getProductById: async (productId: string): Promise<ProductDetailResponse> => {
    const { data } = await apiClient.get<ProductDetailResponse>(
      `/api/v1/products/${productId}`,
    );
    return data;
  },

  // POST /api/v1/products
  createProduct: async (
    payload: any,
  ): Promise<{
    status: string;
    message: string;
    data: { id: string; status: string };
  }> => {
    const { data } = await apiClient.post<{
      status: string;
      message: string;
      data: { id: string; status: string };
    }>("/api/v1/products", payload);
    return data;
  },

  // PUT /api/v1/products/{productId}
  updateProduct: async (
    productId: string,
    payload: any,
  ): Promise<{
    status: string;
    message: string;
    data: { id: string; status: string };
  }> => {
    const { data } = await apiClient.put<{
      status: string;
      message: string;
      data: { id: string; status: string };
    }>(`/api/v1/products/${productId}`, payload);
    return data;
  },

  // PATCH /api/v1/products/{productId}/approve
  approveProduct: async (
    productId: string,
    payload: ApproveProductPayload,
  ): Promise<ApproveProductResponse> => {
    const { data } = await apiClient.patch<ApproveProductResponse>(
      `/api/v1/products/${productId}/approve`,
      payload,
    );
    return data;
  },

  // PATCH /api/v1/products/{productId}/status
  updateProductStatus: async (
    productId: string,
    payload: UpdateProductStatusPayload,
  ): Promise<UpdateProductStatusResponse> => {
    const { data } = await apiClient.patch<UpdateProductStatusResponse>(
      `/api/v1/products/${productId}/status`,
      payload,
    );
    return data;
  },
};
