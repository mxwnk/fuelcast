import { createContext, useContext, useEffect } from "react";

export type Lang = "en" | "de";

const DICT = {
  en: {
    "app.tagline": "Endurance fueling calc",
    "nav.calculator": "Calculator",
    "nav.knowHow": "Know-how",
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
      "Estimates ~{fluid} ml fluid and ~{sodium} mg sodium per hour (individual sweat rates vary widely). The DIY recipe includes the matching salt amount.",

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
      "{g} g in one {ml} ml bottle is a ~{pct}% solution — above 8% slows gastric emptying. Drink plain water alongside or split carbs across more bottles.",
    "warn.gutTraining":
      "Intakes of 90 g/h and above need gut training — practice this in workouts before race day.",
    "warn.runOverBike":
      "Your run target is higher than your bike target — most athletes front-load fueling on the bike where eating is mechanically easier, then reduce on the run to avoid GI issues from impact.",
    "hint.short":
      "Racing under ~90 minutes? Topped-up glycogen stores cover most of it — one bottle of mix or a single gel is plenty.",
    "hint.firstHour":
      "Ease into it: stay at the lower end of your target for the first hour while your gut settles into race rhythm.",
    "hint.hydration":
      "Hydration assumes {temp} conditions (~{fluid} ml + ~{sodium} mg sodium per hour). Open \u201c{advanced}\u201d to tune for heat.",
    "hint.drinkToThirst":
      "Drink to thirst, not to a schedule. Fluid targets here are rough estimates \u2014 overdrinking can cause dangerous hyponatremia. Let thirst guide you.",
    "hint.individualVariation":
      "Sweat rates vary ~8\u00d7 between individuals and sodium concentration ~15\u00d7. Consider a sweat test for personalized targets, especially for events over 3 hours.",
    "hint.medicalDisclaimer":
      "Not suitable for children. If you have cardiac, renal, or blood pressure conditions, consult your physician before following any hydration or fueling plan.",
    "hint.bodyWeight":
      "High carb targets (80+ g/h) are based on research with trained male athletes. Lighter athletes or those new to fueling may want to start at the lower end and build up.",
    "hint.saltPalatability":
      "Hot conditions increase the salt concentration in your bottle. If the taste becomes unpalatable, drink more plain water alongside or split into smaller, more frequent bottles.",
    "hints.toggle": "{count} hints & safety notes",

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
    "export.copyFallback": "Copy this link:",

    "footer.assumptions":
      "Your settings: {gel} g per gel · {bottle} ml bottle · maltodextrin counts as glucose. FuelCast is a planning aid, not medical or nutritional advice — always test your fueling strategy in training.",
    "footer.privacy":
      "Free, open and stateless: no account, no tracking, no data leaves your device — your plan lives entirely in the URL.",
    "footer.disclaimer":
      "Not affiliated with any brand mentioned. Trademarks belong to their respective owners.",
    "footer.source": "Source code",
    "footer.imprint": "Imprint",

    "imprint.updated": "Last updated: July 2026",
    "imprint.legal.title": "Information according to § 5 DDG",
    "imprint.contact": "Contact",
    "imprint.responsible": "Responsible for content according to § 18 (2) MStV",
    "imprint.liability.title": "Liability for content",
    "imprint.liability.p1": "As a service provider, we are responsible for our own content on these pages in accordance with § 7 (1) DDG. According to §§ 8 to 10 DDG, however, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
    "imprint.liability.p2": "Obligations to remove or block the use of information under general law remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific legal violation. Upon becoming aware of corresponding legal violations, we will remove this content immediately.",
    "imprint.links.title": "Liability for links",
    "imprint.links.p1": "Our site contains links to external third-party websites whose content we have no influence over. Therefore, we cannot assume any liability for this third-party content. The respective provider or operator is always responsible for the content of linked pages.",
    "imprint.links.p2": "A permanent content control of the linked pages is not reasonable without concrete evidence of a legal violation. Upon becoming aware of legal violations, we will remove such links immediately.",
    "imprint.copyright.title": "Copyright",
    "imprint.copyright.p1": "The content and works created by the site operator on these pages are subject to German copyright law. Reproduction, editing, distribution, and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator.",
    "imprint.copyright.p2": "Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.",

    "privacy.title": "Privacy Policy",
    "privacy.updated": "Last updated: July 2026",
    "privacy.p1": "FuelCast does not collect, store, transmit, or share any personal data or user information.",
    "privacy.p2": "This app runs entirely in your browser. No data is sent to any server. There are no analytics, no cookies, no tracking technologies, and no third-party SDKs.",
    "privacy.p3": "Your fueling plan exists only in the URL. If you share the URL, anyone with the link can see the plan parameters. No data is stored on our side.",
    "privacy.p4": "The site uses a Service Worker for offline functionality. This caches only static assets (HTML, CSS, JS, fonts) on your device — no personal data.",
    "privacy.p5": "If this policy changes in the future, the 'Last Updated' date will be revised and any new data practices will be clearly disclosed.",

    "footer.privacy.link": "Privacy",

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
    "science.oxidation.diminishing":
      "Diminishing returns above 90 g/h: oxidation efficiency drops from ~86% to ~76% at 120 g/h with no additional glycogen sparing. The extra carbs require dedicated gut training and offer sub-proportional benefit.",
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
    "nav.knowHow": "Know-how",
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
      "Schätzt ~{fluid} ml Flüssigkeit und ~{sodium} mg Natrium pro Stunde (individuelle Schweißraten variieren stark). Das DIY-Rezept enthält die passende Salzmenge.",

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
      "{g} g in einer {ml}-ml-Flasche ergeben eine ~{pct}%-Lösung — über 8% verlangsamt die Magenentleerung. Trink klares Wasser dazu oder verteile die Carbs auf mehr Flaschen.",
    "warn.gutTraining":
      "Mengen ab 90 g/h erfordern Gut-Training — übe das in Trainingseinheiten vor dem Wettkampf.",
    "warn.runOverBike":
      "Dein Lauf-Ziel liegt über dem Rad-Ziel — die meisten Athleten fueln stärker auf dem Rad, wo Essen mechanisch einfacher ist, und reduzieren beim Laufen um GI-Probleme durch den Aufprall zu vermeiden.",
    "hint.short":
      "Rennen unter ~90 Minuten? Volle Glykogenspeicher decken das meiste ab — eine Flasche Mix oder ein einzelnes Gel reicht.",
    "hint.firstHour":
      "Lass es ruhig angehen: Bleib in der ersten Stunde am unteren Ende deines Ziels, bis sich dein Magen an den Rennrhythmus gewöhnt hat.",
    "hint.hydration":
      "Hydration nimmt {temp} Bedingungen an (~{fluid} ml + ~{sodium} mg Natrium pro Stunde). Öffne \u201e{advanced}\u201c, um z. B. Hitze einzustellen.",
    "hint.drinkToThirst":
      "Trinke nach Durst, nicht nach Zeitplan. Die Flüssigkeitsziele hier sind grobe Schätzungen \u2014 übermäßiges Trinken kann gefährliche Hyponatriämie verursachen. Lass dein Durstgefühl entscheiden.",
    "hint.individualVariation":
      "Schweißraten variieren ~8\u00d7 zwischen Personen, Natrium-Konzentration ~15\u00d7. Erwäge einen Schweißtest für individuelle Ziele, besonders bei Events über 3 Stunden.",
    "hint.medicalDisclaimer":
      "Nicht geeignet für Kinder. Bei Herz-, Nieren- oder Blutdruckerkrankungen vor Anwendung eines Hydrations- oder Fueling-Plans ärztlichen Rat einholen.",
    "hint.bodyWeight":
      "Hohe Carb-Ziele (80+ g/h) basieren auf Studien mit trainierten männlichen Athleten. Leichtere Athleten oder Einsteiger sollten am unteren Ende beginnen und sich steigern.",
    "hint.saltPalatability":
      "Heiße Bedingungen erhöhen die Salzkonzentration in deiner Flasche. Wenn der Geschmack unangenehm wird, trink mehr klares Wasser dazu oder nutze kleinere, häufigere Flaschen.",
    "hints.toggle": "{count} Hinweise & Sicherheitsinfos",

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
    "export.copyFallback": "Link kopieren:",

    "footer.assumptions":
      "Deine Einstellungen: {gel} g pro Gel · {bottle} ml Flasche · Maltodextrin zählt als Glukose. FuelCast ist eine Planungshilfe, keine medizinische oder Ernährungsberatung — teste deine Strategie immer im Training.",
    "footer.privacy":
      "Kostenlos, offen und zustandslos: kein Konto, kein Tracking, keine Daten verlassen dein Gerät — dein Plan lebt komplett in der URL.",
    "footer.disclaimer":
      "Nicht mit den genannten Marken verbunden. Marken gehören ihren jeweiligen Inhabern.",
    "footer.source": "Quellcode",
    "footer.imprint": "Impressum",

    "imprint.updated": "Stand: Juli 2026",
    "imprint.legal.title": "Angaben gemäß § 5 DDG",
    "imprint.contact": "Kontakt",
    "imprint.responsible": "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    "imprint.liability.title": "Haftung für Inhalte",
    "imprint.liability.p1": "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
    "imprint.liability.p2": "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.",
    "imprint.links.title": "Haftung für Links",
    "imprint.links.p1": "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
    "imprint.links.p2": "Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
    "imprint.copyright.title": "Urheberrecht",
    "imprint.copyright.p1": "Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
    "imprint.copyright.p2": "Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.",

    "privacy.title": "Datenschutz",
    "privacy.updated": "Stand: Juli 2026",
    "privacy.p1": "FuelCast erhebt, speichert, überträgt oder teilt keinerlei personenbezogene Daten oder Nutzerinformationen.",
    "privacy.p2": "Diese App läuft vollständig in deinem Browser. Es werden keine Daten an einen Server gesendet. Es gibt keine Analyse-Tools, keine Cookies, keine Tracking-Technologien und keine Drittanbieter-SDKs.",
    "privacy.p3": "Dein Fueling-Plan existiert ausschließlich in der URL. Wenn du die URL teilst, kann jeder mit dem Link die Plan-Parameter sehen. Auf unserer Seite werden keine Daten gespeichert.",
    "privacy.p4": "Die Seite verwendet einen Service Worker für Offline-Funktionalität. Dieser speichert ausschließlich statische Dateien (HTML, CSS, JS, Schriften) auf deinem Gerät — keine personenbezogenen Daten.",
    "privacy.p5": "Sollte sich diese Richtlinie in Zukunft ändern, wird das Datum der letzten Aktualisierung angepasst und neue Datenverarbeitungen werden klar offengelegt.",

    "footer.privacy.link": "Datenschutz",

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
    "science.oxidation.diminishing":
      "Abnehmender Ertrag über 90 g/h: Die Oxidationseffizienz sinkt von ~86% auf ~76% bei 120 g/h ohne zusätzliches Glykogen-Sparing. Die extra Carbs erfordern gezieltes Darm-Training und bieten unterproportionalen Nutzen.",
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
export type TranslateFn = {
  (key: MessageKey, params?: Record<string, string | number>): string;
  /** Dynamic key overload — accepts any string but warns in dev if missing */
  (key: string, params?: Record<string, string | number>): string;
};

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslateFn;
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Default for URLs without a language prefix: saved preference, then browser language */
export function detectLang(): Lang {
  const stored = localStorage.getItem("fuelcast-lang");
  if (isLang(stored ?? undefined)) return stored as Lang;
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

export function persistLang(lang: Lang): void {
  localStorage.setItem("fuelcast-lang", lang);
}

export const LANGS: Lang[] = ["en", "de"];

export function isLang(value: string | undefined): value is Lang {
  return value === "en" || value === "de";
}

interface I18nProviderProps {
  /** Language is owned by the URL — the provider only renders it */
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
  children: React.ReactNode;
}

export function I18nProvider({ lang, onChangeLang, children }: I18nProviderProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t: TranslateFn = (key: string, params?: Record<string, string | number>) => {
    const dict = DICT[lang] as Record<string, string>;
    const fallback = DICT.en as Record<string, string>;
    let text: string = dict[key] ?? fallback[key] ?? key;
    if (import.meta.env.DEV && !(key in fallback)) {
      console.warn(`[i18n] Missing translation key: "${key}"`);
    }
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };

  const locale = lang === "de" ? "de-DE" : "en-US";

  return (
    <I18nContext.Provider value={{ lang, setLang: onChangeLang, t, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
