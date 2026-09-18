import Link from 'next/link'
import GlitchMasthead from './components/GlitchMasthead'

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
  return (
    <main style={{ paddingTop: '2rem', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>

      {/* Masthead */}
      <div style={{ borderBottom: '1px solid #0a0a0a', paddingBottom: '1.25rem', marginBottom: '0' }}>
        <GlitchMasthead />
        <nav style={{ fontFamily: 'var(--font-grotesk)', fontSize: '11px', fontWeight: 500, color: '#666', display: 'flex', gap: '20px', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {['Politics', 'Culture', 'Economics', 'Media', 'About'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none' }}>{item}</Link>
          ))}
        </nav>
      </div>

      {/* Dateline */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.6rem 0', borderBottom: '0.5px solid #e0e0e0' }}>
        Friday, September 18, 2026
      </div>

      {/* Featured Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.75rem 0', borderBottom: '0.5px solid #e0e0e0' }}>

        {/* Main featured */}
        <div style={{ borderRight: '0.5px solid #e0e0e0', paddingRight: '2rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a0a0a' }}>
              {featuredArticles[0].irtLabel}&nbsp;&nbsp;
            </span>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '11px', color: '#0a0a0a' }}>
              {featuredArticles[0].irtTarget}
            </span>
            <span style={{ fontFamily: 'var(--font-lora)', fontSize: '12px', fontStyle: 'italic', color: '#666', display: 'block', marginTop: '3px' }}>
              {featuredArticles[0].irtOriginal}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '26px', lineHeight: 1.1, color: '#0a0a0a', marginTop: '0.6rem' }}>
            {featuredArticles[0].headline}
          </div>
          <div style={{ fontFamily: 'var(--font-lora)', fontSize: '15px', lineHeight: 1.65, color: '#444', fontStyle: 'italic', marginTop: '0.4rem' }}>
            {featuredArticles[0].deck}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', marginTop: '0.6rem' }}>
            {featuredArticles[0].author} &nbsp;·&nbsp; {featuredArticles[0].date} &nbsp;·&nbsp; {featuredArticles[0].category}
          </div>
        </div>

        {/* Secondary featured */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {featuredArticles.slice(1).map((article, i) => (
            <div key={article.id} style={{ paddingBottom: '1.5rem', borderBottom: i < featuredArticles.slice(1).length - 1 ? '0.5px solid #e0e0e0' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a0a0a' }}>
                {article.irtLabel}&nbsp;&nbsp;
              </span>
              <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '11px', color: '#0a0a0a' }}>
                {article.irtTarget}
              </span>
              <span style={{ fontFamily: 'var(--font-lora)', fontSize: '12px', fontStyle: 'italic', color: '#666', display: 'block', marginTop: '3px' }}>
                {article.irtOriginal}
              </span>
              <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '17px', lineHeight: 1.1, color: '#0a0a0a', marginTop: '0.5rem' }}>
                {article.headline}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', marginTop: '0.5rem' }}>
                {article.author} &nbsp;·&nbsp; {article.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest divider */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0', borderBottom: '0.5px solid #e0e0e0' }}>
        Latest
      </div>

      {/* Latest feed */}
      {latestArticles.map(article => (
        <div key={article.id} style={{ padding: '1.75rem 0', borderBottom: '0.5px solid #e0e0e0' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a0a0a' }}>
              {article.irtLabel}&nbsp;&nbsp;
            </span>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '11px', color: '#0a0a0a' }}>
              {article.irtTarget}
            </span>
            <span style={{ fontFamily: 'var(--font-lora)', fontSize: '12px', fontStyle: 'italic', color: '#666', display: 'block', marginTop: '3px' }}>
              {article.irtOriginal}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: '20px', lineHeight: 1.1, color: '#0a0a0a', marginTop: '0.6rem' }}>
            {article.headline}
          </div>
          {article.deck && (
            <div style={{ fontFamily: 'var(--font-lora)', fontSize: '14px', lineHeight: 1.65, color: '#444', fontStyle: 'italic', marginTop: '0.4rem' }}>
              {article.deck}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', marginTop: '0.6rem' }}>
            {article.author} &nbsp;·&nbsp; {article.date} &nbsp;·&nbsp; {article.category}
          </div>
        </div>
      ))}

    </main>
  )
}
