"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import RichTextEditor from "@/components/RichTextEditor";
import Image from "next/image";
import { useCreateBlog, useUpdateBlog, useBlogDetails } from "@/hooks/useBlog";
import { useToastStore } from "@/stores/toastStore";
import { BlogListDto } from "@/types/blog";

interface CreateBlogPostFormProps {
  onCancel: () => void;
  initialData?: BlogListDto | null;
}

const CreateBlogPostForm: React.FC<CreateBlogPostFormProps> = ({ onCancel, initialData }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch full details if editing, so we can pre-fill the content body
  const { data: blogDetailsResponse, isLoading: isLoadingDetails } = useBlogDetails(
    initialData?.id || "",
  );
  const blogDetails = blogDetailsResponse?.data;

  const [formData, setFormData] = useState({
    blogTitle: initialData?.title || "",
    audienceType: initialData?.audienceType || "",
    whenLive: initialData?.whenShouldItGoLive || "immediately",
    scheduledDate: initialData?.scheduleDate || "",
    blogBody: blogDetails?.content || "",
  });

  // Update content once details are fetched
  React.useEffect(() => {
    if (blogDetails?.content) {
      setFormData((prev) => ({ ...prev, blogBody: blogDetails.content }));
    }
  }, [blogDetails?.content]);

  const addToast = useToastStore((s) => s.addToast);
  const today = new Date().toISOString().slice(0, 10);

  const handleInputChange = (field: string, value: string) => {
    const nextValue = field === "blogTitle" ? value.slice(0, 120) : value;
    setFormData((prev) => ({ ...prev, [field]: nextValue }));
  };

  const isFormValid = () => {
    const { blogTitle, audienceType, whenLive, scheduledDate, blogBody } = formData;
    if (!blogTitle || blogTitle.length > 120 || !audienceType || !blogBody) return false;
    if (whenLive === "scheduled") {
      if (!scheduledDate || scheduledDate < today) return false;
    }
    return true;
  };

  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const handleCreateBlog = () => {
    if (!isFormValid()) {
      addToast("Please complete all required fields with valid values", "error");
      return;
    }

    const payload = {
      title: formData.blogTitle,
      content: formData.blogBody,
      audienceType: formData.audienceType || undefined,
      whenShouldItGoLive: formData.whenLive || undefined,
      scheduleDate:
        formData.whenLive === "scheduled" && formData.scheduledDate
          ? new Date(formData.scheduledDate).toISOString()
          : undefined,
      category: "General",
    };

    if (initialData) {
      updateBlog.mutate(
        { id: initialData.id, payload },
        {
          onSuccess: () => setShowSuccess(true),
        },
      );
    } else {
      createBlog.mutate(payload, {
        onSuccess: () => setShowSuccess(true),
      });
    }
  };

  const handleBackToOverview = () => {
    setShowSuccess(false);
    onCancel();
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setFormData({
      blogTitle: "",
      audienceType: "",
      whenLive: "immediately",
      scheduledDate: "",
      blogBody: "",
    });
  };

  const audienceOptions = [
    { value: "blog-section", label: "Blog Section" },
    { value: "homepage", label: "Homepage" },
    { value: "product-page", label: "Product Page" },
  ];

  const whenLiveOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "scheduled", label: "Scheduled" },
  ];

  // Success Screen
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">Blog Creation Successfully</h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Blog creation was successfully sent for approver confirmation.
        </p>
        <div className="flex gap-4">
          <div className="w-48">
            <Button
              text="Create Another Blog"
              variant="outline"
              onClick={handleCreateAnother}
              className="text-sm"
            />
          </div>
          <div className="w-24">
            <Button
              text="Done"
              variant="primary"
              onClick={handleBackToOverview}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg pb-10">
      {/* Audience / Scheduling Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">Audience / Scheduling</h3>
        <p className="text-xs text-gray-500">
          Tell us the content of this FAQ and when it should go live
        </p>
      </div>

      <div className="mb-6">
        <Input
          label="Blog Title or Subject"
          type="text"
          theme="light"
          required
          placeholder="Enter"
          maxLength={120}
          value={formData.blogTitle}
          onChange={(e) => handleInputChange("blogTitle", e.target.value)}
          error={formData.blogTitle.length > 120}
          errorMessage="Max 120 characters"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Input
          label="Audience Type"
          type="select"
          theme="light"
          required
          options={audienceOptions}
          value={formData.audienceType}
          onChange={(e) => handleInputChange("audienceType", e.target.value)}
          placeholder="Select Option"
        />
        <Input
          label="When should this go live?"
          type="select"
          theme="light"
          required
          options={whenLiveOptions}
          value={formData.whenLive}
          onChange={(e) => handleInputChange("whenLive", e.target.value)}
          placeholder="Immediately"
        />
        <Input
          label="Scheduled Date"
          type="date"
          theme="light"
          required={formData.whenLive === "scheduled"}
          placeholder="DD/MM/YYYY"
          value={formData.scheduledDate}
          onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
          disabled={formData.whenLive !== "scheduled"}
          minDate={today}
        />
      </div>

      {/* Blog Creator Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">Blog Creator</h3>
        <p className="text-xs text-gray-500">Enter blog details</p>
      </div>

      <RichTextEditor
        label="Blog Body"
        required
        placeholder="Enter Text"
        value={formData.blogBody}
        onChange={(html) => handleInputChange("blogBody", html)}
        rows={15}
      />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-8">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text={createBlog.isPending ? "Submitting..." : "Create Blog"}
            variant="primary"
            onClick={handleCreateBlog}
            disabled={!isFormValid() || createBlog.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPostForm;
