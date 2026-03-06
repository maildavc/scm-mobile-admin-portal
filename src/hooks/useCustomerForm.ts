import { useState, useMemo } from "react";
import {
  BASIC_INFO_FIELDS,
  ProductAssignment,
  DEFAULT_PRODUCT_ASSIGNMENTS,
  EMPTY_PRODUCT_ASSIGNMENTS,
} from "@/constants/customerManagement/createCustomer";
import { useCreateCustomer, useUpdateCustomer } from "./useCustomers";

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

  const [productAssignments, setProductAssignments] =
    useState<ProductAssignment>(
      initialData ? DEFAULT_PRODUCT_ASSIGNMENTS : DEFAULT_PRODUCT_ASSIGNMENTS,
    );

  const [showSuccess, setShowSuccess] = useState(false);

  // Get all required fields
  const requiredFields = useMemo(
    () =>
      BASIC_INFO_FIELDS.filter((field) => field.required).map(
        (field) => field.label,
      ),
    [],
  );

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return requiredFields.every((fieldLabel) => {
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [formData, requiredFields]);

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
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
    } catch (error) {
      console.error("Failed to save customer:", error);
      // Optional: Handle error UI state here if desired
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
    handleInputChange,
    handleProductToggle,
    handleSaveChanges,
    handleCreateAnother,
    handleDone,
  };
}
