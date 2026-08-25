import { memo } from 'react'
import { Building2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ORGANIZATION_NONE,
  useActiveOrganization,
} from '../hooks/useActiveOrganization'
import { useOrganizations } from '../api/useOrganizations'

function OrganizationSelectorComponent() {
  const { organizationId, setOrganizationId } = useActiveOrganization()
  const { data, isLoading, isError } = useOrganizations()

  const orgs = data?.data ?? []
  const loading = isLoading || isError || orgs.length === 0
  const value = organizationId === ORGANIZATION_NONE ? undefined : String(organizationId)

  return (
    <div className="flex items-center gap-2">
      <Building2
        className="h-4 w-4 text-slate-500"
        aria-hidden="true"
      />
      <Select
        value={value}
        onValueChange={(v) => setOrganizationId(Number(v))}
        disabled={loading}
      >
        <SelectTrigger
          className="h-9 w-[220px] sm:w-[280px]"
          aria-label="Select organization"
        >
          <SelectValue
            placeholder={isLoading ? 'Loading…' : 'Select organization'}
          />
        </SelectTrigger>
        <SelectContent>
          {orgs.map((org) => (
            <SelectItem key={org.id} value={String(org.id)}>
              <span className="font-medium text-slate-900">{org.name}</span>
              <span className="ml-2 font-mono text-xs text-slate-500">
                #{org.id}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const OrganizationSelector = memo(OrganizationSelectorComponent)
