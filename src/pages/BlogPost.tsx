import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { CtaBand, SplitTitle, d } from '../components/Shared/Shared'
import { BLOGS } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import NotFound from './abcd'
import './Pages.css'

const BlogPost: React.FC = () => {
  const { slug } = useParams()
  const post = BLOGS.find((b) => b.slug === slug)
  useReveal([slug])

  if (!post) return <NotFound />
  const related = BLOGS.filter((b) => b.slug !== post.slug).slice(0, 3)

  return (
    <div className="vp-page" key={post.slug}>
      <article className="vp-article">
        <header className="vp-article-head">
          <Link to="/blogs" className="vp-back vp-load" style={d(0)}>← All articles</Link>
          <span className="vp-badge vp-load" style={d(1)}>{post.category}</span>
          <SplitTitle className="vp-hero-title">{post.title}</SplitTitle>
          <div className="vp-author vp-load" style={d(3)}>
            <span className="vp-avatar">VB</span>
            <div>
              <strong>Vachika Bhanderi</strong>
              <span>{post.date} · {post.readTime}</span>
            </div>
          </div>
        </header>

        <p className="vp-article-lead vp-load" style={d(4)}>{post.excerpt}</p>

        {post.body.map((block, i) => (
          <section key={i} data-reveal>
            {block.heading && <h2>{block.heading}</h2>}
            <p>{block.text}</p>
          </section>
        ))}

        <blockquote data-reveal>
          “Design is the silent ambassador of your brand.”
          <cite>— Paul Rand</cite>
        </blockquote>
      </article>

      <section className="vp-section">
        <SplitTitle as="h2" className="vp-h2" data-reveal>Keep <i>reading</i></SplitTitle>
        <div className="vp-blogs">
          {related.map((b, i) => (
            <Link to={`/blogs/${b.slug}`} key={b.slug} className="vp-blog" data-reveal data-cursor="Read" style={d(i)}>
              <div className="vp-blog-thumb">
                <span className="vp-blog-cat">{b.category}</span>
                <span className="vp-blog-initial">{b.title.charAt(0)}</span>
              </div>
              <div className="vp-blog-body">
                <span className="vp-meta">{b.date} · {b.readTime}</span>
                <h3>{b.title}</h3>
                <span className="vp-read">Read more <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  )
}

export default BlogPost
