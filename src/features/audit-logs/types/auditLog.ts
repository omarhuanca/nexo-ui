import type { PaginatedResponse } from "@/types/api";

export interface AuditLog {
  message: string;
  context: Record<string, unknown>;
  level: number;
  level_name: string;
  channel: string;
  datetime: string;
  extra: Record<string, unknown>;
}

export interface AuditLogsFilters {
  date?: string;
  page?: number;
  perPage?: number;
}

export type AuditLogsResponse = PaginatedResponse<AuditLog>;
