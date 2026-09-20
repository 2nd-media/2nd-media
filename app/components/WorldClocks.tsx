'use client'

import { useEffect, useState } from 'react'
import ScrambleText from './ScrambleText'
import { shouldAnimateEntrance } from '../lib/sessionEntrance'

const ZONES = [
  { label: 'PACIFIC', shortLabel: 'PT', timeZone: 'America/Los_Angeles' },
  { label: 'MOUNTAIN', shortLabel: 'MT', timeZone: 'America/Denver' },
  { label: 'CENTRAL', shortLabel: 'CT', timeZone: 'America/Chicago' },
  { label: 'EASTERN', shortLabel: 'ET', timeZone: 'America/New_York' },
]

const DATE_ZONE = 'America/Los_Angeles'

// Below this, four full zone names ("MOUNTAIN", etc.) can't fit on one line
// even at the smallest legible font — short codes buy back enough width.
const NARROW_BREAKPOINT_PX = 600
// Below this, even four short codes plus milliseconds still overflow at the
// clamp() floor sizes — dropping the ms field is what actually closes the gap.
const COMPACT_BREAKPOINT_PX = 500

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
  const [isNarrow, setIsNarrow] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  // Only scramble the first time this widget appears in the browser tab —
  // revisiting via client-side navigation shouldn't replay it, only a
  // genuine first load / hard reload should.
  const [animate] = useState(() => shouldAnimateEntrance('worldclocks'))

  useEffect(() => {
    const narrowMql = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT_PX}px)`)
    const updateNarrow = () => setIsNarrow(narrowMql.matches)
    updateNarrow()
    narrowMql.addEventListener('change', updateNarrow)

    const compactMql = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT_PX}px)`)
    const updateCompact = () => setIsCompact(compactMql.matches)
    updateCompact()
    compactMql.addEventListener('change', updateCompact)

    return () => {
      narrowMql.removeEventListener('change', updateNarrow)
      compactMql.removeEventListener('change', updateCompact)
    }
  }, [])

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
      {animate ? (
        <ScrambleText
          text={now ? formatReferenceDate(now) : ''}
          delay={200}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}
        />
      ) : (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          {now ? formatReferenceDate(now) : ' '}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: isCompact ? '0.4rem' : 'clamp(0.75rem, 3vw, 1.5rem)', marginTop: '0.4rem' }}>
        {ZONES.map((zone, i) => (
          <div
            key={zone.timeZone}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: isCompact ? '4px' : '6px',
              minWidth: 0,
              paddingLeft: i > 0 ? (isCompact ? '0.35rem' : 'clamp(0.5rem, 2vw, 1.25rem)') : 0,
              borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: isCompact ? '13px' : 'clamp(14px, 2vw, 18px)', color: 'var(--color-text-primary)' }}>
              {now ? formatZoneTime(now, zone.timeZone) : '00:00:00'}
            </span>
            {!isCompact && (
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 'clamp(9px, 1.2vw, 12px)', color: 'var(--color-text-muted)' }}>
                .{msDigits[i]}
              </span>
            )}
            {animate ? (
              <ScrambleText
                text={isNarrow ? zone.shortLabel : zone.label}
                delay={300 + i * 50}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px, 1vw, 9px)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}
              />
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px, 1vw, 9px)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                {isNarrow ? zone.shortLabel : zone.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
