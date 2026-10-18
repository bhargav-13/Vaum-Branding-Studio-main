import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero, CtaBand, d } from '../components/Shared/Shared'
import { TypeSpecimen } from '../components/HeroArt/HeroArt'
import { BLOGS } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import './Pages.css'

const Blogs: React.FC = () => {
  const categories = useMemo(() => ['All', ...Array.from(new Set(BLOGS.map((b) => b.category)))], [])
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')
  useReveal([cat, query])

  const list = BLOGS.filter(
    (b) =>
      (cat === 'All' || b.category === cat) &&
      (b.title + b.excerpt).toLowerCase().includes(query.trim().toLowerCase())
  )
  const [featured, ...rest] = BLOGS

  return (
    <div className="vp-page">
      <PageHero
        crumb="Blogs"
        art={<TypeSpecimen />}
        eyebrow="Journal"
        title={<>Ideas, tips &amp; <i>design</i> stories</>}
        description="Notes on branding, UI/UX and the creative process — written to help founders and fellow designers make better design decisions."
      />

      <Link to={`/blogs/${featured.slug}`} className="vp-featured vp-hover" data-reveal data-cursor="Read">
        <div className="vp-featured-art" aria-hidden="true">
          <span className="vp-featured-ring" />
          <img src="/octicon_north-star-24.svg" alt="" />
          <span className="vp-featured-word" data-parallax="0.12">Aa</span>
        </div>
        <div className="vp-featured-body">
          <span className="vp-badge">Featured · {featured.category}</span>
          <h2>{featured.title}</h2>
          <p>{featured.excerpt}</p>
          <span className="vp-meta">{featured.date} · {featured.readTime}</span>
          <span className="vp-read">Read article <span aria-hidden="true">→</span></span>
        </div>
      </Link>

      <div className="vp-blog-tools">
        <div className="vp-chips vp-chips-left" role="tablist" aria-label="Filter articles">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              className={`vp-chip ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="vp-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search articles"
          />
        </label>
      </div>

      <div className="vp-blogs" key={cat + query}>
        {(cat === 'All' && !query ? rest : list).map((b, i) => (
          <Link to={`/blogs/${b.slug}`} key={b.slug} className="vp-blog" data-reveal data-cursor="Read" style={d(i % 3)}>
            <div className="vp-blog-thumb">
              <span className="vp-blog-cat">{b.category}</span>
              <span className="vp-blog-initial">{b.title.charAt(0)}</span>
            </div>
            <div className="vp-blog-body">
              <span className="vp-meta">{b.date} · {b.readTime}</span>
              <h3>{b.title}</h3>
              <p>{b.excerpt}</p>
              <span className="vp-read">Read more <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        ))}
        {list.length === 0 && <p className="vp-empty">No articles match your search yet.</p>}
      </div>

      <CtaBand />
    </div>
  )
}

export default Blogs
