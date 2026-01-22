export interface FormField {
  label: string;
  placeholder: string;
  type?: "text" | "select" | "date";
  options?: { value: string; label: string }[];
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

export interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
}

export const BASIC_INFO_FIELDS: FormField[] = [
  { label: "Legal First Name", placeholder: "Enter first name", required: true },
  { label: "Middle Name (Optional)", placeholder: "Enter name", required: false },
  { label: "Legal Last Name", placeholder: "Enter last name", required: true },
  { label: "Email Address", placeholder: "Enter email", type: "text", required: true },
  { label: "Phone Number", placeholder: "Enter phone number", required: true },
  {
    label: "Citizenship",
    placeholder: "Select Option",
    type: "select",
    required: true,
    options: [
      { value: "nigerian", label: "Nigerian" },
      { value: "other", label: "Other" },
    ],
  },
  {
    label: "Account Status",
    placeholder: "Select Option",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    label: "Gender",
    placeholder: "Select Option",
    type: "select",
    required: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  {
    label: "Date of Birth",
    placeholder: "DD/MM/YYYY",
    type: "date",
    required: true,
  },
];

export const PRODUCT_TYPES = [
  { id: "treasury-bill", name: "TREASURY BILL" },
  { id: "fixed-deposit", name: "FIXED DEPOSIT" },
  { id: "commercial-paper", name: "COMMERCIAL PAPER" },
  { id: "equities", name: "EQUITIES" },
  { id: "mutual-funds", name: "MUTUAL FUNDS" },
  { id: "ethical-investment", name: "ETHICAL INVESTMENT" },
];

export interface ProductAssignment {
  [key: string]: {
    buy: boolean;
    sell: boolean;
  };
}

export const DEFAULT_PRODUCT_ASSIGNMENTS: ProductAssignment = {
  "treasury-bill": { buy: true, sell: true },
  "fixed-deposit": { buy: false, sell: true },
  "commercial-paper": { buy: false, sell: true },
  "equities": { buy: false, sell: true },
  "mutual-funds": { buy: true, sell: false },
  "ethical-investment": { buy: false, sell: true },
};

export const EMPTY_PRODUCT_ASSIGNMENTS: ProductAssignment = {
  "treasury-bill": { buy: false, sell: false },
  "fixed-deposit": { buy: false, sell: false },
  "commercial-paper": { buy: false, sell: false },
  "equities": { buy: false, sell: false },
  "mutual-funds": { buy: false, sell: false },
  "ethical-investment": { buy: false, sell: false },
};
