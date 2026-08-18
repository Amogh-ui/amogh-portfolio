import './trox.css'
import './trox-layout.css'
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
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer">BEHANCE <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
          <a href="#resume">RESUME <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
        </div>
      </div>
      <div class="mobile-menu-brand">
        Amogh <div class="mobile-menu-brand-icon" aria-hidden="true"></div> <span>Shete.</span>
      </div>
    </div>

    <!-- ── TROX Content ── -->
    <div class="trox-content">
      <h1 class="trox-title">TROX: THE REVERSAL <span class="project-solo-badge">✦ Solo Project</span></h1>
      
      <div class="trox-video-container">
        <video class="trox-video" src="/WhatsApp Video 2026-07-29 at 11.52.01-2.mp4" autoplay loop muted playsinline></video>
        <button class="trox-mute-btn" aria-label="Toggle mute">
          <svg class="icon-mute" style="display: block;" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
          </svg>
          <svg class="icon-unmute" style="display: none;" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
          </svg>
        </button>
      </div>

      <div class="trox-text-container">
        <p class="trox-text">I am currently leading the UI design, art direction, and branding for both TROX: The Reversal and its game studio. My work includes designing the HUD, menus, inventory, settings, interaction systems, and establishing a cohesive visual identity that enhances the game's immersive experience.</p>
        <p class="trox-text">TROX: The Reversal is a first-person psychological horror game set in a dystopian post-war world, where players uncover disturbing truths through atmospheric exploration, environmental storytelling, and puzzle-solving.</p>
      </div>

      <div class="trox-wip-container">
        <div class="trox-wip-glow"></div>
        <div class="trox-wip-text">WORK IN PROGRESS</div>
      </div>
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

// ─── Mobile Menu (copied from beyondthenet) ──────────────────────────────────
const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
const mobileMenuClose = document.querySelector('.mobile-menu-close')
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay')
const mobileMenuPanel = document.querySelector('.mobile-menu-panel')
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-panel a')

const openMenu = () => {
  mobileMenuBtn.setAttribute('aria-expanded', 'true')
  mobileMenuOverlay.classList.add('is-active')
  mobileMenuPanel.classList.add('is-active')
  if (lenis) lenis.stop()
  document.body.style.overflow = 'hidden'
}

const closeMenu = () => {
  mobileMenuBtn.setAttribute('aria-expanded', 'false')
  mobileMenuOverlay.classList.remove('is-active')
  mobileMenuPanel.classList.remove('is-active')
  if (lenis) lenis.start()
  document.body.style.overflow = ''
}

mobileMenuBtn.addEventListener('click', openMenu)
mobileMenuClose.addEventListener('click', closeMenu)
mobileMenuOverlay.addEventListener('click', closeMenu)
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', closeMenu)
})

// ─── Cursor logic ─────────────────────────────────────────────────────────────
const cursor = document.querySelector('.sc-cursor')
if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`
  })

  // Add hover effects for links and buttons
  const interactables = document.querySelectorAll('a, button')
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'))
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'))
  })
}

// ─── Video Mute Toggle ───────────────────────────────────────────────────────
const troxVideo = document.querySelector('.trox-video')
const troxMuteBtn = document.querySelector('.trox-mute-btn')
if (troxVideo && troxMuteBtn) {
  const iconMute = troxMuteBtn.querySelector('.icon-mute')
  const iconUnmute = troxMuteBtn.querySelector('.icon-unmute')
  
  troxMuteBtn.addEventListener('click', () => {
    troxVideo.muted = !troxVideo.muted
    if (troxVideo.muted) {
      iconMute.style.display = 'block'
      iconUnmute.style.display = 'none'
    } else {
      iconMute.style.display = 'none'
      iconUnmute.style.display = 'block'
    }
  })
}

// ─── Entrance animation ───────────────────────────────────────────────────────
const tl = gsap.timeline()
tl.fromTo('.hero-topbar',
  { y: -20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  0.2
)
tl.fromTo('.sc-mobile-back, .sc-mobile-menu-btn',
  { opacity: 0, scale: 0.9 },
  { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
  0.2
)
tl.fromTo('.trox-content',
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
  0.4
)
