import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
  type Nullable,
  type Options,
  type Values,
} from "nuqs";

export const auditLogFilterParsers = {
  date: parseAsString,
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(15),
};
export type AuditLogFilterValues = Values<typeof auditLogFilterParsers>;

const KEYS_THAT_RESET_PAGE: ReadonlyArray<keyof AuditLogFilterValues> = [
  "date",
  "perPage",
];

function shouldResetPage(
  patch: Partial<Nullable<AuditLogFilterValues>>,
): boolean {
  return KEYS_THAT_RESET_PAGE.some((key) => key in patch);
}

export function useAuditLogFilters() {
  const [filters, setRaw] = useQueryStates(auditLogFilterParsers, {
    history: "push",
  });

  const setFilters = (
    values:
      | Partial<Nullable<AuditLogFilterValues>>
      | ((old: AuditLogFilterValues) => Partial<Nullable<AuditLogFilterValues>>)
      | null,
    options?: Options,
  ) => {
    if (values === null) {
      return setRaw(null, options);
    }

    if (typeof values === "function") {
      return setRaw((old) => {
        const patch = values(old);

        return shouldResetPage(patch) ? { ...patch, page: 1 } : patch;
      }, options);
    }

    return setRaw(
      shouldResetPage(values) ? { ...values, page: 1 } : values,
      options,
    );
  };

  return [filters, setFilters] as const;
}
