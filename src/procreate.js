import './procreate.css'
import gsap from 'gsap'
import Lenis from 'lenis'

const app = document.querySelector('#app')
if (!app) throw new Error('App root not found.')

// Section titles for the right-side indicator
const sectionTitles = ['Overview', 'Analysis', 'Redesign', 'Prototype', 'Thank You']
const sectionMapping = [0, 0, 1, 1, 2, 2, 3, 3, 4]

const sectionNavMarkup = sectionTitles
  .map((title, i) => `
    <button class="sc-section-nav__item${i === 0 ? ' is-active' : ''}" 
            data-section="${i}" 
            type="button">
      <span class="sc-section-nav__indicator"></span>
      <span class="sc-section-nav__text">${title}</span>
    </button>
  `)
  .join('')

app.innerHTML = `
  <div class="sc-page">
    <div class="sc-page-glows" aria-hidden="true"></div>
    <div class="sc-page-border" aria-hidden="true"></div>

    <!-- ── Fixed nav bar (From Landing Page) ── -->
    <header class="hero-topbar" aria-label="Hero navigation" style="display: grid; opacity: 1; visibility: visible;">
      <a class="hero-brand liquid-glass is-project-back" href="/#work" aria-label="Back to home work section">
        <span class="hero-brand__back-arrow" aria-hidden="true">
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15.002C10 14.736 9.866 14.482 9.628 14.294L3.15 9.174C2.954 9.019 2.798 8.835 2.692 8.632C2.586 8.43 2.531 8.213 2.531 7.994C2.531 7.775 2.586 7.558 2.692 7.355C2.798 7.153 2.954 6.969 3.15 6.814L9.62 1.697C9.851 1.508 9.978 1.255 9.976 0.992C9.973 0.73 9.839 0.479 9.605 0.293C9.37 0.108 9.052 0.002 8.72 0C8.388 -0.002 8.068 0.099 7.829 0.281L1.359 5.394C0.489 6.083 0 7.017 0 7.99C0 8.963 0.489 9.897 1.359 10.586L7.838 15.707C8.014 15.846 8.24 15.942 8.485 15.981C8.73 16.019 8.985 16 9.216 15.924C9.448 15.849 9.645 15.721 9.785 15.557C9.924 15.393 9.999 15.2 10 15.002Z" fill="currentColor"/>
          </svg>
        </span>
        <span class="hero-brand__first">Amogh</span>
        <img class="hero-brand__icon" src="/icons/shape.svg" alt="" aria-hidden="true">
        <span class="hero-brand__last">Shete.</span>
      </a>

      <nav class="hero-pill liquid-glass" aria-label="Primary" style="opacity: 0; pointer-events: none;">
        <!-- Hidden pill to keep grid layout identical to landing page -->
      </nav>

      <nav class="hero-links" aria-label="Secondary">
        <a href="https://www.behance.net/Amogh-Shete" target="_blank" rel="noopener noreferrer">
          <span>BEHANCE</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href="https://drive.google.com/drive/folders/1_byu6DyYM6W24F_0wwyaZfAJ-zN6VX1p?usp=share_link" target="_blank" rel="noopener noreferrer">
          <span>RESUME</span>
          <span aria-hidden="true">↗</span>
        </a>
      </nav>

    </header>

    <!-- ── Mobile-only: back arrow ── -->
    <a class="sc-mobile-back" href="/#work" aria-label="Back to work section">
      <svg width="13" height="23" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 15.002C10 14.736 9.866 14.482 9.628 14.294L3.15 9.174C2.954 9.019 2.798 8.835 2.692 8.632C2.586 8.43 2.531 8.213 2.531 7.994C2.531 7.775 2.586 7.558 2.692 7.355C2.798 7.153 2.954 6.969 3.15 6.814L9.62 1.697C9.851 1.508 9.978 1.255 9.976 0.992C9.973 0.73 9.839 0.479 9.605 0.293C9.37 0.108 9.052 0.002 8.72 0C8.388 -0.002 8.068 0.099 7.829 0.281L1.359 5.394C0.489 6.083 0 7.017 0 7.99C0 8.963 0.489 9.897 1.359 10.586L7.838 15.707C8.014 15.846 8.24 15.942 8.485 15.981C8.73 16.019 8.985 16 9.216 15.924C9.448 15.849 9.645 15.721 9.785 15.557C9.924 15.393 9.999 15.2 10 15.002Z" fill="currentColor"/>
      </svg>
    </a>

    <!-- ── Mobile-only: hamburger + menu panel (same as hero section) ── -->
    <button class="mobile-menu-btn liquid-glass sc-mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" y1="1" x2="19" y2="1" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="9" x2="19" y2="9" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="17" x2="19" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="mobile-menu-overlay" aria-hidden="true"></div>
    <div class="mobile-menu-panel" aria-hidden="true">
      <button class="mobile-menu-close" aria-label="Close menu">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.2195 18.2354L17.5826 9.87233L19.418 11.7078L14.1789 16.9469L25.8068 16.9462L26.1818 16.9469V19.5239L25.8068 19.5246L14.1789 19.5239L19.418 24.763L17.5826 26.5984L9.2195 18.2354Z" fill="black" stroke="black" stroke-width="0.75"/>
          <circle cx="18" cy="18" r="16.5" stroke="black" stroke-width="3"/>
        </svg>
      </button>
      <div class="mobile-menu-content">
        <div class="mobile-menu-sections">
          <a href="/#work" class="mobile-menu-section-link">Work</a>
          <a href="/#info" class="mobile-menu-section-link">Info</a>
        </div>
        <div class="mobile-menu-links">
          <a href="https://www.behance.net/Amogh-Shete" target="_blank" rel="noopener noreferrer">BEHANCE <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
          <a href="https://www.linkedin.com/in/amogh-shete-5133bb303/" target="_blank" rel="noopener noreferrer">LINKEDIN <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
          <a href="https://drive.google.com/drive/folders/1_byu6DyYM6W24F_0wwyaZfAJ-zN6VX1p?usp=share_link" target="_blank" rel="noopener noreferrer">RESUME <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
        </div>
      </div>
      <div class="mobile-menu-brand">
        Amogh <div class="mobile-menu-brand-icon" aria-hidden="true"></div> <span>Shete.</span>
      </div>
    </div>

    <div class="sc-page-title" aria-label="Project name">
      <h1 class="sc-page-title__text">RETHINKING PROCREATE</h1>
    </div>

    <!-- ── Main layout: scroll area + right nav ── -->
    <div class="sc-layout">

      <!-- Scroll container frame (accent border & top glow background wrapper) -->
      <div class="sc-scroll-frame">
        <div class="sc-scroll-frame-bg"></div>
        <div class="sc-scroll-track" id="sc-scroll-track">
          ${Array.from({ length: 9 }, (_, i) => `
            <img class="sc-scroll-img" src="/procreate-scroll/${i + 1}.jpg" alt="Scroll slice ${i + 1}" data-section="${sectionMapping[i]}" loading="eager" decoding="async" />
          `).join('')}
        </div>
      </div>

      <!-- Right section indicator -->
      <aside class="sc-section-nav" aria-label="Section navigator">
        <nav class="sc-section-nav__list">
          ${sectionNavMarkup}
        </nav>
      </aside>

    </div>

    <!-- Cursor -->
    <div class="sc-cursor" aria-hidden="true"></div>

  </div>
`

// ─── Lenis smooth scroll ──────────────────────────────────────────────────────

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const lenis = reducedMotion ? null : new Lenis({
  duration: 1.8,
  wheelMultiplier: 0.6,
  touchMultiplier: 0.8,
  smoothWheel: true,
  smoothTouch: false,
  easing: (t) => 1 - Math.pow(2, -10 * t)
})

if (lenis) {
  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// ─── Section nav indicator ────────────────────────────────────────────────────

const sectionNavItems = document.querySelectorAll('.sc-section-nav__item')
const scrollImgs = document.querySelectorAll('.sc-scroll-img')

const setActiveSection = (index) => {
  sectionNavItems.forEach((item, i) => {
    item.classList.toggle('is-active', i === index)
  })
}

// When clicking a section nav button, scroll to that image
sectionNavItems.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    // Find first image with that section index
    const target = Array.from(scrollImgs).find(img => Number(img.dataset.section) === i)
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -160, duration: 1.2 })
      } else {
        const rect = target.getBoundingClientRect()
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const imgTop = rect.top + scrollTop - 160
        window.scrollTo({ top: imgTop, behavior: 'smooth' })
      }
    }
  })
})

// IntersectionObserver to update active section on scroll
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const section = Number(entry.target.dataset.section)
        setActiveSection(section)
      }
    })
  },
  {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0
  }
)

scrollImgs.forEach(img => sectionObserver.observe(img))

// ─── Entrance animation ───────────────────────────────────────────────────────

const navbar = document.querySelector('.hero-topbar')
const mobileBack = document.querySelector('.sc-mobile-back')
const mobileMenuBtnSC = document.querySelector('.sc-mobile-menu-btn')
const pageTitle = document.querySelector('.sc-page-title')
const sectionNav = document.querySelector('.sc-section-nav')
const scrollFrame = document.querySelector('.sc-scroll-frame')
const isMobileSC = window.matchMedia('(max-width: 768px)').matches

if (!reducedMotion) {
  if (isMobileSC) {
    gsap.set([mobileBack, mobileMenuBtnSC, pageTitle, scrollFrame], { autoAlpha: 0, y: 16 })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(mobileBack, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1)
    tl.to(mobileMenuBtnSC, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.15)
    tl.to(pageTitle, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.22)
    tl.to(scrollFrame, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.38)
  } else {
    gsap.set([navbar, pageTitle, scrollFrame, sectionNav], { autoAlpha: 0, y: 16 })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(navbar, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
    tl.to(pageTitle, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.22)
    tl.to(scrollFrame, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.38)
    tl.to(sectionNav, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
  }
}

// Ensure hamburger is visible on mobile even without animation
if (isMobileSC && reducedMotion && mobileMenuBtnSC) {
  mobileMenuBtnSC.style.opacity = '1'
  mobileMenuBtnSC.style.visibility = 'visible'
}
// ─── Custom cursor ────────────────────────────────────────────────────────────

const cursor = document.querySelector('.sc-cursor')
let cursorVisible = false

const follow = {
  x: 0,
  y: 0,
  tx: 0,
  ty: 0
}
let wasVisible = false

window.addEventListener('pointermove', (e) => {
  follow.tx = e.clientX
  follow.ty = e.clientY
  if (!cursorVisible) {
    cursorVisible = true
    cursor?.classList.add('is-visible')
  }
}, { passive: true })

window.addEventListener('pointerleave', () => {
  cursorVisible = false
  cursor?.classList.remove('is-visible')
})

let lastTime = performance.now()
const updateFollow = (now) => {
  const dt = Math.min(64, now - lastTime) / 16.666
  lastTime = now

  if (cursorVisible) {
    if (!wasVisible) {
      follow.x = follow.tx
      follow.y = follow.ty
      wasVisible = true
    } else {
      const lerpFactor = 0.12
      follow.x += (follow.tx - follow.x) * lerpFactor * dt
      follow.y += (follow.ty - follow.y) * lerpFactor * dt
    }
  } else {
    wasVisible = false
    const lerpFactor = 0.12
    follow.x += (follow.tx - follow.x) * lerpFactor * dt
    follow.y += (follow.ty - follow.y) * lerpFactor * dt
  }

  if (cursor) {
    cursor.style.transform = `translate(${Math.round(follow.x)}px, ${Math.round(follow.y)}px) translate(-50%, -50%)`
  }

  requestAnimationFrame(updateFollow)
}

requestAnimationFrame(updateFollow)

const interactables = 'a, button, [role="button"]'
document.addEventListener('pointerover', e => { if (e.target.closest(interactables)) cursor?.classList.add('is-hovering') }, true)
document.addEventListener('pointerout', e => { if (e.target.closest(interactables)) cursor?.classList.remove('is-hovering') }, true)

// ─── Mobile menu open/close (same logic as hero section) ──────────────────────

const scMenuBtn = document.querySelector('.sc-mobile-menu-btn')
const scMenuPanel = document.querySelector('.mobile-menu-panel')
const scMenuOverlay = document.querySelector('.mobile-menu-overlay')
const scMenuClose = document.querySelector('.mobile-menu-close')

let scMenuTimeline = null

const initSCMobileMenu = () => {
  if (!scMenuPanel || !scMenuOverlay) return

  const menuItems = scMenuPanel.querySelectorAll('.mobile-menu-section-link, .mobile-menu-links a, .mobile-menu-brand, .mobile-menu-close')

  scMenuTimeline = gsap.timeline({ paused: true })
  scMenuTimeline.set(scMenuOverlay, { visibility: 'visible' }, 0)
  scMenuTimeline.set(scMenuPanel, { visibility: 'visible' }, 0)
  scMenuTimeline.to(scMenuOverlay, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
  scMenuTimeline.fromTo(scMenuPanel, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.out' }, 0)
  scMenuTimeline.fromTo(menuItems, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, 0.2)
}

const openSCMenu = () => {
  if (!scMenuTimeline) initSCMobileMenu()
  scMenuPanel?.setAttribute('aria-hidden', 'false')
  scMenuBtn?.setAttribute('aria-expanded', 'true')
  document.body.style.overflow = 'hidden'
  scMenuTimeline?.restart()
}

const closeSCMenu = () => {
  scMenuPanel?.setAttribute('aria-hidden', 'true')
  scMenuBtn?.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''
  scMenuTimeline?.reverse()
}

scMenuBtn?.addEventListener('click', openSCMenu)
scMenuClose?.addEventListener('click', closeSCMenu)
scMenuOverlay?.addEventListener('click', closeSCMenu)

// Close menu on link click
scMenuPanel?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeSCMenu)
})
