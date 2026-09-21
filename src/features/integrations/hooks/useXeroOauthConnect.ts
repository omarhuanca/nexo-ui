import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { buildXeroConnectUrl } from '../api/xero'
import { xeroKeys } from '../api/xeroKeys'

const POPUP_FEATURES = 'width=600,height=700'
const POPUP_POLL_INTERVAL_MS = 500

interface XeroOauthMessage {
  type: 'xero-oauth-result'
  status: 'connected' | 'error'
  message?: string | null
}

function isXeroOauthMessage(data: unknown): data is XeroOauthMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { type?: unknown }).type === 'xero-oauth-result'
  )
}

export function useXeroOauthConnect(organizationId: number) {
  const queryClient = useQueryClient()
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(() => {
    const popup = window.open(
      buildXeroConnectUrl(organizationId, { mode: 'popup' }),
      'xero-oauth',
      POPUP_FEATURES,
    )

    if (!popup) {
      // Popup blocked by the browser: fall back to the classic full-page redirect.
      window.location.href = buildXeroConnectUrl(organizationId)
      return
    }

    setIsConnecting(true)

    const cleanup = () => {
      window.removeEventListener('message', handleMessage)
      clearInterval(pollId)
      setIsConnecting(false)
    }

    const handleMessage = (event: MessageEvent) => {
      // The popup's origin depends on the environment (a dev proxy target vs.
      // the real backend domain in prod), so we can't reliably pin an
      // expected origin here. Trusting the exact window reference we opened
      // is the robust check instead.
      if (event.source !== popup || !isXeroOauthMessage(event.data)) {
        return
      }

      const { status, message } = event.data

      if (status === 'connected') {
        toast.success('Connected to Xero successfully.')
        void queryClient.invalidateQueries({
          queryKey: xeroKeys.status(organizationId),
        })
      } else {
        toast.error(message ?? 'Failed to connect to Xero.')
      }

      if (!popup.closed) popup.close()
      cleanup()
    }
    window.addEventListener('message', handleMessage)

    const pollId = window.setInterval(() => {
      if (popup.closed) cleanup()
    }, POPUP_POLL_INTERVAL_MS)
  }, [organizationId, queryClient])

  return { connect, isConnecting }
}
