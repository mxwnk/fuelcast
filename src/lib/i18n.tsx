import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "de";

const DICT = {
  en: {
    "app.tagline": "Endurance fueling calc",
    "nav.calculator": "Calculator",
    "nav.science": "Science",
    "theme.toLight": "Switch to light mode",
    "theme.toDark": "Switch to dark mode",
    "lang.switch": "Switch language",

    "hero.title.plain": "Never bonk",
    "hero.title.accent": " again.",
    "hero.description":
      "Pick your race, set a carb target, done — hourly fueling targets, a product plan, a DIY bottle recipe and a race timeline.",
    "promise.fast": "Race plan in 30 seconds",
    "promise.free": "No account · no subscription",
    "promise.noai": "No AI coach — just sport science",
    "promise.offline": "Works offline · nothing stored",

    "section.sport": "Sport",
    "section.legs": "Race legs",
    "section.duration": "Race duration",
    "section.carbs": "Carb target",
    "section.ratio": "Glucose : Fructose",
    "section.fuelSource": "Fuel source",
    "section.hydration": "Hydration & sodium",
    "section.gear": "Your gear",
    "advanced.show": "Advanced options",
    "advanced.hide": "Hide advanced options",

    "sport.triathlon": "Triathlon",
    "sport.cycling": "Cycling",
    "sport.running": "Running",
    "leg.swim": "Swim",
    "leg.bike": "Bike",
    "leg.run": "Run",
    "leg.race": "Race",

    "preset.sprint": "Sprint",
    "preset.olympic": "Olympic",
    "preset.im703": "70.3",
    "preset.ironman": "Ironman",
    "preset.club": "Club ride · 2h",
    "preset.fondo": "Fondo · 4h",
    "preset.epic": "Epic · 6h",
    "preset.half": "Half · 1h45",
    "preset.marathon": "Marathon · 3h45",
    "preset.ultra": "Ultra · 6h",

    "tri.swimNote":
      "No carbs in the water — down a gel a few minutes before the start.",
    "tri.carbTarget": "Carb target",

    "ratio.custom": "Custom",
    "ratio.glucose": "Glucose",
    "ratio.fructose": "Fructose",
    "ratio.explainer":
      "Glucose and fructose use different gut transporters — combining them raises how many carbs you can absorb per hour.",

    "fuel.combo.label": "Gels + drink mix",
    "fuel.combo.desc":
      "Shop-bought gels carry part of the carbs, the bottle does the rest",
    "fuel.gels.label": "Gels only",
    "fuel.gels.desc":
      "All carbs from gels, the bottle is just water — no powder needed",
    "fuel.diy.label": "DIY mix only",
    "fuel.diy.desc":
      "Everything goes into the bottle — pure maltodextrin + fructose",

    "temp.cool": "Cool",
    "temp.mild": "Mild",
    "temp.hot": "Hot",
    "temp.adj.cool": "cool",
    "temp.adj.mild": "mild",
    "temp.adj.hot": "hot",
    "hydration.targets":
      "Targets ~{fluid} ml fluid and ~{sodium} mg sodium per hour — the DIY recipe includes the matching salt amount.",

    "gear.gel": "Carbs per gel",
    "gear.bottle": "Bottle size",
    "gear.explainer":
      "Match these to your gear: Maurten and most gels are 25 g, SiS Beta Fuel is 40 g. Product counts, recipes and the timeline adapt instantly.",

    "results.title": "Your fuel plan",
    "results.glucoseH": "Glucose / h",
    "results.fructoseH": "Fructose / h",
    "results.perHour": "per hour",
    "results.totalCarbs": "Total carbs",
    "results.totalGlucose": "Total glucose",
    "results.totalFructose": "Total fructose",
    "results.group.perHour": "Each hour",
    "results.group.race": "Whole race",
    "results.each": "({g} g each)",
    "unit.gel": "gel",
    "unit.gels": "gels",

    "shopping.title": "Shopping list",
    "shopping.gels": "Gels ({g} g)",
    "shopping.bottles": "Bottles",
    "shopping.malto": "Maltodextrin",
    "shopping.fructose": "Fructose",
    "shopping.salt": "Table salt",

    "diy.title": "DIY bottle mix",
    "diy.waterTitle": "Water bottle",
    "diy.waterOnly": "hydration only",
    "diy.legBottle": "{leg} bottle",
    "diy.malto": "Maltodextrin (glucose)",
    "diy.fructose": "Fructose",
    "diy.water": "Water",
    "diy.salt": "Salt (sodium)",
    "diy.pinch": "Pinch of salt + squeeze of citrus",
    "diy.toTaste": "to taste",

    "warn.glucoseCap":
      "Glucose absorption tops out around 60 g/h — this plan delivers {g} g/h. Consider shifting to a 1:0.8 ratio.",
    "warn.concentration":
      "{g} g in one {ml} ml bottle is a ~{pct}% solution — that's hard on many stomachs. Chase it with plain water on course.",
    "warn.gutTraining":
      "Intakes of 90 g/h and above need gut training — practice this in workouts before race day.",
    "warn.runOverBike":
      "Your run target is higher than your bike target — most athletes fuel hardest on the bike, where the gut tolerates more, and back off on the run.",
    "hint.short":
      "Racing under ~90 minutes? Topped-up glycogen stores cover most of it — one bottle of mix or a single gel is plenty.",
    "hint.firstHour":
      "Ease into it: stay at the lower end of your target for the first hour while your gut settles into race rhythm.",
    "hint.hydration":
      "Hydration assumes {temp} conditions (~{fluid} ml + ~{sodium} mg sodium per hour). Open “{advanced}” to tune for heat.",

    "timeline.title": "Race timeline",
    "timeline.subtitle.multi": "Hourly pattern per discipline",
    "timeline.subtitle.single": "Repeat this pattern every hour",
    "timeline.every": "Every",
    "timeline.gelSuffix": "— 1 gel ({g} g carbs)",
    "timeline.sipVerb": "— sip ~",
    "timeline.sipSuffix": "of your mix",
    "timeline.start.single":
      "Start fueling in the first 15 minutes — don’t wait until you’re hungry",
    "timeline.start.multi":
      "Start fueling in the first 15 minutes on the bike — the swim leaves you with empty stores",
    "timeline.fullRace": "Full race",

    "export.png": "Save as image",
    "export.rendering": "Rendering…",
    "export.print": "Print",
    "export.copy": "Copy share link",
    "export.copied": "Link copied",

    "footer.assumptions":
      "Assumptions: 1 gel ≈ {gel} g carbs · 1 bottle = {bottle} ml · maltodextrin counts as glucose. FuelCast is a planning aid, not medical or nutritional advice — always test your fueling strategy in training.",
    "footer.privacy":
      "Free, open and stateless: no account, no tracking, no data leaves your device — your plan lives entirely in the URL.",
    "footer.disclaimer":
      "Not affiliated with any brand mentioned. Trademarks belong to their respective owners.",
    "footer.source": "Source on GitHub",

    "science.heroTitle": "The Science",
    "science.heroAccent": " Behind FuelCast",
    "science.heroDesc":
      "Evidence-based sports nutrition — the research that powers our calculator.",
    "science.dualTransport.title": "The Dual Transport Model",
    "science.dualTransport.subtitle": "Why two sugars beat one",
    "science.dualTransport.intro":
      "Your small intestine absorbs carbohydrates through specialized protein channels called transporters. The key insight: glucose and fructose use completely different transporters.",
    "science.dualTransport.sglt1.title": "SGLT1 — The Glucose Channel",
    "science.dualTransport.sglt1.items":
      "Sodium-Glucose Linked Transporter 1|Located on the brush border of enterocytes|Absorbs glucose and glucose polymers (maltodextrin)|Co-transports Na+ and water (hydration bonus)|Saturates at approximately 60 g/h",
    "science.dualTransport.glut5.title": "GLUT5 — The Fructose Channel",
    "science.dualTransport.glut5.items":
      "Facilitative Glucose Transporter 5|Completely independent pathway from SGLT1|Absorbs fructose via facilitated diffusion|Provides an additional ~30–40 g/h capacity",
    "science.dualTransport.insight":
      "Since glucose and fructose use different transporters, consuming both simultaneously allows greater total absorption. Once SGLT1 saturates at ~60 g/h, additional glucose simply accumulates — causing GI distress. Adding fructose bypasses this bottleneck entirely.",
    "science.dualTransport.chartCaption":
      "Exogenous carbohydrate oxidation: glucose-only vs. dual transport (glucose + fructose). Based on Jeukendrup (2010), Smith et al. (2013).",
    "science.oxidation.title": "Oxidation Rates",
    "science.oxidation.subtitle": "How much can your body actually use?",
    "science.oxidation.intro":
      "Exogenous carbohydrate oxidation — the rate at which your body burns ingested carbs during exercise — has a well-documented ceiling depending on intestinal absorption capacity.",
    "science.oxidation.performance":
      "Currell & Jeukendrup (2008) showed glucose + fructose improved cycling time trial power by 8% over glucose alone (275 vs. 254 W).",
    "science.oxidation.bodyweight":
      "Body weight independent: a 60 kg runner and a 90 kg cyclist need the same intake rates. The gut, not the muscles, is the bottleneck.",
    "science.ratio.title": "The Optimal Ratio",
    "science.ratio.subtitle": "Glucose:Fructose — finding the sweet spot",
    "science.ratio.classic":
      "The classic 2:1 ratio delivers ~60 g glucose (saturating SGLT1) + ~30 g fructose (utilizing GLUT5) at 90 g/h. Most commercial products use this ratio.",
    "science.ratio.modern":
      "Newer research (Rowlands et al., 2015) suggests 1:0.8 may be equally effective. The exact ratio matters less than ensuring both transporters are recruited above 60 g/h.",
    "science.timing.title": "Timing & Dosing",
    "science.timing.subtitle": "When, how much, how often",
    "science.timing.start":
      "Start fueling within the first 15–30 minutes. Peak oxidation takes 75–90 minutes to reach maximum — starting early avoids a fuel gap.",
    "science.timing.frequency":
      "Little and often: every 15–20 minutes with smaller doses maintains stable blood glucose and reduces GI burden.",
    "science.gut.title": "Gut Training",
    "science.gut.subtitle": "Your gut is trainable",
    "science.gut.intro":
      "Cox et al. (2010) showed that 28 days of high-carb training increased exogenous oxidation rates. Intestinal transporters (SGLT1, GLUT5) are upregulated with consistent carbohydrate exposure.",
    "science.gut.protocol":
      "Start 4–6 weeks before race day. Begin at 40–50 g/h, increase by 10 g/h per week. Use the same products and concentrations you plan to race with.",
    "science.gut.osmolality":
      "Maltodextrin advantage: a 60 g/L maltodextrin solution has far lower osmolality than glucose — allowing high-concentration bottles that still empty quickly from the stomach.",
    "science.practical.title": "Practical Application",
    "science.practical.subtitle": "From science to race day",
    "science.practical.formats":
      "All formats (gels, drinks, solids) achieve similar oxidation rates when carb type and amount are matched (Pfeiffer et al., 2010). The choice is practical, not physiological.",
    "science.practical.diy":
      "DIY mixing with maltodextrin + fructose allows precise control over concentration and ratio at a fraction of the cost of commercial products.",
    "science.practical.rules":
      "Train your gut (4+ weeks)|Use multiple transportable carbs above 60 g/h|Start fueling within 15–30 minutes|Little and often — every 15–20 minutes|Keep bottles at 6–8% concentration|Nothing new on race day",
    "science.references.title": "Key References",
  },
  de: {
    "app.tagline": "Ausdauer-Fueling-Rechner",
    "nav.calculator": "Rechner",
    "nav.science": "Wissenschaft",
    "theme.toLight": "Zum hellen Modus wechseln",
    "theme.toDark": "Zum dunklen Modus wechseln",
    "lang.switch": "Switch language",

    "hero.title.plain": "Nie wieder",
    "hero.title.accent": " Hungerast.",
    "hero.description":
      "Rennen wählen, Carb-Ziel setzen, fertig — stündliche Fueling-Ziele, ein Produktplan, ein DIY-Flaschenrezept und eine Renn-Timeline.",
    "promise.fast": "Rennplan in 30 Sekunden",
    "promise.free": "Kein Konto · kein Abo",
    "promise.noai": "Kein KI-Coach — nur Sportwissenschaft",
    "promise.offline": "Offline nutzbar · nichts gespeichert",

    "section.sport": "Sportart",
    "section.legs": "Disziplinen",
    "section.duration": "Renndauer",
    "section.carbs": "Carb-Ziel",
    "section.ratio": "Glukose : Fruktose",
    "section.fuelSource": "Energiequelle",
    "section.hydration": "Flüssigkeit & Natrium",
    "section.gear": "Deine Ausrüstung",
    "advanced.show": "Erweiterte Optionen",
    "advanced.hide": "Erweiterte Optionen ausblenden",

    "sport.triathlon": "Triathlon",
    "sport.cycling": "Radfahren",
    "sport.running": "Laufen",
    "leg.swim": "Schwimmen",
    "leg.bike": "Rad",
    "leg.run": "Laufen",
    "leg.race": "Rennen",

    "preset.sprint": "Sprint",
    "preset.olympic": "Olympisch",
    "preset.im703": "70.3",
    "preset.ironman": "Ironman",
    "preset.club": "Feierabendrunde · 2h",
    "preset.fondo": "Fondo · 4h",
    "preset.epic": "Langstrecke · 6h",
    "preset.half": "Halbmarathon · 1h45",
    "preset.marathon": "Marathon · 3h45",
    "preset.ultra": "Ultra · 6h",

    "tri.swimNote":
      "Im Wasser gibt’s keine Carbs — nimm ein paar Minuten vor dem Start ein Gel.",
    "tri.carbTarget": "Carb-Ziel",

    "ratio.custom": "Eigenes",
    "ratio.glucose": "Glukose",
    "ratio.fructose": "Fruktose",
    "ratio.explainer":
      "Glukose und Fruktose nutzen unterschiedliche Transporter im Darm — kombiniert kannst du mehr Carbs pro Stunde aufnehmen.",

    "fuel.combo.label": "Gels + Drink-Mix",
    "fuel.combo.desc":
      "Gekaufte Gels liefern einen Teil der Carbs, die Flasche den Rest",
    "fuel.gels.label": "Nur Gels",
    "fuel.gels.desc":
      "Alle Carbs aus Gels, die Flasche enthält nur Wasser — kein Pulver nötig",
    "fuel.diy.label": "Nur DIY-Mix",
    "fuel.diy.desc":
      "Alles kommt in die Flasche — pures Maltodextrin + Fruktose",

    "temp.cool": "Kühl",
    "temp.mild": "Mild",
    "temp.hot": "Heiß",
    "temp.adj.cool": "kühle",
    "temp.adj.mild": "milde",
    "temp.adj.hot": "heiße",
    "hydration.targets":
      "Zielt auf ~{fluid} ml Flüssigkeit und ~{sodium} mg Natrium pro Stunde — das DIY-Rezept enthält die passende Salzmenge.",

    "gear.gel": "Carbs pro Gel",
    "gear.bottle": "Flaschengröße",
    "gear.explainer":
      "Pass das an deine Ausrüstung an: Maurten und die meisten Gels haben 25 g, SiS Beta Fuel hat 40 g. Produktanzahl, Rezepte und Timeline passen sich sofort an.",

    "results.title": "Dein Fuel-Plan",
    "results.glucoseH": "Glukose / h",
    "results.fructoseH": "Fruktose / h",
    "results.perHour": "pro Stunde",
    "results.totalCarbs": "Carbs gesamt",
    "results.totalGlucose": "Glukose gesamt",
    "results.totalFructose": "Fruktose gesamt",
    "results.group.perHour": "Pro Stunde",
    "results.group.race": "Ganzes Rennen",
    "results.each": "(je {g} g)",
    "unit.gel": "Gel",
    "unit.gels": "Gels",

    "shopping.title": "Einkaufsliste",
    "shopping.gels": "Gels ({g} g)",
    "shopping.bottles": "Flaschen",
    "shopping.malto": "Maltodextrin",
    "shopping.fructose": "Fruktose",
    "shopping.salt": "Salz",

    "diy.title": "DIY-Flaschenmix",
    "diy.waterTitle": "Wasserflasche",
    "diy.waterOnly": "nur Flüssigkeit",
    "diy.legBottle": "{leg}-Flasche",
    "diy.malto": "Maltodextrin (Glukose)",
    "diy.fructose": "Fruktose",
    "diy.water": "Wasser",
    "diy.salt": "Salz (Natrium)",
    "diy.pinch": "Prise Salz + Spritzer Zitrone",
    "diy.toTaste": "nach Geschmack",

    "warn.glucoseCap":
      "Die Glukoseaufnahme ist bei ~60 g/h gedeckelt — dieser Plan liefert {g} g/h. Erwäge ein 1:0.8-Verhältnis.",
    "warn.concentration":
      "{g} g in einer {ml}-ml-Flasche ergeben eine ~{pct}%-Lösung — das vertragen viele Mägen schlecht. Trink unterwegs klares Wasser dazu.",
    "warn.gutTraining":
      "Mengen ab 90 g/h erfordern Gut-Training — übe das in Trainingseinheiten vor dem Wettkampf.",
    "warn.runOverBike":
      "Dein Lauf-Ziel liegt über dem Rad-Ziel — die meisten Athleten fueln am härtesten auf dem Rad, wo der Magen mehr verträgt, und reduzieren beim Laufen.",
    "hint.short":
      "Rennen unter ~90 Minuten? Volle Glykogenspeicher decken das meiste ab — eine Flasche Mix oder ein einzelnes Gel reicht.",
    "hint.firstHour":
      "Lass es ruhig angehen: Bleib in der ersten Stunde am unteren Ende deines Ziels, bis sich dein Magen an den Rennrhythmus gewöhnt hat.",
    "hint.hydration":
      "Hydration nimmt {temp} Bedingungen an (~{fluid} ml + ~{sodium} mg Natrium pro Stunde). Öffne „{advanced}“, um z. B. Hitze einzustellen.",

    "timeline.title": "Renn-Timeline",
    "timeline.subtitle.multi": "Stundenmuster pro Disziplin",
    "timeline.subtitle.single": "Wiederhole dieses Muster jede Stunde",
    "timeline.every": "Alle",
    "timeline.gelSuffix": "— 1 Gel ({g} g Carbs)",
    "timeline.sipVerb": "— trink ~",
    "timeline.sipSuffix": "deines Mix",
    "timeline.start.single":
      "Beginne in den ersten 15 Minuten mit dem Fueling — warte nicht, bis du hungrig bist",
    "timeline.start.multi":
      "Beginne auf dem Rad in den ersten 15 Minuten mit dem Fueling — nach dem Schwimmen sind die Speicher angezapft",
    "timeline.fullRace": "Ganzes Rennen",

    "export.png": "Bild speichern",
    "export.rendering": "Wird erstellt…",
    "export.print": "Drucken",
    "export.copy": "Link kopieren",
    "export.copied": "Link kopiert",

    "footer.assumptions":
      "Annahmen: 1 Gel ≈ {gel} g Carbs · 1 Flasche = {bottle} ml · Maltodextrin zählt als Glukose. FuelCast ist eine Planungshilfe, keine medizinische oder Ernährungsberatung — teste deine Strategie immer im Training.",
    "footer.privacy":
      "Kostenlos, offen und zustandslos: kein Konto, kein Tracking, keine Daten verlassen dein Gerät — dein Plan lebt komplett in der URL.",
    "footer.disclaimer":
      "Nicht mit den genannten Marken verbunden. Marken gehören ihren jeweiligen Inhabern.",
    "footer.source": "Quellcode auf GitHub",

    "science.heroTitle": "Die Wissenschaft",
    "science.heroAccent": " hinter FuelCast",
    "science.heroDesc":
      "Evidenzbasierte Sporternährung — die Forschung, die unseren Rechner antreibt.",
    "science.dualTransport.title": "Das Dual-Transport-Modell",
    "science.dualTransport.subtitle": "Warum zwei Zucker besser sind als einer",
    "science.dualTransport.intro":
      "Dein Dünndarm absorbiert Kohlenhydrate über spezialisierte Proteinkanäle — sogenannte Transporter. Die zentrale Erkenntnis: Glucose und Fructose nutzen komplett unterschiedliche Transporter.",
    "science.dualTransport.sglt1.title": "SGLT1 — Der Glucose-Kanal",
    "science.dualTransport.sglt1.items":
      "Sodium-Glucose Linked Transporter 1|Sitzt auf der Bürstenmembran der Enterozyten|Absorbiert Glucose und Glucose-Polymere (Maltodextrin)|Co-transportiert Na+ und Wasser (Hydrations-Bonus)|Sättigt bei ca. 60 g/h",
    "science.dualTransport.glut5.title": "GLUT5 — Der Fructose-Kanal",
    "science.dualTransport.glut5.items":
      "Facilitative Glucose Transporter 5|Komplett unabhängiger Absorptionsweg|Absorbiert Fructose über erleichterte Diffusion|Bietet zusätzliche ~30–40 g/h Kapazität",
    "science.dualTransport.insight":
      "Da Glucose und Fructose unterschiedliche Transporter nutzen, ermöglicht der gleichzeitige Konsum eine höhere Gesamtabsorption. Sobald SGLT1 bei ~60 g/h sättigt, sammelt sich zusätzliche Glucose an — und verursacht GI-Beschwerden. Fructose umgeht diesen Flaschenhals vollständig.",
    "science.dualTransport.chartCaption":
      "Exogene Kohlenhydrat-Oxidation: nur Glucose vs. Dual-Transport (Glucose + Fructose). Basierend auf Jeukendrup (2010), Smith et al. (2013).",
    "science.oxidation.title": "Oxidationsraten",
    "science.oxidation.subtitle":
      "Wie viel kann dein Körper tatsächlich verwerten?",
    "science.oxidation.intro":
      "Exogene Kohlenhydrat-Oxidation — die Rate, mit der dein Körper aufgenommene Carbs verbrennt — hat eine gut dokumentierte Obergrenze, abhängig von der intestinalen Absorptionskapazität.",
    "science.oxidation.performance":
      "Currell & Jeukendrup (2008) zeigten: Glucose + Fructose verbesserte die Zeitfahr-Leistung um 8% gegenüber reiner Glucose (275 vs. 254 W).",
    "science.oxidation.bodyweight":
      "Körpergewicht-unabhängig: Ein 60 kg Läufer und ein 90 kg Radfahrer benötigen dieselben Zufuhrraten. Der Darm, nicht die Muskulatur, ist der Flaschenhals.",
    "science.ratio.title": "Das optimale Verhältnis",
    "science.ratio.subtitle": "Glucose:Fructose — den Sweet Spot finden",
    "science.ratio.classic":
      "Das klassische 2:1-Verhältnis liefert bei 90 g/h ~60 g Glucose (sättigt SGLT1) + ~30 g Fructose (nutzt GLUT5). Die meisten kommerziellen Produkte verwenden dieses Verhältnis.",
    "science.ratio.modern":
      "Neuere Forschung (Rowlands et al., 2015) deutet darauf hin, dass 1:0.8 ebenso effektiv sein könnte. Das exakte Verhältnis ist weniger kritisch als sicherzustellen, dass über 60 g/h beide Transporter rekrutiert werden.",
    "science.timing.title": "Timing & Dosierung",
    "science.timing.subtitle": "Wann, wie viel, wie oft",
    "science.timing.start":
      "Starte innerhalb der ersten 15–30 Minuten. Die Spitzen-Oxidation braucht 75–90 Minuten zum Maximum — früher Start vermeidet eine Kraftstofflücke.",
    "science.timing.frequency":
      "Wenig und oft: alle 15–20 Minuten in kleinen Dosen hält den Blutzucker stabil und reduziert die GI-Belastung.",
    "science.gut.title": "Darm-Training",
    "science.gut.subtitle": "Dein Darm ist trainierbar",
    "science.gut.intro":
      "Cox et al. (2010) zeigten, dass 28 Tage High-Carb-Training die exogenen Oxidationsraten steigerte. Intestinale Transporter (SGLT1, GLUT5) werden bei konstanter Kohlenhydrat-Exposition hochreguliert.",
    "science.gut.protocol":
      "Starte 4–6 Wochen vor dem Renntag. Beginne bei 40–50 g/h, steigere um 10 g/h pro Woche. Verwende dieselben Produkte und Konzentrationen wie im Wettkampf geplant.",
    "science.gut.osmolality":
      "Maltodextrin-Vorteil: Eine 60 g/L Maltodextrin-Lösung hat weit geringere Osmolalität als Glucose — ermöglicht hoch-konzentrierte Flaschen, die trotzdem schnell aus dem Magen entleert werden.",
    "science.practical.title": "Praktische Anwendung",
    "science.practical.subtitle": "Von der Wissenschaft zum Renntag",
    "science.practical.formats":
      "Alle Formate (Gels, Getränke, feste Nahrung) erreichen ähnliche Oxidationsraten bei gleichem Carb-Typ und gleicher Menge (Pfeiffer et al., 2010). Die Wahl ist praktisch, nicht physiologisch.",
    "science.practical.diy":
      "DIY-Mischen mit Maltodextrin + Fructose ermöglicht präzise Kontrolle über Konzentration und Verhältnis zu einem Bruchteil der Kosten kommerzieller Produkte.",
    "science.practical.rules":
      "Trainiere deinen Darm (4+ Wochen)|Nutze mehrere transportable KH über 60 g/h|Starte innerhalb von 15–30 Minuten|Wenig und oft — alle 15–20 Minuten|Flaschen bei 6–8% Konzentration halten|Nichts Neues am Renntag",
    "science.references.title": "Quellen",
  },
} as const;

export type MessageKey = keyof (typeof DICT)["en"];
export type TranslateFn = (
  key: MessageKey,
  params?: Record<string, string | number>,
) => string;

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslateFn;
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

function detectLang(): Lang {
  const stored = localStorage.getItem("fuelcast-lang");
  if (stored === "de" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang);

  useEffect(() => {
    localStorage.setItem("fuelcast-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t: TranslateFn = (key, params) => {
    let text: string = DICT[lang][key] ?? DICT.en[key] ?? key;
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };

  const locale = lang === "de" ? "de-DE" : "en-US";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
