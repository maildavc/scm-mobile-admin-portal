"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { FiDownload } from "react-icons/fi";
import { EMAIL_BACKGROUND_COLORS } from "@/constants/notificationService/notificationService";
import EmailPreview from "./EmailPreview";

interface NotificationSettingsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    backgroundColor: "#F8F9FB",
  });

  const handleInputChange = (
    field: "logo" | "backgroundColor",
    value: File | null | string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    handleInputChange("logo", file);
  };

  const colorOptions = EMAIL_BACKGROUND_COLORS.map((color) => ({
    value: color.value,
    label: (
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded border border-gray-300"
          style={{ backgroundColor: color.value }}
        ></div>
        <span>
          {color.value} ({color.name})
        </span>
      </div>
    ),
  }));

  return (
    <div className="bg-white rounded-lg pb-10">
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Edit Your Email Notification Template
        </h3>
        <p className="text-xs text-gray-500">
          Tell us who this notification is intended for
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Input
          label="Email Logo"
          type="file"
          theme="light"
          required
          placeholder="IMG87654323456"
          rightIcon={<FiDownload size={18} />}
          onFileChange={handleFileChange}
          className="border-green-500"
        />
        <Input
          label="Email Background Colour"
          type="select"
          theme="light"
          required
          options={colorOptions}
          value={formData.backgroundColor}
          onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
          placeholder="Select Color"
        />
      </div>

      {/* Preview Area */}
      <EmailPreview backgroundColor={formData.backgroundColor} />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-48">
          <Button
            text="Save Changes"
            variant="primary"
            onClick={() => {
              console.log("Saving settings", formData);
              onSuccess();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
