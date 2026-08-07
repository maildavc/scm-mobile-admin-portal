import React, { useState } from "react";
import { FiEye, FiLink2 } from "react-icons/fi";
import {
  RECIPIENT_TYPES,
  AUDIENCE_OPTIONS,
  CHANNEL_OPTIONS,
  SEND_TYPES,
  EMAIL_REPLY_OPTIONS,
} from "@/constants/notificationService/notificationService";
import Input from "@/components/Input";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import EmailPreviewModal from "./EmailPreviewModal";
import { useCreateNotification } from "@/hooks/useNotification";
import { useToastStore } from "@/stores/toastStore";
import { NotificationChannel, RecipientType } from "@/types/notification";

interface CreateNotificationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateNotificationForm: React.FC<CreateNotificationFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    recipientType: "",
    audience: "",
    channel: "",
    body: "",
    allowReply: "",
    replyToEmail: "",
    sendType: "",
    date: "",
    time: "",
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { mutate: createNotification, isPending } = useCreateNotification();
  const addToast = useToastStore((s) => s.addToast);
  const isScheduled = formData.sendType === "Later";
  const today = new Date().toISOString().slice(0, 10);

  const handleInputChange = (field: string, value: string) => {
    const nextValue = field === "title" ? value.slice(0, 120) : value;
    setFormData((prev) => {
      const next = { ...prev, [field]: nextValue };
      // Immediately / Now → disable and clear schedule fields
      if (field === "sendType" && value !== "Later") {
        next.date = "";
        next.time = "";
      }
      if (field === "allowReply" && value !== "Yes") {
        next.replyToEmail = "";
      }
      return next;
    });
  };

  const toOptions = (items: string[]) => items.map((item) => ({ label: item, value: item }));

  // Map UI channel label → backend integer enum
  const channelMap: Record<string, NotificationChannel> = {
    Email: NotificationChannel.Email, // 1
    SMS: NotificationChannel.SMS, // 2
    "Push Notification": NotificationChannel.Push, // 3
    "In-App": NotificationChannel.InApp, // 4
  };

  // Map UI recipient type label → backend integer enum
  const recipientTypeMap: Record<string, RecipientType> = {
    "All Users": RecipientType.AllUsers, // 1
    Vendor: RecipientType.Vendor, // 2
    Customer: RecipientType.Customer, // 3
    "Specific Users": RecipientType.SpecificUsers, // 4
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim().length === 0 || formData.title.length > 120) {
      addToast("Title is required and must be at most 120 characters", "error");
      return;
    }

    // Build scheduled date from separate date+time fields
    let scheduledFor: string | undefined;
    if (formData.sendType === "Later") {
      if (!formData.date || !formData.time) {
        addToast("Date and time are required for scheduled notifications", "error");
        return;
      }
      const dt = new Date(`${formData.date}T${formData.time}`);
      if (Number.isNaN(dt.getTime()) || dt.getTime() < Date.now()) {
        addToast("Scheduled date/time must be in the future", "error");
        return;
      }
      scheduledFor = dt.toISOString();
    }

    createNotification(
      {
        title: formData.title,
        message: formData.body,
        channel: channelMap[formData.channel] ?? NotificationChannel.Email,
        recipientType: recipientTypeMap[formData.recipientType] ?? undefined,
        targetAudience: formData.audience || undefined,
        scheduledFor,
        allowReply: formData.allowReply === "Yes",
        replyToEmail: formData.allowReply === "Yes" ? formData.replyToEmail : undefined,
      },
      { onSuccess },
    );
  };

  return (
    <div className="bg-white rounded-lg pb-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Audience / Targeting */}
        <section>
          <h3 className="text-sm font-bold text-[#2F3140] mb-1">Audience / Targeting</h3>
          <p className="text-xs text-gray-500 mb-6">
            Tell us who this notification is intended for
          </p>

          <div className="space-y-6">
            <Input
              label="Notification Title or Subject"
              placeholder="Enter"
              theme="light"
              required
              maxLength={120}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={formData.title.length > 120}
              errorMessage="Max 120 characters"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Recipient Type"
                type="select"
                theme="light"
                required
                options={toOptions(RECIPIENT_TYPES)}
                value={formData.recipientType}
                onChange={(e) => handleInputChange("recipientType", e.target.value)}
                placeholder="Select Option"
              />
              <Input
                label="Audience"
                type="select"
                theme="light"
                required
                options={toOptions(AUDIENCE_OPTIONS)}
                value={formData.audience}
                onChange={(e) => handleInputChange("audience", e.target.value)}
                placeholder="Select Option"
              />
              <Input
                label="Channel"
                type="select"
                theme="light"
                required
                options={toOptions(CHANNEL_OPTIONS)}
                value={formData.channel}
                onChange={(e) => handleInputChange("channel", e.target.value)}
                placeholder="Select Option"
              />
            </div>
          </div>
        </section>

        {/* Notification Creator */}
        <section>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-[#2F3140]">Notification Creator</h3>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gray-100 rounded-lg text-xs font-medium text-[#2F3140] hover:bg-gray-200"
            >
              <FiEye /> View Notification
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-6">Assign a role to this user</p>

          <RichTextEditor
            label="Notification Body"
            required
            placeholder="Enter Text"
            value={formData.body}
            onChange={(html) => handleInputChange("body", html)}
            rows={12}
          />
        </section>

        {/* Reply Options */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Allow Email Reply"
              type="select"
              theme="light"
              required
              options={toOptions(EMAIL_REPLY_OPTIONS)}
              value={formData.allowReply}
              onChange={(e) => handleInputChange("allowReply", e.target.value)}
              placeholder="Select Option"
            />
            <Input
              label="Where should replies go to?"
              placeholder="Enter email address"
              theme="light"
              required={formData.allowReply === "Yes"}
              disabled={formData.allowReply !== "Yes"}
              inputKind="email"
              maxLength={100}
              value={formData.replyToEmail}
              onChange={(e) => handleInputChange("replyToEmail", e.target.value)}
              rightIcon={<FiLink2 size={18} />}
            />
          </div>
        </section>

        {/* Scheduling & Delivery */}
        <section>
          <h3 className="text-sm font-bold text-[#2F3140] mb-1">Scheduling & Delivery</h3>
          <p className="text-xs text-gray-500 mb-6">
            When do you want this notification to be sent?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Send Type"
              type="select"
              theme="light"
              required
              options={toOptions(SEND_TYPES)}
              value={formData.sendType}
              onChange={(e) => handleInputChange("sendType", e.target.value)}
              placeholder="Select Option"
            />
            <Input
              label="Date"
              type="date"
              theme="light"
              required={isScheduled}
              disabled={!isScheduled}
              minDate={today}
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              placeholder="DD/MM/YYYY"
            />
            <Input
              label="Time"
              type="time"
              theme="light"
              required={isScheduled}
              disabled={!isScheduled}
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              placeholder="00:00 AM"
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4 pb-4">
          <div className="w-32">
            <Button text="Cancel" variant="outline" onClick={onCancel} />
          </div>
          <div className="w-48">
            <Button
              text={isPending ? "Creating..." : "Create Notification"}
              variant="primary"
              disabled={isPending}
            />
          </div>
        </div>
      </form>

      <EmailPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={formData.title}
        body={formData.body}
      />
    </div>
  );
};

export default CreateNotificationForm;
