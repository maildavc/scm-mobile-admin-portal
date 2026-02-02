"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Image from "next/image";

interface CreateFAQFormProps {
  onCancel: () => void;
}

const CreateFAQForm: React.FC<CreateFAQFormProps> = ({ onCancel }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    faqQuestion: "",
    audienceType: "",
    whenLive: "immediately",
    scheduledDate: "",
    faqAnswer: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    const { faqQuestion, audienceType, whenLive, scheduledDate, faqAnswer } =
      formData;
    if (!faqQuestion || !audienceType || !faqAnswer) return false;
    if (whenLive === "scheduled" && !scheduledDate) return false;
    return true;
  };

  const handleCreateFAQ = () => {
    if (isFormValid()) {
      console.log("Creating FAQ", formData);
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
      faqQuestion: "",
      audienceType: "",
      whenLive: "immediately",
      scheduledDate: "",
      faqAnswer: "",
    });
  };

  const audienceOptions = [
    { value: "faq-section", label: "FAQ Section" },
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
          FAQ Creation Successfully
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          FAQ creation was successfully sent for approver confirmation.
        </p>
        <div className="flex gap-4">
          <div className="w-42">
            <Button
              text="Create Another FAQ"
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
          label="FAQ Question"
          type="text"
          theme="light"
          required
          placeholder="Enter"
          value={formData.faqQuestion}
          onChange={(e) => handleInputChange("faqQuestion", e.target.value)}
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

      {/* FAQ Answer Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">FAQ Answer</h3>
        <p className="text-xs text-gray-500">Enter answer</p>
      </div>

      {/* Rich Text Editor Toolbar */}
      <div className="mb-4 flex items-center gap-3 p-1 border border-gray-200 rounded-lg bg-white">
        <select aria-label="Font family" className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none">
          <option>Roboto</option>
        </select>
        <select aria-label="Text style" className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none">
          <option>Normal</option>
        </select>
        <select aria-label="Font size" className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none">
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
        label="FAQ Answer"
        theme="light"
        required
        placeholder="Enter Text"
        value={formData.faqAnswer}
        onChange={(e) => handleInputChange("faqAnswer", e.target.value)}
        rows={15}
      />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-8">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text="Create FAQ"
            variant="primary"
            onClick={handleCreateFAQ}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFAQForm;
