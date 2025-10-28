import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import abcd from './pages/abcd'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/services" element={React.createElement(abcd)} />
        <Route path="/about" element={React.createElement(abcd)} />
        <Route path="/projects" element={React.createElement(abcd)} />
        <Route path="/blogs" element={React.createElement(abcd)} />
        <Route path="/testimonials" element={React.createElement(abcd)} />
        <Route path="*" element={React.createElement(abcd)} />
      </Routes>
    </Layout>
  )
}

export default App
