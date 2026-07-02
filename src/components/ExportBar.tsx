import { Check, ImageDown, Link2 } from 'lucide-react'
import { useState } from 'react'
import { toPng } from 'html-to-image'
import type { PlanInput } from '../lib/fueling'
import { buildShareUrl } from '../lib/share'

interface ExportBarProps {
  input: PlanInput
  exportTarget: React.RefObject<HTMLDivElement | null>
}

export function ExportBar({ input, exportTarget }: ExportBarProps) {
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const downloadPng = async () => {
    const node = exportTarget.current
    if (!node || exporting) return
    setExporting(true)
    try {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg')
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: bg.trim() || undefined,
        style: { margin: '0' },
      })
      const link = document.createElement('a')
      link.download = 'fuelcast-plan.png'
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(buildShareUrl(input))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={downloadPng}
        disabled={exporting}
        className="head flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-xs text-accent-ink transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        <ImageDown className="size-4" />
        {exporting ? 'Rendering…' : 'Save as image'}
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={`head flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs transition-all duration-150 active:scale-[0.98] ${
          copied
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-line-strong bg-surface text-ink hover:border-accent'
        }`}
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? 'Link copied' : 'Copy share link'}
      </button>
    </div>
  )
}
