import { useQuery } from "@tanstack/react-query";
import { auditLogService } from "@/services/auditLogService";
import type { GetAuditLogsParams } from "@/types/auditLog";

// ── Query Keys ─────────────────────────────────────────────────────────────
export const auditLogKeys = {
  all: ["auditLogs"] as const,
  lists: () => [...auditLogKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...auditLogKeys.lists(), filters] as const,
};

// ── GET /api/v1/audit-logs ─────────────────────────────────────────────────
export const useAuditLogs = (params: GetAuditLogsParams) => {
  return useQuery({
    queryKey: auditLogKeys.list(params as unknown as Record<string, unknown>),
    queryFn: () => auditLogService.getAuditLogs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
