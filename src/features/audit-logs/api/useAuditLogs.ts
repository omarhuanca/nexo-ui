import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { auditLogsKeys } from "./auditLogsKeys";
import type { AuditLogsFilters, AuditLogsResponse } from "../types/auditLog";

export function useAuditLogs(
  filters: AuditLogsFilters,
): UseQueryResult<AuditLogsResponse, Error> {
  const hasDate = Boolean(filters.date);

  return useQuery({
    queryKey: auditLogsKeys.list(filters),
    enabled: hasDate,
    placeholderData: keepPreviousData,
    staleTime: 15_000,

    queryFn: async () => {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      }

      const { data } = await api.get<AuditLogsResponse>(
        `/audit-logs?${params.toString()}`,
      );

      return data;
    },
  });
}
