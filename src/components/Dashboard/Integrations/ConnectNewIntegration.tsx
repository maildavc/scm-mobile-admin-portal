"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { FiImage } from "react-icons/fi";
import Image from "next/image";

export interface ConnectNewIntegrationData {
  name: string;
  description: string;
  clientUrl: string;
  clientSecretKey: string;
  username: string;
  password: string;
}

interface ConnectNewIntegrationProps {
  onCancel: () => void;
  onTestConnection: (data: ConnectNewIntegrationData) => void;
  initialData?: ConnectNewIntegrationData;
}

const ConnectNewIntegration: React.FC<ConnectNewIntegrationProps> = ({
  onCancel,
  onTestConnection,
  initialData,
}) => {
  const [formData, setFormData] = useState<ConnectNewIntegrationData>(
    initialData || {
      name: "",
      description: "",
      clientUrl: "",
      clientSecretKey: "",
      username: "",
      password: "",
    },
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isValidUrl = (value: string) => /^https?:\/\/.+\..+/i.test(value.trim());

  const fieldErrors = React.useMemo(() => {
    const errors: Partial<Record<keyof ConnectNewIntegrationData, string>> = {};
    if (formData.name && formData.name.length > 100) {
      errors.name = "Max 100 characters";
    }
    if (formData.username && formData.username.length > 50) {
      errors.username = "Max 50 characters";
    }
    if (formData.clientUrl && !isValidUrl(formData.clientUrl)) {
      errors.clientUrl = "Enter a valid URL starting with http:// or https://";
    }
    if (formData.description && formData.description.length > 250) {
      errors.description = "Max 250 characters";
    }
    return errors;
  }, [formData]);

  const isValid = React.useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.clientUrl.trim() !== "" &&
      formData.clientSecretKey.trim() !== "" &&
      formData.username.trim() !== "" &&
      formData.password.trim() !== "" &&
      Object.keys(fieldErrors).length === 0
    );
  }, [formData, fieldErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const limits: Record<string, number> = {
      name: 100,
      description: 250,
      username: 50,
      clientSecretKey: 256,
    };
    const max = limits[name];
    setFormData({ ...formData, [name]: max ? value.slice(0, max) : value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#2F3140]">Audience / Targeting</h2>
        <p className="text-sm text-[#707781] mt-1">Tell us who this notification is intended for</p>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {/* Image Upload Placeholder */}
        <div
          onClick={handleImageClick}
          className="w-24 h-24 rounded-full bg-[#1A1C29] flex items-center justify-center mb-12 cursor-pointer overflow-hidden relative transition-opacity hover:opacity-90"
        >
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          ) : (
            <FiImage size={32} className="text-white" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            aria-label="Upload integration image"
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
          <Input
            label="Integration name"
            placeholder="Enter"
            required
            theme="light"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="w-full"
            maxLength={100}
            inputKind="text"
            error={!!fieldErrors.name}
            errorMessage={fieldErrors.name}
          />
          <Input
            label="Description"
            placeholder="Enter"
            name="description"
            value={formData.description}
            onChange={handleChange}
            theme="light"
            type="text"
            className="w-full"
            maxLength={250}
            inputKind="text"
            error={!!fieldErrors.description}
            errorMessage={fieldErrors.description}
          />
          <Input
            label="Client URL"
            placeholder="https://example.com"
            required
            name="clientUrl"
            value={formData.clientUrl}
            onChange={handleChange}
            theme="light"
            type="url"
            className="w-full"
            inputKind="url"
            error={!!fieldErrors.clientUrl}
            errorMessage={fieldErrors.clientUrl}
          />
          <Input
            label="Client Secret Key"
            placeholder="Input secret key"
            required
            name="clientSecretKey"
            value={formData.clientSecretKey}
            onChange={handleChange}
            theme="light"
            type="password"
            isPassword
            className="w-full"
            maxLength={256}
            inputKind="password"
          />
          <Input
            label="Username"
            placeholder="Enter username"
            required
            name="username"
            value={formData.username}
            onChange={handleChange}
            theme="light"
            type="text"
            className="w-full"
            maxLength={50}
            inputKind="text"
            error={!!fieldErrors.username}
            errorMessage={fieldErrors.username}
          />
          <Input
            label="Password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            theme="light"
            type="password"
            isPassword={true}
            required
            className="w-full"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-12 flex justify-end gap-3">
        <div className="w-32">
          <Button
            text="Cancel"
            variant="primary"
            onClick={onCancel}
            className="bg-[#F4F4F5]! text-[#2F3140]! border-none! font-bold"
          />
        </div>
        <div className="w-40">
          <Button
            text={initialData ? "Save Connection" : "Test Connection"}
            variant="primary"
            onClick={() => onTestConnection(formData)}
            disabled={!isValid}
            className={`${isValid ? "bg-[#B2171E]! text-white!" : "bg-[#F2D4D7]! text-white!"} border-none! font-bold transition-colors`}
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectNewIntegration;
