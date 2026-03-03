import axios from "axios";
import Cookies from "js-cookie";
import { encryptPayload, decryptPayload } from "@/lib/encryption";

// Route all API requests through the Next.js proxy to avoid browser
// Content-Encoding issues with encrypted responses.
// The proxy sets Accept-Encoding: identity on the server side.
const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  // Receive responses as raw text so we can decrypt before JSON.parse
  responseType: "text",
});

/**
 * Recursively convert all object keys from camelCase to PascalCase.
 * The backend (.NET) expects PascalCase JSON property names.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPascalCaseKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toPascalCaseKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        key.charAt(0).toUpperCase() + key.slice(1),
        toPascalCaseKeys(val),
      ]),
    );
  }
  return obj;
}

/**
 * Recursively convert all object keys from PascalCase to camelCase.
 * The backend (.NET) returns PascalCase JSON property names but
 * our TypeScript types use camelCase.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCamelCaseKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toCamelCaseKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        toCamelCaseKeys(val),
      ]),
    );
  }
  return obj;
}

// Request interceptor — attach token, correlation ID, and encrypt payload
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["X-Correlation-ID"] = crypto.randomUUID();

    // The backend expects PascalCase JSON keys (e.g. "Email", "Password", "Token").
    // Convert camelCase keys to PascalCase before encrypting.
    // Server expects: { "request": "encrypted_base64_string" }
    if (config.data) {
      const pascalData = toPascalCaseKeys(config.data);
      const jsonString = JSON.stringify(pascalData);
      config.data = { request: encryptPayload(jsonString) };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — decrypt response, convert keys, and handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    // responseType is 'text', so response.data is always a raw string
    if (response.data != null && typeof response.data === "string" && response.data.length > 0) {
      try {
        // Backend wraps encrypted responses as {"response": "<encrypted_base64>"}
        const wrapper = JSON.parse(response.data);

        if (wrapper && typeof wrapper.response === "string" && wrapper.response.length > 0) {
          const decrypted = decryptPayload(wrapper.response);
          const parsed = JSON.parse(decrypted);
          response.data = toCamelCaseKeys(parsed);
        } else if (wrapper && typeof wrapper.Response === "string" && wrapper.Response.length > 0) {
          const decrypted = decryptPayload(wrapper.Response);
          const parsed = JSON.parse(decrypted);
          response.data = toCamelCaseKeys(parsed);
        } else {
          // Non-encrypted JSON response — just convert keys
          response.data = toCamelCaseKeys(wrapper);
        }
      } catch {
        // If outer JSON parse fails, try decrypting the entire body directly (legacy format)
        try {
          const decrypted = decryptPayload(response.data);
          const parsed = JSON.parse(decrypted);
          response.data = toCamelCaseKeys(parsed);
        } catch {
          // Leave as raw string if nothing works
        }
      }
    }
    return response;
  },
  (error) => {
    // Try to decrypt error response too (same {"response":"..."} wrapper)
    if (error.response?.data && typeof error.response.data === "string") {
      try {
        const wrapper = JSON.parse(error.response.data);
        const encrypted = wrapper?.response || wrapper?.Response;
        if (typeof encrypted === "string" && encrypted.length > 0) {
          const decrypted = decryptPayload(encrypted);
          error.response.data = toCamelCaseKeys(JSON.parse(decrypted));
        } else {
          error.response.data = toCamelCaseKeys(wrapper);
        }
      } catch {
        try {
          const decrypted = decryptPayload(error.response.data);
          error.response.data = toCamelCaseKeys(JSON.parse(decrypted));
        } catch {
          // Leave as raw string
        }
      }
    }

    const url = error.config?.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/users/password");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
