"use client";

import React, { useEffect, useMemo, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { FiDownload } from "react-icons/fi";
import { EMAIL_BACKGROUND_COLORS } from "@/constants/notificationService/notificationService";
import EmailPreview from "./EmailPreview";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/hooks/useNotification";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

interface NotificationSettingsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSuccess,
  onCancel,
}) => {
  const userId = useAuthStore((s) => s.user?.id);
  const addToast = useToastStore((s) => s.addToast);
  const { data: settings, isLoading } = useNotificationSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateNotificationSettings();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("/previewlogo.svg");
  const [backgroundColor, setBackgroundColor] = useState("#F2F5F8");
  const [companyName, setCompanyName] = useState("SCM Admin");
  const [existingLogoUrl, setExistingLogoUrl] = useState("/assets/logo.svg");

  useEffect(() => {
    const branding = settings?.brandingSettings;
    if (!branding) return;

    setExistingLogoUrl(branding.logoUrl || "/assets/logo.svg");
    setLogoPreview(branding.logoUrl || "/previewlogo.svg");
    setBackgroundColor(branding.brandColor || "#F2F5F8");
    setCompanyName(branding.companyName || "SCM Admin");
  }, [settings]);

  useEffect(() => {
    if (!logoFile) return;

    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  const colorOptions = useMemo(
    () =>
      EMAIL_BACKGROUND_COLORS.map((color) => ({
        value: color.value,
        label: (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: color.value }}
            />
            <span>
              {color.value} ({color.name})
            </span>
          </div>
        ),
      })),
    [],
  );

  const handleSave = async () => {
    if (!userId) {
      addToast("You must be logged in to update notification settings", "error");
      return;
    }

    try {
      const isUsableLogoUrl =
        !!existingLogoUrl &&
        !existingLogoUrl.startsWith("/") &&
        (existingLogoUrl.startsWith("http") || existingLogoUrl.startsWith("data:"));
      const logoUrl = logoFile
        ? await fileToBase64(logoFile)
        : isUsableLogoUrl
          ? existingLogoUrl
          : undefined;

      await updateSettings({
        userId,
        brandingSettings: {
          ...(logoUrl ? { logoUrl } : {}),
          brandColor: backgroundColor,
          companyName: companyName.trim() || "SCM Admin",
        },
      });
      onSuccess();
    } catch {
      // Toast is handled by the mutation hook.
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Loading notification settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg pb-10">
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Edit Your Email Notification Template
        </h3>
        <p className="text-xs text-gray-500">
          Update the logo and background colour used for email notifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Input
          label="Email Logo"
          type="file"
          theme="light"
          required
          placeholder="IMG87654323456"
          rightIcon={<FiDownload size={18} />}
          onFileChange={setLogoFile}
          className="border-green-500"
        />
        <Input
          label="Email Background Colour"
          type="select"
          theme="light"
          required
          options={colorOptions}
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          placeholder="Select Color"
        />
      </div>

      <EmailPreview backgroundColor={backgroundColor} logoSrc={logoPreview} />

      <div className="flex justify-end gap-3 pt-4">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} disabled={isPending} />
        </div>
        <div className="w-48">
          <Button
            text={isPending ? "Saving..." : "Save Changes"}
            variant="primary"
            onClick={handleSave}
            disabled={isPending || !userId}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
