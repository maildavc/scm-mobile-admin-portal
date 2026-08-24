/** Matches backend `DocumentType`. */
export enum DocumentType {
  NationalId = 1,
  Passport = 2,
  DriversLicense = 3,
  UtilityBill = 4,
  BankStatement = 5,
  ProofOfAddress = 6,
  Signature = 7,
  BusinessRegistration = 8,
  TaxDocument = 9,
  Other = 10,
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.NationalId]: "National ID",
  [DocumentType.Passport]: "Passport",
  [DocumentType.DriversLicense]: "Driver's License",
  [DocumentType.UtilityBill]: "Utility Bill",
  [DocumentType.BankStatement]: "Bank Statement",
  [DocumentType.ProofOfAddress]: "Proof of Address",
  [DocumentType.Signature]: "Signature",
  [DocumentType.BusinessRegistration]: "Business Registration",
  [DocumentType.TaxDocument]: "Tax Document",
  [DocumentType.Other]: "Other",
};

const DOCUMENT_TYPE_BY_NAME: Record<string, DocumentType> = {
  nationalid: DocumentType.NationalId,
  passport: DocumentType.Passport,
  driverslicense: DocumentType.DriversLicense,
  utilitybill: DocumentType.UtilityBill,
  bankstatement: DocumentType.BankStatement,
  proofofaddress: DocumentType.ProofOfAddress,
  signature: DocumentType.Signature,
  businessregistration: DocumentType.BusinessRegistration,
  taxdocument: DocumentType.TaxDocument,
  other: DocumentType.Other,
};

export function formatDocumentType(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "Document File";

  const numeric = Number(value);
  if (Number.isInteger(numeric) && numeric in DOCUMENT_TYPE_LABELS) {
    return DOCUMENT_TYPE_LABELS[numeric as DocumentType];
  }

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const matched = DOCUMENT_TYPE_BY_NAME[normalized];
  if (matched) return DOCUMENT_TYPE_LABELS[matched];

  return String(value);
}
