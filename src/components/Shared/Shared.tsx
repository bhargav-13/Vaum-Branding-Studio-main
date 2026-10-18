import React from 'react'
import { Link } from 'react-router-dom'
import type { CoverKind } from '../../data/content'
import { Scramble } from './Scramble'
import './Shared.css'

type CSSVars = React.CSSProperties & Record<string, string | number>

/** Shorthand for a stagger delay index on a [data-reveal] element. */
export const d = (i: number): CSSVars => ({ '--d': i })

/** Wraps every word (including words inside <i> etc.) so headings can rise in word by word. */
const splitWords = (node: React.ReactNode, counter: { i: number }): React.ReactNode => {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((part, k) =>
      part === '' || /^\s+$/.test(part) ? (
        part
      ) : (
        <span className="vp-word" key={k}>
          <span style={{ '--w': counter.i++ } as CSSVars}>{part}</span>
        </span>
      )
    )
  }
  if (Array.isArray(node)) {
    return node.map((child, k) => <React.Fragment key={k}>{splitWords(child, counter)}</React.Fragment>)
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return React.cloneElement(node, undefined, splitWords(node.props.children, counter))
  }
  return node
}

type SplitTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode
  as?: 'h1' | 'h2'
  'data-reveal'?: boolean | string
}

export const SplitTitle: React.FC<SplitTitleProps> = ({ children, className = '', as: Tag = 'h1', ...rest }) => (
  <Tag
    {...rest}
    className={`vp-split-title ${className}`}
    aria-label={typeof children === 'string' ? children : undefined}
  >
    {splitWords(children, { i: 0 })}
  </Tag>
)

interface PageHeroProps {
  eyebrow: string
  title: React.ReactNode
  description: string
  crumb: string
  /** Page-specific illustration shown beside the title */
  art?: React.ReactNode
}

/** Pointer position inside the hero drives the glow and the depth of the floating shapes. */
const heroPointer = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--hx', ((e.clientX - r.left) / r.width).toFixed(3))
  el.style.setProperty('--hy', ((e.clientY - r.top) / r.height).toFixed(3))
}

const heroPointerLeave = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty('--hx', '0.5')
  e.currentTarget.style.setProperty('--hy', '0.5')
}

export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, crumb, art }) => (
  <section className={`vp-hero${art ? ' has-art' : ''}`} onMouseMove={heroPointer} onMouseLeave={heroPointerLeave}>
    <span className="vp-hero-glow" aria-hidden="true" />
    <span className="vp-hero-blob vp-hero-blob-1 vp-depth" style={{ '--depth': -30 } as CSSVars} aria-hidden="true" />
    <span className="vp-hero-blob vp-hero-blob-2 vp-depth" style={{ '--depth': 45 } as CSSVars} aria-hidden="true" />
    <img className="vp-hero-star vp-hero-star-1 vp-depth" style={{ '--depth': 60 } as CSSVars} src="/octicon_north-star-24.svg" alt="" aria-hidden="true" />
    <img className="vp-hero-star vp-hero-star-2 vp-depth" style={{ '--depth': -45 } as CSSVars} src="/octicon_north-star-24.svg" alt="" aria-hidden="true" />

    <div className="vp-hero-copy">
      <nav className="vp-crumb vp-load" style={d(0)} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>{crumb}</span>
      </nav>
      <Eyebrow className="vp-load" style={d(1)}>{eyebrow}</Eyebrow>
      <SplitTitle className="vp-hero-title vp-depth-text">{title}</SplitTitle>
      <p className="vp-hero-desc vp-load" style={d(3)}>{description}</p>
    </div>
    {art && (
      <div className="vp-hero-art vp-load" style={d(3)}>
        {art}
      </div>
    )}
  </section>
)

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = '',
  style,
}) => (
  <div className={`vp-eyebrow ${className}`} style={style}>
    <span className="vp-eyebrow-line" />
    <Scramble>{children}</Scramble>
  </div>
)

interface PillButtonProps {
  to: string
  children: React.ReactNode
  variant?: 'cream' | 'outline'
}

/** The site's signature button: cream pill with a maroon cap and animated bullet. */
export const PillButton: React.FC<PillButtonProps> = ({ to, children, variant = 'cream' }) => (
  <Link to={to} className={`vp-pill vp-pill-${variant}`}>
    <span className="vp-pill-label">{children}</span>
    <span className="vp-pill-cap">
      <span className="vp-pill-puck">
        <img src="/bullet-point.gif" alt="" />
      </span>
    </span>
  </Link>
)

export const CtaBand: React.FC = () => (
  <section className="vp-cta" data-reveal>
    <Link to="/start" className="vp-cta-ring" aria-label="Start a project">
      <svg className="vp-cta-ring-frame" viewBox="0 0 140 140" aria-hidden="true">
        <circle cx="70" cy="70" r="67" className="vp-cta-ring-outline" />
        <circle cx="70" cy="70" r="38" className="vp-cta-ring-inner" />
      </svg>
      <svg className="vp-cta-ring-text" viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          {/* Circumference 2π·52 ≈ 326.7 — textLength makes the words wrap the circle exactly once */}
          <path id="vp-cta-circle" d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
        </defs>
        <text>
          <textPath href="#vp-cta-circle" textLength="326" lengthAdjust="spacing">
            LET'S CREATE <tspan className="vp-cta-ring-dot">✦</tspan> LET'S CREATE <tspan className="vp-cta-ring-dot">✦</tspan>
          </textPath>
        </text>
      </svg>
      <span className="vp-cta-ring-core" aria-hidden="true">
        <span className="vp-cta-ring-star" />
      </span>
    </Link>
    <div className="vp-cta-text">
      <h2>
        Have a project in mind? <i>Let's make it unforgettable.</i>
      </h2>
      <p>Tell me about your idea and I'll get back to you within 24 hours.</p>
    </div>
    <PillButton to="/start">Start a Project</PillButton>
  </section>
)

interface ProjectCoverProps {
  kind: CoverKind
  mark: string
  palette: [string, string]
  label: string
  /** Wipe the artwork open when it scrolls into view */
  reveal?: boolean
  /** Real project image; when set it replaces the drawn artwork */
  image?: string
}

/** Illustrated cover art for a project, drawn with CSS so no images are required. */
export const ProjectCover: React.FC<ProjectCoverProps> = ({ kind, mark, palette, label, reveal, image }) => {
  const style: CSSVars = { '--c1': palette[0], '--c2': palette[1] }
  const cover = image ? (
    <div className="vp-cover vp-cover-photo" style={style}>
      <img src={image} alt={label} loading="lazy" decoding="async" />
    </div>
  ) : (
    <div
      className={`vp-cover vp-cover-${kind}`}
      style={style}
      role="img"
      aria-label={label}
    >
      <span className="vp-cover-grain" />
      {kind === 'logo' && (
        <>
          <div className="vp-cover-mark">{mark}</div>
          <div className="vp-cover-swatches">
            <span /><span /><span />
          </div>
        </>
      )}
      {kind === 'web' && (
        <div className="vp-cover-browser">
          <div className="vp-cover-bar"><i /><i /><i /></div>
          <div className="vp-cover-page">
            <b>{mark}</b>
            <span className="l1" /><span className="l2" />
            <div className="vp-cover-blocks"><span /><span /><span /></div>
          </div>
        </div>
      )}
      {kind === 'app' && (
        <div className="vp-cover-phones">
          <div className="vp-cover-phone back"><span /><span /><span /></div>
          <div className="vp-cover-phone front">
            <b>{mark}</b>
            <span className="ring" />
            <span /><span />
          </div>
        </div>
      )}
      {kind === 'brochure' && (
        <div className="vp-cover-fold">
          <span className="p1"><b>{mark}</b></span>
          <span className="p2" />
          <span className="p3" />
        </div>
      )}
      {kind === 'social' && (
        <div className="vp-cover-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>{i === 1 || i === 4 ? mark : ''}</span>
          ))}
        </div>
      )}
    </div>
  )
  // The wrapper is what gets observed: a fully clipped element never reports as visible
  return reveal ? <div className="vp-cover-wrap" data-reveal="mask">{cover}</div> : cover
}

/** Oversized outlined word that sits behind a section heading and drifts with scroll */
export const BigWord: React.FC<{ children: string }> = ({ children }) => (
  <span className="vp-bigword" aria-hidden="true" data-parallax="0.12">
    {children}
  </span>
)
