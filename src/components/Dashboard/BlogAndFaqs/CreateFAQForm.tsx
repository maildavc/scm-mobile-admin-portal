"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import RichTextEditor from "@/components/RichTextEditor";
import Image from "next/image";
import { useCreateFAQ, useUpdateFAQ, useFAQDetails } from "@/hooks/useFaq";
import { useToastStore } from "@/stores/toastStore";
import { FAQDto } from "@/types/faq";

interface CreateFAQFormProps {
  onCancel: () => void;
  initialData?: FAQDto | null;
}

const CreateFAQForm: React.FC<CreateFAQFormProps> = ({ onCancel, initialData }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: faqDetails } = useFAQDetails(initialData?.id || "");

  const [formData, setFormData] = useState({
    faqQuestion: initialData?.question || "",
    category: initialData?.category?.toString() || "",
    whenLive: initialData?.whenShouldItGoLive || "immediately",
    scheduledDate: initialData?.scheduleDate || "",
    faqAnswer: faqDetails?.answer || initialData?.answer || "",
  });

  React.useEffect(() => {
    if (faqDetails?.answer) {
      setFormData((prev) => ({ ...prev, faqAnswer: faqDetails.answer }));
    }
  }, [faqDetails?.answer]);

  const addToast = useToastStore((s) => s.addToast);
  const today = new Date().toISOString().slice(0, 10);

  const handleInputChange = (field: string, value: string) => {
    const nextValue = field === "faqQuestion" ? value.slice(0, 200) : value;
    setFormData((prev) => {
      const next = { ...prev, [field]: nextValue };
      if (field === "whenLive" && value !== "scheduled") {
        next.scheduledDate = "";
      }
      return next;
    });
  };

  const isFormValid = () => {
    const { faqQuestion, whenLive, scheduledDate, faqAnswer, category } = formData;
    if (!faqQuestion || faqQuestion.length > 200 || !faqAnswer || !category) return false;
    if (whenLive === "scheduled") {
      if (!scheduledDate || scheduledDate < today) return false;
    }
    return true;
  };

  const createFaq = useCreateFAQ();
  const updateFaq = useUpdateFAQ();

  const handleCreateFAQ = () => {
    if (!isFormValid()) {
      addToast("Please complete all required fields with valid values", "error");
      return;
    }

    const payload = {
      question: formData.faqQuestion,
      answer: formData.faqAnswer,
      whenShouldItGoLive: formData.whenLive || undefined,
      scheduleDate:
        formData.whenLive === "scheduled" && formData.scheduledDate
          ? new Date(formData.scheduledDate).toISOString()
          : undefined,
      category: parseInt(formData.category, 10) || 1,
    };

    if (initialData) {
      updateFaq.mutate(
        { id: initialData.id, payload },
        {
          onSuccess: () => setShowSuccess(true),
        },
      );
    } else {
      createFaq.mutate(payload, {
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
      faqQuestion: "",
      category: "",
      whenLive: "immediately",
      scheduledDate: "",
      faqAnswer: "",
    });
  };

  const categoryOptions = [
    { value: "1", label: "General" },
    { value: "2", label: "Account" },
    { value: "3", label: "Account Management" },
    { value: "4", label: "Investment" },
    { value: "5", label: "Security" },
    { value: "6", label: "Technical" },
    { value: "7", label: "Billing" },
    { value: "8", label: "Support" },
    { value: "9", label: "Legal" },
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
          {initialData ? "FAQ Updated Successfully" : "FAQ Creation Successfully"}
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          {initialData
            ? "Your FAQ was successfully updated."
            : "FAQ creation was successfully sent for approver confirmation."}
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
        <h3 className="text-base font-bold text-[#2F3140] mb-1">Audience / Scheduling</h3>
        <p className="text-xs text-gray-500">
          Tell us the content of this FAQ and when it should go live
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Input
          label="FAQ Question"
          type="text"
          theme="light"
          required
          placeholder="Enter"
          maxLength={200}
          value={formData.faqQuestion}
          onChange={(e) => handleInputChange("faqQuestion", e.target.value)}
          error={formData.faqQuestion.length > 200}
          errorMessage="Max 200 characters"
        />
        <Input
          label="Category"
          type="select"
          theme="light"
          required
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          placeholder="Select Category"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

      {/* FAQ Answer Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">FAQ Answer</h3>
        <p className="text-xs text-gray-500">Enter answer</p>
      </div>

      <RichTextEditor
        label="FAQ Answer"
        required
        placeholder="Enter Text"
        value={formData.faqAnswer}
        onChange={(html) => handleInputChange("faqAnswer", html)}
        rows={15}
      />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-8">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text={
              initialData
                ? updateFaq.isPending
                  ? "Updating..."
                  : "Update FAQ"
                : createFaq.isPending
                  ? "Submitting..."
                  : "Create FAQ"
            }
            variant="primary"
            onClick={handleCreateFAQ}
            disabled={!isFormValid() || createFaq.isPending || updateFaq.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFAQForm;
