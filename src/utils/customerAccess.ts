/** Configuration actions (email/password reset, deactivate) only apply to live accounts. */
export function canManageCustomerConfiguration(status?: string | null): boolean {
  const normalized = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");

  return !["rejected", "blocked", "inactive", "deactivated"].includes(normalized);
}
