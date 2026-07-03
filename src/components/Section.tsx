interface SectionProps {
  step: number
  title: string
  children: React.ReactNode
}

export function Section({ step, title, children }: SectionProps) {
  return (
    <section>
      <h2 className="tick-label head text-xs text-muted">
        <span className="data text-accent">0{step}</span> {title}
      </h2>
      <div className="mt-2.5 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {children}
      </div>
    </section>
  )
}
