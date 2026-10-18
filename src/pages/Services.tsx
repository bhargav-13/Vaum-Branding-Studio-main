import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageHero, Eyebrow, CtaBand, PillButton, SplitTitle, d } from '../components/Shared/Shared'
import { SERVICES, PROCESS } from '../data/content'
import { useReveal, tiltHandlers } from '../hooks/useReveal'
import './Pages.css'

const Services: React.FC = () => {
  const { hash } = useLocation()
  const [open, setOpen] = useState<string | null>(null)
  useReveal()

  // Jump to and expand the service linked from the home page (e.g. /services#website)
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    setOpen(id)
    const el = document.getElementById(id)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
  }, [hash])

  return (
    <div className="vp-page">
      <PageHero
        crumb="Services"
        eyebrow="What I Do"
        title={<>Design <i>services</i> that make brands unforgettable</>}
        description="From the first sketch of a logo to a complete digital product, every service is shaped around your goals, your audience and your story."
      />

      <section className="vp-section">
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
