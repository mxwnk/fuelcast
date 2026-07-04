// Renders the social share / Open Graph card (1200×630) from the FuelCast brand.
// Run with: npm run og
import sharp from 'sharp'

const BG = '#0b0d10'
const SURFACE = '#12151a'
const LINE = '#232a33'
const INK = '#f1f2ee'
const MUTED = '#8b929c'
const ACCENT = '#ff5a1f'
const AMBER = '#ffb224'
const BOLT = 'M17.5 4 8 18h6l-1.5 10L22 14h-6l1.5-10z'

const chip = (x, y, w, label) => `
  <g transform="translate(${x} ${y})">
    <rect width="${w}" height="46" rx="23" fill="${SURFACE}" stroke="${LINE}"/>
    <circle cx="30" cy="23" r="4" fill="${ACCENT}"/>
    <text x="48" y="30" font-family="Arial, sans-serif" font-size="20" fill="${MUTED}">${label}</text>
  </g>`

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>

  <!-- hazard stripe accent along the top -->
  <defs>
    <pattern id="hazard" width="40" height="40" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
      <rect width="20" height="40" fill="${ACCENT}"/>
    </pattern>
    <radialGradient id="glow" cx="78%" cy="30%" r="55%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="10" fill="url(#hazard)" opacity="0.9"/>

  <!-- logo mark -->
  <g transform="translate(90 90)">
    <rect width="96" height="96" rx="22" fill="${SURFACE}"/>
    <g transform="translate(48 48) scale(2.4) translate(-16 -16)">
      <path d="${BOLT}" fill="${ACCENT}"/>
    </g>
  </g>
  <text x="210" y="138" font-family="Arial, sans-serif" font-weight="800" font-size="58" letter-spacing="1" fill="${INK}">Fuel<tspan fill="${ACCENT}">Cast</tspan></text>
  <text x="212" y="172" font-family="Arial, sans-serif" font-size="22" letter-spacing="4" fill="${MUTED}">ENDURANCE FUELING CALCULATOR</text>

  <!-- headline -->
  <text x="90" y="330" font-family="Arial, sans-serif" font-weight="800" font-size="92" fill="${INK}">Never bonk</text>
  <text x="90" y="430" font-family="Arial, sans-serif" font-weight="800" font-size="92" fill="${ACCENT}">again.</text>

  <!-- sub -->
  <text x="92" y="486" font-family="Arial, sans-serif" font-size="28" fill="${MUTED}">Carbs · <tspan fill="${ACCENT}">glucose</tspan>:<tspan fill="${AMBER}">fructose</tspan> · hydration · race timeline</text>

  <!-- promise chips -->
  ${chip(90, 536, 300, 'Plan in 30 seconds')}
  ${chip(406, 536, 300, 'No account · no ads')}
  ${chip(722, 536, 300, 'Works offline')}
</svg>`

await sharp(Buffer.from(svg)).png().toFile('public/og.png')
console.log('✓ public/og.png (1200×630)')
