import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './SiteEffects.css'

declare global {
  interface Window {
    /** performance.now() timestamp until which the first-visit intro covers the page */
    __vpIntroUntil?: number
  }
}

const RING = 2 * Math.PI * 23
const INTRO_MS = 1900
const INTRO_KEY = 'vp-intro-seen'

/** Elements that lean toward the pointer */
const MAGNET_SEL =
  '.vp-pill, .vp-round, .vp-totop, .vp-arrow, .contact-btn, .btn-portfolio, .btn-hire, .btn-view-all, .btn-about-services, .btn-submit-contact, .nav-btn, .social-pill'
/** Elements that make the cursor ring grow */
const HOVER_SEL = 'a, button, [role="tab"], select, label, summary, [data-cursor]'

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Milliseconds left before page content should start animating (first-visit intro). */
export const introRemaining = () => Math.max(0, (window.__vpIntroUntil ?? 0) - performance.now())

// Decide once per page load whether the intro plays, before any page component mounts
const playIntro = (() => {
  if (typeof window === 'undefined' || prefersReduced()) return false
  try {
    if (sessionStorage.getItem(INTRO_KEY)) return false
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* storage blocked: still play once for this load */
  }
  window.__vpIntroUntil = performance.now() + INTRO_MS - 400
  document.documentElement.style.setProperty('--vp-enter', `${(INTRO_MS - 350) / 1000}s`)
  return true
})()

/**
 * Site-wide motion: first-visit intro, page-change curtain, scroll progress, back-to-top,
 * custom cursor, magnetic buttons, click bursts, scroll-velocity skew and scroll parallax.
 */
const SiteEffects: React.FC = () => {
  const { pathname } = useLocation()
  const barRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const cursorDot = useRef<HTMLDivElement>(null)
  const cursorRing = useRef<HTMLDivElement>(null)
  const [showTop, setShowTop] = useState(false)
  const [intro, setIntro] = useState(playIntro)
  const [count, setCount] = useState(0)
  const [cursorLabel, setCursorLabel] = useState('')
  const navs = useRef(0)
  const firstPath = useRef(pathname)
  if (pathname !== firstPath.current) {
    firstPath.current = pathname
    navs.current += 1
  }

  // ---------- First-visit intro: counter, then lift ----------
  useEffect(() => {
    if (!intro) return
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / (INTRO_MS - 600), 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) frame = requestAnimationFrame(tick)
    })
    const done = setTimeout(() => {
      setIntro(false)
      document.documentElement.style.removeProperty('--vp-enter')
    }, INTRO_MS + 700)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(done)
    }
  }, [intro])

  // ---------- Scroll: progress, back-to-top, velocity skew, parallax ----------
  useEffect(() => {
    const root = document.documentElement
    const reduce = prefersReduced()
    let parallax: HTMLElement[] = []
    const collect = () => {
      parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    }
    collect()
    const recollect = setTimeout(collect, 400)

    let lastY = window.scrollY
    let velocity = 0
    let frame = 0

    const loop = () => {
      frame = 0
      const y = window.scrollY
      const max = root.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(y / max, 1) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING * (1 - p))
      setShowTop(y > 600)

      if (!reduce) {
        // Smoothed scroll speed drives a skew on the marquee strips
        velocity = velocity * 0.82 + (y - lastY) * 0.18
        lastY = y
        const skew = Math.max(-10, Math.min(10, velocity * 0.35))
        root.style.setProperty('--vp-skew', skew.toFixed(2))

        const vh = window.innerHeight
        for (const el of parallax) {
          const r = el.getBoundingClientRect()
          if (r.bottom < -200 || r.top > vh + 200) continue
          const factor = parseFloat(el.dataset.parallax || '0.1')
          let offset = (r.top + r.height / 2 - vh / 2) * -factor
          // "reveal" only ever lifts content (slides out from beneath), never pushes it down
          if (el.dataset.parallaxMode === 'reveal') offset = Math.min(0, offset)
          el.style.translate = `0 ${offset.toFixed(1)}px`
        }

        // Keep ticking until the skew has settled back to zero
        if (Math.abs(velocity) > 0.05) frame = requestAnimationFrame(loop)
        else root.style.setProperty('--vp-skew', '0')
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      clearTimeout(recollect)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [pathname])

  // ---------- Pointer: custom cursor, magnetic buttons, click bursts ----------
  useEffect(() => {
    if (prefersReduced()) return
    const fine = finePointer()
    const root = document.documentElement
    if (fine) root.classList.add('vp-has-cursor')

    let mx = -100, my = -100, rx = -100, ry = -100
    let magnet: HTMLElement | null = null
    let mTarget = { x: 0, y: 0 }
    let mCurrent = { x: 0, y: 0 }
    let frame = 0

    const releaseMagnet = () => {
      if (!magnet) return
      const el = magnet
      magnet = null
      el.animate([{ translate: `${mCurrent.x}px ${mCurrent.y}px` }, { translate: '0px 0px' }], {
        duration: 650,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      })
      el.style.translate = ''
      mCurrent = { x: 0, y: 0 }
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (cursorRing.current) cursorRing.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      if (magnet) {
        mCurrent.x += (mTarget.x - mCurrent.x) * 0.25
        mCurrent.y += (mTarget.y - mCurrent.y) * 0.25
        magnet.style.translate = `${mCurrent.x.toFixed(2)}px ${mCurrent.y.toFixed(2)}px`
      }
      frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mx = e.clientX
      my = e.clientY
      if (cursorDot.current) cursorDot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      root.classList.remove('vp-cursor-out')

      const target = e.target as Element | null
      const m = target?.closest<HTMLElement>(MAGNET_SEL) ?? null
      if (m !== magnet) {
        releaseMagnet()
        magnet = m
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const strength = r.width > 160 ? 0.18 : 0.32
        mTarget = {
          x: (mx - (r.left + r.width / 2)) * strength,
          y: (my - (r.top + r.height / 2)) * strength,
        }
      }

      const ring = cursorRing.current
      if (ring) {
        const labelled = target?.closest<HTMLElement>('[data-cursor]')
        const typing = target?.closest('input, textarea')
        ring.classList.toggle('is-hover', !!target?.closest(HOVER_SEL) && !labelled)
        ring.classList.toggle('is-label', !!labelled)
        ring.classList.toggle('is-text', !!typing)
        setCursorLabel(labelled?.dataset.cursor ?? '')
      }
    }

    const onDown = (e: PointerEvent) => {
      cursorRing.current?.classList.add('is-down')
      burst(e.clientX, e.clientY)
    }
    const onUp = () => cursorRing.current?.classList.remove('is-down')
    const onLeave = () => {
      root.classList.add('vp-cursor-out')
      releaseMagnet()
    }

    if (fine) frame = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      releaseMagnet()
      root.classList.remove('vp-has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      {intro && (
        <div className="vp-intro" aria-hidden="true">
          <div className="vp-intro-word">
            {'VAUM'.split('').map((c, i) => (
              <span key={i} style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{c}</span>
            ))}
          </div>
          <p className="vp-intro-tag">Branding Studio</p>
          <div className="vp-intro-meter">
            <span style={{ transform: `scaleX(${count / 100})` }} />
          </div>
          <span className="vp-intro-count">{count}%</span>
        </div>
      )}

      {/* Keyed by path so the wipe replays on every page change (not on first load) */}
      {navs.current > 0 && (
        <div className="vp-curtain" key={pathname} aria-hidden="true">
          <div className="vp-curtain-layer vp-curtain-cream" />
          <div className="vp-curtain-layer vp-curtain-maroon">
            <span className="vp-curtain-star" />
          </div>
        </div>
      )}

      <div className="vp-scrollbar" ref={barRef} aria-hidden="true" />

      <div className="vp-cursor-dot" ref={cursorDot} aria-hidden="true" />
      <div className="vp-cursor-ring" ref={cursorRing} aria-hidden="true">
        <span className="vp-cursor-label">{cursorLabel}</span>
      </div>

      <button
        className={`vp-totop ${showTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <svg viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="23" className="vp-totop-track" />
          <circle
            cx="26"
            cy="26"
            r="23"
            className="vp-totop-fill"
            ref={ringRef}
            strokeDasharray={RING}
            strokeDashoffset={RING}
          />
        </svg>
        <span className="vp-totop-arrow">↑</span>
      </button>
    </>
  )
}

/** A small burst of brand-coloured sparks at the click point. */
export function burst(x: number, y: number) {
  const host = document.createElement('div')
  host.className = 'vp-burst'
  host.style.left = `${x}px`
  host.style.top = `${y}px`
  const n = 9
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i')
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.5
    const dist = 26 + Math.random() * 22
    s.style.setProperty('--tx', `${Math.cos(angle) * dist}px`)
    s.style.setProperty('--ty', `${Math.sin(angle) * dist}px`)
    if (i % 3 === 0) s.className = 'star'
    host.appendChild(s)
  }
  document.body.appendChild(host)
  setTimeout(() => host.remove(), 750)
}

export default SiteEffects
