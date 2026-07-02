import { Moon, Sun, Zap } from 'lucide-react'

interface HeaderProps {
  dark: boolean
  onToggleTheme: () => void
}

export function Header({ dark, onToggleTheme }: HeaderProps) {
  return (
    <header className="rise sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-accent dark:bg-raised">
            <Zap className="size-4.5 fill-accent" strokeWidth={1.5} />
          </span>
          <div className="leading-none">
            <span className="head text-lg tracking-tight">
              Fuel<span className="text-accent">Cast</span>
            </span>
            <p className="data mt-0.5 text-[10px] uppercase tracking-widest text-muted">
              Endurance fueling calc
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="group grid size-9 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-accent"
        >
          <span className="transition-transform duration-300 group-hover:rotate-45 group-active:scale-90">
            {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </span>
        </button>
      </div>
      <div className="hazard h-1" />
    </header>
  )
}
