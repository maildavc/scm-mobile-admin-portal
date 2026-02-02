"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";
import { FiGlobe, FiDownload } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { BsTwitterX } from "react-icons/bs";
import { EMAIL_BACKGROUND_COLORS } from "@/constants/notificationService/notificationService";

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

  const handleInputChange = (field: string, value: any) => {
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
      <div
        className="max-w-2xl mx-auto flex flex-col items-center justify-center mb-8 transition-colors duration-300"
        style={{ backgroundColor: formData.backgroundColor }}
      >
        {/* Logo - Centered above card */}
        <div className="my-8 flex flex-col items-center">
          <Image
            src="/previewlogo.svg"
            alt="Asset+ Logo"
            width={120}
            height={40}
            className="" // Adjust sizing as needed
          />
        </div>

        {/* Content Card - White box */}
        <div className="bg-white max-w-xl w-full p-12 text-[#333333]">
          <p className="mb-6 font-medium text-lg">Hi {"{{firstName}}"},</p>
          <p className="mb-6">
            Welcome to SCM Asset Plus — Invest in both Naira and USD
          </p>
          <p className="mb-6 leading-relaxed text-gray-600">
            We're here to guide you in making smart investments and achieving
            your financial dreams. Let's take the first step together toward a
            future of lasting prosperity
          </p>
          <div className="mt-8">
            <p>Regards,</p>
            <p>SCM Asset Plus Team</p>
          </div>
        </div>

        {/* Footer - Centered below card */}
        <div className="mt-8 max-w-lg">
          <div className="">
            <p className="text-xs md:text-sm text-[#333333] px-5 md:px-0 mb-6 leading-relaxed">
              This email was sent to{" "}
              <span className="text-[#B2171E] underline cursor-pointer">
                useremail@eatfresh.com.
              </span>{" "}
              If this was sent in error, unsubscribe.
            </p>
          </div>

          <div className="flex py-10 justify-center gap-6 text-[#6A7C94]">
            <BsTwitterX size={22} className="cursor-pointer" />
            <AiFillInstagram size={22} className="cursor-pointer" />
            <FaLinkedin size={22} className="cursor-pointer" />
            <FiGlobe size={22} className="cursor-pointer" />
          </div>
        </div>
      </div>

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
