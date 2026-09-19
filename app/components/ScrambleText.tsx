'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|[]{}#@%&*<>'
const DURATION = 700

function isScramblable(ch: string) {
  return /[A-Za-z0-9]/.test(ch)
}

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)]
}

function scrambledFrame(text: string, progress: number) {
  const length = text.length
  let out = ''
  for (let i = 0; i < length; i++) {
    const ch = text[i]
    if (!isScramblable(ch)) {
      out += ch
      continue
    }
    const threshold = i / length + 0.3
    out += progress >= threshold ? ch : randomChar()
  }
  return out
}

// A card already in the initial viewport gets its IntersectionObserver hit
// almost instantly — anything slower than this was actually scrolled into
// view later, well after its own reveal transition already finished.
const EAGER_WINDOW = 100
// Snappy lead-in for the scroll-triggered case, so it feels like a prompt
// reveal rather than an inherited page-load delay.
const LAZY_LEAD = 150

interface ScrambleTextProps {
  text: string
  // ms since page mount at which this card's own reveal animation finishes —
  // used to line the scramble up with the tail end of that reveal when the
  // card is already visible at load.
  delay?: number
  style?: CSSProperties
}

export default function ScrambleText({ text, delay = 0, style }: ScrambleTextProps) {
  // A non-breaking space (not an empty string) so the line box — and the
  // card's height — is already reserved before any text appears; an empty
  // string collapses to zero height and the card would visibly grow later.
  const [display, setDisplay] = useState(' ')
  const rootRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const mountTime = performance.now()
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    function startScramble(startDelay: number) {
      let startTime: number | null = null

      function tick(now: number) {
        if (cancelled) return
        if (startTime === null) startTime = now
        const progress = (now - startTime) / DURATION
        const frame = scrambledFrame(text, progress)
        setDisplay(frame)
        if (frame === text) return
        rafRef.current = requestAnimationFrame(tick)
      }

      timeoutId = setTimeout(() => {
        rafRef.current = requestAnimationFrame(tick)
      }, Math.max(0, startDelay))
    }

    // Only start once this element actually scrolls into view — a card sitting
    // below the fold shouldn't burn its scramble off-screen before it's seen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const elapsedSinceMount = performance.now() - mountTime
        if (elapsedSinceMount < EAGER_WINDOW) {
          // Visible right from page load — overlap with the tail of this
          // card's own reveal instead of waiting for it to fully settle.
          startScramble(delay - elapsedSinceMount)
        } else {
          // Revealed later by scrolling — its fade already finished
          // invisibly, so trigger promptly instead of reusing `delay`.
          startScramble(LAZY_LEAD)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)

    return () => {
      cancelled = true
      observer.disconnect()
      if (timeoutId) clearTimeout(timeoutId)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [text, delay])

  return <div ref={rootRef} style={style}>{display}</div>
}
