import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// The font doesn't depend on request data, so it's read once at module scope
// (see Next.js's "Predictable values" caching guidance). This project loads
// Space Grotesk via a Google Fonts CSS @import rather than a bundled local
// file, so we fetch the same family/weight here instead of duplicating a
// binary font file in the repo. Satori (which ImageResponse uses) only
// supports ttf/otf/woff, not woff2 — the modern css2 endpoint serves woff2
// unconditionally now, but the legacy css endpoint still serves plain woff.
async function loadSpaceGroteskBold() {
  const cssResponse = await fetch('https://fonts.googleapis.com/css?family=Space+Grotesk:700')
  const css = await cssResponse.text()
  const fontUrlMatch = css.match(/src: url\(([^)]+)\) format\('(?:woff|opentype|truetype)'\)/)
  if (!fontUrlMatch) {
    throw new Error('Could not resolve a ttf/otf/woff URL for Space Grotesk Bold')
  }
  const fontResponse = await fetch(fontUrlMatch[1])
  return fontResponse.arrayBuffer()
}

const spaceGroteskBold = await loadSpaceGroteskBold()

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#0a0a0a',
          fontFamily: 'Space Grotesk',
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        2ND
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Space Grotesk',
          data: spaceGroteskBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
