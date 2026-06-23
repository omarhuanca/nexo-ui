import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from './CopyButton'

interface SignatureBlockProps {
  signature: string | undefined | null
}

function SignatureBlockComponent({ signature }: SignatureBlockProps) {
  if (!signature) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">No signature</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre
            className="break-all whitespace-pre-wrap rounded bg-slate-50 p-3 font-mono text-xs text-slate-800"
            style={{ maxHeight: '8rem', overflowY: 'auto' }}
          >
            {signature}
          </pre>
          <CopyButton
            value={signature}
            className="absolute right-2 top-2"
            ariaLabel="Copy signature"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export const SignatureBlock = memo(SignatureBlockComponent)
