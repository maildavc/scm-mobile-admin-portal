"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Image from "next/image";

interface CreateBlogPostFormProps {
  onCancel: () => void;
}

const CreateBlogPostForm: React.FC<CreateBlogPostFormProps> = ({
  onCancel,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    blogTitle: "",
    audienceType: "",
    whenLive: "immediately",
    scheduledDate: "",
    blogBody: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    const { blogTitle, audienceType, whenLive, scheduledDate, blogBody } =
      formData;
    if (!blogTitle || !audienceType || !blogBody) return false;
    if (whenLive === "scheduled" && !scheduledDate) return false;
    return true;
  };

  const handleCreateBlog = () => {
    if (isFormValid()) {
      console.log("Creating blog post", formData);
      setShowSuccess(true);
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
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Blog Creation Successfully
        </h2>
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
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Audience / Scheduling
        </h3>
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
          value={formData.blogTitle}
          onChange={(e) => handleInputChange("blogTitle", e.target.value)}
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
        />
      </div>

      {/* Blog Creator Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Blog Creator
        </h3>
        <p className="text-xs text-gray-500">Enter blog details</p>
      </div>

      {/* Rich Text Editor Toolbar */}
      <div className="mb-4 flex items-center gap-3 p-1 border border-gray-200 rounded-lg bg-white">
        <select
          className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none"
          aria-label="Font Family"
        >
          <option>Roboto</option>
        </select>
        <select
          className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none"
          aria-label="Font Style"
        >
          <option>Normal</option>
        </select>
        <select
          className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none"
          aria-label="Font Size"
        >
          <option>16</option>
        </select>
        <div className="h-5 w-px bg-gray-300" />
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]"
        >
          <strong className="text-sm">B</strong>
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]"
        >
          <em className="text-sm">I</em>
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]"
        >
          <u className="text-sm">U</u>
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          S
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          •
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          1.
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          ⇥
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          ⇤
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          x₂
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          x²
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          🔗
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
        >
          🖼
        </button>
      </div>

      <TextArea
        label="Blog Body"
        theme="light"
        required
        placeholder="Enter Text"
        value={formData.blogBody}
        onChange={(e) => handleInputChange("blogBody", e.target.value)}
        rows={15}
      />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-8">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text="Create Blog"
            variant="primary"
            onClick={handleCreateBlog}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPostForm;
