// Renders the PWA icon set from the FuelCast bolt mark.
// Run with: npm run icons
import sharp from 'sharp'

const BG = '#0b0d10'
const BOLT = '#FF5A1F'
const BOLT_PATH = 'M17.5 4 8 18h6l-1.5 10L22 14h-6l1.5-10z'

const icon = ({ rounded, scale }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${rounded ? 7 : 0}" fill="${BG}"/>
  <g transform="translate(16 16) scale(${scale}) translate(-16 -16)">
    <path d="${BOLT_PATH}" fill="${BOLT}"/>
  </g>
</svg>`

const targets = [
  // Launcher icons with rounded corners
  { file: 'public/pwa-192.png', size: 192, rounded: true, scale: 1 },
  { file: 'public/pwa-512.png', size: 512, rounded: true, scale: 1 },
  // Maskable: full-bleed square, mark shrunk into the 80% safe zone
  { file: 'public/pwa-maskable-512.png', size: 512, rounded: false, scale: 0.72 },
  // iOS applies its own corner mask
  { file: 'public/apple-touch-icon.png', size: 180, rounded: false, scale: 0.85 },
]

for (const { file, size, rounded, scale } of targets) {
  await sharp(Buffer.from(icon({ rounded, scale })), { density: 300 })
    .resize(size, size)
    .png()
    .toFile(file)
  console.log(`✓ ${file} (${size}x${size})`)
}
