import { Bike, Droplets, Flag, Footprints, Waves, Zap } from 'lucide-react'
import type { LegPlan, RacePlan } from '../lib/fueling'
import { formatClock, formatDuration, GEL_CARBS } from '../lib/fueling'

const LEG_ICONS: Record<string, React.ReactNode> = {
  bike: <Bike className="size-3.5" />,
  run: <Footprints className="size-3.5" />,
}

/** One-hour repeating pattern rail with gel/sip markers */
function LegRail({ leg }: { leg: LegPlan }) {
  const gels = leg.hourlyEvents.filter((e) => e.kind === 'gel')
  const sips = leg.hourlyEvents.filter((e) => e.kind === 'sip')
  return (
    <div className="relative mt-6 mb-8">
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

      <div className="roadline w-full rounded-full" />

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

      <span className="data absolute -left-1 -top-5 text-[10px] font-bold text-muted">
        :00
      </span>
      <span className="data absolute -right-1 -top-5 text-[10px] font-bold text-muted">
        :60
      </span>
    </div>
  )
}

function LegCadence({ leg }: { leg: LegPlan }) {
  return (
    <div className="space-y-2">
      {leg.gelIntervalMin && (
        <p className="flex items-center gap-2.5 text-sm">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <Zap className="size-4" />
          </span>
          <span>
            Every <strong className="data">{leg.gelIntervalMin} min</strong> — 1 gel (
            {GEL_CARBS} g carbs)
          </span>
        </p>
      )}
      <p className="flex items-center gap-2.5 text-sm">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          <Droplets className="size-4" />
        </span>
        <span>
          Every <strong className="data">{leg.sipIntervalMin} min</strong> — sip ~
          <strong className="data">{leg.sipMl} ml</strong> of your mix
        </span>
      </p>
    </div>
  )
}

interface TimelineProps {
  plan: RacePlan
}

export function Timeline({ plan }: TimelineProps) {
  const multi = plan.legs.length > 1
  const single = plan.legs[0]

  // Full-race strip: hour blocks for a single sport, leg segments for triathlon
  const hourSegments = (() => {
    if (multi) return []
    const fullHours = Math.floor(single.hours)
    const rest = single.hours - fullHours
    return [
      ...Array.from({ length: fullHours }, () => 1),
      ...(rest > 0.001 ? [rest] : []),
    ]
  })()

  const legSegments = multi
    ? [
        {
          key: 'swim',
          label: 'Swim',
          icon: <Waves className="size-3" />,
          minutes: plan.swimDurationMin,
          fueled: false,
        },
        ...plan.legs.map((leg) => ({
          key: leg.key,
          label: leg.label,
          icon: LEG_ICONS[leg.key],
          minutes: leg.durationMin,
          fueled: true,
        })),
      ]
    : []

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-5 py-3">
        <p className="head text-sm">Race timeline</p>
        <p className="data mt-0.5 text-[11px] uppercase tracking-wider text-muted">
          {multi
            ? 'Hourly pattern per discipline'
            : 'Repeat this pattern every hour'}
        </p>
      </div>

      <div className="p-5">
        {multi ? (
          <div className="space-y-2">
            {plan.legs.map((leg) => (
              <div key={leg.key}>
                <p className="head flex items-center gap-1.5 text-[11px]">
                  <span className="text-accent">{LEG_ICONS[leg.key]}</span>
                  {leg.label}
                  <span className="data font-normal text-muted">
                    {leg.carbsPerHour} g/h
                  </span>
                </p>
                <LegRail leg={leg} />
                <div className="mt-10">
                  <LegCadence leg={leg} />
                </div>
                <div className="roadline mt-4 mb-2 opacity-40" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <LegRail leg={single} />
            <div className="mt-10">
              <LegCadence leg={single} />
            </div>
          </>
        )}

        <p className="mt-3 flex items-center gap-2.5 text-sm">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <Flag className="size-4" />
          </span>
          <span>
            {multi
              ? 'Start fueling in the first 15 minutes on the bike — the swim leaves you with empty stores'
              : 'Start fueling in the first 15 minutes — don’t wait until you’re hungry'}
          </span>
        </p>

        {/* Full race strip */}
        <div className="mt-6">
          <p className="tick-label head text-[11px] text-muted">Full race</p>
          <div className="mt-2 flex h-10 gap-0.5 overflow-hidden rounded-lg">
            {multi
              ? legSegments.map((seg) => (
                  <div
                    key={seg.key}
                    className={`relative flex flex-col items-center justify-center overflow-hidden bg-raised outline outline-line ${
                      seg.fueled ? '' : 'opacity-60'
                    }`}
                    style={{ flexGrow: Math.max(seg.minutes, 1), flexBasis: 0 }}
                  >
                    <span className="head flex items-center gap-1 text-[9px] text-muted">
                      {seg.icon}
                      <span className="max-sm:hidden">{seg.label}</span>
                    </span>
                    <span className="data mt-0.5 text-[9px] font-bold">
                      {formatDuration(seg.minutes)}
                    </span>
                    {!seg.fueled && (
                      <div className="hazard absolute inset-0 opacity-15" />
                    )}
                  </div>
                ))
              : hourSegments.map((width, i) => (
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
                    {width < 1 && (
                      <div className="hazard absolute inset-0 opacity-20" />
                    )}
                  </div>
                ))}
          </div>
          <div className="data mt-1 flex justify-between text-[10px] text-muted">
            <span>0:00</span>
            <span>{formatClock(plan.totalDurationMin)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
