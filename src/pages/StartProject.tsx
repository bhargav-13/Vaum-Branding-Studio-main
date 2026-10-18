import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SplitTitle } from '../components/Shared/Shared'
import { burst } from '../components/SiteEffects/SiteEffects'
import './StartProject.css'

const WHATSAPP_NUMBER = '919727344394'
const EMAIL = 'vaum.branding@gmail.com'

const SERVICES = [
  { name: 'Logo & Identity', hint: 'Logo, colours, type, guidelines', glyph: 'Aa' },
  { name: 'Website Design', hint: 'Landing pages to full sites', glyph: '⌘' },
  { name: 'App Design', hint: 'iOS, Android & web apps', glyph: '▢' },
  { name: 'UI/UX Design', hint: 'Flows, wireframes, prototypes', glyph: '◎' },
  { name: 'Brochure & Print', hint: 'Brochures, menus, stationery', glyph: '❏' },
  { name: 'Social Media Kit', hint: 'Templates that keep you consistent', glyph: '✦' },
]

const BUDGETS = ['$200 – $500', '$500 – $1,000', '$1,000 – $2,500', '$2,500+', 'Not sure yet']
const TIMELINES = [
  { name: 'ASAP', hint: 'Within 1–2 weeks' },
  { name: 'This month', hint: '2–4 weeks' },
  { name: 'Next few months', hint: '1–3 months' },
  { name: 'Flexible', hint: 'No fixed deadline' },
]

const STEPS = ['Services', 'Budget', 'Timeline', 'About you', 'Review']

interface Brief {
  services: string[]
  budget: string
  timeline: string
  name: string
  email: string
  company: string
  message: string
}

const EMPTY: Brief = { services: [], budget: '', timeline: '', name: '', email: '', company: '', message: '' }

const StartProject: React.FC = () => {
  const [params] = useSearchParams()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [brief, setBrief] = useState<Brief>(() => {
    const pre = params.get('service')
    return SERVICES.some((s) => s.name === pre) ? { ...EMPTY, services: [pre as string] } : EMPTY
  })
  const [sent, setSent] = useState(false)
  const [touched, setTouched] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)
  const canNext = [
    brief.services.length > 0,
    !!brief.budget,
    !!brief.timeline,
    brief.name.trim().length > 1 && emailOk,
    true,
  ][step]

  const go = (to: number) => {
    if (to > step && !canNext) {
      setTouched(true)
      return
    }
    setTouched(false)
    setDir(to > step ? 1 : -1)
    setStep(to)
  }

  // Enter moves forward (except inside the message box)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sent || e.key !== 'Enter' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      if (step < STEPS.length - 1) {
        e.preventDefault()
        go(step + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const toggleService = (name: string) =>
    setBrief((b) => ({
      ...b,
      services: b.services.includes(name) ? b.services.filter((s) => s !== name) : [...b.services, name],
    }))

  const summary = useMemo(
    () =>
      `*New project brief — Vaum Studio*

*Name:* ${brief.name}
*Email:* ${brief.email}${brief.company ? `\n*Company:* ${brief.company}` : ''}
*Services:* ${brief.services.join(', ')}
*Budget:* ${brief.budget}
*Timeline:* ${brief.timeline}

*About the project:*
${brief.message || '—'}`,
    [brief]
  )

  const celebrate = () => {
    setSent(true)
    const r = panelRef.current?.getBoundingClientRect()
    if (r && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ;[0, 150, 300, 450].forEach((delay, i) =>
        setTimeout(() => burst(r.left + r.width * (0.2 + i * 0.2), r.top + 120 + (i % 2) * 60), delay)
      )
    }
  }

  const sendWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`, '_blank')
    celebrate()
  }

  const sendEmail = () => {
    const body = summary.replace(/\*/g, '')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Project brief from ${brief.name}`)}&body=${encodeURIComponent(body)}`
    celebrate()
  }

  const progress = sent ? 1 : step / (STEPS.length - 1)

  return (
    <div className="sp-page">
      <aside className="sp-aside">
        <span className="sp-kicker">Start a Project</span>
        <SplitTitle className="sp-title">
          Let's make your brand <i>unforgettable.</i>
        </SplitTitle>
        <p className="sp-lead">
          Answer a few quick questions — it takes about a minute — and I'll reply within 24 hours with ideas and a clear
          quote.
        </p>

        {/* The brief builds itself as you answer */}
        <div className="sp-brief" aria-live="polite">
          <span className="sp-brief-label">Your brief</span>
          <dl>
            <div className={brief.services.length ? 'filled' : ''}>
              <dt>Services</dt>
              <dd>{brief.services.length ? brief.services.join(', ') : '—'}</dd>
            </div>
            <div className={brief.budget ? 'filled' : ''}>
              <dt>Budget</dt>
              <dd>{brief.budget || '—'}</dd>
            </div>
            <div className={brief.timeline ? 'filled' : ''}>
              <dt>Timeline</dt>
              <dd>{brief.timeline || '—'}</dd>
            </div>
            <div className={brief.name ? 'filled' : ''}>
              <dt>From</dt>
              <dd>{brief.name || '—'}</dd>
            </div>
          </dl>
        </div>

        <ul className="sp-promises">
          <li>Reply within 24 hours</li>
          <li>Free discovery call</li>
          <li>Fixed quote, no surprises</li>
        </ul>
      </aside>

      <section className="sp-panel" ref={panelRef}>
        <div className="sp-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>

        {!sent && (
          <ol className="sp-steps" aria-label="Steps">
            {STEPS.map((label, i) => (
              <li key={label} className={i === step ? 'current' : i < step ? 'done' : ''}>
                <button onClick={() => (i < step ? go(i) : undefined)} disabled={i > step} aria-current={i === step}>
                  <span>{i < step ? '✓' : i + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="sp-stage">
          {sent ? (
            <div className="sp-done">
              <div className="sp-done-badge" aria-hidden="true">
                <span />
              </div>
              <h2>
                Brief sent — <i>thank you, {brief.name.split(' ')[0] || 'friend'}!</i>
              </h2>
              <p>Here's what happens next:</p>
              <ol className="sp-after">
                <li>
                  <b>Within 24 hours</b> I'll reply with first thoughts and questions.
                </li>
                <li>
                  <b>A short discovery call</b> to understand your brand and goals.
                </li>
                <li>
                  <b>A clear proposal</b> with timeline and fixed price.
                </li>
              </ol>
              <Link to="/projects" className="sp-link">
                Meanwhile, explore my work →
              </Link>
            </div>
          ) : (
            <div className={`sp-step dir-${dir > 0 ? 'fwd' : 'back'}`} key={step}>
              {step === 0 && (
                <>
                  <h2>What can I help you with?</h2>
                  <p className="sp-help">Pick as many as you like.</p>
                  <div className="sp-grid">
                    {SERVICES.map((s, i) => {
                      const on = brief.services.includes(s.name)
                      return (
                        <button
                          key={s.name}
                          className={`sp-option${on ? ' on' : ''}`}
                          onClick={() => toggleService(s.name)}
                          aria-pressed={on}
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <span className="sp-glyph" aria-hidden="true">{s.glyph}</span>
                          <strong>{s.name}</strong>
                          <small>{s.hint}</small>
                          <span className="sp-check" aria-hidden="true">✓</span>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2>What's your budget?</h2>
                  <p className="sp-help">A rough range helps me suggest the right scope.</p>
                  <div className="sp-pills">
                    {BUDGETS.map((b, i) => (
                      <button
                        key={b}
                        className={`sp-pill${brief.budget === b ? ' on' : ''}`}
                        onClick={() => setBrief((x) => ({ ...x, budget: b }))}
                        aria-pressed={brief.budget === b}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>When do you need it?</h2>
                  <p className="sp-help">Good design takes a little time — but I'll work with your deadline.</p>
                  <div className="sp-grid sp-grid-2">
                    {TIMELINES.map((t, i) => (
                      <button
                        key={t.name}
                        className={`sp-option${brief.timeline === t.name ? ' on' : ''}`}
                        onClick={() => setBrief((x) => ({ ...x, timeline: t.name }))}
                        aria-pressed={brief.timeline === t.name}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <strong>{t.name}</strong>
                        <small>{t.hint}</small>
                        <span className="sp-check" aria-hidden="true">✓</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Tell me about you.</h2>
                  <p className="sp-help">So I know who I'm talking to.</p>
                  <div className="sp-fields">
                    <label className={`sp-field${touched && brief.name.trim().length < 2 ? ' err' : ''}`}>
                      <input
                        value={brief.name}
                        onChange={(e) => setBrief((x) => ({ ...x, name: e.target.value }))}
                        placeholder=" "
                        autoFocus
                      />
                      <span>Your name *</span>
                    </label>
                    <label className={`sp-field${touched && !emailOk ? ' err' : ''}`}>
                      <input
                        type="email"
                        value={brief.email}
                        onChange={(e) => setBrief((x) => ({ ...x, email: e.target.value }))}
                        placeholder=" "
                      />
                      <span>Email *</span>
                    </label>
                    <label className="sp-field">
                      <input
                        value={brief.company}
                        onChange={(e) => setBrief((x) => ({ ...x, company: e.target.value }))}
                        placeholder=" "
                      />
                      <span>Company / brand (optional)</span>
                    </label>
                    <label className="sp-field sp-field-full">
                      <textarea
                        value={brief.message}
                        onChange={(e) => setBrief((x) => ({ ...x, message: e.target.value }))}
                        placeholder=" "
                        rows={4}
                      />
                      <span>Tell me about your project (optional)</span>
                    </label>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2>Looks great — ready to send?</h2>
                  <p className="sp-help">Choose how you'd like to send your brief.</p>
                  <div className="sp-review">
                    <div>
                      <span>Services</span>
                      <b>{brief.services.join(', ')}</b>
                    </div>
                    <div>
                      <span>Budget</span>
                      <b>{brief.budget}</b>
                    </div>
                    <div>
                      <span>Timeline</span>
                      <b>{brief.timeline}</b>
                    </div>
                    <div>
                      <span>Contact</span>
                      <b>
                        {brief.name} · {brief.email}
                      </b>
                    </div>
                  </div>
                  <div className="sp-send">
                    <button className="sp-send-btn primary" onClick={sendWhatsApp}>
                      Send via WhatsApp
                    </button>
                    <button className="sp-send-btn" onClick={sendEmail}>
                      Send via Email
                    </button>
                  </div>
                </>
              )}

              {touched && !canNext && (
                <p className="sp-error" role="alert">
                  {step === 0 && 'Pick at least one service to continue.'}
                  {step === 1 && 'Choose a budget range to continue.'}
                  {step === 2 && 'Choose a timeline to continue.'}
                  {step === 3 && 'Please add your name and a valid email.'}
                </p>
              )}
            </div>
          )}
        </div>

        {!sent && (
          <div className="sp-nav">
            <button className="sp-back" onClick={() => go(step - 1)} disabled={step === 0}>
              ← Back
            </button>
            {step < STEPS.length - 1 && (
              <button className={`sp-next${canNext ? ' ready' : ''}`} onClick={() => go(step + 1)}>
                Continue <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default StartProject
