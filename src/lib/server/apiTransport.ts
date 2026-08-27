import "server-only";

import { createCipheriv, createDecipheriv, randomUUID } from "node:crypto";

type JsonRecord = Record<string, unknown>;

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

function getRequiredEnv(name: "API_BASE_URL" | "API_AES_KEY" | "API_AES_IV"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function getCipherConfig() {
  const key = Buffer.from(getRequiredEnv("API_AES_KEY"), "utf8");
  const iv = Buffer.from(getRequiredEnv("API_AES_IV"), "utf8");

  if (key.length !== 16 || iv.length !== 16) {
    throw new Error("API_AES_KEY and API_AES_IV must each be exactly 16 UTF-8 bytes");
  }

  return { key, iv };
}

export function getApiBaseUrl(): string {
  return getRequiredEnv("API_BASE_URL").replace(/\/+$/, "");
}

export function createCorrelationId(existing?: string | null): string {
  return existing || randomUUID();
}

export function encryptPayload(plaintext: string): string {
  const { key, iv } = getCipherConfig();
  const cipher = createCipheriv("aes-128-cbc", key, iv);
  return Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]).toString("base64");
}

export function decryptPayload(ciphertext: string): string {
  return decryptPayloadBuffer(ciphertext).toString("utf8");
}

export function decryptPayloadBuffer(ciphertext: string): Buffer {
  const { key, iv } = getCipherConfig();
  const decipher = createDecipheriv("aes-128-cbc", key, iv);
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);
}

function sniffContentType(bytes: Buffer): string | null {
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.length >= 4 && bytes.subarray(0, 4).toString("ascii") === "%PDF") {
    return "application/pdf";
  }
  if (bytes.length >= 6 && bytes.subarray(0, 3).toString("ascii") === "GIF") {
    return "image/gif";
  }
  return null;
}

const REPLACEMENT_CHAR = Buffer.from([0xef, 0xbf, 0xbd]);

// A binary file that was UTF-8 decoded before transport comes back with every
// non-ASCII byte replaced by U+FFFD. The original bytes are unrecoverable, so
// the payload must be rejected instead of handed to the browser.
function isUtf8Mangled(bytes: Buffer): boolean {
  const window = bytes.subarray(0, 64 * 1024);
  let occurrences = 0;
  let index = window.indexOf(REPLACEMENT_CHAR);
  while (index !== -1) {
    occurrences += 1;
    index = window.indexOf(REPLACEMENT_CHAR, index + REPLACEMENT_CHAR.length);
  }
  return occurrences * REPLACEMENT_CHAR.length > window.length * 0.05;
}

export function decodeBackendFile(raw: Buffer): {
  kind: "file" | "json" | "corrupt";
  bytes?: Buffer;
  contentType?: string;
  data?: unknown;
} {
  const asText = raw.toString("utf8");
  try {
    const parsed = JSON.parse(asText) as JsonRecord;
    const encrypted = parsed.response ?? parsed.Response;
    if (typeof encrypted === "string" && encrypted.length > 0) {
      const decrypted = decryptPayloadBuffer(encrypted);
      if (isUtf8Mangled(decrypted)) {
        return { kind: "corrupt" };
      }
      const contentType = sniffContentType(decrypted);
      if (contentType) {
        return { kind: "file", bytes: decrypted, contentType };
      }
      try {
        return { kind: "json", data: toCamelCase(JSON.parse(decrypted.toString("utf8"))) };
      } catch {
        return { kind: "file", bytes: decrypted, contentType: "application/octet-stream" };
      }
    }
    return { kind: "json", data: toCamelCase(parsed) };
  } catch {
    if (isUtf8Mangled(raw)) {
      return { kind: "corrupt" };
    }
    const contentType = sniffContentType(raw);
    if (contentType) {
      return { kind: "file", bytes: raw, contentType };
    }
    return { kind: "json", data: asText };
  }
}

export function transformKeys(value: unknown, transform: (key: string) => string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transform));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [transform(key), transformKeys(item, transform)]),
    );
  }
  return value;
}

export const toPascalCase = (value: unknown): unknown =>
  transformKeys(value, (key) => key.charAt(0).toUpperCase() + key.slice(1));

export const toCamelCase = (value: unknown): unknown =>
  transformKeys(value, (key) => key.charAt(0).toLowerCase() + key.slice(1));

export function encodeJsonRequest(value: unknown): string {
  return JSON.stringify({
    request: encryptPayload(JSON.stringify(toPascalCase(value))),
  });
}

export function decodeBackendBody(body: string): {
  data: unknown;
  isJson: boolean;
} {
  const parseDecrypted = (ciphertext: string) => {
    const decrypted = decryptPayload(ciphertext);
    try {
      return { data: toCamelCase(JSON.parse(decrypted)), isJson: true };
    } catch {
      return { data: decrypted, isJson: false };
    }
  };

  try {
    const parsed = JSON.parse(body) as unknown;
    if (parsed && typeof parsed === "object") {
      const wrapper = parsed as JsonRecord;
      const encrypted = wrapper.response ?? wrapper.Response;
      if (typeof encrypted === "string" && encrypted.length > 0) {
        return parseDecrypted(encrypted);
      }
    }
    return { data: toCamelCase(parsed), isJson: true };
  } catch {
    try {
      return parseDecrypted(body);
    } catch {
      return { data: body, isJson: false };
    }
  }
}

export function findAuthTokens(value: unknown): AuthTokens | null {
  if (!value || typeof value !== "object") return null;
  const record = value as JsonRecord;

  if (typeof record.accessToken === "string") {
    return {
      accessToken: record.accessToken,
      refreshToken: typeof record.refreshToken === "string" ? record.refreshToken : undefined,
    };
  }

  for (const child of Object.values(record)) {
    const tokens = findAuthTokens(child);
    if (tokens) return tokens;
  }
  return null;
}

export function removeAuthTokens(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeAuthTokens);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "accessToken" && key !== "refreshToken")
      .map(([key, child]) => [key, removeAuthTokens(child)]),
  );
}
