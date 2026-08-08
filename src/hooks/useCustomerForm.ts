import { useState, useMemo, useEffect } from "react";
import {
  BASIC_INFO_FIELDS,
  ProductAssignment,
  EMPTY_PRODUCT_ASSIGNMENTS,
} from "@/constants/customerManagement/createCustomer";
import { useCreateCustomer, useUpdateCustomer } from "./useCustomers";
import { useProducts } from "./useProducts";
import { useToastStore } from "@/stores/toastStore";
import { todayIsoDate, validateByKind } from "@/utils/formValidation";
import type {
  CreateCustomerRequest,
  CustomerProductAssignmentPayload,
  UpdateCustomerRequest,
} from "@/types/customer";

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

function buildProductAssignmentPayload(
  assignments: ProductAssignment,
): CustomerProductAssignmentPayload[] | undefined {
  const selected = Object.entries(assignments)
    .filter(([, flags]) => flags.buy || flags.sell)
    .map(([productId, flags]) => ({
      productId,
      canBuy: flags.buy,
      canSell: flags.sell,
    }));

  // Backend 500s on empty arrays — omit the field entirely when nothing selected
  return selected.length > 0 ? selected : undefined;
}

function buildCustomerPayload(
  formData: Record<string, string>,
  assignments: ProductAssignment,
): CreateCustomerRequest {
  const firstName = (formData["Legal First Name"] || "").trim();
  const middleName = (formData["Middle Name (Optional)"] || "").trim();
  const lastName = (formData["Legal Last Name"] || "").trim();
  const name = [firstName, middleName, lastName].filter(Boolean).join(" ");
  const dob = formData["Date of Birth"] || "";

  const payload: CreateCustomerRequest = {
    name,
    firstName,
    lastName,
    email: (formData["Email Address"] || "").trim(),
    phone: (formData["Phone Number"] || "").trim(),
    citizenship: formData["Citizenship"] || undefined,
    gender: formData["Gender"] || undefined,
    dateOfBirth: dob ? new Date(`${dob}T00:00:00Z`).toISOString() : undefined,
  };

  if (middleName) {
    payload.middleName = middleName;
  }

  const productAssignments = buildProductAssignmentPayload(assignments);
  if (productAssignments) {
    payload.productAssignments = productAssignments;
  }

  return payload;
}

export function useCustomerForm(initialData?: Customer | null) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (initialData) {
      const nameParts = initialData.name.split(" ");
      return {
        "Legal First Name": nameParts[0] || "",
        "Legal Last Name": nameParts[nameParts.length - 1] || "",
        "Email Address": initialData.email || "",
        "Phone Number": initialData.phone || "",
        "Account Status": initialData.status.toLowerCase(),
      };
    }
    return {} as Record<string, string>;
  });

  const [productAssignments, setProductAssignments] =
    useState<ProductAssignment>(EMPTY_PRODUCT_ASSIGNMENTS);

  const [showSuccess, setShowSuccess] = useState(false);

  const { data: productsRes } = useProducts({ page: 1, limit: 50 });
  const liveProducts = productsRes?.value?.data?.products ?? [];

  // Keep assignment map in sync with available product IDs (real GUIDs from API)
  useEffect(() => {
    if (!liveProducts.length) return;
    setProductAssignments((prev) => {
      const next: ProductAssignment = {};
      for (const product of liveProducts) {
        next[product.id] = prev[product.id] || { buy: false, sell: false };
      }
      return next;
    });
  }, [liveProducts]);

  const requiredFields = useMemo(
    () => BASIC_INFO_FIELDS.filter((field) => field.required).map((field) => field.label),
    [],
  );

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const checks: Array<[string, "name" | "email" | "phone"]> = [
      ["Legal First Name", "name"],
      ["Legal Last Name", "name"],
      ["Middle Name (Optional)", "name"],
      ["Email Address", "email"],
      ["Phone Number", "phone"],
    ];
    for (const [label, kind] of checks) {
      const value = formData[label] || "";
      if (!value) continue;
      const message = validateByKind(kind, value, false);
      if (message) errors[label] = message;
    }
    const dob = formData["Date of Birth"] || "";
    if (dob && dob > todayIsoDate()) {
      errors["Date of Birth"] = "Date of birth cannot be in the future";
    }
    return errors;
  }, [formData]);

  const isFormValid = useMemo(() => {
    const requiredOk = requiredFields.every((fieldLabel) => {
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
    return requiredOk && Object.keys(fieldErrors).length === 0;
  }, [formData, requiredFields, fieldErrors]);

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleProductToggle = (productId: string, type: "buy" | "sell") => {
    setProductAssignments((prev) => ({
      ...prev,
      [productId]: {
        buy: prev[productId]?.buy || false,
        sell: prev[productId]?.sell || false,
        [type]: !(prev[productId]?.[type] || false),
      },
    }));
  };

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const addToast = useToastStore((state) => state.addToast);

  const handleSaveChanges = async () => {
    if (!isFormValid) return;

    try {
      const payload = buildCustomerPayload(formData, productAssignments);

      if (initialData) {
        const updatePayload: UpdateCustomerRequest = {
          ...payload,
          id: initialData.id,
          customerId: initialData.id,
        };
        await updateMutation.mutateAsync({
          customerId: initialData.id,
          payload: updatePayload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setShowSuccess(true);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        response?: { data?: { message?: string; detail?: string } };
      };
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save customer";
      addToast(errorMsg, "error");
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setFormData({});
    setProductAssignments(
      Object.fromEntries(liveProducts.map((p) => [p.id, { buy: false, sell: false }])),
    );
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
    liveProducts,
    handleInputChange,
    handleProductToggle,
    handleSaveChanges,
    handleCreateAnother,
    handleDone,
  };
}
