import React, { useCallback, useEffect, useState } from 'react'
import type { GalleryImage } from '../../data/content'
import './Gallery.css'

type CSSVars = React.CSSProperties & Record<string, string | number>

/**
 * Case-study image grid. Clicking an image opens a full-screen viewer that grows
 * out of the clicked thumbnail; arrows / swipe / keyboard step through the set.
 */
export const Gallery: React.FC<{ images: GalleryImage[]; title: string }> = ({ images, title }) => {
  const [open, setOpen] = useState<number | null>(null)
  const [origin, setOrigin] = useState({ x: 0, y: 0, s: 0.4 })
  const [touchX, setTouchX] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, step])

  const openAt = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // Remember where the thumbnail sits so the viewer can zoom out of it
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin({
      x: r.left + r.width / 2 - window.innerWidth / 2,
      y: r.top + r.height / 2 - window.innerHeight / 2,
      s: Math.min(r.width / window.innerWidth, 0.6),
    })
    setOpen(i)
  }

  const current = open !== null ? images[open] : null

  return (
    <>
      <div className="cs-gallery">
        {images.map((img, i) => (
          <button
            key={img.src}
            className={`cs-gallery-item${img.wide ? ' wide' : ''}`}
            onClick={(e) => openAt(i, e)}
            data-reveal
            data-cursor="Zoom"
            style={{ '--d': i % 3 } as CSSVars}
            aria-label={`Open image ${i + 1}${img.caption ? `: ${img.caption}` : ''}`}
          >
            <img src={img.src} alt={img.caption ?? `${title} — image ${i + 1}`} loading="lazy" decoding="async" />
            {img.caption && <span className="cs-gallery-caption">{img.caption}</span>}
          </button>
        ))}
      </div>

      {current && (
        <div
          className="cs-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          onClick={close}
          style={{ '--ox': `${origin.x}px`, '--oy': `${origin.y}px`, '--os': origin.s } as CSSVars}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return
            const dx = e.changedTouches[0].clientX - touchX
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            setTouchX(null)
          }}
        >
          <figure className="cs-lightbox-figure" onClick={(e) => e.stopPropagation()} key={open}>
            <img src={current.src} alt={current.caption ?? title} />
            <figcaption>
              <span>
                {String((open ?? 0) + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              {current.caption}
            </figcaption>
          </figure>

          <button className="cs-lb-btn cs-lb-close" onClick={close} aria-label="Close">
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                className="cs-lb-btn cs-lb-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                className="cs-lb-btn cs-lb-next"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
