'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import GlitchMasthead from '../components/GlitchMasthead'
import ScrambleText from '../components/ScrambleText'
import WorldClocks from '../components/WorldClocks'
import { shouldAnimateEntrance } from '../lib/sessionEntrance'

const LAUNCHED = false

const introStyle: CSSProperties = {
  fontFamily: 'var(--font-spectral)',
  fontSize: '18px',
  lineHeight: 1.85,
  color: 'var(--color-text-primary)',
}

const dividerStrong: CSSProperties = {
  borderTop: '1px solid var(--color-border-strong)',
  marginTop: '2rem',
}

const dividerSubtle: CSSProperties = {
  borderTop: '0.5px solid var(--color-border)',
  marginTop: '2rem',
}

const sectionLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--color-text-muted)',
  marginTop: '1.5rem',
}

const sectionBodyStyle: CSSProperties = {
  fontFamily: 'var(--font-spectral)',
  fontSize: '17px',
  lineHeight: 1.75,
  color: 'var(--color-text-secondary)',
  marginTop: '1rem',
}

const numberStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
}

const elementTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-grotesk)',
  fontWeight: 700,
  fontSize: '17px',
  color: 'var(--color-text-primary)',
  marginTop: '0.35rem',
}

const elementBodyStyle: CSSProperties = {
  fontFamily: 'var(--font-spectral)',
  fontSize: '16px',
  lineHeight: 1.8,
  color: 'var(--color-text-secondary)',
  marginTop: '0.5rem',
}

const irtInlineStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  textTransform: 'uppercase',
  fontSize: '12px',
  letterSpacing: '0.18em',
  color: 'var(--color-text-primary)',
}

export default function Submit() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [footerVisible, setFooterVisible] = useState(false)
  // Only play the entrance sequence the first time this page appears in the
  // browser tab — revisiting via client-side navigation shouldn't replay it,
  // only a genuine first load / hard reload should.
  const [animate] = useState(() => shouldAnimateEntrance('submit'))
  const [mounted, setMounted] = useState(false)
  const [settled, setSettled] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!animate) return
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [animate])

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setSettled(true), 1800)
    return () => clearTimeout(t)
  }, [mounted])

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      // Syncing from localStorage (browser-only) after mount to avoid a server/client hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function toggleTheme() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      localStorage.setItem('theme', next)
      return next
    })
  }

  function animStyle(delayMs: number): CSSProperties {
    if (!animate || settled) return {}
    return {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transitionProperty: 'opacity, transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'ease-out',
      transitionDelay: `${delayMs}ms`,
    }
  }

  // For horizontal rule lines: grow outward from the center instead of fading.
  function lineStyle(delayMs: number): CSSProperties {
    if (!animate || settled) return {}
    return {
      transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'center',
      transitionProperty: 'transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'ease-out',
      transitionDelay: `${delayMs}ms`,
    }
  }

  return (
    <main style={{ paddingTop: '2rem', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>

      {/* Masthead */}
      <div style={{ position: 'relative', paddingBottom: '1.25rem', marginBottom: '0' }}>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          style={{ position: 'absolute', top: 0, right: 0, zIndex: 1, width: '44px', height: '24px', padding: 0, margin: 0, border: '1px solid var(--color-border)', borderRadius: '999px', background: 'var(--color-border)', cursor: 'pointer', transition: 'background 200ms ease-out' }}
        >
          <span
            style={{
              display: 'block',
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'var(--color-text-primary)',
              transition: 'transform 200ms ease-out',
              transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
            }}
          />
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', ...animStyle(0) }}>
          <GlitchMasthead />
        </div>
        {LAUNCHED ? (
          <nav style={{ fontFamily: 'var(--font-grotesk)', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {['Politics', 'Culture', 'Economics', 'Media', 'About', 'Submit'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link" data-text={item} style={{ textDecoration: 'none' }}>{item}</Link>
            ))}
          </nav>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', ...animStyle(200) }}>
              {['Politics', 'Economics', 'Society', 'Media', 'Technology', 'Arts'].flatMap((item, i, arr) => {
                const nodes = [<span key={item}>{item}</span>]
                if (i < arr.length - 1) {
                  nodes.push(<span key={`${item}-sep`} style={{ color: 'var(--color-text-muted)' }}>|</span>)
                }
                return nodes
              })}
            </div>
            <nav style={{ fontFamily: 'var(--font-grotesk)', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', ...animStyle(300) }}>
              {['About', 'Submit'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link" data-text={item} style={{ textDecoration: 'none', cursor: 'pointer' }}>{item}</Link>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Header divider */}
      <div style={{ borderBottom: '1px solid var(--color-border-strong)', ...lineStyle(350) }} />

      {/* Dateline */}
      <WorldClocks />

      {/* Submit content */}
      <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '3rem' }}>

        <p style={{ ...introStyle, ...animStyle(500) }}>
          2ND publishes second-order journalism. Every piece responds to a specific article, argument, speech, report, or public claim already shaping discourse. If you have a response worth making, we want to read it.
        </p>

        <div style={{ ...dividerStrong, ...lineStyle(550) }} />

        <div style={animStyle(600)}>
          <div style={sectionLabelStyle}>Article Structure</div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={numberStyle}>01</div>
            <div style={elementTitleStyle}>The Declaration</div>
            <p style={elementBodyStyle}>
              <span style={irtInlineStyle}>In Response To</span> names the target. It identifies one specific article, speech, report, post, or argument, never a vague reference to recent coverage or general discourse. Stylistically it functions as the publication&apos;s editorial initial, the illuminated drop cap of the digital age, opening every piece.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={numberStyle}>02</div>
            <div style={elementTitleStyle}>The Steelman</div>
            <p style={elementBodyStyle}>
              Before criticizing, the writer must demonstrate a fair and close reading of the original piece. This means engaging with its evidence, its reasoning, and the places where its conclusions outrun its argument.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={numberStyle}>03</div>
            <div style={elementTitleStyle}>The Response</div>
            <p style={elementBodyStyle}>
              The actual critical engagement. What is missing, wrong, overstated, underexamined, or worth complicating.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={numberStyle}>04</div>
            <div style={elementTitleStyle}>The Position</div>
            <p style={elementBodyStyle}>
              A 2ND piece must arrive somewhere. Not necessarily in opposition, but at a clear, defensible conclusion or proposition.
            </p>
          </div>
        </div>

        <div style={dividerSubtle} />

        <div style={animStyle(700)}>
          <div style={sectionLabelStyle}>A Note on Structure</div>
          <p style={sectionBodyStyle}>
            The four elements above are a guide, not a rigid formula. Submissions are assessed on their potential, not their polish. What matters is the quality of the idea, the seriousness of the engagement, and the writer&apos;s relationship to the argument. Every submission that moves forward will involve a back and forth between the writer and 2ND editors before anything is adopted for publication. A submission is an opportunity to begin a conversation, not deliver a finished product.
          </p>
        </div>

        <div style={dividerSubtle} />

        <div style={animStyle(800)}>
          <div style={sectionLabelStyle}>How to Submit</div>
          <p style={sectionBodyStyle}>
            Send a draft or a pitch. Either is welcome. A pitch should be one or two paragraphs covering what you are responding to, why it matters, and what your position is. A draft should follow the four-element structure as a guide.
          </p>

          <p style={sectionBodyStyle}>
            Use this subject line format:
          </p>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-border)',
              padding: '0.75rem 1rem',
              marginTop: '1rem',
            }}
          >
            IN RESPONSE TO: [Publication or Person], &quot;[Specific Article or Argument]&quot;
          </div>

          <p style={sectionBodyStyle}>
            This is not a title for your piece. It is a citation of the exact source you are responding to.
          </p>
        </div>

        <div style={dividerSubtle} />

        <div style={animStyle(900)}>
          <div style={sectionLabelStyle}>Attribution</div>
          <p style={sectionBodyStyle}>
            You are welcome to include a brief note about yourself for publication, or to request anonymity. Writers who publish anonymously are assigned a permanent pseudonym by 2ND, one that remains uniquely theirs across all future work published here. No two pseudonyms are ever the same.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', ...animStyle(1000) }}>
          <div style={{ ...sectionLabelStyle, marginTop: 0, fontSize: '12px' }}>Send submissions to</div>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '22px', color: 'var(--color-text-primary)', marginTop: '0.4rem' }}>
            editorial.2nd@gmail.com
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer
        ref={footerRef}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderTop: '1px solid var(--color-border-strong)',
          padding: '1.5rem 0',
          marginTop: '3rem',
          opacity: footerVisible ? 1 : 0,
          transform: footerVisible ? 'translateY(0)' : 'translateY(8px)',
          transitionProperty: 'opacity, transform',
          transitionDuration: '400ms',
          transitionTimingFunction: 'ease-out',
        }}
      >
        <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '24px', color: 'var(--color-text-primary)' }}>
          2ND
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <nav style={{ display: 'flex', gap: '16px' }}>
            {['About', 'Submit'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{ fontFamily: 'var(--font-grotesk)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              >
                {item}
              </Link>
            ))}
          </nav>
          {animate ? (
            <ScrambleText
              text="© 2ND 2026 · editorial.2nd@gmail.com"
              delay={300}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}
            />
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              © 2ND 2026 · editorial.2nd@gmail.com
            </div>
          )}
        </div>
      </footer>

    </main>
  )
}
