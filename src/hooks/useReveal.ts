import { useEffect } from 'react'

/**
 * Reveals every `[data-reveal]` element (marks it with `data-shown`; an attribute rather
 * than a class so React re-rendering className — e.g. toggling `open` — can't hide it again) on the page when it scrolls into view.
 * Stagger is controlled per element with the `--d` CSS variable (e.g. style={{ '--d': 2 }}).
 * Pass `deps` that change the rendered list (filters, tabs) so new nodes get observed.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])'))
    if (els.length === 0) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-shown', ''))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-shown', '')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Counts a number up from 0 once the element is visible. */
export function useCountUp(selector = '[data-count]') {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (els.length === 0) return

    const run = (el: HTMLElement) => {
      const target = parseInt(el.dataset.count || '0', 10)
      const duration = 1800
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        el.textContent = String(Math.round(eased * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target as HTMLElement)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector])
}

/** Subtle 3D tilt that follows the pointer. Attach with onMouseMove/onMouseLeave. */
export const tiltHandlers = {
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  },
}
