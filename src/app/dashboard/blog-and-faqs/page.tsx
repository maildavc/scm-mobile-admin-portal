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
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/blogAndFaqs/blogAndFaqs";
import { createBlogPostColumns } from "./columns";
import { createFAQColumns } from "./faqColumns";
import { useAuthStore } from "@/stores/authStore";

import CreateBlogPostForm from "@/components/Dashboard/BlogAndFaqs/CreateBlogPostForm";
import CreateFAQForm from "@/components/Dashboard/BlogAndFaqs/CreateFAQForm";
import ViewBlogRequest from "@/components/Dashboard/BlogAndFaqs/ViewBlogRequest";
import ViewFAQRequest from "@/components/Dashboard/BlogAndFaqs/ViewFAQRequest";
import { useBlogs, useBlogStats } from "@/hooks/useBlog";
import { useFAQs, useFAQStats } from "@/hooks/useFaq";
import { BlogListDto } from "@/types/blog";
import { FAQDto } from "@/types/faq";

export default function BlogAndFaqs() {
  const [currentView, setCurrentView] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Blog");
  const [viewBlogPost, setViewBlogPost] = useState<BlogListDto | null>(null);
  const [viewFAQ, setViewFAQ] = useState<FAQDto | null>(null);
  const [editBlogPost, setEditBlogPost] = useState<BlogListDto | null>(null);
  const [editFAQ, setEditFAQ] = useState<FAQDto | null>(null);
  const isApprover = useAuthStore((s) => s.isApprover);

  const { data: blogsRes, isLoading: blogsLoading } = useBlogs({
    Page: 1,
    Limit: PAGE_CONFIG.itemsPerPage,
  });

  const { data: faqsRes, isLoading: faqsLoading } = useFAQs({
    Page: 1,
    PageSize: PAGE_CONFIG.itemsPerPage,
  });

  const { data: blogStatsRes } = useBlogStats();
  const { data: faqStatsRes } = useFAQStats();

  const blogPosts = blogsRes?.data || [];
  // Backend returns pagination directly for FAQ or wrapped in value
  const faqList = faqsRes?.items || faqsRes?.value?.items || [];

  const sidebarItems = isApprover
    ? BLOG_SIDEBAR_ITEMS.filter((item) => item.label === "Overview")
    : BLOG_SIDEBAR_ITEMS;

  const activeSidebarItems = sidebarItems.map((item) => ({
    ...item,
    isActive: item.label === currentView,
  }));

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setViewBlogPost(null);
    setViewFAQ(null);
  };

  const breadcrumbs = getBreadcrumbs(currentView);

  const faqsTotalCount = faqsRes?.value?.totalCount || faqsRes?.totalCount || 0;
  const blogsTotalCount = blogsRes?.totalCount || 0;

  const blogColumns = createBlogPostColumns(
    (post) => setViewBlogPost(post as BlogListDto),
    isApprover,
    (post) => {
      setEditBlogPost(post as BlogListDto);
      setCurrentView("Create Blog Post");
    },
    blogsTotalCount
  );

  const faqColumns = createFAQColumns(
    (faq) => setViewFAQ(faq as FAQDto),
    isApprover,
    (faq) => {
      setEditFAQ(faq as FAQDto);
      setCurrentView("Create FAQ");
    },
    faqsTotalCount
  );

  const currentStats =
    activeTab === "Blog"
      ? [
          { label: "All Blogs", value: String(blogStatsRes?.allBlogs?.totalPosts ?? blogsTotalCount) },
          { label: "Homepage Blogs", value: String(blogStatsRes?.homepageBlogs?.totalPosts ?? 0) },
          { label: "Product Blogs", value: String(blogStatsRes?.productBlogs?.totalPosts ?? 0) },
        ]
      : [
          { label: "All FAQs", value: String(faqStatsRes?.allFAQs?.totalFAQs ?? faqsTotalCount) },
          { label: "Homepage FAQs", value: String(faqStatsRes?.homepageFAQs?.totalFAQs ?? 0) },
          { label: "Product FAQs", value: String(faqStatsRes?.productFAQs?.totalFAQs ?? 0) },
        ];

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
            {viewBlogPost ? (
              <ViewBlogRequest
                blogPost={viewBlogPost}
                isApprover={isApprover}
                onApprove={() => {
                  setCurrentView("Overview");
                  setViewBlogPost(null);
                }}
                onReject={() => {
                  setCurrentView("Overview");
                  setViewBlogPost(null);
                }}
              />
            ) : viewFAQ ? (
              <ViewFAQRequest
                faq={viewFAQ}
                isApprover={isApprover}
                onApprove={() => {
                  setCurrentView("Overview");
                  setViewFAQ(null);
                }}
                onReject={() => {
                  setCurrentView("Overview");
                  setViewFAQ(null);
                }}
              />
            ) : currentView === "Overview" ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  {currentStats.map((stat, index) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      showLink={false}
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
                    data={blogPosts}
                    columns={blogColumns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                    isLoading={blogsLoading}
                  />
                ) : (
                  <Table
                    data={faqList}
                    columns={faqColumns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                    isLoading={faqsLoading}
                  />
                )}
              </>
            ) : currentView === "Create Blog Post" ? (
              <CreateBlogPostForm 
                initialData={editBlogPost} 
                onCancel={() => {
                  setCurrentView("Overview");
                  setEditBlogPost(null);
                }} 
              />
            ) : currentView === "Create FAQ" ? (
              <CreateFAQForm 
                initialData={editFAQ} 
                onCancel={() => {
                  setCurrentView("Overview");
                  setEditFAQ(null);
                }} 
              />
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
