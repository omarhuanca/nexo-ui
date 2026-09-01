import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from './CopyButton'

interface JournalBlockProps {
  journal: string | undefined | null
  verificationQRCode?: string | null
}

function getJournalRenderParts(journal: string, verificationQRCode?: string | null) {
  const lines = journal.split(/\r?\n/)

  if (!verificationQRCode || lines.length === 0) {
    return {
      before: journal,
      footer: '',
      hasEmbeddedQr: false,
    }
  }

  const before = lines.slice(0, -1).join('\n')
  const footer = lines[lines.length - 1] ?? ''

  return {
    before,
    footer,
    hasEmbeddedQr: true,
  }
}

function JournalBlockComponent({ journal, verificationQRCode }: JournalBlockProps) {
  if (!journal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">No journal</p>
        </CardContent>
      </Card>
    )
  }

  const { before, footer, hasEmbeddedQr } = getJournalRenderParts(
    journal,
    verificationQRCode,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div
            className="rounded bg-slate-50 p-3 font-mono text-xs text-slate-800"
            style={{ maxHeight: '24rem', overflowY: 'auto' }}
          >
            {before ? <pre className="whitespace-pre-wrap">{before}</pre> : null}

            {hasEmbeddedQr && verificationQRCode ? (
              <div className="my-2 w-full">
                <img
                  src={`data:image/gif;base64,${verificationQRCode}`}
                  alt="Verification QR code"
                  width={240}
                  height={240}
                  className="block h-auto max-w-[240px] bg-transparent object-contain"
                  style={{
                    imageRendering: 'auto',
                    display: 'block',
                    marginLeft: 10,
                    marginRight: 0,
                  }}
                />
              </div>
            ) : null}

            {footer ? <pre className="whitespace-pre-wrap">{footer}</pre> : null}
          </div>
          <CopyButton
            value={journal}
            className="absolute right-2 top-2"
            ariaLabel="Copy journal"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export const JournalBlock = memo(JournalBlockComponent)
