import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import SiteEffects from '../SiteEffects/SiteEffects'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const KNOWN_ROOTS = ['', 'services', 'about', 'projects', 'blogs', 'testimonials', 'contact']

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname, hash } = useLocation()

  // Start each new page at the top (hash links handle their own scrolling)
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  // Hide the footer only on the 404 page
  const shouldHideFooter = !KNOWN_ROOTS.includes(pathname.split('/')[1] ?? '')

  return (
    <div className="layout">
      <SiteEffects />
      <Header />
      <main className="main-content">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout
