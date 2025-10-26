import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<div className="page-placeholder"><h1>Services</h1><p>Our services page is coming soon!</p></div>} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<div className="page-placeholder"><h1>Projects</h1><p>Our projects page is coming soon!</p></div>} />
        <Route path="/blogs" element={<div className="page-placeholder"><h1>Blogs</h1><p>Our blogs page is coming soon!</p></div>} />
        <Route path="/testimonials" element={<div className="page-placeholder"><h1>Testimonials</h1><p>Our testimonials page is coming soon!</p></div>} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  )
}

export default App
