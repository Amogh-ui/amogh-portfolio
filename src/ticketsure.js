import './ticketsure.css'
import gsap from 'gsap'
import Lenis from 'lenis'

const app = document.querySelector('#app')
if (!app) throw new Error('App root not found.')

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
        <a href="#behance">
          <span>BEHANCE</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href="#resume">
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

    <!-- ── Mobile-only: hamburger + menu panel ── -->
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
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer">BEHANCE</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href="#resume">RESUME</a>
        </div>
      </div>
      <div class="mobile-menu-brand">
        Amogh <div class="mobile-menu-brand-icon" aria-hidden="true"></div> <span>Shete.</span>
      </div>
    </div>

    <!-- ── Page title ── -->
    <div class="sc-page-title" aria-label="Project name">
      <h1 class="sc-page-title__text">TICKETSURE</h1>
      <div><span class="project-solo-badge">✦ Solo Project</span></div>
    </div>

    <!-- ── Main layout: PDF ── -->
    <div class="sc-layout" style="display: block; width: 100%; max-width: 1400px; margin: 0 auto; padding: 2rem; position: relative; z-index: 2;">
      <iframe src="/ticketsure.pdf" width="100%" height="85vh" style="border: none; border-radius: 20px; min-height: 800px; display: block; background: #fff;" allowfullscreen></iframe>
    </div>

    <!-- Cursor -->
    <div class="sc-cursor" aria-hidden="true"></div>

  </div>
`

// ─── Entrance animation ───────────────────────────────────────────────────────

const navbar = document.querySelector('.hero-topbar')
const mobileBack = document.querySelector('.sc-mobile-back')
const mobileMenuBtnSC = document.querySelector('.sc-mobile-menu-btn')
const pageTitle = document.querySelector('.sc-page-title')
const scrollFrame = document.querySelector('.sc-layout')
const isMobileSC = window.matchMedia('(max-width: 768px)').matches
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reducedMotion) {
  if (isMobileSC) {
    gsap.set([mobileBack, mobileMenuBtnSC, pageTitle, scrollFrame], { autoAlpha: 0, y: 16 })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(mobileBack, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1)
    tl.to(mobileMenuBtnSC, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.15)
    tl.to(pageTitle, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.22)
    tl.to(scrollFrame, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.38)
  } else {
    gsap.set([navbar, pageTitle, scrollFrame], { autoAlpha: 0, y: 16 })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(navbar, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
    tl.to(pageTitle, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.22)
    tl.to(scrollFrame, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.38)
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
  
  if (!wasVisible) {
    cursor.style.opacity = 1
    cursor.style.transform = `translate3d(${follow.tx}px, ${follow.ty}px, 0)`
    follow.x = follow.tx
    follow.y = follow.ty
    wasVisible = true
  }
})

const renderCursor = () => {
  if (wasVisible) {
    follow.x += (follow.tx - follow.x) * 0.15
    follow.y += (follow.ty - follow.y) * 0.15
    cursor.style.transform = `translate3d(${follow.x}px, ${follow.y}px, 0)`
  }
  requestAnimationFrame(renderCursor)
}
renderCursor()

const links = document.querySelectorAll('a, button, .sc-section-nav__item')
links.forEach(link => {
  link.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'))
  link.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'))
})

// ─── Mobile Menu Logic ────────────────────────────────────────────────────────
const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
const mobileMenuClose = document.querySelector('.mobile-menu-close')
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay')
const mobileMenuPanel = document.querySelector('.mobile-menu-panel')
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-section-link, .mobile-menu-links a')

let isMenuOpen = false

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen
  mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen)
  
  if (isMenuOpen) {
    mobileMenuOverlay.classList.add('is-active')
    mobileMenuPanel.classList.add('is-active')
    document.body.style.overflow = 'hidden'
  } else {
    mobileMenuOverlay.classList.remove('is-active')
    mobileMenuPanel.classList.remove('is-active')
    document.body.style.overflow = ''
  }
}

mobileMenuBtn?.addEventListener('click', toggleMobileMenu)
mobileMenuClose?.addEventListener('click', toggleMobileMenu)
mobileMenuOverlay?.addEventListener('click', toggleMobileMenu)
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', toggleMobileMenu)
})
