// ── Product List (GET /api/v1/products) ──────────────────────────────

export interface ProductListItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Inactive" | "Awaiting Approval";
  updated: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductStats {
  activeProducts: number;
  inactiveProducts: number;
  unsubscribedProducts: number;
}

export interface ProductListData {
  products: ProductListItem[];
  pagination: ProductPagination;
  stats: ProductStats;
}

export interface ProductListResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    status: string;
    message: string;
    data: ProductListData;
  };
  error: null | string;
  errors: null | string[];
}

// ── Product Detail (GET /api/v1/products/{id}) ───────────────────────

export interface ProductDetails {
  productName: string;
  instrumentType: string;
  issuer: string;
  sector: string;
}

export interface ProductFinancialDetails {
  sellingPrice: number;
  availableVolume: number;
  interestOrReturnsPercentage: number;
  minimumInvestmentAmount: number;
  maximumInvestmentAmount: number;
  settlementDate: string;
  allowForEarlyLiquidation: boolean;
  earlyLiquidationPeriod: string;
  earlyLiquidationPenalty: string;
  whtAmount: number;
  applicableTax: number;
}

export interface ProductDetailData {
  productDetails: ProductDetails;
  financialDetails: ProductFinancialDetails;
  integration?: { source: string };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetailResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    status: string;
    message: string;
    data: ProductDetailData;
  };
  error: null | string;
  errors: null | string[];
}

// ── Approve/Reject (PATCH /api/v1/products/{id}/approve) ─────────────

export interface ApproveProductPayload {
  productId: string;
  action: "approve" | "reject";
  reason?: string | null;
}

export interface ApproveProductResponse {
  status: string;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

// ── Status Update (PATCH /api/v1/products/{id}/status) ───────────────

export interface UpdateProductStatusPayload {
  productId: string;
  status: "Active" | "Inactive";
}

export interface UpdateProductStatusResponse {
  status: string;
  message: string;
  data: {
    id: string;
    status: string;
  };
}
