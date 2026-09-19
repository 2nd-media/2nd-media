import Link from 'next/link'

export default function Article() {
  return (
    <main style={{ paddingTop: '2rem', paddingLeft: '2.5rem', paddingRight: '2.5rem', paddingBottom: '4rem' }}>

      {/* Masthead */}
      <div style={{ borderBottom: '1px solid #0a0a0a', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '56px', letterSpacing: '-0.04em', lineHeight: 1 }}>
            2ND
          </div>
        </Link>
        <nav style={{ fontFamily: 'var(--font-grotesk)', fontSize: '11px', fontWeight: 500, color: '#666', display: 'flex', gap: '20px', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {['Politics', 'Culture', 'Economics', 'Media', 'About'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none' }}>{item}</Link>
          ))}
        </nav>
      </div>

      {/* Article */}
      <article style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* In Response To */}
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a0a0a' }}>
            In Response To&nbsp;&nbsp;
          </span>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '13px', color: '#0a0a0a' }}>
            The New York Times
          </span>
          <span style={{ fontFamily: 'var(--font-spectral)', fontSize: '14px', fontStyle: 'italic', color: '#666', display: 'block', marginTop: '5px' }}>
            &ldquo;The Economy Is Fine. So Why Does Everyone Feel Terrible?&rdquo;
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '40px', lineHeight: 1.1, color: '#0a0a0a', marginTop: '1.25rem', letterSpacing: '-0.01em' }}>
          The Vibes Economy Is a Real Thing, and the NYT Still Doesn&apos;t Understand It
        </h1>

        {/* Deck */}
        <p style={{ fontFamily: 'var(--font-spectral)', fontSize: '19px', lineHeight: 1.6, color: '#444', marginTop: '0.9rem' }}>
          Dismissing consumer pessimism as irrational misses what the data is actually measuring — and who it&apos;s measuring it for.
        </p>

        {/* Byline */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#999', marginTop: '1.25rem' }}>
          By Roman A. &nbsp;·&nbsp; Sep 18, 2026 &nbsp;·&nbsp; Economics
        </div>

        {/* Divider */}
        <div style={{ borderBottom: '1px solid #0a0a0a', marginTop: '1.5rem', marginBottom: '2rem' }} />

        {/* Body */}
        <div style={{ fontFamily: 'var(--font-spectral)', fontSize: '18px', lineHeight: 1.85, color: '#1a1a1a' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            For the better part of two years, the same chart has made the rounds in every economics newsletter: unemployment low, inflation cooling, wages up in real terms — and consumer sentiment stuck in the basement. The instinct among a certain kind of commentator is to treat this gap as a puzzle to be explained away, a matter of vibes and media diet and doomscrolling, rather than a signal that the aggregate numbers are failing to capture something real.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            This is not a new argument, and it is not, on its face, an unreasonable one. Aggregate statistics smooth over distribution by design. The median wage can rise while the median experience of economic security falls, if the gains are concentrated enough and the costs — housing, insurance, childcare — are lumpy enough. What is strange is not that someone would make this argument. What is strange is that a newsroom with the resources of the Times would make it without asking the obvious next question: measured by whom, and for whom?
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            The answer, when you look closely at the methodology cited in the piece, is that the survey panel skews toward exactly the demographic least exposed to the costs it is being used to dismiss. That is not a smoking gun. It is, however, the kind of detail that belongs in a piece asking why people feel a certain way about the economy — not buried, if it appears at all.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            None of this means the vibes are always right, or that sentiment should override the data. It means the data being cited is doing more interpretive work than its presentation lets on, and that the people it fails to describe are not being irrational when they say the economy does not feel fine to them. They are describing a different economy than the one being measured.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            This is the placeholder body of the article. Replace this text with the full piece when the article content is ready.
          </p>
        </div>

      </article>

    </main>
  )
}
