import React from 'react'
import { BigWord, PageHero, Eyebrow, CtaBand, PillButton, SplitTitle, d } from '../components/Shared/Shared'
import { PortraitArch } from '../components/HeroArt/HeroArt'
import { useReveal, useCountUp } from '../hooks/useReveal'
import './Pages.css'

const STATS = [
  { value: 20, label: 'Projects Completed' },
  { value: 5, label: 'Industries Covered' },
  { value: 2, label: 'Years of Experience' },
  { value: 100, label: '% Client Satisfaction', noPlus: true },
]

const JOURNEY = [
  { year: '2023', title: 'The first sketch', text: 'Started freelancing with logo and social media design for local businesses.' },
  { year: '2024', title: 'Vaum Branding Studio', text: 'Founded Vaum to offer complete brand identities, from strategy to final files.' },
  { year: '2025', title: 'Going digital', text: 'Expanded into website, app and UI/UX design for startups and growing teams.' },
  { year: 'Today', title: 'Your story next', text: 'Helping brands worldwide build identities people remember.' },
]

const VALUES = [
  { title: 'Listen first', text: 'Your vision guides every decision. I ask questions before I open Figma.' },
  { title: 'Craft the details', text: 'Spacing, kerning, colour — the small things are what make a brand feel premium.' },
  { title: 'Keep it honest', text: 'Clear communication, clear pricing and no surprises along the way.' },
]

const TOOLS = [
  { name: 'Figma', img: '/devicon_figma.jpg' },
  { name: 'Canva', img: '/devicon_canva.jpg' },
  { name: 'Photoshop', img: '/photoshop.jpg' },
  { name: 'InVision', img: '/logos_invision-icon.jpg' },
  { name: 'Sketch', img: '/devicon_sketch.jpg' },
]

const About: React.FC = () => {
  useReveal()
  useCountUp()

  return (
    <div className="vp-page">
      <PageHero
        crumb="About"
        art={<PortraitArch />}
        eyebrow="About Me"
        title={<>Hi, I'm <i>Vachika Bhanderi</i></>}
        description="Graphic designer and founder of Vaum Branding Studio. I help businesses and startups build strong visual identities through thoughtful, impactful design."
      />

      <section className="vp-section vp-about-intro">
        <div className="vp-about-portrait" data-reveal="left">
          <div className="vp-about-frame" data-parallax="0.06">
            <img src="/Mask group.svg" alt="Vachika Bhanderi" />
          </div>
          <span className="vp-about-tag vp-about-tag-1">Brand Strategist</span>
          <span className="vp-about-tag vp-about-tag-2">UI/UX Designer</span>
          <span className="vp-about-tag vp-about-tag-3">Logo Maker</span>
        </div>

        <div data-reveal="right">
          <Eyebrow>My Story</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">Design that <i>connects</i> with people</SplitTitle>
          <p className="vp-lead">
            At Vaum Branding Studio, I craft unique and impactful brand identities that help businesses stand out. From logo
            design and brand strategy to digital creatives, I blend creativity with strategy to deliver designs that inspire
            and connect with your audience.
          </p>
          <p className="vp-lead" style={{ marginTop: '1rem' }}>
            I believe every brand has a story worth telling well. My job is to find it, shape it and give it a look people
            remember.
          </p>
          <div className="vp-about-actions">
            <PillButton to="/start">Work With Me</PillButton>
            <span className="vp-signature">Vachika Bhanderi</span>
          </div>
        </div>
      </section>

      <section className="vp-stats" data-reveal>
        {STATS.map((s, i) => (
          <div key={s.label} className="vp-stat" style={d(i)}>
            <div className="vp-stat-num">
              <span data-count={s.value}>0</span>
              {!s.noPlus && '+'}
            </div>
            <div className="vp-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="vp-section">
        <div className="vp-center-head" data-reveal>

          <BigWord>Journey</BigWord>
          <Eyebrow>My Journey</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">How it <i>all</i> started</SplitTitle>
        </div>
        <ol className="vp-timeline">
          {JOURNEY.map((j, i) => (
            <li key={j.year} className="vp-timeline-item" data-reveal={i % 2 ? 'right' : 'left'}>
              <span className="vp-timeline-dot" />
              <div className="vp-timeline-card">
                <span className="vp-timeline-year">{j.year}</span>
                <h3>{j.title}</h3>
                <p>{j.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="vp-section">
        <div className="vp-center-head" data-reveal>

          <BigWord>Values</BigWord>
          <Eyebrow>What I Believe</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">Values behind <i>every</i> project</SplitTitle>
        </div>
        <div className="vp-values">
          {VALUES.map((v, i) => (
            <div key={v.title} className="vp-value" data-reveal style={d(i)}>
              <img src="/octicon_north-star-24.svg" alt="" />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vp-section">
        <div className="vp-center-head" data-reveal>

          <BigWord>Toolkit</BigWord>
          <Eyebrow>Toolkit</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">Tools I <i>love</i> working with</SplitTitle>
        </div>
        <div className="vp-tools">
          {TOOLS.map((t, i) => (
            <div key={t.name} className="vp-tool" data-reveal="zoom" style={d(i)}>
              <div className="vp-tool-logo">
                <img src={t.img} alt="" />
              </div>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  )
}

export default About
