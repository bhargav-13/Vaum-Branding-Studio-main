import React, { useEffect, useState } from 'react'
import { BigWord, PageHero, Eyebrow, CtaBand, SplitTitle, d } from '../components/Shared/Shared'
import { QuoteStack } from '../components/HeroArt/HeroArt'
import { TESTIMONIALS } from '../data/content'
import { useReveal, useCountUp } from '../hooks/useReveal'
import './Pages.css'

const AUTOPLAY_MS = 6000

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  useReveal()
  useCountUp()

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setActive((a) => (a + 1) % TESTIMONIALS.length), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [active, paused])

  const current = TESTIMONIALS[active]
  const go = (dir: number) => setActive((a) => (a + dir + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <div className="vp-page">
      <PageHero
        crumb="Testimonials"
        art={<QuoteStack />}
        eyebrow="Client Love"
        title={<>Kind words from <i>happy</i> clients</>}
        description="The best measure of my work is how clients feel about their brand after we finish. Here's what a few of them had to say."
      />

      <section
        className="vp-spotlight"
        data-reveal
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="vp-spotlight-quote" aria-hidden="true" data-parallax="0.2">“</span>
        <div className="vp-spotlight-body" key={active} aria-live="polite">
          <div className="vp-stars" aria-label={`${current.rating} out of 5 stars`}>
            {'★★★★★'.slice(0, current.rating)}
          </div>
          <p>{current.quote}</p>
          <div className="vp-author">
            <span className="vp-avatar">{initials(current.name)}</span>
            <div>
              <strong>{current.name}</strong>
              <span>{current.role}</span>
            </div>
          </div>
        </div>

        <div className="vp-spotlight-nav">
          <button className="vp-round" onClick={() => go(-1)} aria-label="Previous testimonial">←</button>
          <div className="vp-dots">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                className={`vp-dot ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Show testimonial from ${t.name}`}
              >
                {i === active && !paused && <span className="vp-dot-fill" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
              </button>
            ))}
          </div>
          <button className="vp-round" onClick={() => go(1)} aria-label="Next testimonial">→</button>
        </div>
      </section>

      <section className="vp-stats" data-reveal>
        <div className="vp-stat" style={d(0)}>
          <div className="vp-stat-num">5.0</div>
          <div className="vp-stat-label">Average Rating</div>
        </div>
        <div className="vp-stat" style={d(1)}>
          <div className="vp-stat-num"><span data-count="20">0</span>+</div>
          <div className="vp-stat-label">Projects Delivered</div>
        </div>
        <div className="vp-stat" style={d(2)}>
          <div className="vp-stat-num"><span data-count="100">0</span>%</div>
          <div className="vp-stat-label">Would Recommend</div>
        </div>
      </section>

      <section className="vp-section">
        <div className="vp-center-head" data-reveal>

          <BigWord>Reviews</BigWord>
          <Eyebrow>All Reviews</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">What it's like to <i>work</i> together</SplitTitle>
        </div>
        <div className="vp-reviews">
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.name} className="vp-review" data-reveal style={d(i)}>
              <div className="vp-stars">{'★★★★★'.slice(0, t.rating)}</div>
              <blockquote>{t.quote}</blockquote>
              <figcaption className="vp-author">
                <span className="vp-avatar">{initials(t.name)}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="vp-marquee" aria-label="Clients">
        <div className="vp-marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="vp-marquee-group" aria-hidden={k === 1}>
              {['Delight Autoforge', 'Codelix IT Solutions', 'Sabhaya Solutions', 'Vaum Studio', 'Your Brand Next'].map((n) => (
                <span key={n}>
                  <img src="/octicon_north-star-24.svg" alt="" />
                  {n}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  )
}

export default Testimonials
