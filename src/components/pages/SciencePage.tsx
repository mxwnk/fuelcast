import { BookOpen, FlaskConical, Gauge, Clock, Activity, Beaker } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

const BASE_URL = import.meta.env.BASE_URL

interface CiteProps {
  refs: number[]
}

/** Inline citation links, e.g. [1][2] — scrolls to the reference list */
function Cite({ refs }: CiteProps) {
  return (
    <>
      {refs.map((n) => (
        <a
          key={n}
          href={`#ref-${n}`}
          className="ml-0.5 text-[10px] font-bold text-accent no-underline hover:underline"
          title={REFERENCES[n - 1]?.text}
        >
          [{n}]
        </a>
      ))}
    </>
  )
}

interface ScienceSectionProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}

function ScienceSection({ icon, title, subtitle, children }: ScienceSectionProps) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          {icon}
        </span>
        <div>
          <h2 className="head text-base sm:text-lg">{title}</h2>
          <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-ink/90">{children}</div>
    </section>
  )
}

interface TransporterCardProps {
  title: string
  items: string
  color: 'glucose' | 'fructose'
}

function TransporterCard({ title, items, color }: TransporterCardProps) {
  const colorClass = color === 'glucose' ? 'border-gluc/30 bg-gluc/5' : 'border-fruc/30 bg-fruc/5'
  const dotClass = color === 'glucose' ? 'bg-gluc' : 'bg-fruc'

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <h3 className="data mb-2 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <ul className="space-y-1.5 text-sm">
        {items.split('|').map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dotClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface OxidationTableProps {
  locale: string
}

function OxidationTable({ locale }: OxidationTableProps) {
  const isDE = locale.startsWith('de')
  const rows = [
    { source: isDE ? 'Nur Glucose' : 'Glucose only', rate: '~60 g/h', note: '1.0 g/min' },
    { source: isDE ? 'Nur Maltodextrin' : 'Maltodextrin only', rate: '~60 g/h', note: '1.0 g/min' },
    { source: 'Glucose + Fructose (2:1)', rate: '~90 g/h', note: '1.5 g/min' },
    { source: isDE ? 'Spitzenwert (Studien)' : 'Peak (studies)', rate: '~105 g/h', note: '1.75 g/min' },
    { source: isDE ? 'Moderne Ultra-Athleten' : 'Modern ultra-athletes', rate: '100–120 g/h', note: isDE ? 'trainierter Darm' : 'trained gut' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="data w-full text-xs">
        <thead>
          <tr className="border-b border-line text-left text-muted">
            <th className="pb-2 pr-4 font-semibold">{isDE ? 'Quelle' : 'Source'}</th>
            <th className="pb-2 pr-4 font-semibold">{isDE ? 'Max. Rate' : 'Max Rate'}</th>
            <th className="pb-2 font-semibold">{isDE ? 'Hinweis' : 'Note'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.source} className="border-b border-line/50">
              <td className="py-2 pr-4">{row.source}</td>
              <td className="py-2 pr-4 font-bold text-accent">{row.rate}</td>
              <td className="py-2 text-muted">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface Reference {
  text: string
  url: string
}

const REFERENCES: Reference[] = [
  {
    text: 'Jeukendrup AE (2014). "A Step Towards Personalized Sports Nutrition." Sports Med 44(Suppl 1):25-33.',
    url: 'https://doi.org/10.1007/s40279-014-0148-z',
  },
  {
    text: 'Jeukendrup AE (2010). "Carbohydrate and exercise performance: the role of multiple transportable carbohydrates." Curr Opin Clin Nutr Metab Care 13:452-457.',
    url: 'https://doi.org/10.1097/MCO.0b013e328339de9f',
  },
  {
    text: 'Jentjens & Jeukendrup (2005). "High rates of exogenous carbohydrate oxidation." Br J Nutr 93(4):485-492.',
    url: 'https://doi.org/10.1079/BJN20041368',
  },
  {
    text: 'Cox et al. (2010). "Daily training with high carbohydrate availability increases exogenous carbohydrate oxidation." J Appl Physiol.',
    url: 'https://doi.org/10.1152/japplphysiol.00950.2009',
  },
  {
    text: 'Smith et al. (2013). "Curvilinear dose-response relationship of carbohydrate (0-120 g/h) and performance." Med Sci Sports Exerc 45(2):336-341.',
    url: 'https://doi.org/10.1249/MSS.0b013e31827205d1',
  },
  {
    text: 'Currell & Jeukendrup (2008). "Superior endurance performance with ingestion of multiple transportable carbohydrates." Med Sci Sports Exerc 40(2):275-281.',
    url: 'https://doi.org/10.1249/MSS.0b013e31815adf19',
  },
  {
    text: 'Rowlands et al. (2015). "Fructose-maltodextrin ratio in a carbohydrate-electrolyte solution." Med Sci Sports Exerc 47(12):2621-2631.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26110694/',
  },
  {
    text: 'Pfeiffer et al. (2010). "Oxidation of solid vs. liquid CHO sources during exercise." Med Sci Sports Exerc 42(11):2030-2037.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/20404769/',
  },
  {
    text: 'Pfeiffer et al. (2012). "Nutritional intake and gastrointestinal problems during competitive endurance events." Med Sci Sports Exerc 44(2):344-351.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21775906/',
  },
  {
    text: 'Jeukendrup & McLaughlin (2011). "Carbohydrate ingestion during exercise: effects on performance, training adaptations and trainability of the gut." Nestle Nutr Inst Workshop Ser 69:1-12.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22301831/',
  },
]

export function SciencePage() {
  const { t, locale } = useI18n()

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20">
      {/* Hero */}
      <div className="rise text-center">
        <h1 className="head text-2xl sm:text-3xl">
          {t('science.heroTitle')}
          <span className="text-accent">{t('science.heroAccent')}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {t('science.heroDesc')}
        </p>
      </div>

      {/* 1. Dual Transport */}
      <ScienceSection
        icon={<FlaskConical className="size-5" />}
        title={t('science.dualTransport.title')}
        subtitle={t('science.dualTransport.subtitle')}
      >
        <p>{t('science.dualTransport.intro')}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <TransporterCard
            title={t('science.dualTransport.sglt1.title')}
            items={t('science.dualTransport.sglt1.items')}
            color="glucose"
          />
          <TransporterCard
            title={t('science.dualTransport.glut5.title')}
            items={t('science.dualTransport.glut5.items')}
            color="fructose"
          />
        </div>

        <p className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm">
          {t('science.dualTransport.insight')}<Cite refs={[2, 3]} />
        </p>

        {/* Chart */}
        <figure className="mt-2">
          <img
            src={`${BASE_URL}science-absorption.svg`}
            alt="Dual transport absorption chart"
            className="w-full rounded-lg"
          />
          <figcaption className="mt-2 text-center text-xs text-muted">
            {t('science.dualTransport.chartCaption')}
          </figcaption>
        </figure>
      </ScienceSection>

      {/* 2. Oxidation Rates */}
      <ScienceSection
        icon={<Gauge className="size-5" />}
        title={t('science.oxidation.title')}
        subtitle={t('science.oxidation.subtitle')}
      >
        <p>{t('science.oxidation.intro')}<Cite refs={[5]} /></p>
        <OxidationTable locale={locale} />
        <p className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm">
          {t('science.oxidation.performance')}<Cite refs={[6]} />
        </p>
        <p className="text-sm text-muted italic">
          {t('science.oxidation.bodyweight')}
        </p>
      </ScienceSection>

      {/* 3. Ratio */}
      <ScienceSection
        icon={<BookOpen className="size-5" />}
        title={t('science.ratio.title')}
        subtitle={t('science.ratio.subtitle')}
      >
        <p>{t('science.ratio.classic')}<Cite refs={[3]} /></p>
        <p>{t('science.ratio.modern')}<Cite refs={[7]} /></p>
      </ScienceSection>

      {/* 4. Timing */}
      <ScienceSection
        icon={<Clock className="size-5" />}
        title={t('science.timing.title')}
        subtitle={t('science.timing.subtitle')}
      >
        <p>{t('science.timing.start')}<Cite refs={[1]} /></p>
        <p>{t('science.timing.frequency')}</p>
      </ScienceSection>

      {/* 5. Gut Training */}
      <ScienceSection
        icon={<Activity className="size-5" />}
        title={t('science.gut.title')}
        subtitle={t('science.gut.subtitle')}
      >
        <p>{t('science.gut.intro')}<Cite refs={[4, 10]} /></p>
        <p>{t('science.gut.protocol')}</p>
        <p className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm">
          {t('science.gut.osmolality')}
        </p>
      </ScienceSection>

      {/* 6. Practical */}
      <ScienceSection
        icon={<Beaker className="size-5" />}
        title={t('science.practical.title')}
        subtitle={t('science.practical.subtitle')}
      >
        <p>{t('science.practical.formats')}<Cite refs={[8]} /></p>
        <p>{t('science.practical.diy')}</p>

        <div className="rounded-lg border border-line bg-raised p-4">
          <h3 className="head mb-2 text-xs uppercase tracking-wider text-accent">
            {locale.startsWith('de') ? 'Die goldenen Regeln' : 'The Golden Rules'}
          </h3>
          <ol className="list-inside list-decimal space-y-1.5 text-sm">
            {t('science.practical.rules').split('|').map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </div>
      </ScienceSection>

      {/* References */}
      <section id="references" className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="head mb-4 text-base">{t('science.references.title')}</h2>
        <ol className="list-inside list-decimal space-y-2 text-xs leading-relaxed text-muted">
          {REFERENCES.map((ref, i) => (
            <li key={ref.url} id={`ref-${i + 1}`}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line/50 underline-offset-2 transition-colors hover:text-accent"
              >
                {ref.text}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
