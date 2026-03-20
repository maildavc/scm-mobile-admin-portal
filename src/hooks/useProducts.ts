import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import type {
  ApproveProductPayload,
  UpdateProductStatusPayload,
} from "@/types/product";

// ── Query Keys ───────────────────────────────────────────────────────
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

// ── GET /api/v1/products ─────────────────────────────────────────────
export const useProducts = (
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {},
) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 15000, // Auto-refresh every 15 seconds in the background
  });
};

// ── GET /api/v1/products/{id} ────────────────────────────────────────
export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
};

// ── PATCH /api/v1/products/{id}/approve ─────────────────────────────
export const useApproveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: ApproveProductPayload;
    }) => productService.approveProduct(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

// ── PATCH /api/v1/products/{id}/status ──────────────────────────────
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: UpdateProductStatusPayload;
    }) => productService.updateProductStatus(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

// ── POST /api/v1/products (create) ─────────────────────
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => productService.createProduct(payload),
    onSuccess: () => {
      // Delay invalidation to allow backend to finish indexing/transaction
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: productKeys.all });
      }, 1500);
    },
  });
};

// ── PUT /api/v1/products/{id} (update) ──────────────────
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: any;
    }) => productService.updateProduct(productId, payload),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: productKeys.all });
      }, 1500);
    },
  });
};
