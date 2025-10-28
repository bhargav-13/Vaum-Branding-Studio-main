import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/404'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/services" element={<NotFound />} />
        <Route path="/about" element={<NotFound />} />
        <Route path="/projects" element={<NotFound />} />
        <Route path="/blogs" element={<NotFound />} />
        <Route path="/testimonials" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
