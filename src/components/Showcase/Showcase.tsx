import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProjectCover, PillButton } from '../Shared/Shared'
import { Scramble } from '../Shared/Scramble'
import { PROJECTS, PROCESS, TESTIMONIALS } from '../../data/content'
import { useReveal, useCountUp } from '../../hooks/useReveal'
import './Showcase.css'

type CSSVars = React.CSSProperties & Record<string, string | number>

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Calls `fn` on every animation frame in which the page scrolled or resized. */
function useScrollFrame(fn: () => void, deps: unknown[] = []) {
  useEffect(() => {
    let frame = 0
    const run = () => {
      frame = 0
      fn()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ==========================================================================
   1. Scroll-lit statement — words light up one by one as you scroll
   ========================================================================== */
const STATEMENT =
  "I believe great brands aren't designed, they're *discovered.* My work is to listen, find the story only you can tell, and shape it into an *identity* people remember long after they scroll past."

export const ScrollStatement: React.FC = () => {
  const ref = useRef<HTMLElement>(null)
  const words = STATEMENT.split(' ')

  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const spans = el.querySelectorAll<HTMLElement>('.sc-stmt-word')
    if (reducedMotion()) {
      spans.forEach((s) => s.classList.add('on'))
      return
    }
    const r = el.getBoundingClientRect()
    const travel = r.height - window.innerHeight
    const p = clamp(-r.top / (travel > 0 ? travel : 1))
    const lit = Math.floor(p * 1.12 * spans.length)
    spans.forEach((s, i) => s.classList.toggle('on', i < lit))
    el.style.setProperty('--p', p.toFixed(3))
  })

  return (
    <section className="sc-stmt" ref={ref} aria-label="Design philosophy">
      <div className="sc-stmt-sticky">
        <div className="sc-stmt-inner">
          <span className="sc-stmt-star" aria-hidden="true" />
          <Scramble className="sc-kicker">My Philosophy</Scramble>
          <p className="sc-stmt-text">
            {words.map((w, i) => {
              const accent = w.startsWith('*')
              const clean = w.replace(/\*/g, '')
              return (
                <React.Fragment key={i}>
                  <span className={`sc-stmt-word${accent ? ' accent' : ''}`}>{clean}</span>{' '}
                </React.Fragment>
              )
            })}
          </p>
          <div className="sc-stmt-meter" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   2. Pinned horizontal work gallery
   ========================================================================== */
export const WorkGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [pinned, setPinned] = useState(true)
  const [current, setCurrent] = useState(1)
  const dist = useRef(0)

  // Measure how far the track must travel and size the section to match
  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return
      const usePin = window.innerWidth > 768 && !reducedMotion()
      setPinned(usePin)
      if (!usePin) {
        section.style.height = ''
        track.style.transform = ''
        return
      }
      dist.current = Math.max(0, track.scrollWidth - window.innerWidth)
      section.style.height = `${dist.current + window.innerHeight}px`
    }
    measure()
    const t = setTimeout(measure, 600) // fonts/images settle
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useScrollFrame(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || !pinned) return
    const r = section.getBoundingClientRect()
    const travel = r.height - window.innerHeight
    const p = clamp(-r.top / (travel > 0 ? travel : 1))
    track.style.transform = `translate3d(${(-p * dist.current).toFixed(1)}px, 0, 0)`
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    setCurrent(Math.min(PROJECTS.length, Math.floor(p * PROJECTS.length) + 1))
    // Covers drift slightly against the motion for depth
    track.querySelectorAll<HTMLElement>('.sc-work-cover').forEach((c) => {
      const cr = c.getBoundingClientRect()
      const off = (cr.left + cr.width / 2 - window.innerWidth / 2) / window.innerWidth
      c.style.setProperty('--shift', (off * -40).toFixed(1))
    })
  }, [pinned])

  return (
    <section className={`sc-work ${pinned ? 'is-pinned' : 'is-native'}`} ref={sectionRef} aria-label="Selected work">
      <div className="sc-work-sticky">
        <div className="sc-work-track" ref={trackRef}>
          <div className="sc-work-intro">
            <Scramble className="sc-kicker">Selected Work</Scramble>
            <h2>
              Brands I've helped <i>come alive</i>
            </h2>
            <p>Scroll to explore a few recent projects — each one a story told through design.</p>
            <div className="sc-work-hint" aria-hidden="true">
              <span>Scroll</span>
              <i />
            </div>
          </div>

          {PROJECTS.map((p, i) => (
            <Link to={`/projects/${p.slug}`} key={p.slug} className="sc-work-card vp-hover" data-cursor="View">
              <div className="sc-work-cover">
                <ProjectCover kind={p.cover} mark={p.mark} palette={p.palette} label={`${p.client} cover`} />
              </div>
              <div className="sc-work-meta">
                <span className="sc-work-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>
                    {p.client} · {p.category}
                  </p>
                </div>
                <span className="vp-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}

          <Link to="/projects" className="sc-work-end" data-cursor="All">
            <span className="sc-work-end-ring" aria-hidden="true" />
            <span className="sc-work-end-text">
              View all
              <br />
              <i>projects</i>
            </span>
          </Link>
        </div>

        {pinned && (
          <div className="sc-work-progress" aria-hidden="true">
            <span className="sc-work-count">
              {String(current).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </span>
            <div className="sc-work-bar">
              <span ref={barRef} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ==========================================================================
   3. Stacking process cards
   ========================================================================== */
const PROCESS_EXTRA = [
  { tags: ['Discovery call', 'Brand audit', 'Competitor scan'], tone: 'maroon' },
  { tags: ['Moodboards', 'Direction', 'Sitemap'], tone: 'cream' },
  { tags: ['Concepts', 'Refinement', 'Prototype'], tone: 'white' },
  { tags: ['Final files', 'Guidelines', 'Launch support'], tone: 'gold' },
]

export const ProcessStack: React.FC = () => {
  const listRef = useRef<HTMLOListElement>(null)

  useScrollFrame(() => {
    const list = listRef.current
    if (!list || reducedMotion()) return
    const cards = Array.from(list.querySelectorAll<HTMLElement>('.sc-stack-card'))
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return
      const a = card.getBoundingClientRect()
      const b = next.getBoundingClientRect()
      // 0 when the next card is a full card-height away, 1 once it fully covers this one
      const covered = clamp(1 - (b.top - a.top) / a.height)
      card.style.setProperty('--covered', covered.toFixed(3))
    })
  })

  return (
    <section className="sc-stack" aria-label="How I work">
      <div className="sc-stack-head" data-reveal>
        <Scramble className="sc-kicker">How I Work</Scramble>
        <h2>
          Four steps from <i>idea</i> to identity
        </h2>
      </div>
      <ol className="sc-stack-list" ref={listRef}>
        {PROCESS.map((p, i) => (
          <li
            key={p.step}
            className={`sc-stack-card tone-${PROCESS_EXTRA[i].tone}`}
            style={{ '--i': i } as CSSVars}
          >
            <div className="sc-stack-copy">
              <span className="sc-stack-num">{p.step}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <ul>
                {PROCESS_EXTRA[i].tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className={`sc-stack-art art-${i}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ==========================================================================
   4. Bento grid of live tiles
   ========================================================================== */
const PALETTE = [
  { hex: '#45212B', name: 'Maroon' },
  { hex: '#8A4B5C', name: 'Rose' },
  { hex: '#E5DBAB', name: 'Gold' },
  { hex: '#EDE8D0', name: 'Cream' },
]

const ORBIT = ['/devicon_figma.jpg', '/devicon_canva.jpg', '/photoshop.jpg', '/logos_invision-icon.jpg', '/devicon_sketch.jpg']

export const BentoGrid: React.FC = () => {
  const [time, setTime] = useState('')
  const [quote, setQuote] = useState(0)
  useReveal()
  useCountUp('.sc-bento [data-count]')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const t = setInterval(tick, 1000)
    const q = setInterval(() => setQuote((n) => (n + 1) % TESTIMONIALS.length), 5000)
    return () => {
      clearInterval(t)
      clearInterval(q)
    }
  }, [])

  const t = TESTIMONIALS[quote]

  return (
    <section className="sc-bento" aria-label="Studio at a glance">
      <div className="sc-bento-head" data-reveal>
        <Scramble className="sc-kicker">At a Glance</Scramble>
        <h2>
          The studio, <i>in a nutshell</i>
        </h2>
      </div>

      <div className="sc-bento-grid">
        <article className="sc-tile sc-tile-status" data-reveal style={{ '--d': 0 } as CSSVars}>
          <span className="sc-status-pill">
            <i className="sc-pulse" /> Available for new projects
          </span>
          <h3>
            Let's build something <i>remarkable</i> together.
          </h3>
          <div className="sc-status-foot">
            <div>
              <span className="sc-tile-label">Local time · India</span>
              <strong className="sc-clock">{time}</strong>
            </div>
            <PillButton to="/contact">Book a Call</PillButton>
          </div>
        </article>

        <article className="sc-tile sc-tile-badge" data-reveal style={{ '--d': 1 } as CSSVars}>
          <div className="sc-badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="sc-badge-ring" aria-hidden="true">
              <defs>
                <path id="sc-badge-path" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
              </defs>
              <text>
                <textPath href="#sc-badge-path" textLength="274" lengthAdjust="spacing">
                  BRANDING ✦ UI/UX ✦ PRINT ✦ WEB ✦
                </textPath>
              </text>
            </svg>
            <span className="sc-badge-core" aria-hidden="true" />
          </div>
          <span className="sc-tile-label">Full-service design</span>
        </article>

        <article className="sc-tile sc-tile-stat" data-reveal style={{ '--d': 2 } as CSSVars}>
          <span className="sc-tile-label">Projects delivered</span>
          <strong className="sc-stat-big">
            <span data-count="20">0</span>+
          </strong>
          <div className="sc-stat-bars" aria-hidden="true">
            {[40, 65, 50, 80, 70, 95].map((h, i) => (
              <span key={i} style={{ '--h': `${h}%`, '--i': i } as CSSVars} />
            ))}
          </div>
        </article>

        <article className="sc-tile sc-tile-orbit" data-reveal style={{ '--d': 1 } as CSSVars}>
          <div className="sc-orbit" aria-hidden="true">
            <span className="sc-orbit-core" />
            {ORBIT.map((src, i) => (
              <span key={src} className="sc-orbit-item" style={{ '--a': `${(360 / ORBIT.length) * i}deg` } as CSSVars}>
                <img src={src} alt="" />
              </span>
            ))}
          </div>
          <span className="sc-tile-label">My daily toolkit</span>
        </article>

        <article className="sc-tile sc-tile-palette" data-reveal style={{ '--d': 2 } as CSSVars}>
          <span className="sc-tile-label">The Vaum palette</span>
          <div className="sc-palette">
            {PALETTE.map((c) => (
              <span key={c.hex} style={{ background: c.hex }} className={c.name === 'Cream' || c.name === 'Gold' ? 'light' : ''}>
                <b>{c.name}</b>
                <em>{c.hex}</em>
              </span>
            ))}
          </div>
        </article>

        <article className="sc-tile sc-tile-quote" data-reveal style={{ '--d': 3 } as CSSVars}>
          <span className="sc-quote-mark" aria-hidden="true">“</span>
          <blockquote key={quote}>
            {t.quote.split('. ')[0]}.
            <cite>
              {t.name} — {t.role}
            </cite>
          </blockquote>
          <div className="sc-quote-dots" aria-hidden="true">
            {TESTIMONIALS.map((_, i) => (
              <span key={i} className={i === quote ? 'on' : ''} />
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

/* ==========================================================================
   5. Project index with floating cursor preview
   ========================================================================== */
export const ProjectIndex: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  useReveal()

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    const loop = () => {
      const p = pos.current
      const dx = p.tx - p.x
      p.x += dx * 0.14
      p.y += (p.ty - p.y) * 0.14
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${clamp(dx * 0.06, -12, 12)}deg)`
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX
      pos.current.ty = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section className="sc-index" aria-label="Project index">
      <div className="sc-index-head" data-reveal>
        <Scramble className="sc-kicker">Index</Scramble>
        <h2>
          Every project, <i>at a glance</i>
        </h2>
      </div>

      <ul className="sc-index-list" onMouseLeave={() => setActive(null)}>
        {PROJECTS.map((p, i) => (
          <li key={p.slug} data-reveal style={{ '--d': i % 3 } as CSSVars}>
            <Link to={`/projects/${p.slug}`} className="sc-index-row" onMouseEnter={() => setActive(i)} data-cursor="Open">
              <span className="sc-index-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="sc-index-title">{p.title}</span>
              <span className="sc-index-client">{p.client}</span>
              <span className="sc-index-cat">{p.category}</span>
              <span className="sc-index-year">{p.year}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={`sc-index-preview ${active !== null ? 'show' : ''}`} ref={previewRef} aria-hidden="true">
        {PROJECTS.map((p, i) => (
          <div key={p.slug} className={`sc-index-slide ${active === i ? 'on' : ''}`}>
            <ProjectCover kind={p.cover} mark={p.mark} palette={p.palette} label="" />
          </div>
        ))}
      </div>
    </section>
  )
}
