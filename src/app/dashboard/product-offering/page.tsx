"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/ProductOffering/StatsCard";
import Table from "@/components/Dashboard/Table";
import CreateProductForm from "@/components/Dashboard/ProductOffering/CreateProductForm";
import ViewProduct from "@/components/Dashboard/ProductOffering/ViewProduct";
import ViewProductRequest from "@/components/Dashboard/ProductOffering/ViewProductRequest";
import {
  PRODUCTS,
  PRODUCT_OFFERING_SIDEBAR_ITEMS,
  STATS_CONFIG,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/productOffering/productOffering";
import { createProductColumns } from "./columns";
import { useRole } from "@/context/RoleContext";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

export default function ProductOffering() {
  const { isApprover } = useRole();
  const [currentView, setCurrentView] = useState("Overview");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Filter sidebar items based on role - Approver only sees Overview
  const filteredSidebarItems = isApprover
    ? PRODUCT_OFFERING_SIDEBAR_ITEMS.filter((item) => item.label === "Overview")
    : PRODUCT_OFFERING_SIDEBAR_ITEMS;

  const sidebarItems = filteredSidebarItems.map((item) => ({
    ...item,
    isActive: viewProduct
      ? item.label === "Overview"
      : item.label === currentView,
  }));

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setEditProduct(null);
    setViewProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setViewProduct(null);
    setCurrentView("Create Product");
  };

  const handleViewProduct = (product: Product) => {
    setViewProduct(product);
    setEditProduct(null);
    setCurrentView(product.name);
  };

  const columns = createProductColumns(
    handleEditProduct,
    handleViewProduct,
    isApprover,
  );

  const resetView = () => {
    setCurrentView("Overview");
    setEditProduct(null);
    setViewProduct(null);
  };

  const breadcrumbs = getBreadcrumbs(
    viewProduct ? viewProduct.name : currentView,
  ).map((crumb) => {
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
                  {STATS_CONFIG.map((stat, index) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      className={
                        STATS_CONFIG.length === 3 && index === 2
                          ? "col-span-2 md:col-span-1"
                          : ""
                      }
                    />
                  ))}
                </div>

                <Table
                  data={PRODUCTS}
                  columns={columns}
                  itemsPerPage={PAGE_CONFIG.itemsPerPage}
                />
              </>
            ) : currentView === "Create Product" ? (
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
                  onApprove={() => {
                    // Handle approval
                    setCurrentView("Overview");
                    setViewProduct(null);
                  }}
                  onReject={() => {
                    // Handle rejection
                    setCurrentView("Overview");
                    setViewProduct(null);
                  }}
                />
              ) : (
                <ViewProduct
                  product={viewProduct}
                  onEdit={() => handleEditProduct(viewProduct)}
                  onDeactivate={() => {
                    // Handle deactivation
                    setCurrentView("Overview");
                    setViewProduct(null);
                  }}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {currentView} view coming soon
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
