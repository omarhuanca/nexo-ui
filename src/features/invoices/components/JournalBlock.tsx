import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from './CopyButton'

interface JournalBlockProps {
  journal: string | undefined | null
}

function JournalBlockComponent({ journal }: JournalBlockProps) {
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre
            className="whitespace-pre rounded bg-slate-50 p-3 font-mono text-xs text-slate-800"
            style={{ maxHeight: '24rem', overflowY: 'auto' }}
          >
            {journal}
          </pre>
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
