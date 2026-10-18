import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { BigWord, PageHero, Eyebrow, CtaBand, PillButton, SplitTitle, d } from '../components/Shared/Shared'
import { ServicesWheel } from '../components/HeroArt/HeroArt'
import { SERVICES, PROCESS } from '../data/content'
import { useReveal, tiltHandlers } from '../hooks/useReveal'
import './Pages.css'

/** Which option to pre-select in the brief builder for each service */
const START_SERVICE: Record<string, string> = {
  'ui-ux': 'UI/UX Design',
  application: 'App Design',
  website: 'Website Design',
  logo: 'Logo & Identity',
  brochure: 'Brochure & Print',
  prototype: 'UI/UX Design',
}

const Services: React.FC = () => {
  const { hash } = useLocation()
  const [open, setOpen] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  useReveal()

  // Jump to and expand the service linked from the home page (e.g. /services#website)
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    setOpen(id)
    const idx = SERVICES.findIndex((sv) => sv.id === id)
    if (idx >= 0) setActive(idx)
    // On desktop the grid is replaced by the expanding panels, so scroll to whichever is visible
    const card = document.getElementById(id)
    const target = card && card.offsetParent !== null ? card : document.querySelector('.vp-panels')
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
  }, [hash])

  return (
    <div className="vp-page">
      <PageHero
        crumb="Services"
        art={<ServicesWheel />}
        eyebrow="What I Do"
        title={<>Design <i>services</i> that make brands unforgettable</>}
        description="From the first sketch of a logo to a complete digital product, every service is shaped around your goals, your audience and your story."
      />

      <section className="vp-section">
        {/* Desktop: expanding panels — hover or focus a panel to open it */}
        <div className="vp-panels" data-reveal role="list">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              role="listitem"
              className={`vp-panel ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
              aria-expanded={active === i}
            >
              <span className="vp-panel-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="vp-panel-vertical">{s.title}</h3>
              <div className="vp-panel-body">
                <div className="vp-panel-icon">
                  <img src={s.icon} alt="" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ul>
                  {s.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link to={`/start?service=${encodeURIComponent(START_SERVICE[s.id])}`} className="vp-panel-cta">
                  Start this project <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="vp-services-grid">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className={`vp-service vp-tilt ${open === s.id ? 'is-open' : ''}`}
              data-reveal
              style={d(i % 3)}
              {...tiltHandlers}
            >
              <span className="vp-service-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="vp-service-icon">
                <img src={s.icon} alt="" />
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <button
                className="vp-service-toggle"
                onClick={() => setOpen(open === s.id ? null : s.id)}
                aria-expanded={open === s.id}
              >
                {open === s.id ? 'Hide deliverables' : 'What you get'}
                <span className="vp-plus" aria-hidden="true" />
              </button>
              <ul className="vp-service-list">
                {s.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="vp-section">
        <div className="vp-section-head">

          <BigWord>Process</BigWord>
          <div data-reveal>
            <Eyebrow>How I Work</Eyebrow>
            <SplitTitle as="h2" className="vp-h2">A simple, <i>transparent</i> process</SplitTitle>
          </div>
          <p className="vp-lead" data-reveal style={d(1)}>
            Four clear stages keep every project on track, so you always know what's happening and what comes next.
          </p>
        </div>

        <ol className="vp-process">
          {PROCESS.map((p, i) => (
            <li key={p.step} className="vp-process-step" data-reveal style={d(i)}>
              <span className="vp-process-num">{p.step}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="vp-section vp-split">
        <div data-reveal="left">
          <Eyebrow>Why Choose Me</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">Strategy first, <i>beauty</i> always</SplitTitle>
          <p className="vp-lead">
            Good design is more than looking nice. Every colour, word and layout decision is tied back to what you want
            your brand to achieve.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <PillButton to="/projects">See My Work</PillButton>
          </div>
        </div>
        <ul className="vp-checks" data-reveal="right">
          {[
            'One dedicated designer from start to finish',
            'Clear timelines and fixed quotes',
            'Unlimited ideas, structured revisions',
            'Print-ready and developer-ready files',
            'Support after launch',
          ].map((t, i) => (
            <li key={t} style={d(i)}>
              <span className="vp-check" aria-hidden="true">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </div>
  )
}

export default Services
