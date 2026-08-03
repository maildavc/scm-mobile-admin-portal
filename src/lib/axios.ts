import axios from "axios";

// The browser only talks to the same-origin proxy. The proxy owns backend
// authentication, casing conversion, encryption, decryption, and token refresh.
const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// Correlation IDs are also generated server-side, but creating one here makes
// browser-reported failures traceable through the proxy and backend.
apiClient.interceptors.request.use(
  (config) => {
    config.headers["X-Correlation-ID"] = crypto.randomUUID();

    if (config.method?.toUpperCase() === "GET") {
      delete config.headers["Content-Type"];
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      (response.data.status === "error" || response.data.isFailure === true)
    ) {
      return Promise.reject({
        response,
        message: response.data.message || response.data.error || "An error occurred",
      });
    }

    return response;
  },
  (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/users/password");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("organization");
        localStorage.removeItem("requiresPasswordChange");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
