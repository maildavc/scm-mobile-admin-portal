"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import Table from "@/components/Dashboard/Table";
import CreateProductForm from "@/components/Dashboard/ProductOffering/CreateProductForm";
import ViewProduct from "@/components/Dashboard/ProductOffering/ViewProduct";
import ViewProductRequest from "@/components/Dashboard/ProductOffering/ViewProductRequest";
import {
  PRODUCT_OFFERING_SIDEBAR_ITEMS,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/productOffering/productOffering";
import ActionButton from "@/components/Dashboard/ActionButton";
import { createProductColumns } from "./columns";
import { useAuthStore } from "@/stores/authStore";
import { useProducts, useUpdateProductStatus } from "@/hooks/useProducts";
import { useToastStore } from "@/stores/toastStore";

export type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  // API returns "Inactive"; legacy child components expect "Deactivated" — both accepted
  // Backend apparently returns "Approved" instead of "Active" after approval.
  status: "Active" | "Inactive" | "Deactivated" | "Awaiting Approval" | "Approved";
  updated: string;
};

export default function ProductOffering() {
  const isApprover = useAuthStore((s) => s.isApprover);
  const addToast = useToastStore((s) => s.addToast);
  const [currentView, setCurrentView] = useState("Overview");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // ── Live data ──────────────────────────────────────────────────────
  const { data: productsRes, isLoading } = useProducts({ page: 1, limit: 50 });
  const updateStatus = useUpdateProductStatus();

  const products: Product[] = productsRes?.value?.data?.products ?? [];
  const stats = productsRes?.value?.data?.stats;

  const statsConfig = [
    {
      label: "Active Products",
      value:
        products.filter((p) => p.status === "Active" || p.status === "Approved").length ||
        stats?.activeProducts ||
        0,
    },
    {
      label: "Inactive Products",
      value:
        products.filter((p) => p.status === "Inactive" || p.status === "Deactivated").length ||
        stats?.inactiveProducts ||
        0,
    },
    {
      label: "Unsubscribed",
      value: stats?.unsubscribedProducts ?? 0,
    },
  ];

  // ── Sidebar / navigation ───────────────────────────────────────────
  const filteredSidebarItems = isApprover
    ? PRODUCT_OFFERING_SIDEBAR_ITEMS.filter((item) => item.label === "Overview")
    : PRODUCT_OFFERING_SIDEBAR_ITEMS;

  const sidebarItems = filteredSidebarItems.map((item) => ({
    ...item,
    isActive: viewProduct
      ? item.label === "Overview"
      : item.label === currentView ||
        (currentView === "Edit Product" && item.label === "Create Product"),
  }));

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setEditProduct(null);
    setViewProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setViewProduct(null);
    setCurrentView("Edit Product");
  };

  const handleViewProduct = (product: Product) => {
    setViewProduct(product);
    setEditProduct(null);
    setCurrentView(product.name);
  };

  const resetView = () => {
    setCurrentView("Overview");
    setEditProduct(null);
    setViewProduct(null);
  };

  // ── Approve / Reject ───────────────────────────────────────────────
  const handleApprove = () => {
    resetView();
  };

  const handleReject = () => {
    resetView();
  };

  // ── Deactivate / Activate / Disable ────────────────────────────────
  const isLiveStatus = (status: Product["status"]) =>
    status === "Active" || status === "Approved";

  const handleStatusChange = async (product: Product, status: "Active" | "Inactive") => {
    try {
      await updateStatus.mutateAsync({
        productId: product.id,
        payload: { productId: product.id, status },
      });
      addToast(`Product set to ${status}`, "success");
      resetView();
    } catch {
      addToast("Failed to update product status", "error");
    }
  };

  const handleDeactivate = async (product?: Product | null) => {
    const target = product || viewProduct;
    if (!target) return;
    const newStatus = isLiveStatus(target.status) ? "Inactive" : "Active";
    await handleStatusChange(target, newStatus);
  };

  const handleDisable = async (product?: Product | null) => {
    const target = product || viewProduct;
    if (!target) return;
    await handleStatusChange(target, "Inactive");
  };

  const totalCount = productsRes?.value?.data?.pagination?.total || products.length;
  const columns = createProductColumns(
    handleEditProduct,
    handleViewProduct,
    (product) => handleDeactivate(product),
    isApprover,
    totalCount,
  );

  const breadcrumbs = getBreadcrumbs(viewProduct ? viewProduct.name : currentView).map((crumb) => {
    if (crumb.label === "Product Offering") {
      return { ...crumb, onClick: resetView, href: undefined };
    }
    return crumb;
  });

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar menuItems={sidebarItems} onItemClick={handleSidebarClick} />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {currentView === "Overview" ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  {statsConfig.map((stat, index) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={isLoading ? "..." : String(stat.value)}
                      className={
                        statsConfig.length === 3 && index === 2 ? "col-span-2 md:col-span-1" : ""
                      }
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center gap-3 mb-6">
                  <ActionButton label="Download Table as PDF" actionText="Download" fullWidth />
                  <ActionButton label="Export Table as CSV" actionText="Export" fullWidth />
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
                    Loading products...
                  </div>
                ) : (
                  <Table
                    data={products}
                    columns={columns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                )}
              </>
            ) : currentView === "Create Product" || currentView === "Edit Product" ? (
              <CreateProductForm
                initialData={editProduct}
                onSuccess={() => {
                  setCurrentView("Overview");
                  setEditProduct(null);
                }}
                onCancel={() => {
                  setCurrentView("Overview");
                  setEditProduct(null);
                }}
              />
            ) : viewProduct ? (
              isApprover ? (
                <ViewProductRequest
                  product={viewProduct}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ) : (
                <ViewProduct
                  product={viewProduct}
                  onEdit={() => handleEditProduct(viewProduct)}
                  onDeactivate={() => handleDeactivate(viewProduct)}
                  onDisable={() => handleDisable(viewProduct)}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Unable to display the selected product view.
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
