import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'

const STARS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: 10 + ((i * 7) % 22),
  delay: `${(i % 7) * 0.6}s`,
  dur: `${6 + (i % 5) * 1.5}s`,
}))

const abcd: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="nf-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
      </div>

      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="error-code nf-glitch" data-text="404">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-description">
            Oops! The page you're looking for doesn't exist.
            It might have been moved or deleted.
          </p>
          <Link to="/" className="btn-home">
            <span>Go Back Home</span>
            <div className="home-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45212B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default abcd
