const normalize = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");

/** Roll up multiple KYC request statuses into one customer-level badge. */
export function rollupKycStatus(statuses: Array<string | null | undefined>): string | undefined {
  const normalized = statuses.map(normalize).filter(Boolean);
  if (normalized.length === 0) return undefined;

  if (normalized.some((status) => status.includes("pending") || status.includes("awaiting"))) {
    return "Pending";
  }
  if (normalized.some((status) => status === "approved" || status === "completed")) {
    return "Approved";
  }
  if (normalized.some((status) => status === "rejected" || status === "failed")) {
    return "Rejected";
  }

  return statuses.find(Boolean) as string | undefined;
}
