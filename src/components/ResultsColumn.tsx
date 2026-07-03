import { useRef } from 'react'
import type { PlanInput, RacePlan } from '../lib/fueling'
import { ExportBar } from './ExportBar'
import { ResultsPanel } from './results/ResultsPanel'
import { Timeline } from './Timeline'

interface ResultsColumnProps {
  input: PlanInput
  plan: RacePlan
  advanced: boolean
}

export function ResultsColumn({ input, plan, advanced }: ResultsColumnProps) {
  const exportRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-4">
      <div
        ref={exportRef}
        className="rise space-y-4 bg-bg"
        style={{ animationDelay: '400ms' }}
      >
        <ResultsPanel input={input} plan={plan} advanced={advanced} />
        <Timeline plan={plan} />
      </div>
      <div className="rise" style={{ animationDelay: '480ms' }} data-print="hide">
        <ExportBar input={input} exportTarget={exportRef} />
      </div>
    </div>
  )
}
