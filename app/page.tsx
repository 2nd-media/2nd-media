'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import GlitchMasthead from './components/GlitchMasthead'
import ScrambleText from './components/ScrambleText'
import WorldClocks from './components/WorldClocks'

const articles = [
  {
    id: 1,
    irtLabel: 'In Response To',
    irtTarget: 'The New York Times',
    irtOriginal: '"The Economy Is Fine. So Why Does Everyone Feel Terrible?"',
    headline: "The Vibes Economy Is a Real Thing, and the NYT Still Doesn't Understand It",
    deck: 'Dismissing consumer pessimism as irrational misses what the data is actually measuring — and who it\'s measuring it for.',
    author: 'Roman A.',
    date: 'Sep 18, 2026',
    category: 'Economics',
    featured: true,
  },
  {
    id: 2,
    irtLabel: 'In Response To',
    irtTarget: 'The Atlantic',
    irtOriginal: '"The Death of the American City"',
    headline: 'Cities Didn\'t Die. They Just Stopped Performing for Coastal Media',
    deck: null,
    author: 'M. Chen',
    date: 'Sep 17, 2026',
    category: 'Culture',
    featured: true,
  },
  {
    id: 3,
    irtLabel: 'In Response To',
    irtTarget: 'Elon Musk',
    irtOriginal: '"Free speech is the bedrock of a functional democracy"',
    headline: 'On Free Speech and the People Who Fund It',
    deck: null,
    author: 'J. Park',
    date: 'Sep 16, 2026',
    category: 'Politics',
    featured: true,
  },
  {
    id: 4,
    irtLabel: 'In Response To',
    irtTarget: 'Wall Street Journal',
    irtOriginal: '"Return-to-Office Is Winning"',
    headline: 'Return-to-Office Mandates Are Not About Productivity',
    deck: 'The Journal\'s defense of RTO policy takes management\'s stated rationale at face value. The actual data tells a different story.',
    author: 'J. Park',
    date: 'Sep 15, 2026',
    category: 'Economics',
    featured: false,
  },
  {
    id: 5,
    irtLabel: 'In Response To',
    irtTarget: 'Vox',
    irtOriginal: '"Why Harm Reduction Works"',
    headline: 'Harm Reduction Is Not the Same as Endorsement',
    deck: 'A thoughtful piece on drug policy that nevertheless conflates two ideas that need to be held apart if the argument is going to work.',
    author: 'S. Okafor',
    date: 'Sep 14, 2026',
    category: 'Politics',
    featured: false,
  },
  {
    id: 6,
    irtLabel: 'In Response To',
    irtTarget: 'The Guardian',
    irtOriginal: '"AI Will Take Your Job — And That\'s Okay"',
    headline: 'The "It\'s Okay" Argument for Automation Has Always Been Made by People Whose Jobs Are Safe',
    deck: 'The history of technological displacement is not a story of smooth transitions. It\'s a story of who absorbs the cost.',
    author: 'L. Torres',
    date: 'Sep 13, 2026',
    category: 'Culture',
    featured: false,
  },
]

const featuredArticles = articles.filter(a => a.featured)
const latestArticles = articles.filter(a => !a.featured)

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [settled, setSettled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [footerVisible, setFooterVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Longest entrance delay (latest feed, 1000ms) + its 500ms duration, plus a buffer.
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
    // Once the entrance has played out, stop declaring opacity/transform inline —
    // an inline `transform` would otherwise permanently block the .article-card
    // hover lift, since inline styles always win over a stylesheet's :hover rule.
    if (settled) return {}
    return {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transitionProperty: 'opacity, transform',
      transitionDuration: '500ms',
      transitionTimingFunction: 'ease-out',
      transitionDelay: `${delayMs}ms`,
    }
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
        <div style={{ display: 'flex', justifyContent: 'center', ...animStyle(0) }}>
          <GlitchMasthead />
        </div>
        <nav style={{ fontFamily: 'var(--font-grotesk)', fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', ...animStyle(200) }}>
          {['Politics', 'Culture', 'Economics', 'Media', 'About', 'Submit'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link" data-text={item} style={{ textDecoration: 'none' }}>{item}</Link>
          ))}
        </nav>
      </div>

      {/* Dateline */}
      <WorldClocks />

      {/* Featured Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.75rem 0', borderBottom: '0.5px solid var(--color-border)', ...animStyle(600) }}>

        {/* Main featured */}
        <div className="article-card" style={{ borderRight: '0.5px solid var(--color-border)', paddingRight: '2rem', ...animStyle(600) }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
              {featuredArticles[0].irtLabel}&nbsp;&nbsp;
            </span>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>
              {featuredArticles[0].irtTarget}
            </span>
            <span style={{ fontFamily: 'var(--font-spectral)', fontSize: '14px', fontStyle: 'italic', color: 'var(--color-text-secondary)', display: 'block', marginTop: '3px' }}>
              {featuredArticles[0].irtOriginal}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '32px', lineHeight: 1.1, color: 'var(--color-text-primary)', marginTop: '0.6rem' }}>
            {featuredArticles[0].headline}
          </div>
          <div style={{ fontFamily: 'var(--font-spectral)', fontSize: '17px', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
            {featuredArticles[0].deck}
          </div>
          <ScrambleText
            text={`${featuredArticles[0].author} · ${featuredArticles[0].date} · ${featuredArticles[0].category}`}
            delay={600 + 400}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '0.6rem' }}
          />
        </div>

        {/* Secondary featured */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {featuredArticles.slice(1).map((article, i) => (
            <div key={article.id} className="article-card" style={{ paddingBottom: '1.5rem', borderBottom: i < featuredArticles.slice(1).length - 1 ? '0.5px solid var(--color-border)' : 'none', ...animStyle(600 + (i + 1) * 100) }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
                {article.irtLabel}&nbsp;&nbsp;
              </span>
              <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>
                {article.irtTarget}
              </span>
              <span style={{ fontFamily: 'var(--font-spectral)', fontSize: '14px', fontStyle: 'italic', color: 'var(--color-text-secondary)', display: 'block', marginTop: '3px' }}>
                {article.irtOriginal}
              </span>
              <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '21px', lineHeight: 1.1, color: 'var(--color-text-primary)', marginTop: '0.5rem' }}>
                {article.headline}
              </div>
              <ScrambleText
                text={`${article.author} · ${article.date}`}
                delay={600 + (i + 1) * 100 + 400}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Latest divider */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0', borderBottom: '0.5px solid var(--color-border)', ...animStyle(700) }}>
        Latest
      </div>

      {/* Latest feed */}
      {latestArticles.map((article, i) => (
        <div key={article.id} className="article-card" style={{ padding: '1.75rem 0', borderBottom: '0.5px solid var(--color-border)', ...animStyle(800 + i * 100) }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
              {article.irtLabel}&nbsp;&nbsp;
            </span>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>
              {article.irtTarget}
            </span>
            <span style={{ fontFamily: 'var(--font-spectral)', fontSize: '14px', fontStyle: 'italic', color: 'var(--color-text-secondary)', display: 'block', marginTop: '3px' }}>
              {article.irtOriginal}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '24px', lineHeight: 1.1, color: 'var(--color-text-primary)', marginTop: '0.6rem' }}>
            {article.headline}
          </div>
          {article.deck && (
            <div style={{ fontFamily: 'var(--font-spectral)', fontSize: '17px', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
              {article.deck}
            </div>
          )}
          <ScrambleText
            text={`${article.author} · ${article.date} · ${article.category}`}
            delay={800 + i * 100 + 400}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '0.6rem' }}
          />
        </div>
      ))}

      {/* Footer */}
      <footer
        ref={footerRef}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderTop: '1px solid var(--color-border-strong)',
          padding: '1.5rem 0',
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
