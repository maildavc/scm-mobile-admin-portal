import apiClient from "@/lib/axios";
import type {
  GetAuditLogsParams,
  AuditLogListResponse,
} from "@/types/auditLog";

// Backend wraps responses: { isSuccess, isFailure, value: <actual payload>, error, errors }
type BackendEnvelope<T> = {
  isSuccess: boolean;
  isFailure: boolean;
  value: T;
  error: unknown;
  errors: unknown;
};

export const auditLogService = {
  /**
   * GET /api/v1/audit-logs
   * Returns a paginated, filterable list of audit log entries.
   */
  getAuditLogs: async (
    params: GetAuditLogsParams,
  ): Promise<AuditLogListResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<AuditLogListResponse>>(
      "/api/v1/audit-logs",
      { params },
    );
    return data.value ?? (data as unknown as AuditLogListResponse);
  },

  /**
   * GET /api/v1/audit-logs/export
   * Downloads audit logs as a CSV/Excel binary file.
   * Returns a Blob that can be used to trigger a browser download.
   */
  exportAuditLogs: async (params: {
    userType?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> => {
    const { data } = await apiClient.get<string>("/api/v1/audit-logs/export", {
      params,
      // Override responseType to get raw text/binary from proxy
      responseType: "text",
    });
    // The proxy returns the same encrypted response wrapper.
    // After apiClient decrypts it, data will be the decrypted CSV string.
    return new Blob([data], { type: "text/csv;charset=utf-8;" });
  },
};
