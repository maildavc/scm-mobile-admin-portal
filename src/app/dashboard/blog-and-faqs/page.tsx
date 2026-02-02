"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import Table from "@/components/Dashboard/Table";
import Tabs from "@/components/Dashboard/Tabs";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  BLOG_SIDEBAR_ITEMS,
  BLOG_STATS_CONFIG,
  FAQ_STATS_CONFIG,
  BLOG_POSTS,
  FAQS,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/blogAndFaqs/blogAndFaqs";
import { createBlogPostColumns } from "./columns";
import { createFAQColumns } from "./faqColumns";
import { useRole } from "@/context/RoleContext";

import CreateBlogPostForm from "@/components/Dashboard/BlogAndFaqs/CreateBlogPostForm";
import CreateFAQForm from "@/components/Dashboard/BlogAndFaqs/CreateFAQForm";

// Placeholder components if they don't exist yet
// Ideally these would be separate files in /components/Dashboard/BlogAndFaqs/
// I will create them inline or separate files shortly after this to avoid errors if I import them.
// For now, I'll rely on having created them or just creating them next.
// Wait, I haven't created them yet. Let me create simple placeholders first in this flow.
// Actually, I can render them inside the page component if needed, but clean code suggests separating.
// I will assume I will create:
// src/components/Dashboard/BlogAndFaqs/CreateBlogPostForm.tsx
// src/components/Dashboard/BlogAndFaqs/CreateFAQForm.tsx

export default function BlogAndFaqs() {
  const [currentView, setCurrentView] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Blog");
  const { isApprover } = useRole();

  const sidebarItems = isApprover
    ? BLOG_SIDEBAR_ITEMS.filter((item) => item.label === "Overview")
    : BLOG_SIDEBAR_ITEMS;

  const activeSidebarItems = sidebarItems.map((item) => ({
    ...item,
    isActive: item.label === currentView,
  }));

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
  };

  const breadcrumbs = getBreadcrumbs(currentView);

  const blogColumns = createBlogPostColumns((post) => {
    console.log("View post", post);
  }, isApprover);

  const faqColumns = createFAQColumns((faq) => {
    console.log("View FAQ", faq);
  }, isApprover);

  const currentStats = activeTab === "Blog" ? BLOG_STATS_CONFIG : FAQ_STATS_CONFIG;

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar
            menuItems={activeSidebarItems}
            onItemClick={handleSidebarClick}
          />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {currentView === "Overview" ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  {currentStats.map((stat, index) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      className={
                        currentStats.length === 3 && index === 2
                          ? "col-span-2 md:col-span-1"
                          : ""
                      }
                    />
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <Tabs
                    tabs={["Blog", "FAQ"]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />

                  <div className="flex gap-3">
                    <div className="">
                      <ActionButton
                        onClick={() => console.log("Download clicked")}
                        label="Download Table as PDF"
                        actionText="Download"
                        
                      />
                    </div>
                    <div className="">
                      <ActionButton
                        onClick={() => console.log("Export clicked")}
                        label="Export Table as CSV"
                        actionText="Export"
                        
                      />
                    </div>
                  </div>
                </div>

                {activeTab === "Blog" ? (
                  <Table
                    data={BLOG_POSTS}
                    columns={blogColumns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                ) : (
                  <Table
                    data={FAQS}
                    columns={faqColumns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                )}
              </>
            ) : currentView === "Create Blog Post" ? (
              <CreateBlogPostForm onCancel={() => setCurrentView("Overview")} />
            ) : currentView === "Create FAQ" ? (
              <CreateFAQForm onCancel={() => setCurrentView("Overview")} />
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
