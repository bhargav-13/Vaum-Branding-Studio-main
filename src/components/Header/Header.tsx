import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  // Compact header once scrolled; slide it away while scrolling down, bring it back on scroll up
  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setIsScrolled(y > 40)
      if (Math.abs(y - lastY) > 6) {
        setIsHidden(y > lastY && y > 320)
        lastY = y
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLinkClick = () => {
    closeMobileMenu()
  }

  return (
    <header className={`header${isScrolled ? ' is-scrolled' : ''}${isHidden && !isMobileMenuOpen ? ' is-hidden' : ''}`}>
      <div className="header-container">
        {/* Desktop Navigation */}
        <nav className="nav-left">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            <img src="/Vecto1r.svg" alt="Home" className="home-icon" />
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Services
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            About
          </NavLink>
        </nav>

        {/* Center Logo */}
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src="/Logo.svg" alt="VAUM" className="logo-img desktop-logo" />
          <img src="/mobile-logoo.svg" alt="VAUM" className="logo-img mobile-logo" />
        </Link>

        {/* Desktop Right Navigation */}
        <nav className="nav-right">
          <NavLink to="/projects" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Projects
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Blogs
          </NavLink>
          <NavLink to="/testimonials" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Testimonials
          </NavLink>
        </nav>

        {/* Desktop Contact Button */}
        <div className="header-actions">
          <NavLink to="/contact" className={({ isActive }) => `contact-btn${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Contact Me
          </NavLink>
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
          <NavLink to="/" end className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Services
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            About
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Projects
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Blogs
          </NavLink>
          <NavLink to="/testimonials" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Testimonials
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link mobile-contact-btn${isActive ? ' active' : ''}`} onClick={handleLinkClick}>
            Contact Me
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
