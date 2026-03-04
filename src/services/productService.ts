import apiClient from "@/lib/axios";
import type {
  ProductListResponse,
  ProductDetailResponse,
  ApproveProductPayload,
  ApproveProductResponse,
  UpdateProductStatusPayload,
  UpdateProductStatusResponse,
} from "@/types/product";

// Helper: get token from cookie for direct fetch calls (multipart bypasses Axios)
function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

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

  // POST /api/v1/products (multipart/form-data — bypasses Axios encryption)
  createProduct: async (
    formData: FormData,
  ): Promise<{
    status: string;
    message: string;
    data: { id: string; status: string };
  }> => {
    const token = getToken();
    const res = await fetch("/api/proxy/api/v1/products", {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Create failed (${res.status})`);
    }
    return res.json();
  },

  // PUT /api/v1/products/{productId} (multipart/form-data — bypasses Axios encryption)
  updateProduct: async (
    productId: string,
    formData: FormData,
  ): Promise<{
    status: string;
    message: string;
    data: { id: string; status: string };
  }> => {
    const token = getToken();
    const res = await fetch(`/api/proxy/api/v1/products/${productId}`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Update failed (${res.status})`);
    }
    return res.json();
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
