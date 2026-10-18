import React, { useRef, useState } from 'react'
import { BigWord, PageHero, Eyebrow, PillButton, SplitTitle, d } from '../components/Shared/Shared'
import { HelloCycle } from '../components/HeroArt/HeroArt'
import { FAQS } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { burst } from '../components/SiteEffects/SiteEffects'
import './Pages.css'

const WHATSAPP_NUMBER = '919727344394'

const EMPTY = { name: '', email: '', phone: '', interest: '', budget: '', country: '', message: '' }

const CHANNELS = [
  {
    label: 'Email',
    value: 'vaum.branding@gmail.com',
    href: 'mailto:vaum.branding@gmail.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3,7 12,13 21,7" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: 'Chat with me',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 20l1.2-5.3A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@vaum.studio',
    href: 'https://instagram.com/vaum.studio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

const Contact: React.FC = () => {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const sendRef = useRef<HTMLButtonElement>(null)
  useReveal()

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `*New Contact Form Submission*

*Name:* ${form.name}
*Email:* ${form.email}
*Phone:* ${form.phone}
*Interest:* ${form.interest}
*Budget:* ${form.budget}
*Country:* ${form.country}

*Message:*
${form.message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setForm(EMPTY)
    setSent(true)
    // Celebrate: a few staggered spark bursts around the button
    const r = sendRef.current?.getBoundingClientRect()
    if (r && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ;[0, 120, 240].forEach((delay, i) =>
        setTimeout(() => burst(r.left + r.width * (0.3 + i * 0.25), r.top + r.height / 2), delay)
      )
    }
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="vp-page">
      <PageHero
        crumb="Contact"
        art={<HelloCycle />}
        eyebrow="Get In Touch"
        title={<>Let's talk about your <i>next project</i></>}
        description="Whether you need branding, a website or digital design, I'd love to hear about it. Share a few details and I'll reply within 24 hours."
      />

      <div className="vp-guided" data-reveal>
        <p>
          <b>Prefer a guided brief?</b> Answer 4 quick questions and send everything in one go.
        </p>
        <PillButton to="/start">Start a Project</PillButton>
      </div>

      <div className="vp-channels">
        {CHANNELS.map((c, i) => (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="vp-channel" data-reveal style={d(i)}>
            <span className="vp-channel-icon">{c.icon}</span>
            <span className="vp-channel-label">{c.label}</span>
            <strong>{c.value}</strong>
          </a>
        ))}
      </div>

      <section className="vp-section vp-contact">
        <div className="vp-contact-aside" data-reveal="left">
          <Eyebrow>Start a Project</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">Tell me a little <i>about it</i></SplitTitle>
          <p className="vp-lead">
            The more you share, the better I can understand your goals. Your message opens in WhatsApp so we can chat
            right away.
          </p>
          <ul className="vp-checks vp-checks-plain">
            <li><span className="vp-check" aria-hidden="true">✓</span>Reply within 24 hours</li>
            <li><span className="vp-check" aria-hidden="true">✓</span>Free first consultation</li>
            <li><span className="vp-check" aria-hidden="true">✓</span>Clear quote, no hidden costs</li>
          </ul>
        </div>

        <form className="vp-form" onSubmit={onSubmit} data-reveal="right">
          <div className="vp-form-grid">
            <label className="vp-field">
              <span>Your Name*</span>
              <input name="name" value={form.name} onChange={onChange} placeholder="Ex. Darshil Patel" required />
            </label>
            <label className="vp-field">
              <span>Email*</span>
              <input type="email" name="email" value={form.email} onChange={onChange} placeholder="example@gmail.com" required />
            </label>
            <label className="vp-field">
              <span>Phone*</span>
              <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="Enter phone number" required />
            </label>
            <label className="vp-field">
              <span>I'm Interested in*</span>
              <select name="interest" value={form.interest} onChange={onChange} required>
                <option value="" disabled>Select</option>
                <option>Branding</option>
                <option>Website Design</option>
                <option>Application Design</option>
                <option>Logo Design</option>
                <option>Other</option>
              </select>
            </label>
            <label className="vp-field">
              <span>Budget Range*</span>
              <select name="budget" value={form.budget} onChange={onChange} required>
                <option value="" disabled>Select range</option>
                <option>$200 - $500</option>
                <option>$500 - $1000</option>
                <option>$1000 - $2500</option>
                <option>$2500+</option>
              </select>
            </label>
            <label className="vp-field">
              <span>Country*</span>
              <select name="country" value={form.country} onChange={onChange} required>
                <option value="" disabled>Select country</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Other</option>
              </select>
            </label>
          </div>
          <label className="vp-field">
            <span>Your Message*</span>
            <textarea name="message" value={form.message} onChange={onChange} placeholder="Tell me about your project..." required />
          </label>
          <div className="vp-form-foot">
            <button type="submit" className={`vp-pill vp-submit ${sent ? 'is-sent' : ''}`} ref={sendRef}>
              <span className="vp-pill-label">
                <span className="vp-send-text">Send Message</span>
                <span className="vp-send-done" aria-hidden={!sent}>Sent ✓</span>
              </span>
              <span className="vp-pill-cap">
                <span className="vp-pill-puck"><img src="/bullet-point.gif" alt="" /></span>
              </span>
            </button>
            <span className={`vp-sent ${sent ? 'show' : ''}`} role="status">
              ✓ Opening WhatsApp — talk soon!
            </span>
          </div>
        </form>
      </section>

      <section className="vp-section">
        <div className="vp-center-head" data-reveal>

          <BigWord>FAQ</BigWord>
          <Eyebrow>FAQ</Eyebrow>
          <SplitTitle as="h2" className="vp-h2">Questions, <i>answered</i></SplitTitle>
        </div>
        <div className="vp-faqs">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`vp-faq ${openFaq === i ? 'open' : ''}`} data-reveal style={d(i)}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                {f.q}
                <span className="vp-plus" aria-hidden="true" />
              </button>
              <div className="vp-faq-body">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Contact
