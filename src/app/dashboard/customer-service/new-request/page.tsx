"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import PageHeader from "@/components/Dashboard/PageHeader";
import { SidebarProvider } from "@/components/Dashboard/Sidebar";
import { useCreateSupportRequest } from "@/hooks/useCustomerSupport";

export default function NewSupportRequest() {
  const router = useRouter();
  const createRequest = useCreateSupportRequest();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [submitted, setSubmitted] = useState(false);

  const subjectError = submitted && subject.trim().length < 3;
  const messageError = submitted && message.trim().length < 10;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (subjectError || messageError || !subject.trim() || !message.trim()) {
      return;
    }

    await createRequest.mutateAsync({
      subject: subject.trim(),
      message: message.trim(),
      priority,
    });
    router.push("/dashboard/customer-service/messages");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#FAFAFA]">
        <PageHeader
          title="New Support Request"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            {
              label: "Customer Support",
              href: "/dashboard/customer-service",
            },
            { label: "New Request", active: true },
          ]}
        />

        <main className="mx-auto w-full max-w-3xl p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#2F3140]">Request details</h2>
              <p className="mt-1 text-sm text-[#707781]">
                Provide enough context for the support team to investigate.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <Input
                label="Subject"
                theme="light"
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                error={subjectError}
                errorMessage={subjectError ? "Subject must contain at least 3 characters" : ""}
                placeholder="Brief summary of the issue"
                maxLength={160}
              />
              <Input
                label="Priority"
                theme="light"
                type="select"
                required
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Medium", label: "Medium" },
                  { value: "High", label: "High" },
                  { value: "Urgent", label: "Urgent" },
                ]}
              />
              <div>
                <TextArea
                  label="Message"
                  theme="light"
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  error={messageError}
                  placeholder="Describe what happened, what you expected, and any relevant identifiers"
                  maxLength={4000}
                />
                {messageError ? (
                  <p className="mt-1 text-xs text-red-500">
                    Message must contain at least 10 characters
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                text="Cancel"
                variant="outline"
                className="sm:w-auto sm:px-6"
                onClick={() => router.push("/dashboard/customer-service")}
              />
              <Button
                type="submit"
                text={createRequest.isPending ? "Creating..." : "Create Request"}
                disabled={createRequest.isPending}
                className="sm:w-auto sm:px-6"
              />
            </div>
          </form>
        </main>
      </div>
    </SidebarProvider>
  );
}
