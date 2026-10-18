import React, { useEffect, useRef } from 'react'

const GLYPHS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GLYPHS_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const GLYPHS_OTHER = '✦*#%&/+'

const randomLike = (ch: string) => {
  if (/[A-Z]/.test(ch)) return GLYPHS_UPPER[(Math.random() * 26) | 0]
  if (/[a-z]/.test(ch)) return GLYPHS_LOWER[(Math.random() * 26) | 0]
  if (/\s/.test(ch)) return ch
  return GLYPHS_OTHER[(Math.random() * GLYPHS_OTHER.length) | 0]
}

/**
 * Renders its text, then "decodes" it from random glyphs the first time it scrolls into view.
 * The final text is read from the DOM, so any children that render to plain text work.
 */
export const Scramble: React.FC<{ children: React.ReactNode; className?: string; duration?: number }> = ({
  children,
  className,
  duration = 900,
}) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const finalText = el.textContent ?? ''
    if (!finalText.trim()) return

    let frame = 0
    const run = () => {
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        // Characters lock in left to right; the rest keep flickering
        const locked = Math.floor(p * finalText.length)
        let out = ''
        for (let i = 0; i < finalText.length; i++) {
          out += i < locked ? finalText[i] : randomLike(finalText[i])
        }
        el.textContent = out
        if (p < 1) frame = requestAnimationFrame(step)
        else el.textContent = finalText
      }
      frame = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          run()
        }
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      el.textContent = finalText
    }
  }, [duration])

  return (
    <span ref={ref} className={className} aria-label={typeof children === 'string' ? children : undefined}>
      {children}
    </span>
  )
}
