// Site content for the inner pages. Replace sample entries with real work as it becomes available.

export type CoverKind = 'logo' | 'web' | 'app' | 'brochure' | 'social'

export interface ServiceItem {
  id: string
  title: string
  icon: string
  short: string
  description: string
  deliverables: string[]
}

export interface ProjectItem {
  slug: string
  title: string
  client: string
  category: 'Branding' | 'Website' | 'Application' | 'Print'
  year: string
  cover: CoverKind
  mark: string
  palette: [string, string]
  summary: string
  challenge: string
  solution: string
  services: string[]
}

export interface BlogItem {
  slug: string
  title: string
  category: string
  date: string
  readTime: string
  excerpt: string
  body: { heading?: string; text: string }[]
}

export interface TestimonialItem {
  name: string
  role: string
  quote: string
  rating: number
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    icon: '/computer (1).gif',
    short: 'User-friendly, visually appealing digital experiences.',
    description:
      'Research-led interfaces that feel effortless. I map user journeys, build wireframes and turn them into polished, consistent screens your users enjoy coming back to.',
    deliverables: ['User flows', 'Wireframes', 'High-fidelity UI', 'Design system'],
  },
  {
    id: 'application',
    title: 'Application Design',
    icon: '/vector (1).gif',
    short: 'Intuitive mobile and desktop applications.',
    description:
      'From onboarding to the smallest micro-interaction, I design mobile and desktop apps that are clear, efficient and ready to hand off to developers.',
    deliverables: ['iOS & Android screens', 'Interactive prototype', 'Component library', 'Dev hand-off'],
  },
  {
    id: 'website',
    title: 'Website Design',
    icon: '/web-design (1).gif',
    short: 'Modern, responsive websites that convert.',
    description:
      'Websites that tell your story and guide visitors to act. Every layout is designed mobile-first, on-brand and built around a clear content hierarchy.',
    deliverables: ['Sitemap', 'Responsive layouts', 'Landing pages', 'Figma prototype'],
  },
  {
    id: 'logo',
    title: 'Logo & Brand Identity',
    icon: '/computer (1).gif',
    short: 'Memorable marks and complete visual identities.',
    description:
      'A logo is the front door of your brand. I craft distinctive marks and extend them into colour, type and usage rules so your brand stays consistent everywhere.',
    deliverables: ['Logo suite', 'Colour palette', 'Typography', 'Brand guidelines'],
  },
  {
    id: 'brochure',
    title: 'Brochure & Print',
    icon: '/vector (1).gif',
    short: 'Print collateral that feels premium in hand.',
    description:
      'Brochures, catalogues, business cards and packaging designed with print-ready precision and a layout that makes your offer easy to understand.',
    deliverables: ['Brochures', 'Catalogues', 'Stationery', 'Print-ready files'],
  },
  {
    id: 'prototype',
    title: 'Wireframes & Prototypes',
    icon: '/web-design (1).gif',
    short: 'Test ideas quickly before you build.',
    description:
      'Clickable prototypes that let you validate ideas with real users and stakeholders early, saving time and budget during development.',
    deliverables: ['Low-fi wireframes', 'Clickable prototype', 'Usability notes', 'Iteration rounds'],
  },
]

export const PROCESS = [
  { step: '01', title: 'Discover', text: 'We talk about your goals, audience and competitors to find what makes you different.' },
  { step: '02', title: 'Define', text: 'Moodboards, direction and structure — we agree on the path before pixels are pushed.' },
  { step: '03', title: 'Design', text: 'Concepts come to life. You get thoughtful options and clear reasoning behind each one.' },
  { step: '04', title: 'Deliver', text: 'Refined final files, guidelines and support so your brand launches with confidence.' },
]

export const PROJECTS: ProjectItem[] = [
  {
    slug: 'delight-autoforge',
    title: 'Forged in Precision',
    client: 'Delight Autoforge',
    category: 'Branding',
    year: '2025',
    cover: 'logo',
    mark: 'DA',
    palette: ['#45212B', '#EDE8D0'],
    summary: 'A bold industrial identity for an automotive forging company.',
    challenge: 'The brand had no clear direction and many competing ideas about how it should look.',
    solution: 'A strong monogram, a confident colour system and guidelines that unify every touchpoint.',
    services: ['Logo Design', 'Brand Identity', 'Stationery'],
  },
  {
    slug: 'codelix-it-solutions',
    title: 'Code with Character',
    client: 'Codelix IT Solutions',
    category: 'Website',
    year: '2025',
    cover: 'web',
    mark: 'CX',
    palette: ['#2E1A20', '#E5DBAB'],
    summary: 'A personality-rich website for a growing software studio.',
    challenge: 'Their old site looked generic and did not reflect the team’s creativity.',
    solution: 'A modern responsive site with expressive type and a clear path to enquiries.',
    services: ['Website Design', 'UI/UX Design', 'Prototype'],
  },
  {
    slug: 'sabhaya-solutions',
    title: 'Clarity in Every Tap',
    client: 'Sabhaya Solutions',
    category: 'Application',
    year: '2024',
    cover: 'app',
    mark: 'SS',
    palette: ['#5A2A35', '#F5F0D8'],
    summary: 'A clean dashboard app that makes complex data feel simple.',
    challenge: 'Users were overwhelmed by dense screens and unclear navigation.',
    solution: 'A calm interface with focused flows, a reusable component library and an interactive prototype.',
    services: ['Application Design', 'UI/UX Design', 'Design System'],
  },
  {
    slug: 'bloom-cafe',
    title: 'Bloom Café Menu',
    client: 'Bloom Café (sample)',
    category: 'Print',
    year: '2024',
    cover: 'brochure',
    mark: 'B',
    palette: ['#3A1E26', '#EDE8D0'],
    summary: 'A warm menu and brochure set for a neighbourhood café.',
    challenge: 'The menu was cluttered and hard to read at a glance.',
    solution: 'A tidy grid, friendly illustrations and a tri-fold brochure for takeaway.',
    services: ['Brochure Design', 'Print'],
  },
  {
    slug: 'aura-skincare',
    title: 'Aura Skincare',
    client: 'Aura (sample)',
    category: 'Branding',
    year: '2024',
    cover: 'social',
    mark: 'A',
    palette: ['#45212B', '#E5DBAB'],
    summary: 'A soft, elegant identity and social kit for a skincare label.',
    challenge: 'A new label needed to stand out in a crowded, look-alike market.',
    solution: 'A refined wordmark, gentle palette and social templates that keep the feed consistent.',
    services: ['Logo Design', 'Social Media Kit'],
  },
  {
    slug: 'nomad-travel',
    title: 'Nomad Travel',
    client: 'Nomad (sample)',
    category: 'Website',
    year: '2023',
    cover: 'web',
    mark: 'N',
    palette: ['#2E1A20', '#EDE8D0'],
    summary: 'An inspiring booking website for curated travel experiences.',
    challenge: 'Visitors browsed but rarely booked.',
    solution: 'Story-driven landing pages and a simplified booking flow.',
    services: ['Website Design', 'Wireframes'],
  },
]

export const BLOGS: BlogItem[] = [
  {
    slug: 'what-makes-a-logo-memorable',
    title: 'What Makes a Logo Truly Memorable?',
    category: 'Branding',
    date: 'Sep 12, 2026',
    readTime: '4 min read',
    excerpt: 'Simplicity, relevance and timelessness — the three qualities every lasting logo shares.',
    body: [
      { text: 'A memorable logo is rarely the most complex one. The marks we remember are simple enough to sketch from memory, yet distinctive enough to belong to only one brand.' },
      { heading: 'Keep it simple', text: 'Strip away anything that does not help recognition. A simple shape scales from a favicon to a billboard without losing its character.' },
      { heading: 'Make it relevant', text: 'Your logo should feel right for your audience and industry, but it should not copy what everyone else is doing.' },
      { heading: 'Design for the long run', text: 'Trends fade quickly. Choose forms and type that will still feel right in ten years.' },
    ],
  },
  {
    slug: 'ui-ux-basics-for-founders',
    title: 'UI vs UX: A Simple Guide for Founders',
    category: 'UI/UX',
    date: 'Aug 28, 2026',
    readTime: '5 min read',
    excerpt: 'UI is how it looks, UX is how it works. Here is why your product needs both from day one.',
    body: [
      { text: 'Founders often use UI and UX interchangeably, but they solve different problems. Understanding both helps you brief designers and make better product decisions.' },
      { heading: 'UX is the journey', text: 'User experience is about flows, structure and removing friction. It answers: can people achieve their goal easily?' },
      { heading: 'UI is the surface', text: 'User interface is the visual layer — colour, type, spacing and components. It answers: does this feel trustworthy and clear?' },
      { heading: 'Why both matter', text: 'A beautiful app that is confusing loses users. A usable app that looks dated loses trust. Great products balance both.' },
    ],
  },
  {
    slug: 'choosing-brand-colours',
    title: 'How to Choose Colours for Your Brand',
    category: 'Branding',
    date: 'Aug 02, 2026',
    readTime: '3 min read',
    excerpt: 'Colour shapes how people feel about your brand before they read a single word.',
    body: [
      { text: 'Colour is one of the fastest ways to communicate personality. The right palette builds recognition; the wrong one sends mixed signals.' },
      { heading: 'Start with emotion', text: 'Decide how you want people to feel — calm, energetic, premium, playful — and pick hues that support it.' },
      { heading: 'Limit the palette', text: 'One primary, one secondary and a few neutrals are usually enough. Fewer colours make a stronger identity.' },
      { heading: 'Check contrast', text: 'Make sure text stays readable on every background so your brand works for everyone.' },
    ],
  },
  {
    slug: 'website-design-checklist',
    title: 'The Website Design Checklist Before Launch',
    category: 'Web Design',
    date: 'Jul 15, 2026',
    readTime: '6 min read',
    excerpt: 'Ten quick checks that make the difference between a good site and a great one.',
    body: [
      { text: 'Launch day is exciting, but a few small details can make or break a first impression. Run through this list before you go live.' },
      { heading: 'Mobile first', text: 'Most visitors arrive on a phone. Test every page on small screens before anything else.' },
      { heading: 'Clear calls to action', text: 'Every page should make the next step obvious — contact, buy, book or learn more.' },
      { heading: 'Speed and images', text: 'Compress images and remove what you do not need. A fast site feels more professional.' },
    ],
  },
  {
    slug: 'power-of-print',
    title: 'Why Print Still Matters in a Digital World',
    category: 'Print',
    date: 'Jun 30, 2026',
    readTime: '4 min read',
    excerpt: 'A well-designed brochure creates a tangible connection no screen can replace.',
    body: [
      { text: 'Print gives your brand a physical presence. People keep beautiful brochures and cards long after they have closed a browser tab.' },
      { heading: 'Tactile trust', text: 'Paper, finish and weight communicate quality instantly.' },
      { heading: 'Focused attention', text: 'Print has no notifications. Readers give it their full attention.' },
    ],
  },
  {
    slug: 'figma-workflow-tips',
    title: 'My Favourite Figma Workflow Tips',
    category: 'UI/UX',
    date: 'Jun 10, 2026',
    readTime: '5 min read',
    excerpt: 'Auto layout, components and variables — small habits that save hours on every project.',
    body: [
      { text: 'Figma is where most of my design work happens. These habits keep files tidy and hand-offs smooth.' },
      { heading: 'Auto layout everything', text: 'Responsive frames adapt as content changes, so you spend less time nudging pixels.' },
      { heading: 'Build components early', text: 'Buttons, inputs and cards as components mean one change updates the whole file.' },
      { heading: 'Use variables', text: 'Colour and spacing variables make theming and dark mode far easier.' },
    ],
  },
]

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Harsh Vora',
    role: 'Founder, Delight Autoforge',
    quote:
      'Working with Vaum Studio was honestly the best decision we made for our brand. We had so many ideas but no clear direction, and they just got it. The team really listened, brought fresh ideas, and turned everything into something that felt so us.',
    rating: 5,
  },
  {
    name: 'Manas Vadodaria',
    role: 'CEO, Codelix It Solutions',
    quote:
      "Vaum Studio totally nailed it. They didn't just make our brand look good — they gave it personality. The whole process felt super smooth, and since launching our new look we've seen a huge boost in how people connect with our brand.",
    rating: 5,
  },
  {
    name: 'Yash Sabhaya',
    role: 'CTO, Sabhaya Solutions',
    quote:
      "The team at Vaum Studio just gets it. They turned our ideas into something beautiful and meaningful. We feel much more confident showing off our brand now, and it's been a total game-changer for our business.",
    rating: 5,
  },
]

export const FAQS = [
  { q: 'How long does a branding project take?', a: 'Most logo and identity projects take 2–4 weeks, depending on scope and feedback rounds.' },
  { q: 'Do you work with clients outside India?', a: 'Yes! I work with clients worldwide. Everything is handled online through calls, email and shared Figma files.' },
  { q: 'How many revisions are included?', a: 'Every project includes structured revision rounds so you get a result you love without endless back-and-forth.' },
  { q: 'What do I receive at the end?', a: 'All final files in the formats you need (AI, SVG, PNG, PDF, Figma), plus guidelines where relevant.' },
  { q: 'How do I get started?', a: 'Fill in the contact form or message on WhatsApp with a few details about your project, and I will get back within 24 hours.' },
]
