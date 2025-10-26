import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  
  // Hide footer on 404 pages (services, about, projects, blogs, testimonials, contact)
  const hideFooterPaths = ['/services', '/about', '/projects', '/blogs', '/testimonials', '/contact']
  const shouldHideFooter = hideFooterPaths.includes(location.pathname)
  
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout
