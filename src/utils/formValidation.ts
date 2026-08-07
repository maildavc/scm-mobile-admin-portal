/** Shared form field kinds, sanitizers, and validators for QA rules. */

export type InputKind =
  | "text"
  | "name"
  | "email"
  | "url"
  | "phone"
  | "number"
  | "decimal"
  | "percentage"
  | "password";

export const DEFAULT_MAX_LENGTH: Record<InputKind, number> = {
  text: 250,
  name: 50,
  email: 100,
  url: 500,
  phone: 20,
  number: 20,
  decimal: 20,
  percentage: 6,
  password: 128,
};

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function sanitizeByKind(kind: InputKind, value: string, maxLength?: number): string {
  let next = value;

  switch (kind) {
    case "name":
      next = next.replace(/[^A-Za-z\s'-]/g, "");
      break;
    case "phone":
      next = next.replace(/[^\d+\s()-]/g, "");
      break;
    case "number":
      next = next.replace(/[^\d]/g, "");
      break;
    case "decimal":
      next = next
        .replace(/[^\d.]/g, "")
        .replace(/(\..*)\./g, "$1");
      break;
    case "percentage": {
      next = next.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
      const parsed = Number(next);
      if (next !== "" && !Number.isNaN(parsed) && parsed > 100) {
        next = "100";
      }
      break;
    }
    case "email":
      next = next.replace(/\s/g, "");
      break;
    default:
      break;
  }

  const limit = maxLength ?? DEFAULT_MAX_LENGTH[kind];
  return next.slice(0, limit);
}

export function validateByKind(kind: InputKind, value: string, required = false): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return required ? "This field is required" : null;
  }

  switch (kind) {
    case "name":
      if (!/^[A-Za-z][A-Za-z\s'-]{0,49}$/.test(trimmed)) {
        return "Letters only, max 50 characters";
      }
      return null;
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Enter a valid email address";
      }
      return null;
    case "url":
      if (!/^https?:\/\/.+\..+/i.test(trimmed)) {
        return "Enter a valid URL starting with http:// or https://";
      }
      return null;
    case "phone":
      if (!/^[+]?[\d\s()-]{7,20}$/.test(trimmed)) {
        return "Enter a valid phone number";
      }
      return null;
    case "number":
      if (!/^\d+$/.test(trimmed)) {
        return "Numbers only";
      }
      return null;
    case "decimal":
      if (!/^\d+(\.\d+)?$/.test(trimmed)) {
        return "Enter a valid number";
      }
      return null;
    case "percentage": {
      if (!/^\d+(\.\d+)?$/.test(trimmed)) {
        return "Enter a valid percentage";
      }
      const n = Number(trimmed);
      if (n < 0 || n > 100) {
        return "Percentage must be between 0 and 100";
      }
      return null;
    }
    default:
      return null;
  }
}

/** Infer a field kind from label/type when forms don't set one explicitly. */
export function inferInputKind(label: string, type?: string): InputKind {
  const l = label.toLowerCase();
  if (type === "email" || l.includes("email")) return "email";
  if (type === "url" || l.includes("url")) return "url";
  if (type === "password" || l.includes("password") || l.includes("secret")) return "password";
  if (l.includes("phone")) return "phone";
  if (l.includes("percent") || l.includes("percentage") || l.includes("wht") || l.includes("tax")) {
    return "percentage";
  }
  if (
    l.includes("price") ||
    l.includes("amount") ||
    l.includes("volume") ||
    l.includes("penalty")
  ) {
    return "decimal";
  }
  if (
    l.includes("first name") ||
    l.includes("last name") ||
    l.includes("middle name") ||
    l === "name" ||
    l.endsWith(" name")
  ) {
    return "name";
  }
  return "text";
}
