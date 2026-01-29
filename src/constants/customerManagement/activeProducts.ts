export type Product = {
  id: string;
  name: string;
  code: string;
  productType: string;
  portfolioSize: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  lastUpdated: string;
  changes?: "Reactivated" | "Assigned" | "Deactivated";
};

export const ACTIVE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Deactivated",
    lastUpdated: "28/12/2025 13:32",
    changes: "Reactivated",
  },
  {
    id: "2",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Awaiting Approval",
    lastUpdated: "28/12/2025 13:32",
    changes: "Assigned",
  },
  {
    id: "3",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Active",
    lastUpdated: "28/12/2025 13:32",
    changes: "Deactivated",
  },
  {
    id: "4",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Deactivated",
    lastUpdated: "28/12/2025 13:32",
  },
  {
    id: "5",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Active",
    lastUpdated: "28/12/2025 13:32",
    changes: "Reactivated",
  },
  {
    id: "6",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Active",
    lastUpdated: "28/12/2025 13:32",
  },
  {
    id: "7",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Awaiting Approval",
    lastUpdated: "28/12/2025 13:32",
    changes: "Assigned",
  },
  {
    id: "8",
    name: "Product name one",
    code: "PNC-00001",
    productType: "Treasury Bill",
    portfolioSize: "NGN200M",
    status: "Active",
    lastUpdated: "28/12/2025 13:32",
  },
];
