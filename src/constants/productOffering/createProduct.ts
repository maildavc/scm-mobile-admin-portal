export interface FormField {
  label: string;
  placeholder: string;
  type?: "text" | "select" | "date" | "file";
  options?: { value: string; label: string }[];
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  hasUploadIcon?: boolean;
}

export interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
  hasCustomContent?: boolean;
}

export const FORM_SECTIONS: FormSection[] = [
  {
    title: "Integration",
    description: "If this product is using data from external source. Add the integration here",
    fields: [
      {
        label: "Source",
        placeholder: "Select Option",
        type: "select",
        options: [
          { value: "abbey", label: "Abbey Mortgage Bank PLC" },
          { value: "other", label: "Other Source" },
        ],
      },
    ],
    hasCustomContent: true,
  },
  {
    title: "Basic Information",
    description: "Tell us about this product",
    fields: [
      { label: "Product Name", placeholder: "Enter name", required: true },
      {
        label: "Instrument Type",
        placeholder: "Select Option",
        type: "select",
        required: true,
        options: [{ value: "tbill", label: "Treasury Bill" }],
      },
      {
        label: "Issuer",
        placeholder: "Select Option",
        type: "select",
        required: true,
        options: [{ value: "issuer1", label: "Issuer 1" }],
      },
      {
        label: "Sector",
        placeholder: "Select Option",
        type: "select",
        required: true,
        options: [{ value: "finance", label: "Finance" }],
      },
      {
        label: "Issuers Logo",
        placeholder: "Upload Image",
        type: "file",
        required: true,
        hasUploadIcon: true,
        className: "cursor-pointer",
      },
    ],
  },
  {
    title: "Financial Information",
    description: "Tell us how this product is sold",
    fields: [
      { label: "Selling Price", placeholder: "₦0.0", required: true },
      { label: "Available Volume", placeholder: "Enter value", required: true },
      { label: "Interest or returns Percentage", placeholder: "Enter value", required: true },
      { label: "Minimum Investment Amount", placeholder: "Enter value", required: true },
      { label: "Maximum Investment Amount", placeholder: "Enter value", required: true },
      { label: "Settlement Date", placeholder: "DD/MM/YYYY", type: "date", required: true },
    ],
  },
  {
    title: "Liquidation Info",
    description: "What happens when customers liquidate",
    fields: [
      {
        label: "Allow for Early Liquidation",
        placeholder: "Select option",
        type: "select",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      {
        label: "Early Liquidation Period",
        placeholder: "Select option",
        type: "select",
        required: true,
        options: [{ value: "30", label: "30 Days" }],
      },
      { label: "Early Liquidation Penalty?", placeholder: "Enter value", required: true },
      { label: "WHT Amount", placeholder: "₦0.0 or in percentage", required: true },
      { label: "Applicable Tax", placeholder: "Enter value", required: true },
    ],
  },
];
