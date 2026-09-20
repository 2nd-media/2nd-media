'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import GlitchMasthead from '../components/GlitchMasthead'
import WorldClocks from '../components/WorldClocks'

const headlineStyle: CSSProperties = {
  fontFamily: 'var(--font-grotesk)',
  fontWeight: 700,
  fontSize: '28px',
  color: 'var(--color-text-primary)',
}

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-spectral)',
  fontSize: '18px',
  lineHeight: 1.85,
  color: 'var(--color-text-primary)',
  marginTop: '1.25rem',
}

const irtStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  textTransform: 'uppercase',
  fontSize: '13px',
  letterSpacing: '0.18em',
  color: 'var(--color-text-primary)',
}

export default function About() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [footerVisible, setFooterVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

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

  return (
    <main style={{ paddingTop: '2rem', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>

      {/* Masthead */}
      <div style={{ position: 'relative', borderBottom: '1px solid var(--color-border-strong)', paddingBottom: '1.25rem', marginBottom: '0' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlitchMasthead />
        </div>
        <nav style={{ fontFamily: 'var(--font-grotesk)', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {['Politics', 'Culture', 'Economics', 'Media', 'About', 'Submit'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link" data-text={item} style={{ textDecoration: 'none' }}>{item}</Link>
          ))}
        </nav>
      </div>

      {/* Dateline */}
      <WorldClocks />

      {/* About content */}
      <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '3rem' }}>

        <h1 style={headlineStyle}>What 2ND Is</h1>
        <p style={bodyStyle}>
          2ND is a second-order journalism publication. Every piece begins by identifying a specific article, argument, report, speech, or public claim already shaping discourse. Authors are then invited to respond critically, rigorously, and without predetermined conclusions. 2ND does not employ a newsroom or staff editors. It functions as an institutional public forum for second-order thought and criticism.
        </p>
        <p style={bodyStyle}>
          Our <span style={irtStyle}>In Response To</span> column is the editorial signature of this publication and a commitment to intellectual transparency: what we are responding to, why it matters, and what we think is missing, wrong, or worth complicating.
        </p>
        <p style={bodyStyle}>
          A response may ultimately agree with the original piece. Intellectual honesty and sound reasoning are always more important than aimless opposition.
        </p>

        <h2 style={{ ...headlineStyle, marginTop: '3rem' }}>What 2ND Is Not</h2>
        <p style={bodyStyle}>
          2ND is not a fact-checking operation. It is not a contrarian publication. It has no ideological voice. The target is weak reasoning, missing context, sensationalism, and unexamined assumptions, wherever they appear and whoever is responsible for them.
        </p>
        <p style={bodyStyle}>
          2ND is not a platform. It is a publication with editorial standards, a consistent format, and a point of view about how journalism should be approached, made, and read.
        </p>

        <h2 style={{ ...headlineStyle, marginTop: '3rem' }}>Why</h2>
        <p style={bodyStyle}>
          The current media environment rewards quantity over quality and rapid first takes over meaningful second thoughts. 2ND exists because no story should have the final say.
        </p>

        <p style={{ fontFamily: 'var(--font-spectral)', fontSize: '15px', fontStyle: 'italic', color: 'var(--color-text-secondary)', marginTop: '1.5rem' }}>
          Founded in the United States, for the United States. 2026.
        </p>

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
            {['Politics', 'Culture', 'Economics', 'Media', 'About', 'Submit'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{ fontFamily: 'var(--font-grotesk)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            © 2ND 2026 · editorial.2nd@gmail.com
          </div>
        </div>
      </footer>

    </main>
  )
}
