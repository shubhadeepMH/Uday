import { useState, useEffect, useRef } from 'react'
import { jsPDF } from 'jspdf'
import logoImg from './logo.png'

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
          <img
            src={logoImg}
            alt="Uday Chatterjee Logo"
            style={{
              width: 36, height: 36, borderRadius: 10,
              objectFit: 'cover',
              boxShadow: '4px 4px 8px #babecc, -4px -4px 8px #ffffff',
            }}
          />
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
  const techs = ['React', 'TypeScript', 'React Native', 'Django', 'Redux Toolkit', 'AWS S3', 'AWS EC2', 'Tailwind CSS']

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
        <img
          src={logoImg}
          alt="Uday Chatterjee Profile"
          style={{
            width: 44, height: 44, borderRadius: 12,
            objectFit: 'cover', flexShrink: 0,
            boxShadow: '0 0 0 2px rgba(255,71,87,0.35)',
          }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark-fg)' }}>Uday Chatterjee</div>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--dark-fg-muted)', letterSpacing: '0.04em' }}>Software Developer</div>
        </div>
        <span className="badge-available" style={{ marginLeft: 'auto' }}>Open</span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Experience', value: '1.5+ Yrs Mindscale' },
          { label: 'Specialty', value: 'Full-Stack & Mobile' },
          { label: 'Location', value: 'Kolkata, IN' },
          { label: 'Availability', value: 'Full-time' },
        ].map(item => (
          <div key={item.label} className="stat-cell">
            <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--dark-fg-muted)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--dark-fg)' }}>{item.value}</div>
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
      {/* Subtle radial lighting hotspot */}
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
          <div className="section-label">Portfolio · 2025–Present</div>

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
              Software Developer | Full-Stack &amp; Mobile
            </span>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--foreground-muted)', lineHeight: 1.75, maxWidth: 540, marginBottom: 36 }}>
            Results-driven Software Developer with a BSc in Computer Science and over a year of hands-on industry experience building scalable full-stack and cross-platform mobile applications with <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>React</strong>, <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>React Native</strong>, <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>TypeScript</strong>, <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>Django</strong>, and <strong style={{ color: 'var(--foreground)', fontWeight: 700 }}>AWS</strong>.
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

          {/* LinkedIn & Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
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
            <a
              href="tel:+918944990853"
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
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-floating)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)' }}
            >
              📞 +91 89449 90853
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
  { category: 'Programming',           icon: '⌨', skills: ['Java', 'JavaScript', 'TypeScript'] },
  { category: 'Web Technologies',      icon: '🌐', skills: ['HTML5', 'CSS3', 'DOM', 'JSON', 'Responsive Web Design'] },
  { category: 'Frontend',              icon: '🖥', skills: ['React', 'React Native (Expo)', 'Tailwind CSS'] },
  { category: 'State Management',      icon: '🔄', skills: ['Redux Toolkit', 'React Context API'] },
  { category: 'Backend',               icon: '⚙', skills: ['Django (RESTful APIs)', 'Server-Side Integration'] },
  { category: 'Cloud & Storage',       icon: '☁', skills: ['AWS S3'] },
  { category: 'Mobile',                icon: '📱', skills: ['Expo Router', 'Animated API', 'FlatList Optimisation', 'WebView'] },
  { category: 'Development Practices', icon: '📐', skills: ['Requirements Analysis', 'SDLC (Agile, Waterfall, Spiral, Hybrid)'] },
  { category: 'Tools',                 icon: '🛠', skills: ['Git', 'MobaXterm'] },
  { category: 'Soft Skills',           icon: '🤝', skills: ['Problem-Solving', 'Attention to Detail', 'Communication', 'Teamwork'] },
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
    period: 'April 2025 – Jun 2025',
    type: 'Web Application',
    stack: ['React', 'TypeScript', 'Django', 'AWS S3', 'Tailwind CSS'],
    description: 'Architected scalable blogging platform with secure AWS S3 media handling, responsive UI, rich-text content creation, and optimized SEO.',
    highlights: ['Full Stack', 'REST APIs', 'Cloud Storage', 'SEO Optimised'],
    icon: '📝',
    features: [
      'Architected scalable blogging platform structure',
      'Implemented secure AWS S3 media handling & storage',
      'Built responsive UI with Tailwind CSS',
      'Engineered rich-text content creation engine',
      'Optimised SEO & performance strategy',
    ],
  },
  {
    title: 'Restaurant Order Management System',
    period: 'Jun 2025 – Aug 2025',
    type: 'Web Dashboard',
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS'],
    description: 'Developed ordering frontend with Redux state architecture, responsive dashboard layout, reusable menu grid, and integrated toast notifications.',
    highlights: ['Dashboard', 'Redux Toolkit', 'Reusable Menu Grid'],
    icon: '🍽',
    features: [
      'Developed restaurant ordering frontend interface',
      'Architected centralized Redux state management',
      'Designed responsive order management dashboard',
      'Built reusable menu grid component',
      'Integrated real-time toast notifications system',
    ],
  },
  {
    title: 'Geology & Minerals Learning App',
    period: 'Sep 2025 – Nov 2025',
    type: 'Mobile Application',
    stack: ['React Native (Expo)', 'TypeScript', 'Redux Toolkit'],
    description: 'Built complete mobile frontend with responsive masonry gallery, interactive detail views, colour-coded geologic time scale, quiz feature, and external mineral API integrations.',
    highlights: ['Cross Platform', 'Masonry Gallery', 'Geologic Scale', 'API Integration'],
    icon: '🪨',
    features: [
      'Built complete mobile frontend in React Native & Expo',
      'Developed responsive masonry gallery layout',
      'Created interactive mineral detail views',
      'Designed colour-coded geologic time scale',
      'Implemented interactive quiz feature & mineral API integrations',
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
            Key Projects
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{project.type}</span>
                        <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)' }}>• {project.period}</span>
                      </div>
                      <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.01em', marginTop: 2 }}>{project.title}</h3>
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
                  {isExpanded ? '▲ Collapse Details' : '▼ View Highlights'}
                </button>

                {/* Expanded feature list */}
                {isExpanded && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
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
    'Developed and maintained full-stack web and mobile applications using React, React Native, TypeScript, and Django.',
    'Collaborated with cross-functional teams to design RESTful APIs, manage cloud storage via AWS S3, and integrate third-party services.',
    'Led frontend architecture decisions implementing Redux Toolkit.',
    'Participated in Agile sprints, code reviews, and technical planning.',
    'Executed production migration and deployment of a full-stack web application, including the Django backend, database, media assets, and React/Vite frontend within an existing AWS EC2 environment.',
    'Configured and deployed Django applications using Gunicorn, systemd, and Nginx reverse proxy, implementing separate API routing while preserving existing production services.',
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
                <div className="font-mono" style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--foreground-muted)', letterSpacing: '0.04em', fontWeight: 600 }}>
                  April 2025 – Present (1 Year 6 Months)
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.75, marginBottom: 24, fontSize: '0.9rem', maxWidth: 660 }}>
              Over a year of hands-on corporate experience building scalable full-stack web and cross-platform mobile applications. Specialized in React, React Native, TypeScript, Redux Toolkit, Django REST APIs, AWS S3, and AWS EC2 deployments with Gunicorn &amp; Nginx.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10, marginBottom: 20 }}>
              {responsibilities.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 9,
                  padding: '12px 14px',
                  background: 'var(--background)',
                  boxShadow: 'var(--shadow-recessed)',
                  borderRadius: 8,
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, marginTop: 2 }}>•</span>
                  <span style={{ fontSize: '0.83rem', color: 'var(--foreground)', lineHeight: 1.55, fontWeight: 500 }}>{r}</span>
                </div>
              ))}
            </div>

            {/* Tech used */}
            <div style={{ paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['React', 'React Native (Expo)', 'TypeScript', 'Django', 'Redux Toolkit', 'AWS S3', 'AWS EC2', 'Gunicorn', 'Nginx', 'RESTful APIs'].map(t => (
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

  const trainingDetails = [
    'Successfully completed an intensive corporate training program in Java Full Stack Development.',
    'Strengthened programming fundamentals through hands-on coding exercises and practical assignments.',
    'Learned Core Java, including Object-Oriented Programming (OOP), exception handling, collections, multithreading, and file handling.',
    'Gained a solid understanding of SQL, including database design, joins, normalization, stored procedures, and query optimization.',
    'Studied Web Technologies, including HTML5, CSS3, JavaScript, HTTP, and responsive web design principles.',
    'Developed a strong foundation in software development methodologies, debugging, and problem-solving.',
  ]

  const covered = [
    'Core Java', 'OOP', 'Exception Handling', 'Collections Framework', 'Multithreading',
    'File Handling', 'SQL & Joins', 'Database Normalization', 'Stored Procedures', 'Query Optimization',
    'HTML5 & CSS3', 'JavaScript', 'HTTP Protocol', 'Responsive Web Design',
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
                <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem' }}>JSpiders, Kolkata</div>
              </div>
            </div>
            <div style={{
              padding: '12px 18px',
              background: 'var(--background)',
              boxShadow: 'var(--shadow-recessed)',
              borderRadius: 10, flexShrink: 0,
            }}>
              <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--foreground-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Duration</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--foreground)' }}>~9 Months</div>
              <div className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)', marginTop: 3 }}>15 July 2024 – March 2025</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10, marginBottom: 24 }}>
            {trainingDetails.map((td, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 9,
                padding: '11px 13px',
                background: 'var(--background)',
                boxShadow: 'var(--shadow-recessed)',
                borderRadius: 8,
              }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: '0.83rem', color: 'var(--foreground)', lineHeight: 1.5, fontWeight: 500 }}>{td}</span>
              </div>
            ))}
          </div>

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
    { level: 'Bachelor of Science', field: 'Computer Science', institution: 'Manbhum Mahavidyalaya', period: '2021–2024', result: 'CGPA: 7.39', icon: '🎓' },
    { level: 'Higher Secondary (Class XII)', field: 'Science Stream', institution: 'H.K.S.G.C.M High School', period: '2019–2021', result: '66.6%', icon: '📚' },
    { level: 'Secondary (Class X)', field: 'General Studies', institution: 'Jambad Anchalik High School', period: '2019', result: 'Passed', icon: '🏫' },
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{deg.level}</span>
                        <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)' }}>• {deg.period}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.95rem', marginTop: 2 }}>{deg.institution}</div>
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
    { icon: '⚡', title: 'Full-Stack & Mobile', desc: 'Architects scalable web & mobile codebases using React, React Native (Expo), TypeScript, and Django.' },
    { icon: '☁', title: 'AWS Cloud & Deployments', desc: 'Hands-on experience deploying Django & React apps to AWS EC2 with Gunicorn, Nginx, and managing AWS S3 storage.' },
    { icon: '🔗', title: 'REST API & State Architecture', desc: 'Proficient in Redux Toolkit state design, API integrations, third-party services, and real-time UI updates.' },
    { icon: '🎨', title: 'Clean UI & Design Systems', desc: 'Sharp eye for responsive design, component reusability, Tailwind CSS, and polished user experiences.' },
    { icon: '🎓', title: 'Java & CS Fundamentals', desc: 'Strong foundation in Core Java, OOP, SQL databases, joins, normalization, stored procedures, and SDLC.' },
    { icon: '🚀', title: 'Agile & Best Practices', desc: 'Active in code reviews, Agile sprints, technical planning, and maintaining high code quality.' },
    { icon: '🧩', title: 'Measurable Business Impact', desc: 'Adept at translating complex requirements into reliable software that delivers real business value.' },
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
              { icon: '📞', label: 'Phone', value: '+91 89449 90853', href: 'tel:+918944990853' },
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
      const primaryColor = '#111827'
      const secondaryColor = '#4b5563'
      const accentColor = '#ff4757'

      // Margins & Dimensions
      const marginX = 18
      let currentY = 16
      const pageWidth = doc.internal.pageSize.getWidth() // 210mm
      const usableWidth = pageWidth - (marginX * 2) // 174mm

      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > 280) {
          doc.addPage()
          currentY = 16
        }
      }

      // Helper function to draw headings
      const drawHeading = (text: string) => {
        checkPageBreak(16)
        currentY += 6
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(primaryColor)
        doc.text(text, marginX, currentY)
        
        currentY += 2
        doc.setDrawColor(220, 225, 230)
        doc.setLineWidth(0.4)
        doc.line(marginX, currentY, pageWidth - marginX, currentY)
        currentY += 5
      }

      // Header - Name
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(primaryColor)
      doc.text("UDAY CHATTERJEE", marginX, currentY)

      // Header - Title
      currentY += 6
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(accentColor)
      doc.text("SOFTWARE DEVELOPER  |  FULL-STACK & MOBILE APPLICATION DEVELOPMENT", marginX, currentY)

      // Header - Contact Details
      currentY += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(secondaryColor)
      doc.text("Email: udaychatterjee2003@gmail.com   |   Phone: +91 89449 90853   |   Location: Kolkata, West Bengal, India", marginX, currentY)
      
      currentY += 4.5
      doc.text("LinkedIn: linkedin.com/in/uday-chatterjee-45a153319", marginX, currentY)

      // Career Objective
      drawHeading("CAREER OBJECTIVE")
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(primaryColor)
      const objectiveText = "Results-driven Software Developer with a BSc in Computer Science and over a year of hands-on industry experience building scalable full-stack and cross-platform mobile applications. Proven ability to architect clean, maintainable codebases using modern technologies including React, React Native, TypeScript, Django, and AWS. Adept at translating complex requirements into intuitive user experiences and passionate about continuous learning, clean code practices, and delivering measurable business impact."
      const splitObjective = doc.splitTextToSize(objectiveText, usableWidth)
      doc.text(splitObjective, marginX, currentY)
      currentY += (splitObjective.length * 4) + 1

      // Professional Experience
      drawHeading("PROFESSIONAL EXPERIENCE (2 Years + Corporate Experience)")
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(primaryColor)
      doc.text("Software Developer", marginX, currentY)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      const dateStr = "April 2025 – Present (1 Year 6 Months)"
      const dateWidth = doc.getTextWidth(dateStr)
      doc.text(dateStr, pageWidth - marginX - dateWidth, currentY)

      currentY += 4.5
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(secondaryColor)
      doc.text("Mindscale Infinity Solutions", marginX, currentY)

      currentY += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(primaryColor)
      
      const responsibilities = [
        "Developed and maintained full-stack web and mobile applications using React, React Native, TypeScript, and Django.",
        "Collaborated with cross-functional teams to design RESTful APIs, manage cloud storage via AWS S3, and integrate third-party services.",
        "Led frontend architecture decisions implementing Redux Toolkit.",
        "Participated in Agile sprints, code reviews, and technical planning.",
        "Executed production migration and deployment of a full-stack web application, including Django backend, database, media assets, and React/Vite frontend within an existing AWS EC2 environment.",
        "Configured and deployed Django applications using Gunicorn, systemd, and Nginx reverse proxy, implementing separate API routing while preserving existing production services."
      ]

      responsibilities.forEach(resp => {
        const bulletText = doc.splitTextToSize(resp, usableWidth - 5)
        checkPageBreak(bulletText.length * 3.8 + 2)
        doc.text("•", marginX, currentY)
        doc.text(bulletText, marginX + 4, currentY)
        currentY += (bulletText.length * 3.8) + 1.2
      })
      currentY += 1

      // Key Projects
      drawHeading("KEY PROJECTS")

      const projectsPdf = [
        {
          title: "Full-Stack Blog Platform",
          period: "April 2025 – Jun 2025",
          stack: "React • TypeScript • Django • AWS S3 • Tailwind CSS",
          bullets: [
            "Architected scalable blogging platform.",
            "Implemented secure AWS S3 media handling.",
            "Built responsive UI.",
            "Engineered rich-text content creation.",
            "Optimised SEO."
          ]
        },
        {
          title: "Restaurant Order Management System",
          period: "Jun 2025 – Aug 2025",
          stack: "React • TypeScript • Redux Toolkit • Tailwind CSS",
          bullets: [
            "Developed ordering frontend.",
            "Architected Redux state.",
            "Designed responsive dashboard.",
            "Built reusable menu grid.",
            "Integrated toast notifications."
          ]
        },
        {
          title: "Geology & Minerals Learning App – Mobile Frontend",
          period: "Sep 2025 – Nov 2025",
          stack: "React Native (Expo) • TypeScript • Redux Toolkit",
          bullets: [
            "Built complete mobile frontend.",
            "Developed responsive masonry gallery.",
            "Created interactive detail views.",
            "Designed colour-coded geologic time scale.",
            "Implemented quiz feature.",
            "Integrated external mineral APIs."
          ]
        }
      ]

      projectsPdf.forEach(p => {
        checkPageBreak(20)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9.5)
        doc.setTextColor(primaryColor)
        doc.text(p.title, marginX, currentY)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const pDateWidth = doc.getTextWidth(p.period)
        doc.text(p.period, pageWidth - marginX - pDateWidth, currentY)

        currentY += 4
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(secondaryColor)
        doc.text(p.stack, marginX, currentY)

        currentY += 4.5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(primaryColor)

        p.bullets.forEach(b => {
          const bText = doc.splitTextToSize(b, usableWidth - 5)
          checkPageBreak(bText.length * 3.6 + 1)
          doc.text("•", marginX, currentY)
          doc.text(bText, marginX + 4, currentY)
          currentY += (bText.length * 3.6) + 1
        })
        currentY += 2
      })

      // Corporate Training
      drawHeading("CORPORATE TRAINING (9 months)")
      
      checkPageBreak(25)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(primaryColor)
      doc.text("Java Full Stack Development (Corporate Training)", marginX, currentY)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      const trDate = "15 July 2024 – March 2025 (Approx. 9 Months)"
      const trWidth = doc.getTextWidth(trDate)
      doc.text(trDate, pageWidth - marginX - trWidth, currentY)

      currentY += 4
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(secondaryColor)
      doc.text("JSpiders, Kolkata", marginX, currentY)

      currentY += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(primaryColor)

      const trBullets = [
        "Successfully completed an intensive corporate training program in Java Full Stack Development.",
        "Strengthened programming fundamentals through hands-on coding exercises and practical assignments.",
        "Learned Core Java, including Object-Oriented Programming (OOP), exception handling, collections, multithreading, and file handling.",
        "Gained a solid understanding of SQL, including database design, joins, normalization, stored procedures, and query optimization.",
        "Studied Web Technologies, including HTML5, CSS3, JavaScript, HTTP, and responsive web design principles.",
        "Developed a strong foundation in software development methodologies, debugging, and problem-solving."
      ]

      trBullets.forEach(b => {
        const bText = doc.splitTextToSize(b, usableWidth - 5)
        checkPageBreak(bText.length * 3.6 + 1)
        doc.text("•", marginX, currentY)
        doc.text(bText, marginX + 4, currentY)
        currentY += (bText.length * 3.6) + 1
      })
      currentY += 1

      // Technical Skills
      drawHeading("TECHNICAL SKILLS")
      doc.setFontSize(8.5)
      
      const skillCategories = [
        { name: "Programming:", skills: "Java, JavaScript, TypeScript" },
        { name: "Web Technologies:", skills: "HTML5, CSS3, DOM, JSON, Responsive Web Design" },
        { name: "Frontend:", skills: "React, React Native (Expo), Tailwind CSS" },
        { name: "State Management:", skills: "Redux Toolkit, React Context API" },
        { name: "Backend:", skills: "Django (RESTful APIs), Server-Side Integration" },
        { name: "Cloud & Storage:", skills: "AWS S3" },
        { name: "Mobile:", skills: "Expo Router, Animated API, FlatList Optimisation, WebView" },
        { name: "Development Practices:", skills: "Requirements Analysis, SDLC (Agile, Waterfall, Spiral, Hybrid)" },
        { name: "Tools:", skills: "Git, MobaXterm" },
        { name: "Soft Skills:", skills: "Problem-Solving, Attention to Detail, Communication, Teamwork" }
      ]

      skillCategories.forEach(cat => {
        checkPageBreak(5)
        doc.setFont('helvetica', 'bold')
        doc.text(cat.name, marginX, currentY)
        
        const catWidth = doc.getTextWidth(cat.name) + 3
        doc.setFont('helvetica', 'normal')
        
        const skillsText = doc.splitTextToSize(cat.skills, usableWidth - catWidth)
        doc.text(skillsText, marginX + catWidth, currentY)
        
        currentY += Math.max(4.2, skillsText.length * 4)
      })
      currentY += 1

      // Education
      drawHeading("EDUCATION")
      
      const eduList = [
        { degree: "BSc in Computer Science", institution: "Manbhum Mahavidyalaya (2021–2024)", result: "CGPA: 7.39" },
        { degree: "Higher Secondary (Class XII)", institution: "H.K.S.G.C.M High School (2019–2021)", result: "66.6%" },
        { degree: "Secondary (Class X)", institution: "Jambad Anchalik High School (2019)", result: "Passed" }
      ]

      eduList.forEach((edu, index) => {
        checkPageBreak(9)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text(edu.degree, marginX, currentY)
        
        const resStr = edu.result
        const resWidth = doc.getTextWidth(resStr)
        doc.text(resStr, pageWidth - marginX - resWidth, currentY)

        currentY += 4
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(secondaryColor)
        doc.text(edu.institution, marginX, currentY)
        
        currentY += index < eduList.length - 1 ? 5 : 0
        doc.setTextColor(primaryColor)
      })

      // Declaration
      drawHeading("DECLARATION")
      checkPageBreak(14)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      doc.setTextColor(secondaryColor)
      doc.text("I hereby declare that all information provided in this résumé is true and accurate to the best of my knowledge and belief.", marginX, currentY)
      currentY += 6
      doc.setFont('helvetica', 'bold')
      doc.text("Uday Chatterjee", marginX, currentY)
      currentY += 4
      doc.setFont('helvetica', 'normal')
      doc.text("Kolkata, West Bengal  |  Date: 23 September 2026", marginX, currentY)

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
