import { Droplets, Flag, Zap } from 'lucide-react'
import type { FuelPlan } from '../lib/fueling'
import { formatClock, GEL_CARBS } from '../lib/fueling'

interface TimelineProps {
  plan: FuelPlan
}

export function Timeline({ plan }: TimelineProps) {
  const gels = plan.hourlyEvents.filter((e) => e.kind === 'gel')
  const sips = plan.hourlyEvents.filter((e) => e.kind === 'sip')
  const fullHours = Math.floor(plan.hours)
  const rest = plan.hours - fullHours
  const segments = [
    ...Array.from({ length: fullHours }, () => 1),
    ...(rest > 0.001 ? [rest] : []),
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-5 py-3">
        <p className="head text-sm">Race timeline</p>
        <p className="data mt-0.5 text-[11px] uppercase tracking-wider text-muted">
          Repeat this pattern every hour
        </p>
      </div>

      <div className="p-5">
        {/* One-hour pattern rail */}
        <div className="relative mt-6 mb-8">
          {/* gel markers above the rail */}
          {gels.map((event) => (
            <div
              key={`gel-${event.minute}`}
              className="absolute -top-6 -translate-x-1/2"
              style={{ left: `${(event.minute / 60) * 100}%` }}
            >
              <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-ink shadow-md">
                <Zap className="size-3.5" />
              </span>
              <span className="absolute left-1/2 top-6 h-3 w-px -translate-x-1/2 bg-accent" />
            </div>
          ))}

          {/* the rail: dashed road line */}
          <div className="roadline w-full rounded-full" />

          {/* sip markers below the rail */}
          {sips.map((event) => (
            <div
              key={`sip-${event.minute}`}
              className="absolute top-2 -translate-x-1/2 text-center"
              style={{ left: `${(event.minute / 60) * 100}%` }}
            >
              <Droplets className="mx-auto size-3.5 text-muted" />
              <span className="data mt-0.5 block text-[9px] text-muted">
                :{String(event.minute).padStart(2, '0')}
              </span>
            </div>
          ))}

          {/* start / hour markers */}
          <span className="data absolute -left-1 -top-5 text-[10px] font-bold text-muted">
            :00
          </span>
          <span className="data absolute -right-1 -top-5 text-[10px] font-bold text-muted">
            :60
          </span>
        </div>

        {/* Cadence summary */}
        <div className="mt-10 space-y-2">
          {plan.gelIntervalMin && (
            <p className="flex items-center gap-2.5 text-sm">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <Zap className="size-4" />
              </span>
              <span>
                Every <strong className="data">{plan.gelIntervalMin} min</strong> — 1
                gel ({GEL_CARBS} g carbs)
              </span>
            </p>
          )}
          <p className="flex items-center gap-2.5 text-sm">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
              <Droplets className="size-4" />
            </span>
            <span>
              Every <strong className="data">{plan.sipIntervalMin} min</strong> — sip ~
              <strong className="data">{plan.sipMl} ml</strong> of your mix
            </span>
          </p>
          <p className="flex items-center gap-2.5 text-sm">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
              <Flag className="size-4" />
            </span>
            <span>Start fueling in the first 15 minutes — don’t wait until you’re hungry</span>
          </p>
        </div>

        {/* Full race strip */}
        <div className="mt-6">
          <p className="tick-label head text-[11px] text-muted">Full race</p>
          <div className="mt-2 flex h-9 gap-0.5 overflow-hidden rounded-lg">
            {segments.map((width, i) => (
              <div
                key={i}
                className="relative grid place-items-center overflow-hidden bg-raised outline outline-line"
                style={{ flexGrow: width, flexBasis: 0 }}
              >
                {width === 1 && (
                  <span className="data text-[10px] font-bold text-muted">
                    H{i + 1}
                  </span>
                )}
                {width < 1 && <div className="hazard absolute inset-0 opacity-20" />}
              </div>
            ))}
          </div>
          <div className="data mt-1 flex justify-between text-[10px] text-muted">
            <span>0:00</span>
            <span>{formatClock(Math.round(plan.hours * 60))}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
