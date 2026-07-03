import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'en' | 'de'

const DICT = {
  en: {
    'app.tagline': 'Endurance fueling calc',
    'theme.toLight': 'Switch to light mode',
    'theme.toDark': 'Switch to dark mode',
    'lang.switch': 'Switch language',

    'hero.title.plain': 'Never bonk',
    'hero.title.accent': ' again.',
    'hero.description':
      'Pick your race, set a carb target, done — hourly fueling targets, a product plan, a DIY bottle recipe and a race timeline.',
    'promise.fast': 'Race plan in 30 seconds',
    'promise.free': 'No account · no subscription',
    'promise.noai': 'No AI coach — just sport science',
    'promise.offline': 'Works offline · nothing stored',

    'section.sport': 'Sport',
    'section.legs': 'Race legs',
    'section.duration': 'Race duration',
    'section.carbs': 'Carb target',
    'section.ratio': 'Glucose : Fructose',
    'section.fuelSource': 'Fuel source',
    'section.hydration': 'Hydration & sodium',
    'section.gear': 'Your gear',
    'advanced.show': 'Advanced options',
    'advanced.hide': 'Hide advanced options',

    'sport.triathlon': 'Triathlon',
    'sport.cycling': 'Cycling',
    'sport.running': 'Running',
    'leg.swim': 'Swim',
    'leg.bike': 'Bike',
    'leg.run': 'Run',
    'leg.race': 'Race',

    'preset.sprint': 'Sprint',
    'preset.olympic': 'Olympic',
    'preset.im703': '70.3',
    'preset.ironman': 'Ironman',
    'preset.club': 'Club ride · 2h',
    'preset.fondo': 'Fondo · 4h',
    'preset.epic': 'Epic · 6h',
    'preset.half': 'Half · 1h45',
    'preset.marathon': 'Marathon · 3h45',
    'preset.ultra': 'Ultra · 6h',

    'tri.swimNote': 'No carbs in the water — down a gel a few minutes before the start.',
    'tri.carbTarget': 'Carb target',

    'ratio.custom': 'Custom',
    'ratio.glucose': 'Glucose',
    'ratio.fructose': 'Fructose',
    'ratio.explainer':
      'Glucose and fructose use different gut transporters — combining them raises how many carbs you can absorb per hour.',

    'fuel.combo.label': 'Gels + drink mix',
    'fuel.combo.desc': 'Shop-bought gels carry part of the carbs, the bottle does the rest',
    'fuel.gels.label': 'Gels only',
    'fuel.gels.desc': 'All carbs from gels, the bottle is just water — no powder needed',
    'fuel.diy.label': 'DIY mix only',
    'fuel.diy.desc': 'Everything goes into the bottle — pure maltodextrin + fructose',

    'temp.cool': 'Cool',
    'temp.mild': 'Mild',
    'temp.hot': 'Hot',
    'temp.adj.cool': 'cool',
    'temp.adj.mild': 'mild',
    'temp.adj.hot': 'hot',
    'hydration.targets':
      'Targets ~{fluid} ml fluid and ~{sodium} mg sodium per hour — the DIY recipe includes the matching salt amount.',

    'gear.gel': 'Carbs per gel',
    'gear.bottle': 'Bottle size',
    'gear.explainer':
      'Match these to your gear: Maurten and most gels are 25 g, SiS Beta Fuel is 40 g. Product counts, recipes and the timeline adapt instantly.',

    'results.title': 'Your fuel plan',
    'results.glucoseH': 'Glucose / h',
    'results.fructoseH': 'Fructose / h',
    'results.perHour': 'per hour',
    'results.totalCarbs': 'Total carbs',
    'results.totalGlucose': 'Total glucose',
    'results.totalFructose': 'Total fructose',
    'results.group.perHour': 'Each hour',
    'results.group.race': 'Whole race',
    'results.each': '({g} g each)',
    'results.drink': '{ml} ml drink',
    'results.mix': '({g} g mix)',
    'results.water': '{ml} ml water',
    'unit.gel': 'gel',
    'unit.gels': 'gels',

    'shopping.title': 'Shopping list',
    'shopping.gels': 'Gels ({g} g)',
    'shopping.bottles': 'Bottles',
    'shopping.malto': 'Maltodextrin',
    'shopping.fructose': 'Fructose',
    'shopping.salt': 'Table salt',

    'diy.title': 'DIY bottle mix',
    'diy.waterTitle': 'Water bottle',
    'diy.waterOnly': 'hydration only',
    'diy.legBottle': '{leg} bottle',
    'diy.topsUp': 'tops up the gels',
    'diy.malto': 'Maltodextrin (glucose)',
    'diy.fructose': 'Fructose',
    'diy.water': 'Water',
    'diy.salt': 'Salt (sodium)',
    'diy.pinch': 'Pinch of salt + squeeze of citrus',
    'diy.toTaste': 'to taste',

    'warn.glucoseCap':
      'Glucose absorption tops out around 60 g/h — this plan delivers {g} g/h. Consider shifting to a 1:0.8 ratio.',
    'warn.concentration':
      "{g} g in one {ml} ml bottle is a ~{pct}% solution — that's hard on many stomachs. Chase it with plain water on course.",
    'warn.gutTraining':
      'Intakes of 90 g/h and above need gut training — practice this in workouts before race day.',
    'warn.runOverBike':
      'Your run target is higher than your bike target — most athletes fuel hardest on the bike, where the gut tolerates more, and back off on the run.',
    'hint.short':
      'Racing under ~90 minutes? Topped-up glycogen stores cover most of it — one bottle of mix or a single gel is plenty.',
    'hint.firstHour':
      'Ease into it: stay at the lower end of your target for the first hour while your gut settles into race rhythm.',
    'hint.hydration':
      'Hydration assumes {temp} conditions (~{fluid} ml + ~{sodium} mg sodium per hour). Open “{advanced}” to tune for heat.',

    'timeline.title': 'Race timeline',
    'timeline.subtitle.multi': 'Hourly pattern per discipline',
    'timeline.subtitle.single': 'Repeat this pattern every hour',
    'timeline.every': 'Every',
    'timeline.gelSuffix': '— 1 gel ({g} g carbs)',
    'timeline.sipVerb': '— sip ~',
    'timeline.sipSuffix': 'of your mix',
    'timeline.start.single':
      'Start fueling in the first 15 minutes — don’t wait until you’re hungry',
    'timeline.start.multi':
      'Start fueling in the first 15 minutes on the bike — the swim leaves you with empty stores',
    'timeline.fullRace': 'Full race',

    'export.png': 'Save as image',
    'export.rendering': 'Rendering…',
    'export.copy': 'Copy share link',
    'export.copied': 'Link copied',

    'footer.assumptions':
      'Assumptions: 1 gel ≈ {gel} g carbs · 1 bottle = {bottle} ml · maltodextrin counts as glucose. FuelCast is a planning aid, not medical or nutritional advice — always test your fueling strategy in training.',
    'footer.privacy':
      'Free, open and stateless: no account, no tracking, no data leaves your device — your plan lives entirely in the URL.',
    'footer.disclaimer':
      'Not affiliated with any brand mentioned. Trademarks belong to their respective owners.',
    'footer.source': 'Source on GitHub',
  },
  de: {
    'app.tagline': 'Ausdauer-Fueling-Rechner',
    'theme.toLight': 'Zum hellen Modus wechseln',
    'theme.toDark': 'Zum dunklen Modus wechseln',
    'lang.switch': 'Switch language',

    'hero.title.plain': 'Nie wieder',
    'hero.title.accent': ' Hungerast.',
    'hero.description':
      'Rennen wählen, Carb-Ziel setzen, fertig — stündliche Fueling-Ziele, ein Produktplan, ein DIY-Flaschenrezept und eine Renn-Timeline.',
    'promise.fast': 'Rennplan in 30 Sekunden',
    'promise.free': 'Kein Konto · kein Abo',
    'promise.noai': 'Kein KI-Coach — nur Sportwissenschaft',
    'promise.offline': 'Offline nutzbar · nichts gespeichert',

    'section.sport': 'Sportart',
    'section.legs': 'Disziplinen',
    'section.duration': 'Renndauer',
    'section.carbs': 'Carb-Ziel',
    'section.ratio': 'Glukose : Fruktose',
    'section.fuelSource': 'Energiequelle',
    'section.hydration': 'Flüssigkeit & Natrium',
    'section.gear': 'Deine Ausrüstung',
    'advanced.show': 'Erweiterte Optionen',
    'advanced.hide': 'Erweiterte Optionen ausblenden',

    'sport.triathlon': 'Triathlon',
    'sport.cycling': 'Radfahren',
    'sport.running': 'Laufen',
    'leg.swim': 'Schwimmen',
    'leg.bike': 'Rad',
    'leg.run': 'Laufen',
    'leg.race': 'Rennen',

    'preset.sprint': 'Sprint',
    'preset.olympic': 'Olympisch',
    'preset.im703': '70.3',
    'preset.ironman': 'Ironman',
    'preset.club': 'Feierabendrunde · 2h',
    'preset.fondo': 'Fondo · 4h',
    'preset.epic': 'Langstrecke · 6h',
    'preset.half': 'Halbmarathon · 1h45',
    'preset.marathon': 'Marathon · 3h45',
    'preset.ultra': 'Ultra · 6h',

    'tri.swimNote':
      'Im Wasser gibt’s keine Carbs — nimm ein paar Minuten vor dem Start ein Gel.',
    'tri.carbTarget': 'Carb-Ziel',

    'ratio.custom': 'Eigenes',
    'ratio.glucose': 'Glukose',
    'ratio.fructose': 'Fruktose',
    'ratio.explainer':
      'Glukose und Fruktose nutzen unterschiedliche Transporter im Darm — kombiniert kannst du mehr Carbs pro Stunde aufnehmen.',

    'fuel.combo.label': 'Gels + Drink-Mix',
    'fuel.combo.desc': 'Gekaufte Gels liefern einen Teil der Carbs, die Flasche den Rest',
    'fuel.gels.label': 'Nur Gels',
    'fuel.gels.desc': 'Alle Carbs aus Gels, die Flasche enthält nur Wasser — kein Pulver nötig',
    'fuel.diy.label': 'Nur DIY-Mix',
    'fuel.diy.desc': 'Alles kommt in die Flasche — pures Maltodextrin + Fruktose',

    'temp.cool': 'Kühl',
    'temp.mild': 'Mild',
    'temp.hot': 'Heiß',
    'temp.adj.cool': 'kühle',
    'temp.adj.mild': 'milde',
    'temp.adj.hot': 'heiße',
    'hydration.targets':
      'Zielt auf ~{fluid} ml Flüssigkeit und ~{sodium} mg Natrium pro Stunde — das DIY-Rezept enthält die passende Salzmenge.',

    'gear.gel': 'Carbs pro Gel',
    'gear.bottle': 'Flaschengröße',
    'gear.explainer':
      'Pass das an deine Ausrüstung an: Maurten und die meisten Gels haben 25 g, SiS Beta Fuel hat 40 g. Produktanzahl, Rezepte und Timeline passen sich sofort an.',

    'results.title': 'Dein Fuel-Plan',
    'results.glucoseH': 'Glukose / h',
    'results.fructoseH': 'Fruktose / h',
    'results.perHour': 'pro Stunde',
    'results.totalCarbs': 'Carbs gesamt',
    'results.totalGlucose': 'Glukose gesamt',
    'results.totalFructose': 'Fruktose gesamt',
    'results.group.perHour': 'Pro Stunde',
    'results.group.race': 'Ganzes Rennen',
    'results.each': '(je {g} g)',
    'results.drink': '{ml} ml Getränk',
    'results.mix': '({g} g Mix)',
    'results.water': '{ml} ml Wasser',
    'unit.gel': 'Gel',
    'unit.gels': 'Gels',

    'shopping.title': 'Einkaufsliste',
    'shopping.gels': 'Gels ({g} g)',
    'shopping.bottles': 'Flaschen',
    'shopping.malto': 'Maltodextrin',
    'shopping.fructose': 'Fruktose',
    'shopping.salt': 'Salz',

    'diy.title': 'DIY-Flaschenmix',
    'diy.waterTitle': 'Wasserflasche',
    'diy.waterOnly': 'nur Flüssigkeit',
    'diy.legBottle': '{leg}-Flasche',
    'diy.topsUp': 'ergänzt die Gels',
    'diy.malto': 'Maltodextrin (Glukose)',
    'diy.fructose': 'Fruktose',
    'diy.water': 'Wasser',
    'diy.salt': 'Salz (Natrium)',
    'diy.pinch': 'Prise Salz + Spritzer Zitrone',
    'diy.toTaste': 'nach Geschmack',

    'warn.glucoseCap':
      'Die Glukoseaufnahme ist bei ~60 g/h gedeckelt — dieser Plan liefert {g} g/h. Erwäge ein 1:0.8-Verhältnis.',
    'warn.concentration':
      '{g} g in einer {ml}-ml-Flasche ergeben eine ~{pct}%-Lösung — das vertragen viele Mägen schlecht. Trink unterwegs klares Wasser dazu.',
    'warn.gutTraining':
      'Mengen ab 90 g/h erfordern Gut-Training — übe das in Trainingseinheiten vor dem Wettkampf.',
    'warn.runOverBike':
      'Dein Lauf-Ziel liegt über dem Rad-Ziel — die meisten Athleten fueln am härtesten auf dem Rad, wo der Magen mehr verträgt, und reduzieren beim Laufen.',
    'hint.short':
      'Rennen unter ~90 Minuten? Volle Glykogenspeicher decken das meiste ab — eine Flasche Mix oder ein einzelnes Gel reicht.',
    'hint.firstHour':
      'Lass es ruhig angehen: Bleib in der ersten Stunde am unteren Ende deines Ziels, bis sich dein Magen an den Rennrhythmus gewöhnt hat.',
    'hint.hydration':
      'Hydration nimmt {temp} Bedingungen an (~{fluid} ml + ~{sodium} mg Natrium pro Stunde). Öffne „{advanced}“, um z. B. Hitze einzustellen.',

    'timeline.title': 'Renn-Timeline',
    'timeline.subtitle.multi': 'Stundenmuster pro Disziplin',
    'timeline.subtitle.single': 'Wiederhole dieses Muster jede Stunde',
    'timeline.every': 'Alle',
    'timeline.gelSuffix': '— 1 Gel ({g} g Carbs)',
    'timeline.sipVerb': '— trink ~',
    'timeline.sipSuffix': 'deines Mix',
    'timeline.start.single':
      'Beginne in den ersten 15 Minuten mit dem Fueling — warte nicht, bis du hungrig bist',
    'timeline.start.multi':
      'Beginne auf dem Rad in den ersten 15 Minuten mit dem Fueling — nach dem Schwimmen sind die Speicher angezapft',
    'timeline.fullRace': 'Ganzes Rennen',

    'export.png': 'Als Bild speichern',
    'export.rendering': 'Wird erstellt…',
    'export.copy': 'Link kopieren',
    'export.copied': 'Link kopiert',

    'footer.assumptions':
      'Annahmen: 1 Gel ≈ {gel} g Carbs · 1 Flasche = {bottle} ml · Maltodextrin zählt als Glukose. FuelCast ist eine Planungshilfe, keine medizinische oder Ernährungsberatung — teste deine Strategie immer im Training.',
    'footer.privacy':
      'Kostenlos, offen und zustandslos: kein Konto, kein Tracking, keine Daten verlassen dein Gerät — dein Plan lebt komplett in der URL.',
    'footer.disclaimer':
      'Nicht mit den genannten Marken verbunden. Marken gehören ihren jeweiligen Inhabern.',
    'footer.source': 'Quellcode auf GitHub',
  },
} as const

export type MessageKey = keyof (typeof DICT)['en']
export type TranslateFn = (
  key: MessageKey,
  params?: Record<string, string | number>,
) => string

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: TranslateFn
  locale: string
}

const I18nContext = createContext<I18nValue | null>(null)

function detectLang(): Lang {
  const stored = localStorage.getItem('fuelcast-lang')
  if (stored === 'de' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang)

  useEffect(() => {
    localStorage.setItem('fuelcast-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t: TranslateFn = (key, params) => {
    let text: string = DICT[lang][key] ?? DICT.en[key] ?? key
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value))
      }
    }
    return text
  }

  const locale = lang === 'de' ? 'de-DE' : 'en-US'

  return (
    <I18nContext.Provider value={{ lang, setLang, t, locale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
