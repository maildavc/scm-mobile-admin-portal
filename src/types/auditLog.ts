// ─── Audit Log Types ──────────────────────────────────────────────────────────

export interface AuditLogDto {
  auditId: string | null;
  eventType: string | null;
  userId: string | null;
  action: string | null;
  entityId: string | null;
  status: string | null;
  ipAddress: string | null;
  service: string | null;
  environment: string | null;
  request: string | null;
  response: string | null;
  correlationId: string | null;
  createdAtUtc: string; // ISO date-time
}

export interface GetAuditLogsParams {
  page: number;
  limit: number;
  userType?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogListResponse {
  status: string | null;
  data: AuditLogDto[];
  totalCount: number;
}
