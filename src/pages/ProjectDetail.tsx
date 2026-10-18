import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Eyebrow, CtaBand, ProjectCover, SplitTitle, d } from '../components/Shared/Shared'
import { PROJECTS } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { Gallery } from '../components/CaseStudy/Gallery'
import NotFound from './abcd'
import './Pages.css'

/** Which brief option to pre-select when starting a project from a case study */
const START_SERVICE: Record<string, string> = {
  Branding: 'Logo & Identity',
  Website: 'Website Design',
  Application: 'App Design',
  Print: 'Brochure & Print',
}

const ProjectDetail: React.FC = () => {
  const { slug } = useParams()
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  useReveal([slug])

  if (index === -1) return <NotFound />
  const p = PROJECTS[index]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  return (
    <div className="vp-page" key={p.slug}>
      <section className="vp-detail-head">
        <Link to="/projects" className="vp-back vp-load" style={d(0)}>← All projects</Link>
        <Eyebrow className="vp-load" style={d(1)}>{p.category} · {p.year}</Eyebrow>
        <SplitTitle className="vp-hero-title">{p.title}</SplitTitle>
        <p className="vp-hero-desc vp-load" style={d(3)}>{p.summary}</p>
      </section>

      <div className="vp-detail-cover" data-parallax="0.04">
        <ProjectCover reveal image={p.coverImage} kind={p.cover} mark={p.mark} palette={p.palette} label={`${p.client} cover`} />
      </div>

      <section className="vp-detail-info">
        <dl className="vp-detail-facts" data-reveal="left">
          <div><dt>Client</dt><dd>{p.client}</dd></div>
          <div><dt>Category</dt><dd>{p.category}</dd></div>
          <div><dt>Year</dt><dd>{p.year}</dd></div>
          <div>
            <dt>Services</dt>
            <dd className="vp-tags">{p.services.map((s) => <span key={s}>{s}</span>)}</dd>
          </div>
          {p.link && (
            <div>
              <dt>Live</dt>
              <dd>
                <a href={p.link} target="_blank" rel="noreferrer" className="vp-live-link">
                  View project ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
        <div className="vp-detail-story">
          <div data-reveal>
            <h2 className="vp-h3">The <i>Challenge</i></h2>
            <p className="vp-lead">{p.challenge}</p>
          </div>
          <div data-reveal style={d(1)}>
            <h2 className="vp-h3">The <i>Solution</i></h2>
            <p className="vp-lead">{p.solution}</p>
          </div>
        </div>
      </section>

      {p.gallery && p.gallery.length > 0 && (
        <section className="vp-section">
          <SplitTitle as="h2" className="vp-h2" data-reveal>
            Inside the <i>project</i>
          </SplitTitle>
          <Gallery images={p.gallery} title={p.title} />
        </section>
      )}

      <section className="vp-similar" data-reveal>
        <div>
          <span className="vp-similar-kicker">Like what you see?</span>
          <h3>
            Let's create something like <i>{p.title}</i> for your brand.
          </h3>
        </div>
        <Link to={`/start?service=${encodeURIComponent(START_SERVICE[p.category])}`} className="vp-pill">
          <span className="vp-pill-label">Start a Similar Project</span>
          <span className="vp-pill-cap">
            <span className="vp-pill-puck">
              <img src="/bullet-point.gif" alt="" />
            </span>
          </span>
        </Link>
      </section>

      <Link to={`/projects/${next.slug}`} className="vp-next vp-hover" data-reveal data-cursor="Next">
        <div>
          <span>Next project</span>
          <h3>{next.title}</h3>
        </div>
        <div className="vp-next-cover">
          <ProjectCover image={next.coverImage} kind={next.cover} mark={next.mark} palette={next.palette} label={`${next.client} cover`} />
        </div>
      </Link>

      <CtaBand />
    </div>
  )
}

export default ProjectDetail
