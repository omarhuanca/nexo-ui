import type { AuditLogsFilters } from "../types/auditLog";

function serializeFilters(filters: AuditLogsFilters): string {
  return JSON.stringify(
    Object.entries(filters)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      )
      .sort(([first], [second]) => first.localeCompare(second)),
  );
}

export const auditLogsKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditLogsKeys.all, "list"] as const,
  list: (filters: AuditLogsFilters) =>
    [...auditLogsKeys.lists(), serializeFilters(filters)] as const,
};
