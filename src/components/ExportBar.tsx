import { Check, ImageDown, Link2, Printer } from 'lucide-react'
import { useState } from 'react'
import { toPng } from 'html-to-image'
import type { PlanInput } from '../lib/fueling'
import { useI18n } from '../lib/i18n'
import { buildShareUrl } from '../lib/share'

interface ExportBarProps {
  input: PlanInput
  exportTarget: React.RefObject<HTMLDivElement | null>
}

export function ExportBar({ input, exportTarget }: ExportBarProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const downloadPng = async () => {
    const node = exportTarget.current
    if (!node || exporting) return
    setExporting(true)
    try {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg')
      // Hide hints/safety notes during export
      const hiddenElements = node.querySelectorAll<HTMLElement>('[data-print="hide"]')
      hiddenElements.forEach((el) => { el.style.display = 'none' })
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: bg.trim() || undefined,
        style: { margin: '0' },
      })
      hiddenElements.forEach((el) => { el.style.display = '' })
      const link = document.createElement('a')
      link.download = 'fuelcast-plan.png'
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(input))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for insecure contexts or denied permission
      const url = buildShareUrl(input)
      window.prompt(t('export.copyFallback'), url)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={downloadPng}
        disabled={exporting}
        className="head flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-xs text-accent-ink transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        <ImageDown className="size-4" />
        {exporting ? t('export.rendering') : t('export.png')}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="head flex flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-4 py-3 text-xs text-ink transition-all duration-150 hover:border-accent active:scale-[0.98]"
      >
        <Printer className="size-4" />
        {t('export.print')}
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
        {copied ? t('export.copied') : t('export.copy')}
      </button>
    </div>
  )
}
