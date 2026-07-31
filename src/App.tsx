import { useState, useEffect, useRef } from 'react'
import { jsPDF } from 'jspdf'

/* ─── Scroll reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Active section detection ─── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const obs = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id) },
        { threshold: 0.25, rootMargin: '-60px 0px -60% 0px' }
      )
      o.observe(el)
      return o
    })
    return () => obs.forEach(o => o?.disconnect())
  }, [ids])
  return active
}

/* ─── Vent slots decoration ─── */
function Vents({ count = 4 }: { count?: number }) {
  return (
    <div className="vents" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => <div key={i} className="vent" />)}
    </div>
  )
}

/* ─── Corner screws decoration ─── */
function Screw({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 10, height: 10, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #d4d8df 0%, #bdc3cc 40%, #a8afbb 100%)',
        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.65), inset -1px -1px 2px rgba(0,0,0,0.15)',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

/* ─── Navbar ─── */
const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'training', label: 'Training' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

function Navbar({
  onContactClick,
  onHireMeClick
}: {
  onContactClick?: (e: React.MouseEvent) => void
  onHireMeClick?: (e: React.MouseEvent) => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(NAV_LINKS.map(l => l.id))

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 24px',
        background: '#e0e5ec',
        boxShadow: scrolled ? '0 4px 20px rgba(186,190,204,0.7), 0 -2px 0 rgba(255,255,255,0.9) inset' : 'none',
        transition: 'box-shadow 0.35s ease',
        borderBottom: scrolled ? '1px solid rgba(186,190,204,0.5)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          aria-label="Go to top"
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#e0e5ec',
            boxShadow: '4px 4px 8px #babecc, -4px -4px 8px #ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 800, color: '#ff4757',
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
          }}>
            UC
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Uday Chatterjee</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--foreground-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Software Developer</div>
          </div>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hide-mobile">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-link${active === link.id ? ' active' : ''}`}
              aria-current={active === link.id ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* LED */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hide-mobile">
            <span className="led" aria-hidden="true" />
            <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Available</span>
          </div>
          <a href="mailto:udaychatterjee2003@gmail.com?subject=Opportunity:%20Software%20Developer%20Inquiry&body=Hi%20Uday,%0D%0A%0D%0AWe%20came%20across%20your%20portfolio%20and%20are%20impressed%20with%20your%20technical%20background%20as%20a%20Software%20Developer.%20We%20would%20love%20to%20discuss%20a%20potential%20opportunity%20with%20you.%0D%0A%0D%0APlease%20let%20us%20know%20your%20availability%20for%20a%20brief%20call.%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]%0D%0A[Your%20Company]" onClick={onHireMeClick} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.72rem' }}>
            Hire Me
          </a>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="show-mobile"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              background: 'var(--background)',
              border: 'none',
              borderRadius: 10,
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              boxShadow: menuOpen ? 'var(--shadow-pressed)' : 'var(--shadow-card)',
              transition: 'box-shadow 150ms ease',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 18, height: 2,
                background: 'var(--foreground-muted)', borderRadius: 2,
                transition: 'transform 200ms ease, opacity 200ms ease',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                          : menuOpen && i === 2 ? 'rotate(-45deg) translate(4px, -4px)'
                          : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 12, right: 12,
          background: 'var(--background)',
          boxShadow: 'var(--shadow-floating)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 0', zIndex: 999,
        }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '13px 24px', fontSize: '0.82rem', fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: active === link.id ? 'var(--accent)' : 'var(--foreground-muted)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

/* ─── Developer Card ─── */
function DeveloperCard() {
  const techs = ['React', 'TypeScript', 'React Native', 'Django', 'Redux Toolkit', 'AWS S3', 'Tailwind CSS', 'REST APIs']

  return (
    <div
      className="neu-dark-card"
      style={{ padding: '28px', position: 'relative', overflow: 'hidden', maxWidth: 360, width: '100%' }}
      role="complementary"
      aria-label="Developer profile card"
    >
      {/* Top hardware bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff4757', '#fbbf24', '#22c55e'].map((c, i) => (
            <div key={i} aria-hidden="true" style={{ width: 9, height: 9, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}99` }} />
          ))}
        </div>
        <div className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          profile.sys
        </div>
        <Vents count={3} />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--accent) 0%, #c0392b 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', fontWeight: 800, color: '#fff', flexShrink: 0,
          fontFamily: 'JetBrains Mono, monospace',
          boxShadow: '0 0 0 2px rgba(255,71,87,0.35)',
        }}>
          UC
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark-fg)' }}>Uday Chatterjee</div>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--dark-fg-muted)', letterSpacing: '0.04em' }}>Software Developer</div>
        </div>
        <span className="badge-available" style={{ marginLeft: 'auto' }}>Open</span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Experience', value: '1+ Year' },
          { label: 'Specialty', value: 'Full-Stack' },
          { label: 'Location', value: 'Kolkata, IN' },
          { label: 'Availability', value: 'Full-time' },
        ].map(item => (
          <div key={item.label} className="stat-cell">
            <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--dark-fg-muted)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--dark-fg)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div style={{ marginBottom: 4 }}>
        <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--dark-fg-muted)', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Core Stack</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {techs.map(tech => (
            <span
              key={tech}
              className="font-mono"
              style={{
                fontSize: '0.65rem', fontWeight: 600, padding: '4px 9px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4, color: 'var(--dark-fg-muted)',
                letterSpacing: '0.03em',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="led" aria-hidden="true" />
        <span className="font-mono" style={{ fontSize: '0.62rem', color: '#22c55e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>System Operational · Mindscale</span>
      </div>
    </div>
  )
}

/* ─── Hero ─── */
function Hero({ onDownloadResume }: { onDownloadResume?: (e: React.MouseEvent) => void }) {
  const leftRef = useReveal()

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial lighting hotspot (top-left, per design system) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: -100, left: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1152, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>
        {/* Left */}
        <div ref={leftRef} className="reveal">
          <div className="section-label">Portfolio · 2024–Present</div>

          <h1
            style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              color: 'var(--foreground)',
              marginBottom: 8,
            }}
            className="text-embossed"
          >
            Uday<br />
            <span style={{ color: 'var(--accent)' }}>Chatterjee</span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 24px' }}>
            <div style={{ height: 2, width: 28, background: 'var(--accent)', borderRadius: 2 }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground-muted)', letterSpacing: '-0.01em' }}>
              Software Developer
            </span>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--foreground-muted)', lineHeight: 1.75, maxWidth: 500, marginBottom: 36 }}>
            Results-driven developer specializing in <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>Full-Stack</strong> and <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>Cross-Platform Application Development</strong>. Building scalable web and mobile applications with React, React Native, Django, TypeScript, and AWS.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
            <button
              className="btn-primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              View Projects
            </button>
            <button onClick={onDownloadResume} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download Resume
            </button>
          </div>

          {/* LinkedIn */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Connect</span>
            <div style={{ height: 1, width: 16, background: 'var(--border)' }} />
            <a
              href="https://www.linkedin.com/in/uday-chatterjee-45a153319"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px',
                background: 'var(--background)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--foreground-muted)',
                textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600,
                letterSpacing: '0.04em',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a66c2'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-floating)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right: dev card */}
        <div className="hide-mobile" style={{ flexShrink: 0 }}>
          <DeveloperCard />
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.45 }}
      >
        <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--foreground-muted)' }}>Scroll</span>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, var(--border-dark), transparent)' }} />
      </div>
    </section>
  )
}

/* ─── Skills ─── */
const SKILL_GROUPS = [
  { category: 'Programming',      icon: '⌨', skills: ['JavaScript', 'TypeScript', 'Java'] },
  { category: 'Frontend',         icon: '🖥', skills: ['React', 'React Native', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { category: 'Backend',          icon: '⚙', skills: ['Django', 'REST APIs'] },
  { category: 'State Management', icon: '🔄', skills: ['Redux Toolkit', 'React Context'] },
  { category: 'Cloud',            icon: '☁', skills: ['AWS S3'] },
  { category: 'Mobile',           icon: '📱', skills: ['Expo', 'Expo Router', 'Animated API', 'FlatList Optimization', 'WebView'] },
  { category: 'Tools & Methods',  icon: '🛠', skills: ['Git', 'SDLC', 'Agile', 'Waterfall', 'Spiral'] },
  { category: 'Soft Skills',      icon: '🤝', skills: ['Communication', 'Teamwork', 'Problem Solving', 'Attention to Detail'] },
]

function Skills() {
  const titleRef = useReveal()
  return (
    <section id="skills" style={{ padding: '96px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Technical Expertise</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--foreground)' }} className="text-embossed">
            Skills &amp; Technologies
          </h2>
          <p style={{ color: 'var(--foreground-muted)', marginTop: 10, maxWidth: 420, margin: '10px auto 0', fontSize: '0.95rem' }}>
            A curated stack built through real production experience — not just tutorials.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: 20 }}>
          {SKILL_GROUPS.map((group, i) => {
            const ref = useReveal()
            return (
              <div
                key={group.category}
                ref={ref}
                className={`reveal neu-card card-lift screws reveal-delay-${Math.min(i + 1, 6)}`}
                style={{ padding: '24px 20px', position: 'relative' }}
                role="article"
                aria-label={`${group.category} skills`}
              >
                {/* Top-right vents */}
                <div style={{ position: 'absolute', top: 14, right: 36 }} aria-hidden="true">
                  <Vents count={3} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, marginTop: 4 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'var(--background)',
                    boxShadow: 'var(--shadow-floating)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', flexShrink: 0,
                  }}>
                    {group.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--foreground)', letterSpacing: '0.01em' }}>
                    {group.category}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {group.skills.map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Projects ─── */
const PROJECTS = [
  {
    title: 'Full-Stack Blog Platform',
    type: 'Web Application',
    stack: ['React', 'TypeScript', 'Django REST Framework', 'AWS S3', 'Tailwind CSS'],
    description: 'Developed a scalable blogging platform with secure authentication, REST APIs, AWS S3 media storage, responsive UI, reusable components, rich-text editing, and SEO-friendly architecture.',
    highlights: ['Full Stack', 'REST APIs', 'Cloud Storage', 'Responsive Design'],
    icon: '📝',
    features: [
      'Secure JWT authentication & authorization',
      'AWS S3 media storage integration',
      'Rich-text editor with image uploads',
      'SEO-optimized architecture',
      'Fully responsive across all devices',
    ],
  },
  {
    title: 'Geology & Minerals Learning App',
    type: 'Mobile Application',
    stack: ['React Native', 'Expo', 'Redux Toolkit', 'TypeScript'],
    description: 'Built a production-ready educational mobile application with responsive UI, masonry gallery, advanced search, shimmer loading, interactive mineral details, geologic time scale visualization, quizzes, and API integrations.',
    highlights: ['Cross Platform', 'Responsive', 'Animations', 'Redux'],
    icon: '🪨',
    features: [
      'Masonry gallery with shimmer loading',
      'Advanced search & filtering',
      'Geologic time scale visualization',
      'Interactive quiz engine',
      'Expo Router navigation',
    ],
  },
  {
    title: 'Restaurant Order Management System',
    type: 'Dashboard',
    stack: ['React', 'Redux Toolkit', 'Tailwind CSS', 'TypeScript'],
    description: 'Developed a restaurant ordering dashboard with dynamic order management, real-time state updates, responsive layouts, live search, reusable UI components, and modal-based editing.',
    highlights: ['Dashboard', 'State Management', 'Reusable Components'],
    icon: '🍽',
    features: [
      'Real-time order state management',
      'Live search across orders',
      'Modal-based order editing',
      'Responsive dashboard layouts',
      'Reusable component architecture',
    ],
  },
]

function Projects() {
  const titleRef = useReveal()
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section id="projects" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Portfolio</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--foreground)' }} className="text-embossed">
            Featured Projects
          </h2>
          <p style={{ color: 'var(--foreground-muted)', marginTop: 10, maxWidth: 420, margin: '10px auto 0', fontSize: '0.95rem' }}>
            Production-grade applications built with clean architecture and real-world constraints.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {PROJECTS.map((project, i) => {
            const ref = useReveal()
            const isExpanded = expanded === i
            return (
              <div
                key={project.title}
                ref={ref}
                className={`reveal neu-card screws card-lift reveal-delay-${i + 1}`}
                style={{ padding: '32px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : i)}
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setExpanded(isExpanded ? null : i)}
              >
                {/* Top-right hardware decoration */}
                <div style={{ position: 'absolute', top: 16, right: 36 }} aria-hidden="true">
                  <Vents count={4} />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap', marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'var(--background)',
                      boxShadow: 'var(--shadow-floating)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', flexShrink: 0,
                    }}>
                      {project.icon}
                    </div>
                    <div>
                      <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{project.type}</div>
                      <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>{project.title}</h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start' }}>
                    {project.highlights.map((h, hi) => (
                      <span key={h} className={`proj-tag${hi === 0 ? ' proj-tag-accent' : ''}`}>{h}</span>
                    ))}
                  </div>
                </div>

                <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.75, marginBottom: 18, fontSize: '0.9rem', maxWidth: 680 }}>
                  {project.description}
                </p>

                {/* Stack chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {project.stack.map(tech => (
                    <span key={tech} className="skill-chip">{tech}</span>
                  ))}
                </div>

                {/* Expand toggle */}
                <button
                  className="font-mono"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0 }}
                  onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : i) }}
                  aria-label={isExpanded ? 'Collapse features' : 'Expand features'}
                >
                  {isExpanded ? '▲ Collapse' : '▼ Key Features'}
                </button>

                {/* Expanded feature list */}
                {isExpanded && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
                    {project.features.map((feat, fi) => (
                      <div key={fi} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 9,
                        padding: '10px 12px',
                        background: 'var(--background)',
                        boxShadow: 'var(--shadow-recessed)',
                        borderRadius: 8,
                      }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', lineHeight: 1.5, fontWeight: 500 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Experience ─── */
function Experience() {
  const titleRef = useReveal()
  const cardRef = useReveal()

  const responsibilities = [
    'Developing scalable frontend architecture with React & TypeScript',
    'Building reusable, accessible UI component libraries',
    'Designing & integrating REST API endpoints with Django',
    'Managing complex application state with Redux Toolkit',
    'Building responsive mobile applications using React Native & Expo',
    'Participating in Agile sprints, planning, and retrospectives',
    'Conducting code reviews and contributing to technical planning',
    'Implementing AWS S3 for media storage and delivery',
  ]

  return (
    <section id="experience" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Work History</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--foreground)' }} className="text-embossed">
            Professional Experience
          </h2>
        </div>

        <div style={{ position: 'relative', paddingLeft: 52 }} ref={cardRef} className="reveal">
          <div style={{ position: 'absolute', left: 20, top: 36, bottom: 0, width: 1, background: 'linear-gradient(to bottom, var(--border-dark), transparent)' }} aria-hidden="true" />
          <div className="timeline-dot" aria-hidden="true" />

          <div className="neu-card-elevated screws" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 14, right: 36 }} aria-hidden="true">
              <Vents count={5} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20, marginTop: 4 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: 'var(--background)',
                    boxShadow: 'var(--shadow-floating)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}>
                    💼
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Software Developer</h3>
                    <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>Mindscale Infinity Solutions</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge-available">Current Role</div>
                <div className="font-mono" style={{ marginTop: 6, fontSize: '0.68rem', color: 'var(--foreground-muted)', letterSpacing: '0.04em' }}>
                  April 2024 – Present
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.75, marginBottom: 24, fontSize: '0.9rem', maxWidth: 620 }}>
              Worked on scalable web and mobile applications using React, React Native, TypeScript, Django, Redux Toolkit, and AWS S3. Contributed across the full product lifecycle — from architecture and development to code reviews and deployment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 8, marginBottom: 20 }}>
              {responsibilities.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 9,
                  padding: '10px 13px',
                  background: 'var(--background)',
                  boxShadow: 'var(--shadow-recessed)',
                  borderRadius: 8,
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, marginTop: 2 }}>→</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--foreground)', lineHeight: 1.5, fontWeight: 500 }}>{r}</span>
                </div>
              ))}
            </div>

            {/* Tech used */}
            <div style={{ paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['React', 'React Native', 'TypeScript', 'Django', 'Redux Toolkit', 'AWS S3', 'REST APIs', 'Expo'].map(t => (
                <span key={t} className="skill-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Corporate Training ─── */
function CorporateTraining() {
  const titleRef = useReveal()
  const cardRef = useReveal()

  const covered = [
    'Core Java', 'Advanced Java', 'JDBC', 'Servlets', 'JSP',
    'Hibernate', 'Spring Framework', 'SQL', 'HTML & CSS', 'JavaScript', 'Web Technologies',
  ]

  return (
    <section id="training" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Formal Training</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--foreground)' }} className="text-embossed">
            Corporate Training
          </h2>
        </div>

        <div ref={cardRef} className="reveal neu-card-elevated screws" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 14, right: 36 }} aria-hidden="true">
            <Vents count={5} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 24, flexWrap: 'wrap', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'var(--background)',
                boxShadow: 'var(--shadow-floating)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0,
              }}>
                🎓
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Java Full Stack Development</h3>
                <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem' }}>JSpiders Kolkata</div>
              </div>
            </div>
            <div style={{
              padding: '12px 18px',
              background: 'var(--background)',
              boxShadow: 'var(--shadow-recessed)',
              borderRadius: 10, flexShrink: 0,
            }}>
              <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--foreground-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Duration</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--foreground)' }}>6 Months</div>
              <div className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)', marginTop: 3 }}>Jul 2024 – Jan 2025</div>
            </div>
          </div>

          <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.75, marginBottom: 22, fontSize: '0.9rem', maxWidth: 640 }}>
            Intensive corporate training focused on building strong backend fundamentals, object-oriented programming, database management, and enterprise application development using the Java ecosystem.
          </p>

          <div className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            Curriculum Covered
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {covered.map(item => (
              <span key={item} className="skill-chip">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Education ─── */
function Education() {
  const titleRef = useReveal()
  const degrees = [
    { level: 'Bachelor of Science', field: 'Computer Science', institution: 'Manbhum Mahavidyalaya', result: 'CGPA 7.39', icon: '🎓' },
    { level: 'Higher Secondary',    field: 'Science Stream',   institution: 'West Bengal Board',      result: '66.6%',    icon: '📚' },
    { level: 'Secondary',           field: 'WBBSE',             institution: 'West Bengal Board',      result: 'Passed',   icon: '🏫' },
  ]

  return (
    <section id="education" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Academic Background</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--foreground)' }} className="text-embossed">
            Education
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {degrees.map((deg, i) => {
            const ref = useReveal()
            return (
              <div key={deg.level} ref={ref} className={`reveal reveal-delay-${i + 1}`} style={{ position: 'relative', paddingLeft: 52, paddingBottom: i < degrees.length - 1 ? 24 : 0 }}>
                {i < degrees.length - 1 && (
                  <div aria-hidden="true" style={{ position: 'absolute', left: 20, top: 36, bottom: 0, width: 1, background: 'linear-gradient(to bottom, var(--border-dark), transparent)' }} />
                )}
                <div aria-hidden="true" style={{ position: 'absolute', left: 12, top: 20, width: 16, height: 16, borderRadius: '50%', background: 'var(--background)', boxShadow: 'var(--shadow-card)', border: '2px solid var(--accent)' }} />

                <div className="neu-card card-lift" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.2rem' }}>{deg.icon}</span>
                    <div>
                      <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{deg.level}</div>
                      <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.95rem' }}>{deg.institution}</div>
                      <div style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>{deg.field}</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--background)', boxShadow: 'var(--shadow-recessed)', borderRadius: 8, padding: '7px 14px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--foreground)' }}>{deg.result}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Why Hire Me ─── */
function WhyHireMe() {
  const titleRef = useReveal()
  const strengths = [
    { icon: '⚡', title: 'Production-Level React', desc: 'Builds scalable, performant React applications following modern best practices and clean architecture.' },
    { icon: '📱', title: 'Mobile Development',     desc: 'Cross-platform expertise with React Native and Expo — from architecture to deployment.' },
    { icon: '🔗', title: 'REST API Integration',   desc: 'Experienced in designing and consuming REST APIs with Django and integrating third-party services.' },
    { icon: '🎨', title: 'Clean UI Development',   desc: 'Sharp eye for detail — produces polished, accessible, and responsive user interfaces.' },
    { icon: '🏗', title: 'Full Stack Experience',  desc: 'End-to-end ownership of features, from database design to frontend delivery and deployment.' },
    { icon: '🚀', title: 'Performance Optimization', desc: 'Applies code splitting, lazy loading, FlatList optimization, and profiling for fast experiences.' },
    { icon: '🧩', title: 'Problem Solving',         desc: 'Tackles complex technical challenges with structured thinking and attention to edge cases.' },
  ]

  return (
    <section style={{ padding: '96px 24px', background: 'var(--dark-bg)' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center', color: 'var(--accent)' }}>Value Proposition</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--dark-fg)' }} className="text-embossed-dark">
            Why Hire Uday?
          </h2>
          <p style={{ color: 'var(--dark-fg-muted)', marginTop: 10, fontSize: '0.95rem' }}>
            Here's what I bring to your team from day one.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(296px, 1fr))', gap: 18 }}>
          {strengths.map((s, i) => {
            const ref = useReveal()
            return (
              <div
                key={s.title}
                ref={ref}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)}`}
                style={{
                  padding: '26px',
                  background: 'var(--dark-surface)',
                  boxShadow: 'var(--shadow-dark-card)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'transform 300ms ease, box-shadow 300ms ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'rgba(255,71,87,0.12)',
                  border: '1px solid rgba(255,71,87,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', marginBottom: 14,
                }}>
                  {s.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark-fg)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--dark-fg-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>{s.desc}</p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="led-red led" aria-hidden="true" style={{ width: 6, height: 6, background: 'var(--accent)', boxShadow: '0 0 6px rgba(255,71,87,0.7)' }} />
                  <span className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Production-verified</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ─── */
function Contact({ onContactClick }: { onContactClick?: (e: React.MouseEvent) => void }) {
  const titleRef = useReveal()
  const cardRef = useReveal()

  return (
    <section id="contact" style={{ padding: '96px 24px 120px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--foreground)' }} className="text-embossed">
            Let's Work Together
          </h2>
          <p style={{ color: 'var(--foreground-muted)', marginTop: 10, maxWidth: 400, margin: '10px auto 0', fontSize: '0.95rem', lineHeight: 1.75 }}>
            I'm actively looking for new opportunities. Whether you have a role in mind or just want to connect — my inbox is always open.
          </p>
        </div>

        <div ref={cardRef} className="reveal neu-card-elevated screws" style={{ padding: '44px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 36 }} aria-hidden="true">
            <Vents count={5} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32, marginTop: 4 }}>
            {[
              { icon: '✉', label: 'Email', value: 'udaychatterjee2003@gmail.com', href: 'mailto:udaychatterjee2003@gmail.com' },
              { icon: '📍', label: 'Location', value: 'Kolkata, West Bengal, India', href: null },
              { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/uday-chatterjee-45a153319', href: 'https://www.linkedin.com/in/uday-chatterjee-45a153319' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '15px 18px',
                background: 'var(--background)',
                boxShadow: 'var(--shadow-recessed)',
                borderRadius: 10,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'var(--background)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--foreground-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} onClick={item.href.startsWith('mailto:') ? onContactClick : undefined} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', wordBreak: 'break-all' }}>{item.value}</a>
                    : <span style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '0.88rem' }}>{item.value}</span>
                  }
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="mailto:udaychatterjee2003@gmail.com" onClick={onContactClick} className="btn-primary" style={{ fontSize: '0.85rem', padding: '14px 36px' }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Send Message
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--background)', padding: '28px 24px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--background)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            UC
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--foreground)' }}>Uday Chatterjee</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="led" aria-hidden="true" />
          <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--foreground-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>System Operational · Kolkata, India</span>
        </div>
        <a href="https://www.linkedin.com/in/uday-chatterjee-45a153319" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600, transition: 'color 200ms ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground-muted)')}
        >
          LinkedIn →
        </a>
      </div>
    </footer>
  )
}

/* ─── App ─── */
export default function App() {
  const [toast, setToast] = useState<string | null>(null)
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean
    subject: string
    body: string
  } | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const copyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    try {
      navigator.clipboard.writeText('udaychatterjee2003@gmail.com')
      showToast('Email copied to clipboard! (udaychatterjee2003@gmail.com)')
    } catch (err) {
      showToast('Contact: udaychatterjee2003@gmail.com')
    }
  }

  const openContactModal = (subject: string, body: string) => {
    setContactModal({
      isOpen: true,
      subject,
      body
    })
  }

  const handleHireMe = (e: React.MouseEvent) => {
    e.preventDefault()
    openContactModal(
      "Opportunity: Software Developer Inquiry",
      "Hi Uday,\n\nWe came across your portfolio and are impressed with your technical background as a Software Developer. We would love to discuss a potential opportunity with you.\n\nPlease let us know your availability for a brief call.\n\nBest regards,\n[Your Name]\n[Your Company]"
    )
  }

  const handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault()
    openContactModal(
      "Inquiry: Contact from Portfolio",
      "Hi Uday,\n\nI visited your portfolio website and wanted to get in touch regarding...\n\nBest regards,\n[Your Name]"
    )
  }

  const generateResumePDF = (e: React.MouseEvent) => {
    e.preventDefault()
    showToast('Generating resume PDF... Initializing download')

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Theme Colors
      const primaryColor = '#111827' // dark grey/black
      const secondaryColor = '#4b5563' // muted grey
      const accentColor = '#ff4757' // red/accent color

      // Margins & Dimensions
      const marginX = 20
      let currentY = 20
      const pageWidth = doc.internal.pageSize.getWidth() // 210mm
      const usableWidth = pageWidth - (marginX * 2) // 170mm

      // Helper function to draw headings
      const drawHeading = (text: string) => {
        currentY += 8
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.setTextColor(primaryColor)
        doc.text(text, marginX, currentY)
        
        // Draw horizontal separator line
        currentY += 2
        doc.setDrawColor(220, 225, 230) // light border
        doc.setLineWidth(0.4)
        doc.line(marginX, currentY, pageWidth - marginX, currentY)
        currentY += 6
      }

      // Header - Name
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(24)
      doc.setTextColor(primaryColor)
      doc.text("UDAY CHATTERJEE", marginX, currentY)

      // Header - Title
      currentY += 7
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(accentColor)
      doc.text("SOFTWARE DEVELOPER", marginX, currentY)

      // Header - Contact Details
      currentY += 6
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(secondaryColor)
      doc.text("Email: udaychatterjee2003@gmail.com   |   Kolkata, West Bengal, India", marginX, currentY)
      
      currentY += 5
      doc.text("LinkedIn: linkedin.com/in/uday-chatterjee-45a153319", marginX, currentY)

      // Professional Summary
      drawHeading("PROFESSIONAL SUMMARY")
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(primaryColor)
      const summaryText = "Results-driven Software Developer specializing in Full-Stack and Cross-Platform Application Development. Experienced in building scalable web and mobile applications using React, React Native, Django, TypeScript, Redux Toolkit, AWS S3, and modern frontend architecture."
      const splitSummary = doc.splitTextToSize(summaryText, usableWidth)
      doc.text(splitSummary, marginX, currentY)
      currentY += (splitSummary.length * 5) + 2

      // Technical Skills
      drawHeading("TECHNICAL SKILLS")
      doc.setFontSize(9.5)
      
      const skillCategories = [
        { name: "Programming Languages:", skills: "JavaScript, TypeScript, Java" },
        { name: "Frontend Development:", skills: "React, React Native, HTML5, CSS3, Tailwind CSS" },
        { name: "Backend Development:", skills: "Django, REST APIs" },
        { name: "State Management:", skills: "Redux Toolkit, React Context" },
        { name: "Cloud & Dev Tools:", skills: "AWS S3, Git" },
        { name: "Mobile Ecosystem:", skills: "Expo, Expo Router, Animated API, FlatList Optimization" },
        { name: "Soft Skills:", skills: "Communication, Teamwork, Problem Solving, Attention to Detail" }
      ]

      skillCategories.forEach(cat => {
        doc.setFont('helvetica', 'bold')
        doc.text(cat.name, marginX, currentY)
        
        // Measure width of category name to offset the skills text
        const catWidth = doc.getTextWidth(cat.name) + 3
        doc.setFont('helvetica', 'normal')
        
        const skillsText = doc.splitTextToSize(cat.skills, usableWidth - catWidth)
        doc.text(skillsText, marginX + catWidth, currentY)
        
        currentY += Math.max(5, skillsText.length * 4.5)
      })
      currentY += 2

      // Professional Experience
      drawHeading("PROFESSIONAL EXPERIENCE")
      
      // Job 1
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(primaryColor)
      doc.text("Software Developer", marginX, currentY)
      
      doc.setFont('helvetica', 'normal')
      const dateStr = "April 2024 - Present"
      const dateWidth = doc.getTextWidth(dateStr)
      doc.text(dateStr, pageWidth - marginX - dateWidth, currentY)

      currentY += 5
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(secondaryColor)
      doc.text("Mindscale Infinity Solutions  |  Full-Time", marginX, currentY)

      currentY += 6
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(primaryColor)
      
      const responsibilities = [
        "Developing scalable frontend architecture using React & TypeScript to ensure clean and testable modular code.",
        "Building reusable, accessible, and responsive UI component libraries following strict design system guidelines.",
        "Designing and integrating REST API endpoints with Django to support dynamic and stateful features.",
        "Managing complex application state using Redux Toolkit to reduce prop-drilling and optimize render counts.",
        "Building responsive, high-performance cross-platform mobile apps using React Native and Expo.",
        "Implementing AWS S3 configurations for secure, performant media storage, retrieval, and delivery."
      ]

      responsibilities.forEach(resp => {
        doc.text("-", marginX, currentY)
        const bulletText = doc.splitTextToSize(resp, usableWidth - 5)
        doc.text(bulletText, marginX + 4, currentY)
        currentY += (bulletText.length * 4.5) + 1.5
      })
      currentY += 2

      // Formal Training
      drawHeading("FORMAL TRAINING")
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(primaryColor)
      doc.text("Java Full Stack Development", marginX, currentY)
      
      doc.setFont('helvetica', 'normal')
      const trainingDate = "Jul 2024 - Jan 2025"
      const trDateWidth = doc.getTextWidth(trainingDate)
      doc.text(trainingDate, pageWidth - marginX - trDateWidth, currentY)

      currentY += 5
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(secondaryColor)
      doc.text("JSpiders Kolkata  |  6-Month Corporate Training", marginX, currentY)

      currentY += 6
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(primaryColor)
      const trainingDesc = "Intensive professional training focusing on core and advanced Java, JDBC, Servlets, JSP, Hibernate, Spring Framework, SQL, and enterprise-grade web application architecture."
      const splitTraining = doc.splitTextToSize(trainingDesc, usableWidth)
      doc.text(splitTraining, marginX, currentY)
      currentY += (splitTraining.length * 4.5) + 4

      // Education
      drawHeading("EDUCATION")
      
      const eduList = [
        { degree: "Bachelor of Science in Computer Science", institution: "Manbhum Mahavidyalaya", result: "CGPA: 7.39" },
        { degree: "Higher Secondary (Science Stream)", institution: "West Bengal Board", result: "Percentage: 66.6%" },
        { degree: "Secondary Education", institution: "West Bengal Board", result: "Passed" }
      ]

      eduList.forEach((edu, index) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text(edu.degree, marginX, currentY)
        
        const resStr = edu.result
        const resWidth = doc.getTextWidth(resStr)
        doc.text(resStr, pageWidth - marginX - resWidth, currentY)

        currentY += 4.5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(secondaryColor)
        doc.text(edu.institution, marginX, currentY)
        
        currentY += index < eduList.length - 1 ? 6 : 0
        doc.setTextColor(primaryColor)
      })

      doc.save("Uday_Chatterjee_Resume.pdf")
      showToast('✓ Resume PDF downloaded successfully!')
    } catch (error) {
      console.error('PDF Generation error:', error)
      showToast('❌ Failed to generate PDF. Please try again.')
    }
  }

  return (
    <>
      <Navbar onContactClick={handleSendMessage} onHireMeClick={handleHireMe} />
      <main>
        <Hero onDownloadResume={generateResumePDF} />
        <Skills />
        <Projects />
        <Experience />
        <CorporateTraining />
        <Education />
        <WhyHireMe />
        <Contact onContactClick={handleSendMessage} />
      </main>
      <Footer />

      {/* Contact Options Modal */}
      {contactModal && contactModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(17, 24, 39, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 11000,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            background: 'var(--background)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '20px',
            padding: '36px',
            maxWidth: '440px',
            width: 'calc(100% - 32px)',
            boxShadow: 'var(--shadow-floating)',
            position: 'relative',
            fontFamily: 'Inter, sans-serif',
            animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Screws */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: 16, left: 16, right: 16 }} aria-hidden="true">
              <Screw />
              <Screw />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--foreground)', textAlign: 'center', marginTop: 12, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Contact Uday Chatterjee
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', textAlign: 'center', marginBottom: 28, lineHeight: 1.5 }}>
              Choose how you would like to send your email. We've prefilled a template for you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Option 1: Gmail Web */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=udaychatterjee2003@gmail.com&su=${encodeURIComponent(contactModal.subject)}&body=${encodeURIComponent(contactModal.body)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setContactModal(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  background: 'var(--background)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid transparent',
                  borderRadius: '12px',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-recessed)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.color = 'var(--foreground)' }}
              >
                <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>📧</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>Gmail (Web)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', fontWeight: 400 }}>Open in your web browser</div>
                </div>
              </a>

              {/* Option 2: Default Mail App */}
              <a
                href={`mailto:udaychatterjee2003@gmail.com?subject=${encodeURIComponent(contactModal.subject)}&body=${encodeURIComponent(contactModal.body)}`}
                onClick={() => setContactModal(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  background: 'var(--background)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid transparent',
                  borderRadius: '12px',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-recessed)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.color = 'var(--foreground)' }}
              >
                <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>💻</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>Default Mail Client</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', fontWeight: 400 }}>Outlook, Mail app, Thunderbird</div>
                </div>
              </a>

              {/* Option 3: Copy Email */}
              <button
                onClick={() => {
                  copyEmail();
                  setContactModal(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  background: 'var(--background)',
                  boxShadow: 'var(--shadow-card)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--foreground)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-recessed)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.color = 'var(--foreground)' }}
              >
                <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>📋</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>Copy Address</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', fontWeight: 400 }}>Copy udaychatterjee2003@gmail.com</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setContactModal(null)}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '24px',
                padding: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--foreground-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--foreground-muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(224, 229, 236, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          borderRadius: '12px',
          padding: '12px 24px',
          boxShadow: 'var(--shadow-floating)',
          color: '#111827',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 600,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> {toast}
        </div>
      )}
    </>
  )
}
