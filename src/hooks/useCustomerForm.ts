import { useState, useMemo } from "react";
import {
  BASIC_INFO_FIELDS,
  ProductAssignment,
  DEFAULT_PRODUCT_ASSIGNMENTS,
  EMPTY_PRODUCT_ASSIGNMENTS,
} from "@/constants/customerManagement/createCustomer";
import { useCreateCustomer, useUpdateCustomer } from "./useCustomers";
import { useToastStore } from "@/stores/toastStore";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier?: string;
  status: string;
  kycStatus: string;
  updatedAt?: string;
};

export function useCustomerForm(initialData?: Customer | null) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (initialData) {
      const nameParts = initialData.name.split(" ");
      return {
        "Legal First Name": nameParts[0] || "",
        "Legal Last Name": nameParts[nameParts.length - 1] || "",
        "Account Status": initialData.status.toLowerCase(),
      };
    }
    return {} as Record<string, string>;
  });

  const [productAssignments, setProductAssignments] = useState<ProductAssignment>(
    initialData ? DEFAULT_PRODUCT_ASSIGNMENTS : DEFAULT_PRODUCT_ASSIGNMENTS,
  );

  const [showSuccess, setShowSuccess] = useState(false);

  // Get all required fields
  const requiredFields = useMemo(
    () => BASIC_INFO_FIELDS.filter((field) => field.required).map((field) => field.label),
    [],
  );

  const namePattern = /^[A-Za-z][A-Za-z\s'-]{0,49}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+]?[\d\s()-]{7,20}$/;

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const first = formData["Legal First Name"] || "";
    const last = formData["Legal Last Name"] || "";
    const middle = formData["Middle Name (Optional)"] || "";
    const email = formData["Email Address"] || "";
    const phone = formData["Phone Number"] || "";
    const dob = formData["Date of Birth"] || "";

    if (first && !namePattern.test(first)) {
      errors["Legal First Name"] = "Letters only, max 50 characters";
    }
    if (last && !namePattern.test(last)) {
      errors["Legal Last Name"] = "Letters only, max 50 characters";
    }
    if (middle && !namePattern.test(middle)) {
      errors["Middle Name (Optional)"] = "Letters only, max 50 characters";
    }
    if (email && !emailPattern.test(email)) {
      errors["Email Address"] = "Enter a valid email address";
    }
    if (phone && !phonePattern.test(phone)) {
      errors["Phone Number"] = "Enter a valid phone number";
    }
    if (dob) {
      const today = new Date().toISOString().slice(0, 10);
      if (dob > today) errors["Date of Birth"] = "Date of birth cannot be in the future";
    }
    return errors;
  }, [formData]);

  // Check if all required fields are filled and valid
  const isFormValid = useMemo(() => {
    const requiredOk = requiredFields.every((fieldLabel) => {
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
    return requiredOk && Object.keys(fieldErrors).length === 0;
  }, [formData, requiredFields, fieldErrors]);

  const handleInputChange = (label: string, value: string) => {
    const maxLengths: Record<string, number> = {
      "Legal First Name": 50,
      "Legal Last Name": 50,
      "Middle Name (Optional)": 50,
      "Email Address": 100,
      "Phone Number": 20,
    };
    const max = maxLengths[label];
    setFormData((prev) => ({ ...prev, [label]: max ? value.slice(0, max) : value }));
  };

  const handleProductToggle = (productId: string, type: "buy" | "sell") => {
    setProductAssignments((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: !prev[productId][type],
      },
    }));
  };

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const addToast = useToastStore((state) => state.addToast);

  const handleSaveChanges = async () => {
    if (!isFormValid) return;

    try {
      const payload = {
        name: `${formData["Legal First Name"] || ""} ${formData["Legal Last Name"] || ""}`.trim(),
        email: formData["Email Address"] || "",
        phone: formData["Phone Number"] || "",
      };

      if (initialData) {
        await updateMutation.mutateAsync({
          customerId: initialData.id,
          payload: {
            ...payload,
            customerId: initialData.id,
          },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setShowSuccess(true);
    } catch (error: any) {
      console.error("Failed to save customer:", error);
      const errorMsg =
        error?.message || error?.response?.data?.message || "Failed to save customer";
      addToast(errorMsg, "error");
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setFormData({});
    setProductAssignments(EMPTY_PRODUCT_ASSIGNMENTS);
  };

  const handleDone = (onSuccess?: () => void) => {
    setShowSuccess(false);
    setFormData({});
    onSuccess?.();
  };

  return {
    formData,
    setFormData,
    productAssignments,
    setProductAssignments,
    showSuccess,
    setShowSuccess,
    requiredFields,
    isFormValid,
    fieldErrors,
    handleInputChange,
    handleProductToggle,
    handleSaveChanges,
    handleCreateAnother,
    handleDone,
  };
}
