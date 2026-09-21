import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { xeroKeys } from './xeroKeys'

export function useDisconnectXeroConnection(organizationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.delete('/integrations/xero/disconnect', {
        params: { organization_id: organizationId },
      })
    },
    onSuccess: async () => {
      toast.success('Disconnected from Xero.')
      await queryClient.invalidateQueries({
        queryKey: xeroKeys.status(organizationId),
      })
    },
    onError: () => {
      toast.error('Failed to disconnect from Xero.')
    },
  })
}
