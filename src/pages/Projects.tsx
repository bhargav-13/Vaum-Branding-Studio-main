import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero, CtaBand, ProjectCover, d } from '../components/Shared/Shared'
import { CoverDeck } from '../components/HeroArt/HeroArt'
import { PROJECTS } from '../data/content'
import { useReveal, tiltHandlers } from '../hooks/useReveal'
import { ProjectIndex } from '../components/Showcase/Showcase'
import './Pages.css'

const FILTERS = ['All', 'Branding', 'Website', 'Application', 'Print'] as const

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const list = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
  useReveal([filter])

  return (
    <div className="vp-page">
      <PageHero
        crumb="Projects"
        art={<CoverDeck />}
        eyebrow="Selected Work"
        title={<>Projects crafted with <i>purpose</i></>}
        description="A look at brands, websites and apps I've helped bring to life. Each one started with a conversation and ended with an identity the client is proud of."
      />

      <div className="vp-chips" role="tablist" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`vp-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="vp-projects" key={filter}>
        {list.map((p, i) => (
          <Link
            to={`/projects/${p.slug}`}
            key={p.slug}
            className={`vp-project vp-hover vp-tilt ${i % 3 === 0 ? 'wide' : ''}`}
            data-reveal
            data-cursor="View"
            style={d(i % 2)}
            {...tiltHandlers}
          >
            <ProjectCover reveal image={p.coverImage} kind={p.cover} mark={p.mark} palette={p.palette} label={`${p.client} cover`} />
            <div className="vp-project-meta">
              <div>
                <span className="vp-project-cat">{p.category} · {p.year}</span>
                <h3>{p.title}</h3>
                <p>{p.client}</p>
              </div>
              <span className="vp-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>

      <ProjectIndex />

      <CtaBand />
    </div>
  )
}

export default Projects
