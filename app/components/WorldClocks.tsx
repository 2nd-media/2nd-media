'use client'

import { useEffect, useState } from 'react'

const ZONES = [
  { label: 'PACIFIC', timeZone: 'America/Los_Angeles' },
  { label: 'MOUNTAIN', timeZone: 'America/Denver' },
  { label: 'CENTRAL', timeZone: 'America/Chicago' },
  { label: 'EASTERN', timeZone: 'America/New_York' },
]

const DATE_ZONE = 'America/Los_Angeles'

function formatZoneTime(date: Date, timeZone: string) {
  let str = date.toLocaleString('en-US', {
    timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  // Some engines render midnight as "24:MM:SS" instead of "00:MM:SS" when
  // hour12 is false — this is the actual source of the Pacific-zone bug,
  // since LA crosses local midnight while it's already later elsewhere.
  if (str.startsWith('24:')) {
    str = '00:' + str.slice(3)
  }
  return str
}

function formatReferenceDate(date: Date) {
  return date
    .toLocaleDateString('en-US', {
      timeZone: DATE_ZONE,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase()
}

function randomDigits(count: number) {
  let out = ''
  for (let i = 0; i < count; i++) out += Math.floor(Math.random() * 10)
  return out
}

export default function WorldClocks() {
  // Real time is unknown at SSR time and would mismatch the client's first
  // paint anyway, so render a stable placeholder until mounted, then swap in
  // the live clock — same server/client-safe pattern used elsewhere here.
  const [now, setNow] = useState<Date | null>(null)
  const [msDigits, setMsDigits] = useState<string[]>(() => ZONES.map(() => '000'))

  useEffect(() => {
    // Date() is unknown at SSR time, so this is set after mount, not derived
    // from render — the same client-only-sync exception used for the theme
    // toggle's localStorage read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let rafId: number
    let last = 0
    function tick(t: number) {
      if (t - last >= 1000 / 60) {
        last = t
        setMsDigits(ZONES.map(() => randomDigits(3)))
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.6rem 0', borderBottom: '0.5px solid var(--color-border)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
        {now ? formatReferenceDate(now) : ' '}
      </div>
      <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: 'clamp(0.75rem, 3vw, 1.5rem)', marginTop: '0.4rem' }}>
        {ZONES.map((zone, i) => (
          <div
            key={zone.timeZone}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              minWidth: 0,
              paddingLeft: i > 0 ? 'clamp(0.5rem, 2vw, 1.25rem)' : 0,
              borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'clamp(14px, 2vw, 18px)', color: 'var(--color-text-primary)' }}>
              {now ? formatZoneTime(now, zone.timeZone) : '00:00:00'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: '12px', color: 'var(--color-text-muted)' }}>
              .{msDigits[i]}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px, 1vw, 9px)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              {zone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
