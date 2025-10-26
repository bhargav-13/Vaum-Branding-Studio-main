import React, { useState } from 'react'
import './Header.css'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    closeMobileMenu()
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Desktop Navigation */}
        <nav className="nav-left">
          <a href="/" className="nav-link" onClick={handleLinkClick}>
            <img src="/Vecto1r.svg" alt="Home" className="home-icon" />
          </a>
          <a href="/services" className="nav-link" onClick={handleLinkClick}>
            Services
          </a>
          <a href="/about" className="nav-link" onClick={handleLinkClick}>
            About
          </a>
        </nav>

        {/* Center Logo */}
        <a href="/" className="logo" onClick={handleLinkClick}>
          <img src="/Logo.svg" alt="VAUM" className="logo-img desktop-logo" />
          <img src="/mobile.svg" alt="VAUM" className="logo-img mobile-logo" />
        </a>

        {/* Desktop Right Navigation */}
        <nav className="nav-right">
          <a href="/projects" className="nav-link" onClick={handleLinkClick}>
            Projects
          </a>
          <a href="/blogs" className="nav-link" onClick={handleLinkClick}>
            Blogs
          </a>
          <a href="/testimonials" className="nav-link" onClick={handleLinkClick}>
            Testimonials
          </a>
        </nav>

        {/* Desktop Contact Button */}
        <div className="header-actions">
          <a href="/contact" className="contact-btn" onClick={handleLinkClick}>
            Contact Me
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="mobile-nav">
          <a href="/" className="mobile-nav-link" onClick={handleLinkClick}>
            Home
          </a>
          <a href="/services" className="mobile-nav-link" onClick={handleLinkClick}>
            Services
          </a>
          <a href="/about" className="mobile-nav-link" onClick={handleLinkClick}>
            About
          </a>
          <a href="/projects" className="mobile-nav-link" onClick={handleLinkClick}>
            Projects
          </a>
          <a href="/blogs" className="mobile-nav-link" onClick={handleLinkClick}>
            Blogs
          </a>
          <a href="/testimonials" className="mobile-nav-link" onClick={handleLinkClick}>
            Testimonials
          </a>
          <a href="/contact" className="mobile-nav-link mobile-contact-btn" onClick={handleLinkClick}>
            Contact Me
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
