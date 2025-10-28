import React from 'react'
import './NotFound.css'

const abcd: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-description">
            Oops! The page you're looking for doesn't exist. 
            It might have been moved or deleted.
          </p>
          <a href="/" className="btn-home">
            <span>Go Back Home</span>
            <div className="home-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45212B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default abcd


