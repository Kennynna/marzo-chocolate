import { Jimp } from 'jimp'
import ImageTracer from 'imagetracerjs'
import fs from 'fs'

const src = 'public/92ec7897bfda0fcf460e920b3ab12d80.jpg'
const img = await Jimp.read(src)
img.greyscale()

const { width, height, data } = img.bitmap

for (let i = 0; i < data.length; i += 4) {
  const v = data[i] > 40 ? 255 : 0
  data[i] = data[i + 1] = data[i + 2] = v
  data[i + 3] = 255
}

let minX = width
let minY = height
let maxX = 0
let maxY = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4
    if (data[i] > 128) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
}

const pad = 24
minX = Math.max(0, minX - pad)
minY = Math.max(0, minY - pad)
maxX = Math.min(width - 1, maxX + pad)
maxY = Math.min(height - 1, maxY + pad)

const cropW = maxX - minX + 1
const cropH = maxY - minY + 1
const cropped = new Uint8ClampedArray(cropW * cropH * 4)
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const si = ((minY + y) * width + (minX + x)) * 4
    const di = (y * cropW + x) * 4
    cropped[di] = data[si]
    cropped[di + 1] = data[si + 1]
    cropped[di + 2] = data[si + 2]
    cropped[di + 3] = 255
  }
}

const raw = ImageTracer.imagedataToSVG(
  { width: cropW, height: cropH, data: cropped },
  {
    ltres: 0.6,
    qtres: 0.6,
    pathomit: 12,
    colorsampling: 0,
    numberofcolors: 2,
    mincolorratio: 0,
    colorquantcycles: 1,
    blurradius: 0,
    strokewidth: 0,
    linefilter: true,
    scale: 1,
    roundcoords: 2,
    viewbox: true,
    desc: false,
  },
)

const paths = [...raw.matchAll(/<path\b[^>]*>/g)].map((m) => m[0])
const whitePaths = paths.filter((p) => /fill="rgb\(255,\s*255,\s*255\)"/.test(p))

if (!whitePaths.length) {
  console.error('No white paths found. Paths:', paths.length)
  console.error(raw.slice(0, 800))
  process.exit(1)
}

const cleanedPaths = whitePaths.map((p) =>
  p
    .replace(/fill="rgb\(255,\s*255,\s*255\)"/, 'fill="currentColor"')
    .replace(/\s*stroke="[^"]*"/g, '')
    .replace(/\s*stroke-width="[^"]*"/g, '')
    .replace(/\s*opacity="[^"]*"/g, ''),
)

const mark = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cropW} ${cropH}" role="img" aria-label="Декоративный орнамент">
${cleanedPaths.join('\n')}
</svg>
`

const withBg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cropW} ${cropH}" role="img" aria-label="Декоративный орнамент" style="background:#000;color:#fff">
${cleanedPaths.join('\n')}
</svg>
`

fs.writeFileSync('public/ornament-filigree-mark.svg', mark)
fs.writeFileSync('public/ornament-filigree.svg', withBg)
console.log('crop', cropW, 'x', cropH, 'paths', cleanedPaths.length)
console.log(mark.slice(0, 280))
