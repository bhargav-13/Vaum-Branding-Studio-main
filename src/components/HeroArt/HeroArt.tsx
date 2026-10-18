import React, { useEffect, useState } from 'react'
import { ProjectCover } from '../Shared/Shared'
import { PROJECTS, TESTIMONIALS } from '../../data/content'
import './HeroArt.css'

type CSSVars = React.CSSProperties & Record<string, string | number>

/* Each inner page gets its own crafted header illustration. All are pure CSS/SVG. */

/** Services: a slowly turning wheel of disciplines around the studio star */
export const ServicesWheel: React.FC = () => {
  const items = ['UI/UX', 'Apps', 'Websites', 'Logos', 'Print', 'Prototypes']
  return (
    <div className="ha-wheel" aria-hidden="true">
      <div className="ha-wheel-ring">
        {items.map((t, i) => (
          <span key={t} style={{ '--a': `${i * 60}deg` } as CSSVars}>
            <b>{t}</b>
          </span>
        ))}
      </div>
      <div className="ha-wheel-inner" />
      <div className="ha-wheel-core">
        <i />
      </div>
    </div>
  )
}

/** About: arched portrait with a ring of rotating text and stickers */
export const PortraitArch: React.FC = () => (
  <div className="ha-arch" aria-hidden="true">
    <div className="ha-arch-frame">
      <img src="/Mask group.svg" alt="" />
    </div>
    <svg className="ha-arch-ring" viewBox="0 0 200 200">
      <defs>
        <path id="ha-arch-path" d="M 100,100 m -86,0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0" />
      </defs>
      <text>
        <textPath href="#ha-arch-path" textLength="538" lengthAdjust="spacing">
          VACHIKA BHANDERI ✦ BRAND DESIGNER ✦ VAUM STUDIO ✦
        </textPath>
      </text>
    </svg>
    <span className="ha-sticker ha-sticker-1">Hello!</span>
    <span className="ha-sticker ha-sticker-2">✦ Est. 2023</span>
  </div>
)

/** Projects: a fanned deck of project covers that spreads on hover */
export const CoverDeck: React.FC = () => (
  <div className="ha-deck" aria-hidden="true">
    {PROJECTS.slice(0, 3).map((p, i) => (
      <div key={p.slug} className={`ha-deck-card c${i}`}>
        <ProjectCover image={p.coverImage} kind={p.cover} mark={p.mark} palette={p.palette} label="" />
        <span>{p.title}</span>
      </div>
    ))}
  </div>
)

/** Blogs: a type-specimen card */
export const TypeSpecimen: React.FC = () => (
  <div className="ha-type" aria-hidden="true">
    <div className="ha-type-head">
      <span>Typeface</span>
      <span>Poppins</span>
    </div>
    <div className="ha-type-aa">Aa</div>
    <div className="ha-type-weights">
      {['Light', 'Regular', 'Medium', 'Semibold'].map((w, i) => (
        <span key={w} style={{ fontWeight: 300 + i * 100, '--i': i } as CSSVars}>
          {w}
        </span>
      ))}
    </div>
    <div className="ha-type-line">
      Design is thinking made visual<i />
    </div>
    <div className="ha-type-glyphs">& @ ✦ ? ! 0 1 2 3</div>
  </div>
)

/** Testimonials: floating client quote bubbles */
export const QuoteStack: React.FC = () => (
  <div className="ha-quotes" aria-hidden="true">
    {TESTIMONIALS.map((t, i) => (
      <div key={t.name} className={`ha-bubble b${i}`}>
        <div className="ha-bubble-stars">★★★★★</div>
        <p>“{t.quote.split(/[.,—]/)[0].slice(0, 70)}…”</p>
        <div className="ha-bubble-who">
          <span>
            {t.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
          {t.name}
        </div>
      </div>
    ))}
  </div>
)

/** Contact: "Hello" cycling through languages */
export const HelloCycle: React.FC = () => {
  const words = ['Hello', 'नमस्ते', 'Hola', 'Bonjour', 'Ciao', 'こんにちは', 'Hallo']
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 1700)
    return () => clearInterval(t)
  }, [words.length])

  return (
    <div className="ha-hello" aria-hidden="true">
      <div className="ha-hello-bubble">
        <span key={i} className="ha-hello-word">
          {words[i]}
        </span>
      </div>
      <div className="ha-hello-status">
        <i /> Usually replies within 24 hours
      </div>
      <span className="ha-hello-dot d1" />
      <span className="ha-hello-dot d2" />
    </div>
  )
}
