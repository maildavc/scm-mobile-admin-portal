"use client";

import React, { useState } from "react";
import { FiEye, FiPaperclip } from "react-icons/fi";
import {
  RECIPIENT_TYPES,
  AUDIENCE_OPTIONS,
  CHANNEL_OPTIONS,
  SEND_TYPES,
  EMAIL_REPLY_OPTIONS,
} from "@/constants/notificationService/notificationService";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";

interface CreateNotificationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateNotificationForm: React.FC<CreateNotificationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toOptions = (items: string[]) =>
    items.map((item) => ({ label: item, value: item }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Simulate API call
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg pb-10">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        {/* Audience / Targeting */}
        <section>
          <h3 className="text-sm font-bold text-[#2F3140] mb-1">
            Audience / Targeting
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Tell us who this notification is intended for
          </p>

          <div className="space-y-6">
            <Input
              label="Notification Title or Subject"
              placeholder="Enter"
              theme="light"
              required
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Recipient Type"
                type="select"
                theme="light"
                required
                options={toOptions(RECIPIENT_TYPES)}
                value={formData.recipientType}
                onChange={(e) =>
                  handleInputChange("recipientType", e.target.value)
                }
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
            <h3 className="text-sm font-bold text-[#2F3140]">
              Notification Creator
            </h3>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-xs font-medium text-[#2F3140] hover:bg-gray-200"
            >
              <FiEye /> View Notification
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Assign a role to this user
          </p>

          {/* Rich Text Editor Toolbar */}
          <div className="mb-4 flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
            <select className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none">
              <option>Roboto</option>
            </select>
            <select className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none">
              <option>Normal</option>
            </select>
            <select className="px-2 py-1 text-sm border-none focus:ring-0 text-[#2F3140] bg-transparent outline-none">
              <option>16</option>
            </select>
            <div className="h-5 w-px bg-gray-300" />
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]">
              <strong className="text-sm">B</strong>
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]">
              <em className="text-sm">I</em>
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]">
              <u className="text-sm">U</u>
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">S</button>
            <div className="h-5 w-px bg-gray-300" />
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">•</button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">1.</button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">⇥</button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">⇤</button>
            <div className="h-5 w-px bg-gray-300" />
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">x₂</button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">x²</button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">🔗</button>
            <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm">🖼</button>
          </div>

          <TextArea
            label="Notification Body"
            theme="light"
            required
            placeholder="Enter Text"
            value={formData.body}
            onChange={(e) => handleInputChange("body", e.target.value)}
            rows={12}
          />
        </section>

        {/* Reply Options */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              required
              value={formData.replyToEmail}
              onChange={(e) =>
                handleInputChange("replyToEmail", e.target.value)
              }
              rightIcon={<FiPaperclip size={18} />}
            />
          </div>
        </section>

        {/* Scheduling & Delivery */}
        <section>
          <h3 className="text-sm font-bold text-[#2F3140] mb-1">
            Scheduling & Delivery
          </h3>
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
              required
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              placeholder="DD/MM/YYYY"
            />
            <Input
              label="Time"
              type="time"
              theme="light"
              required
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
              text="Create Notification"
              variant="primary"
              disabled={false}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNotificationForm;
