import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createShaderAnimation } from './shaderAnimation.js'
import { createHalftoneAnimation } from './halftoneAnimation.js'

gsap.registerPlugin(ScrollTrigger)



const app = document.querySelector('#app')

if (!app) {
  throw new Error('App root not found.')
}

window.triggerHaptic = (pattern = 15) => {
  if (window.matchMedia('(max-width: 768px)').matches && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch (e) {}
  }
}

// Unlock vibration API on first user interaction
let hapticsUnlocked = false
const unlockHaptics = (e) => {
  if (hapticsUnlocked) return
  
  // Browsers often don't grant user activation on 'down' events to prevent spam
  if (e.type === 'touchstart' || e.type === 'pointerdown') return

  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      // navigator.vibrate returns true if successful (e.g. user gesture was accepted)
      const success = navigator.vibrate(1)
      if (success) {
        hapticsUnlocked = true
        const events = ['touchstart', 'touchend', 'click', 'pointerdown']
        events.forEach(ev => document.removeEventListener(ev, unlockHaptics))
      }
    } catch (err) {}
  }
}
if (typeof document !== 'undefined') {
  const events = ['touchstart', 'touchend', 'click', 'pointerdown']
  events.forEach(e => document.addEventListener(e, unlockHaptics, { passive: true }))
}

const topNavLinks = [
  { label: 'BEHANCE', href: 'https://www.behance.net/Amogh-Shete' },
  { label: 'RESUME', href: '#resume' }
]

const topNavMarkup = topNavLinks
  .map(
    ({ label, href }) => `
      <a href="${href}">
        <span>${label}</span>
        <span aria-hidden="true">↗</span>
      </a>
    `
  )
  .join('')

const pillNavMarkup = [
  { label: 'Work', href: '#work' },
  { label: 'Info', href: '#info' }
]
  .map(
    ({ label, href }) => `
      <a class="hero-pill__item" href="${href}">
        <span>${label}</span>
      </a>
    `
  )
  .join('')

const createGlyphMarkup = (text) =>
  Array.from(text)
    .map((glyph) => {
      const content = glyph === ' ' ? '&nbsp;' : glyph
      return `<span class="title-glyph">${content}</span>`
    })
    .join('')

const nameMarkup = `
  <span class="name-first name-group">${createGlyphMarkup('Amogh')}</span>
  <span class="name-last name-group">${createGlyphMarkup('Shete.')}</span>
`

const createIntroGlyphMarkup = (text) =>
  Array.from(text)
    .map((glyph) => {
      const content = glyph === ' ' ? '&nbsp;' : glyph
      return `<span class="intro-glyph">${content}</span>`
    })
    .join('')

const createIntroWordMarkup = (text, className = '') =>
  `<span class="intro-word ${className}">${createIntroGlyphMarkup(text)}</span>`
const glassAsset = (fileName) => `/icons/glass/${encodeURIComponent(fileName)}`

const workPreviewImage = new URL('../images/AM-FREEBIES-IP-005 1.jpg', import.meta.url).href
const beyondTheNetImage = new URL('../images/beyond-the-net-thumbnail.jpg', import.meta.url).href
const troxImage = new URL('../images/trox-thumbnail.png', import.meta.url).href
const ticketsureImage = new URL('../images/ticketsure-thumbnail.jpg', import.meta.url).href

// ─── Real Asset Preloader ─────────────────────────────────────────────────────
// Kick off all critical image loads immediately so they're warmed up in the
// browser cache before the intro animation finishes. The progress bar and the
// exit of the loader are both driven by *actual* loading state.
let _loaderProgress = 0
let _assetsLoaded = false
let _assetsResolve
const _assetsReady = new Promise(res => { _assetsResolve = res })

;(() => {
  const criticalUrls = [
    '/icons/shape.svg',
    '/icons/glass/gradient%20glass%20(11).png',
    '/icons/glass/gradient%20glass%20(21).png',
    '/icons/glass/gradient%20glass%20(8).png',
    '/icons/glass/dispersion%20glass%20(16).png',
    '/screencalorie-scroll/1.jpg',
    '/screencalorie-scroll/2.jpg',
    '/screencalorie-scroll/3.jpg',
    '/screencalorie-scroll/4.jpg',
    '/screencalorie-scroll/5.jpg',
    '/screencalorie-scroll/6.jpg',
    '/beyond-the-net-scroll/1.jpg',
    '/beyond-the-net-scroll/2.jpg',
    '/beyond-the-net-scroll/3.jpg',
    '/beyond-the-net-scroll/4.jpg',
    '/beyond-the-net-scroll/5.jpg',
    '/beyond-the-net-scroll/6.jpg',
    '/beyond-the-net-scroll/7.jpg',
    '/beyond-the-net-scroll/8.jpg',
    workPreviewImage,
    beyondTheNetImage,
    troxImage,
    ticketsureImage
  ]

  let loaded = 0
  const total = criticalUrls.length

  criticalUrls.forEach(src => {
    const img = new Image()
    img.onload = img.onerror = () => {
      loaded++
      _loaderProgress = loaded / total
      if (loaded >= total) {
        _assetsLoaded = true
        _assetsResolve()
      }
    }
    img.src = src
  })
})()

const workItems = [
  {
    id: 'screen-calorie',
    number: '01',
    title: 'ScreenCalorie',
    year: '2025',
    description:
      'ScreenCalorie is a mental metabolism app that reframes screen time as balance instead of restriction. Using a calorie-based metaphor, the app tracks productive and unproductive usage through “sCals,” introducing smart nudges, micro-interruptions, and recovery prompts to help users build intentional digital habits without removing autonomy.',
    tags: ['UI/UX', 'App Design', 'Brand Identity'],
    isSoloProject: true
  },
  {
    id: 'beyond-the-net',
    number: '02',
    title: 'Beyond the Net',
    year: '2025',
    description:
      'Beyond the Net is a sports experience concept that turns match stats into a sharper digital story, pairing live performance cues with clearer score-state feedback and a more deliberate visual hierarchy.',
    tags: ['Product Design', 'Dashboard', 'Visual System'],
    image: beyondTheNetImage,
    isSoloProject: true
  },
  {
    id: 'paalan',
    number: '03',
    title: 'Paalan',
    year: '2026',
    description:
      'Paalan is a caregiving companion concept designed to make daily check-ins, support notes, and routine coordination feel calmer and easier to navigate.',
    tags: ['UX Design', 'Service Design', 'App Flow']
  },
  {
    id: 'popclozet',
    number: '04',
    title: 'Popclozet',
    year: '2026',
    description:
      'Popclozet explores a more editorial shopping flow for fashion discovery, mixing wardrobe curation, styling prompts, and a cleaner product presentation.',
    tags: ['E-Commerce', 'Art Direction', 'Visual Identity'],
    image: '/popclozet-thumbnail.jpg'
  },
  {
    id: 'ticketsure',
    number: '05',
    title: 'TicketSure',
    year: '2025',
    description:
      'TicketSure is a ticketing concept focused on reducing friction in seat selection, purchase states, and post-booking clarity for faster event checkout.',
    tags: ['Mobile UX', 'Booking Flow', 'Brand System'],
    image: ticketsureImage,
    isSoloProject: true
  },
  {
    id: 'trox',
    number: '06',
    title: 'TROX: The Reversal',
    year: '2026',
    description:
      'TROX: The Reversal is a first-person psychological horror game set in a dystopian post-war world, where players uncover disturbing truths through atmospheric exploration, environmental storytelling, and puzzle-solving.',
    tags: ['Game UI', 'UX Design', 'HUD Design'],
    image: troxImage,
    isSoloProject: true
  },
  {
    id: 'procreate',
    number: '07',
    title: 'Rethinking Procreate',
    year: '2026',
    description:
      'Rethinking Procreate is an ergonomic evaluation and redesign of Procreate\'s interface, reimagining usability patterns, tool accessibility, and creative workflow to better serve digital artists.',
    tags: ['UX Research', 'Ergonomic Design', 'Redesign'],
    image: '/procreate-thumbnail.jpg'
  }
]

const worksMarkup = `
  <section class="works-section" id="work" aria-label="Works">
    <div class="works-view-toggle" aria-label="Switch view">
      <button class="works-view-btn" data-works-view="list" type="button" aria-label="List view" title="List view">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="1" width="18" height="2" rx="1" fill="currentColor"/>
          <rect x="0" y="8" width="18" height="2" rx="1" fill="currentColor"/>
          <rect x="0" y="15" width="18" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>
      <button class="works-view-btn is-active" data-works-view="grid" type="button" aria-label="Grid view" title="Grid view">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="6.5" y="0" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="13" y="0" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="0" y="6.5" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="6.5" y="6.5" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="13" y="6.5" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="0" y="13" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="6.5" y="13" width="5" height="5" rx="1" fill="currentColor"/>
          <rect x="13" y="13" width="5" height="5" rx="1" fill="currentColor"/>
        </svg>
      </button>
    </div>
    <div class="works-section__inner">
      <div class="works-section__frame">
        <div class="works-list" role="list" style="display:none;">
          ${workItems
            .map(
              (item) => `
                <button class="work-card" type="button" data-work-card data-work-id="${item.id}" aria-expanded="false">
                  <div class="work-card__header">
                    <span class="work-card__number">${item.number}</span>
                    <span class="work-card__title">${item.title}</span>
                    <span class="work-card__year">${item.year}</span>
                    <div class="work-card__mobile-arrow" aria-hidden="true">
                      <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.72308 16L0 14.2769L11.8154 2.46154H1.23077V0H16V14.7692H13.5385V4.18462L1.72308 16Z" fill="#e0e0e0"/>
                      </svg>
                    </div>
                  </div>

                  <div class="work-card__body">
                    <div class="work-card__copy">
                      <div class="work-card__tags">
                        ${[...(item.isSoloProject ? ['✦ Solo Project'] : []), ...item.tags].map(tag => `<span class="work-chip ${tag === '✦ Solo Project' ? 'work-chip--solo' : ''}">${tag}</span>`).join('')}
                      </div>
                      <div class="work-card__details">
                        <p class="work-card__eyebrow">Overview:</p>
                        <p class="work-card__description">${item.description}</p>
                      </div>
                    </div>

                    <div class="work-card__media">
                      <img src="${item.image || workPreviewImage}" alt="${item.title} preview" />
                    </div>
                  </div>
                </button>
              `
            )
            .join('')}
        </div>

        <div class="works-grid" role="list">
          ${workItems
            .map(
              (item) => `
                <button class="works-grid-card" type="button" data-grid-card data-work-id="${item.id}">
                  <div class="works-grid-card__media">
                    <img src="${item.image || workPreviewImage}" alt="${item.title} preview" />
                  </div>
                  <div class="works-grid-card__content">
                    <div class="works-grid-card__meta">
                      <span class="works-grid-card__number">${item.number}</span>
                      <span class="works-grid-card__year">${item.year}</span>
                    </div>
                    <h3 class="works-grid-card__title">${item.title}</h3>
                    <div class="works-grid-card__tags">
                      ${[...(item.isSoloProject ? ['✦ Solo Project'] : []), ...item.tags].map(tag => `<span class="works-grid-chip ${tag === '✦ Solo Project' ? 'works-grid-chip--solo' : ''}">${tag}</span>`).join('')}
                    </div>
                    <div class="works-grid-card__arrow" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.72308 16L0 14.2769L11.8154 2.46154H1.23077V0H16V14.7692H13.5385V4.18462L1.72308 16Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </button>
              `
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>
`

const peripheryMarkup = `
  <section class="periphery-section" aria-label="Introduction" id="info">
    <div class="periphery-stage">
      <div class="periphery-inner">
        <!-- Floating Elements Container -->
        <div class="periphery-orbit">
          <!-- Floating Work Thumbnails -->
          <div class="periphery-item p-img-1" data-depth="40"><div class="p-anim periphery-img"><img src="${workPreviewImage}" alt="ScreenCalorie" /></div></div>
          <div class="periphery-item p-img-2" data-depth="60"><div class="p-anim periphery-img"><img src="${beyondTheNetImage}" alt="Beyond the Net" /></div></div>
          <div class="periphery-item p-img-3" data-depth="20"><div class="p-anim periphery-img"><img src="/beyond-the-net-scroll/3.jpg" alt="Documentation preview" /></div></div>
          <div class="periphery-item p-img-4" data-depth="70"><div class="p-anim periphery-img"><img src="/popclozet-thumbnail.jpg" alt="Popclozet" /></div></div>
          <div class="periphery-item p-img-5" data-depth="30"><div class="p-anim periphery-img"><img src="${ticketsureImage}" alt="TicketSure" /></div></div>
          <div class="periphery-item p-img-6" data-depth="50"><div class="p-anim periphery-img"><img src="${troxImage}" alt="TROX" /></div></div>
          <div class="periphery-item p-img-7" data-depth="80"><div class="p-anim periphery-img"><img src="/procreate-thumbnail.jpg" alt="Rethinking Procreate" /></div></div>
          <div class="periphery-item p-img-8" data-depth="45"><div class="p-anim periphery-img"><img src="/screencalorie-scroll/4.jpg" alt="Documentation preview" /></div></div>

          <!-- Floating Skill Tags -->
          <div class="periphery-item p-tag-1" data-depth="55"><div class="p-anim periphery-tag">PRODUCT DESIGN</div></div>
          <div class="periphery-item p-tag-2" data-depth="35"><div class="p-anim periphery-tag">VISUAL DESIGN</div></div>
          <div class="periphery-item p-tag-3" data-depth="65"><div class="p-anim periphery-tag">WEB DESIGN</div></div>
          <div class="periphery-item p-tag-4" data-depth="25"><div class="p-anim periphery-tag">UX RESEARCH</div></div>
        </div>

        <!-- Central Text -->
        <div class="periphery-text">
          I enjoy meaningful conversations,<br>
          thoughtful experiences, and the quiet<br>
          satisfaction of understanding something<br>
          a little better than I did yesterday.
        </div>
      </div>
    </div>
  </section>
`

const curiousByNatureMarkup = `
  <section class="below-intro" aria-label="Introduction">
    <div class="below-intro__stage">
      <div class="below-intro__copy">
        <div class="below-intro__line below-intro__line--one">
          ${createIntroWordMarkup('CURIOUS BY')}
          <img class="below-intro__glass below-intro__glass--a" src="${glassAsset('gradient glass (11).png')}" alt="" aria-hidden="true">
          ${createIntroWordMarkup('NATURE,', 'below-intro__word--italic')}
        </div>

        <div class="below-intro__line below-intro__line--two">
          ${createIntroWordMarkup('BUILDING')}
          <img class="below-intro__glass below-intro__glass--b" src="${glassAsset('gradient glass (21).png')}" alt="" aria-hidden="true">
          ${createIntroWordMarkup('MEANINGFUL')}
        </div>

        <div class="below-intro__line below-intro__line--three">
          ${createIntroWordMarkup('EXPERIENCES,', 'below-intro__word--italic')}
          <img class="below-intro__glass below-intro__glass--c" src="${glassAsset('gradient glass (8).png')}" alt="" aria-hidden="true">
          ${createIntroWordMarkup('ONE')}
        </div>

        <div class="below-intro__line below-intro__line--four">
          ${createIntroWordMarkup('INTERACTION')}
          <img class="below-intro__glass below-intro__glass--d" src="${glassAsset('dispersion glass (16).png')}" alt="" aria-hidden="true">
          ${createIntroWordMarkup('AT A TIME.')}
        </div>
      </div>
    </div>
  </section>
`

app.innerHTML = `
  <main class="app">
    <div class="hero-stage">
      <section class="scene scene-intro" aria-label="Intro">
        <div class="loading-progress-bar">
          <div class="loading-progress-fill"></div>
        </div>
        <div class="loading-percentage">0%</div>
        <div class="tap-to-enter-hint">TAP TO ENTER</div>
      </section>

      <section class="scene scene-sweep" aria-hidden="true">
        <div class="sweep-fill"></div>
      </section>

      <section class="scene scene-hero" aria-label="Hero">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-shell">
        </div>
      </section>

      <div class="mobile-scroll-spinner" aria-hidden="true">
        <svg class="mobile-scroll-spinner__svg" viewBox="0 0 200 200" role="presentation" focusable="false">
          <defs>
            <path id="mobile-orbit-path" d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
          </defs>
          <text class="mobile-scroll-spinner__text" text-anchor="middle">
            <textPath href="#mobile-orbit-path" xlink:href="#mobile-orbit-path" startOffset="50%" textLength="440">SCROLL • SCROLL • SCROLL •</textPath>
          </text>
        </svg>
      </div>

      <header class="hero-topbar" aria-label="Hero navigation">
        <a class="hero-brand liquid-glass" href="/" aria-label="Home">
          <span class="hero-brand__first">Amogh</span>
          <img class="hero-brand__icon" src="/icons/shape.svg" alt="" aria-hidden="true">
          <span class="hero-brand__last">Shete.</span>
        </a>

        <nav class="hero-pill liquid-glass" aria-label="Primary">
          ${pillNavMarkup}
        </nav>

        <nav class="hero-links" aria-label="Secondary">
          ${topNavMarkup}
        </nav>
      </header>

      <button class="mobile-menu-btn liquid-glass" aria-label="Open menu" aria-expanded="false">
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
            <a href="#work" class="mobile-menu-section-link" data-mobile-nav>Work</a>
            <a href="#info" class="mobile-menu-section-link" data-mobile-nav>Info</a>
          </div>
          <div class="mobile-menu-links">
            <a href="https://www.behance.net/Amogh-Shete" target="_blank" rel="noopener noreferrer">BEHANCE <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
            <a href="#resume">RESUME <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.29231 12L0 10.7077L8.86154 1.84615H0.923077V0H12V11.0769H10.1538V3.13846L1.29231 12Z" fill="#656565"/></svg></a>
          </div>
        </div>
        <div class="mobile-menu-brand">
          Amogh <div class="mobile-menu-brand-icon" aria-hidden="true"></div> <span>Shete.</span>
        </div>
      </div>

      <div class="shared-title" aria-hidden="true">
        ${nameMarkup}
        <div class="shared-title-blue" aria-hidden="true">
          ${nameMarkup}
        </div>
        <div class="hero-cursor-glow" aria-hidden="true"></div>
      </div>

      <div class="cursor-follower" aria-hidden="true">
        <span class="cursor-follower__label">VIEW</span>
      </div>

      <div class="cursor-orbit" aria-hidden="true">
        <svg class="cursor-orbit__svg" viewBox="0 0 200 200" role="presentation" focusable="false">
          <defs>
            <path id="cursor-orbit-path" d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
          </defs>
          <text class="cursor-orbit__text" text-anchor="middle">
            <textPath href="#cursor-orbit-path" xlink:href="#cursor-orbit-path" startOffset="50%">SCROLL • SCROLL • SCROLL • SCROLL •</textPath>
          </text>
        </svg>
      </div>
    </div>

    ${peripheryMarkup}

    ${worksMarkup}

    ${curiousByNatureMarkup}

    <footer class="footer_wrap_main" data-footer-parallax>
      <div class="footer_wrap" data-footer-parallax-inner>
        <div class="footer_top_row">
          <div class="footer_email">sheteamogh@gmail.com</div>
          <div class="footer_time_val" data-footer-time>12:00:00 AM</div>
        </div>
        <div class="footer_links_row">
          <div class="footer_nav_links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN <span>↗</span></a>
            <a href="#resume">RESUME <span>↗</span></a>
            <a href="https://www.behance.net/Amogh-Shete" target="_blank" rel="noopener noreferrer">BEHANCE <span>↗</span></a>
          </div>
          <div class="footer_developed_in">Developed in VS Code</div>
        </div>
      </div>
      <div class="footer_canvas_bottom" data-canvas-container data-cursor-text="Hold to disrupt">
        <canvas data-canvas class="footer_canvas_item"></canvas>
        <button class="mobile_hold_btn" aria-label="Hold to disrupt">HOLD TO DISRUPT</button>
        <div class="footer_canvas_content">
          <div class="footer_canvas_brand" data-canvas-content="left">
            <span class="amogh">Amogh</span>
            <img class="footer_canvas_icon_mobile" src="/icons/shape.svg" alt="" aria-hidden="true">
            <span class="shete">Shete.</span>
          </div>
          <img class="footer_canvas_icon" data-canvas-content="right" src="/icons/shape.svg" alt="" aria-hidden="true">
        </div>
      </div>
    </footer>
  </main>
`

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const appRoot = document.querySelector('.app')
const introScene = document.querySelector('.scene-intro')
const loadingPercentage = document.querySelector('.loading-percentage')
const loadingProgressBar = document.querySelector('.loading-progress-bar')
const loadingProgressFill = document.querySelector('.loading-progress-fill')
const sweepScene = document.querySelector('.scene-sweep')
const heroScene = document.querySelector('.scene-hero')
const heroTopbar = document.querySelector('.hero-topbar')
const sharedTitle = document.querySelector('.shared-title')
const cursorFollower = document.querySelector('.cursor-follower')
const cursorOrbit = document.querySelector('.cursor-orbit')
const peripherySection = document.querySelector('.periphery-section')
const peripheryInner = document.querySelector('.periphery-inner')
const peripheryItems = gsap.utils.toArray('.periphery-item')
const peripheryText = document.querySelector('.periphery-text')
const belowIntro = document.querySelector('.below-intro')
const belowIntroCopy = document.querySelector('.below-intro__copy')
const introLines = gsap.utils.toArray('.below-intro__line')
const introGlasses = gsap.utils.toArray('.below-intro__glass')
const titleGlyphs = gsap.utils.toArray('.shared-title > .name-group .title-glyph')
const introGlyphRows = introLines.map((line) => Array.from(line.querySelectorAll('.intro-glyph')))
const heroBg = document.querySelector('.hero-bg')
const worksSection = document.querySelector('.works-section')
const footerSection = document.querySelector('.footer_wrap_main')
const workCards = gsap.utils.toArray('.work-card')
const shaderCleanup = createShaderAnimation(heroBg, { reducedMotion })
const lenis = reducedMotion
  ? null
  : new Lenis({
      duration: 1.8,
      wheelMultiplier: 0.6,
      touchMultiplier: 0.8,
      smoothWheel: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(2, -10 * t)
    })

if (lenis) {
  if (!reducedMotion && !window.location.hash) {
    lenis.stop()
    document.body.classList.add('is-scroll-locked')
  }

  // Intercept anchor clicks starting with '#' for smooth scrolling
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]')
    if (anchor) {
      const targetId = anchor.getAttribute('href')
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          e.preventDefault()
          lenis.scrollTo(targetElement, { duration: 1.2 })
        }
      }
    }
  })
}

let booted = false
let cursorReady = false
let workCursorHover = false

const getCursorOrbitFade = () => {
  const scrollY = Math.max(window.scrollY, lenis ? lenis.scroll : 0)
  const fadeEnd = Math.max(window.innerHeight * 0.45, 250)
  const introProgress = clamp(scrollY / fadeEnd, 0, 1)

  return 1 - introProgress
}

const updateCursorOrbitVisuals = (baseVisibility = 1) => {
  if (!cursorOrbit) return
  const fade = getCursorOrbitFade()
  const opacity = baseVisibility * fade
  const blur = (1 - fade) * 18
  cursorOrbit.style.opacity = `${opacity}`
  cursorOrbit.style.filter = `blur(${blur}px)`
}

const syncCursorLayers = (x, y, visible) => {
  if (cursorFollower) {
    cursorFollower.style.opacity = `${workCursorHover ? 1 : visible}`
    cursorFollower.classList.toggle('is-work-hover', workCursorHover)
  }

  updateCursorOrbitVisuals(visible)
}

const setWorkCursorHover = (isHovering, text = 'VIEW') => {
  if (window.matchMedia('(max-width: 768px)').matches) return
  
  workCursorHover = isHovering
  appRoot?.classList.toggle('is-work-cursor-hover', isHovering)

  if (cursorFollower) {
    const label = cursorFollower.querySelector('.cursor-follower__label')
    if (label) {
      label.textContent = isHovering ? text : 'VIEW'
      label.style.opacity = isHovering ? '1' : '0'
      label.style.transform = isHovering ? 'scale(1)' : 'scale(0.25)'
      label.style.filter = isHovering ? 'blur(0px)' : 'blur(4px)'
    }

    cursorFollower.style.opacity = `${isHovering ? 1 : Number(appRoot?.style.getPropertyValue('--cursor-follow-visible') || '0')}`
    cursorFollower.style.width = isHovering ? (text.length > 5 ? 'auto' : '48px') : '16px'
    cursorFollower.style.height = isHovering ? '20px' : '16px'
    cursorFollower.style.borderRadius = isHovering ? '0' : '50%'
    cursorFollower.style.background = '#0a5cff'
    cursorFollower.style.boxShadow = isHovering ? 'none' : '0 0 0 1px rgba(52, 124, 255, 0.2), 0 8px 22px rgba(18, 78, 255, 0.18)'
    cursorFollower.style.display = isHovering ? 'flex' : 'block'
    cursorFollower.style.alignItems = isHovering ? 'center' : ''
    cursorFollower.style.justifyContent = isHovering ? 'center' : ''
    cursorFollower.style.paddingLeft = isHovering ? '8px' : '0'
    cursorFollower.style.paddingRight = isHovering ? '8px' : '0'
  }

  updateCursorOrbitVisuals(isHovering ? 0 : Number(appRoot?.style.getPropertyValue('--cursor-follow-visible') || '0'))
}

// Global pointer tracking for the intro follower (viewport coords)
if (appRoot) {
  const onPointerMoveGlobal = (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    appRoot.style.setProperty('--cursor-follow-x', `${e.clientX}px`)
    appRoot.style.setProperty('--cursor-follow-y', `${e.clientY}px`)
    const cursorVisible = cursorReady ? 1 : 0
    appRoot.classList.toggle('is-cursor-active', cursorReady)
    appRoot.style.setProperty('--cursor-follow-visible', `${cursorVisible}`)
    syncCursorLayers(e.clientX, e.clientY, cursorVisible)
  }

  const onPointerLeaveGlobal = () => {
    appRoot.style.setProperty('--cursor-follow-visible', '0')
    appRoot.classList.remove('is-cursor-active')
    syncCursorLayers(-200, -200, 0)
  }

  window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true })
  window.addEventListener('pointerleave', onPointerLeaveGlobal)
  window.addEventListener('blur', onPointerLeaveGlobal)
}

const setActiveWorkCard = (activeCard) => {
  if (activeCard) {
    activeCard.classList.add('is-active')
    activeCard.setAttribute('aria-expanded', 'true')
  }
}

// Refresh ScrollTrigger after card layout changes so the footer parallax
// always reads the correct trigger positions regardless of expanded state.
let _stRefreshTimer = null
const scheduleSTRefresh = () => {
  if (_stRefreshTimer) clearTimeout(_stRefreshTimer)
  _stRefreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
}

if (worksSection && workCards.length) {
  workCards.forEach((card) => {
    card.addEventListener('pointerenter', () => {
      if (window.matchMedia('(max-width: 768px)').matches) return
      setActiveWorkCard(card)
      setWorkCursorHover(true)
      scheduleSTRefresh()
    })
    card.addEventListener('pointerleave', () => {
      if (window.matchMedia('(max-width: 768px)').matches) return
      setWorkCursorHover(false)
      scheduleSTRefresh()
    })
    card.addEventListener('focus', () => {
      if (window.matchMedia('(max-width: 768px)').matches) return
      setActiveWorkCard(card)
      setWorkCursorHover(true)
      scheduleSTRefresh()
    })
    card.addEventListener('blur', () => {
      if (window.matchMedia('(max-width: 768px)').matches) return
      setWorkCursorHover(false)
      scheduleSTRefresh()
    })
    card.addEventListener('click', () => {
      if (window.triggerHaptic) window.triggerHaptic(15)
      setActiveWorkCard(card)
      const workId = card.dataset.workId
      const pageMap = {
        'screen-calorie': '/screencalorie.html',
        'beyond-the-net': '/beyondthenet.html',
        'trox': '/trox.html',
        'popclozet': '/popclozet.html',
        'ticketsure': '/ticketsure.html',
        'procreate': '/procreate.html'
      }
      const href = pageMap[workId]
      if (href) {
        window.location.href = href
      }
    })
  })

  worksSection.addEventListener('focusout', (event) => {
    if (!worksSection.contains(event.relatedTarget)) {
      setActiveWorkCard(null)
      setWorkCursorHover(false)
      scheduleSTRefresh()
    }
  })
  worksSection.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setActiveWorkCard(null)
      setWorkCursorHover(false)
      scheduleSTRefresh()
    }
  })
}

// ─── Works View Toggle (Desktop Only) ──────────────────────────────────────
const viewToggleBtns = document.querySelectorAll('.works-view-btn')
const worksList = document.querySelector('.works-list')
const worksGrid = document.querySelector('.works-grid')
let currentWorksView = 'grid'
let _isToggling = false

const pageMap = {
  'screen-calorie': '/screencalorie.html',
  'beyond-the-net': '/beyondthenet.html',
  'trox': '/trox.html',
  'popclozet': '/popclozet.html',
  'ticketsure': '/ticketsure.html',
  'procreate': '/procreate.html'
}

// Grid card interaction & cursor hover handlers
const gridCards = document.querySelectorAll('.works-grid-card[data-grid-card]')
gridCards.forEach((card) => {
  card.addEventListener('pointerenter', () => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    setWorkCursorHover(true)
  })
  card.addEventListener('pointerleave', () => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    setWorkCursorHover(false)
  })
  card.addEventListener('focus', () => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    setWorkCursorHover(true)
  })
  card.addEventListener('blur', () => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    setWorkCursorHover(false)
  })
  card.addEventListener('click', () => {
    const workId = card.dataset.workId
    const href = pageMap[workId]
    if (href) window.location.href = href
  })
})

const switchWorksView = (targetView) => {
  if (targetView === currentWorksView || _isToggling) return
  if (window.matchMedia('(max-width: 768px)').matches) return
  if (!worksList || !worksGrid) return

  setWorkCursorHover(false)
  _isToggling = true
  const outgoing = targetView === 'grid' ? worksList : worksGrid
  const incoming = targetView === 'grid' ? worksGrid : worksList

  // Update toggle button active state
  viewToggleBtns.forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.worksView === targetView)
  })

  // Crossfade: fade out current view
  gsap.to(outgoing, {
    opacity: 0,
    y: 12,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      outgoing.style.display = 'none'
      gsap.set(outgoing, { clearProps: 'opacity,y' })

      // Show incoming view
      incoming.style.display = ''
      const incomingCards = incoming.querySelectorAll('.work-card, .works-grid-card')

      gsap.set(incoming, { opacity: 0 })
      gsap.set(incomingCards, { opacity: 0, y: 20, scale: 0.98 })

      gsap.to(incoming, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out'
      })

      gsap.to(incomingCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power3.out',
        onComplete: () => {
          _isToggling = false
          currentWorksView = targetView
          ScrollTrigger.refresh()
        }
      })
    }
  })
}

viewToggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchWorksView(btn.dataset.worksView)
  })
})

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const mixColor = (fromHex, toHex, amount) => {
  const clampAmount = clamp(amount, 0, 1)
  const from = fromHex.replace('#', '')
  const to = toHex.replace('#', '')
  const fromValue = [0, 2, 4].map((index) => parseInt(from.slice(index, index + 2), 16))
  const toValue = [0, 2, 4].map((index) => parseInt(to.slice(index, index + 2), 16))
  const mixed = fromValue.map((channel, index) => Math.round(channel + (toValue[index] - channel) * clampAmount))

  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`
}

const applyIntroScrollState = (progress) => {
  if (!belowIntroCopy || window.matchMedia('(max-width: 768px)').matches) {
    return
  }

  const stageProgress = clamp(progress, 0, 1)
  const blurReveal = clamp(stageProgress / 0.3, 0, 1)
  const fillReveal = clamp((stageProgress - 0.18) / 0.7, 0, 1)
  const textBlur = (1 - blurReveal) * 16
  const baseColor = '#4c4c4c'
  const filledColor = '#e0e0e0'

  belowIntroCopy.style.opacity = `${0.28 + blurReveal * 0.72}`
  belowIntroCopy.style.filter = `blur(${textBlur}px)`

  introGlyphRows.forEach((glyphRow, rowIndex) => {
    const rowStart = 0.12 + rowIndex * 0.12
    const rowSpan = 0.44

    glyphRow.forEach((glyph, glyphIndex) => {
      const glyphStart = rowStart + glyphIndex * 0.01
      const glyphProgress = clamp((fillReveal - glyphStart) / rowSpan, 0, 1)
      glyph.style.color = mixColor(baseColor, filledColor, glyphProgress)
      glyph.style.opacity = '1'
    })
  })

  introGlasses.forEach((glass, index) => {
    const revealProfile = [
      { start: 0.38, duration: 0.18, lift: 24, scale: 0.58, rotate: -16, driftX: -8, driftY: -2 },
      { start: 0.45, duration: 0.16, lift: 18, scale: 0.62, rotate: 10, driftX: 6, driftY: -4 },
      { start: 0.51, duration: 0.17, lift: 22, scale: 0.6, rotate: -12, driftX: -4, driftY: 3 },
      { start: 0.57, duration: 0.15, lift: 20, scale: 0.64, rotate: 14, driftX: 7, driftY: 1 }
    ][index] || { start: 0.46, duration: 0.16, lift: 20, scale: 0.6, rotate: -10, driftX: 0, driftY: 0 }

    const rawProgress = clamp((stageProgress - revealProfile.start) / revealProfile.duration, 0, 1)
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3)
    const bubble = Math.sin(easedProgress * Math.PI) * (6 + index * 2)
    const xShift = revealProfile.driftX * (1 - easedProgress) + Math.sin(easedProgress * Math.PI * 1.4 + index) * 4
    const yShift = (1 - easedProgress) * revealProfile.lift + revealProfile.driftY - bubble
    const scale = revealProfile.scale + easedProgress * 0.36 + bubble * 0.0025
    const rotate = revealProfile.rotate * (1 - easedProgress) + Math.sin(easedProgress * Math.PI * 1.2 + index) * 5

    glass.style.opacity = `${easedProgress}`
    glass.style.transform = `translate3d(${xShift}px, ${yShift}px, 0) scale(${scale}) rotate(${rotate}deg)`
  })
}

const syncScrollState = () => {
  if (!heroScene || !sharedTitle) {
    return
  }

  const scrollY = Math.max(window.scrollY, lenis ? lenis.scroll : 0)
  const fadeRange = Math.max(window.innerHeight * 0.9, 420)
  const progress = clamp(scrollY / fadeRange, 0, 1)
  const fade = 1 - progress
  const heroBlur = progress * 18
  const titleBlur = progress * 16

  gsap.set(heroScene, {
    opacity: Math.max(0.18, fade),
    filter: `blur(${heroBlur}px) saturate(${1 - progress * 0.1})`
  })

  gsap.set(sharedTitle, {
    opacity: Math.max(0, fade),
    filter: `blur(${titleBlur}px)`
  })

  if (peripherySection) {
    const peripheryStart = peripherySection.offsetTop - window.innerHeight * 0.5
    const peripheryTravel = Math.max(peripherySection.offsetHeight - window.innerHeight * 0.5, 1)
    const peripheryProgress = clamp((scrollY - peripheryStart) / peripheryTravel, 0, 1)

    if (heroTopbar) {
      const topbarFadeOutStart = peripherySection.offsetTop - window.innerHeight * 0.6
      const topbarFadeOutTravel = window.innerHeight * 0.25
      const topbarFadeOutEnd = topbarFadeOutStart + topbarFadeOutTravel

      const workSectionTop = worksSection ? worksSection.offsetTop : (peripherySection.offsetTop + peripherySection.offsetHeight)
      const topbarFadeInStart = workSectionTop - window.innerHeight * 0.7
      const topbarFadeInTravel = window.innerHeight * 0.35

      let tbFade = 1
      let tbBlur = 0

      if (scrollY >= topbarFadeInStart) {
        const inProgress = clamp((scrollY - topbarFadeInStart) / topbarFadeInTravel, 0, 1)
        tbFade = inProgress
        tbBlur = (1 - inProgress) * 16
      } else if (scrollY >= topbarFadeOutEnd) {
        tbFade = 0
        tbBlur = 16
      } else if (scrollY >= topbarFadeOutStart) {
        const outProgress = clamp((scrollY - topbarFadeOutStart) / topbarFadeOutTravel, 0, 1)
        tbFade = 1 - outProgress
        tbBlur = outProgress * 16
      } else {
        tbFade = 1
        tbBlur = 0
      }

      if (footerSection) {
        const footerFadeStart = footerSection.offsetTop - window.innerHeight * 0.75
        const footerFadeTravel = window.innerHeight * 0.35
        if (scrollY >= footerFadeStart) {
          const footerProgress = clamp((scrollY - footerFadeStart) / footerFadeTravel, 0, 1)
          tbFade = 1 - footerProgress
          tbBlur = footerProgress * 16
        }
      }

      gsap.set(heroTopbar, {
        autoAlpha: tbFade,
        filter: `blur(${tbBlur}px)`
      })
    }
    
    // Fade out and blur the periphery section as you scroll past it
    const pFadeOutStart = peripherySection.offsetTop + peripherySection.offsetHeight * 0.3
    const pFadeOutTravel = window.innerHeight * 0.6
    const pFadeProgress = clamp((scrollY - pFadeOutStart) / pFadeOutTravel, 0, 1)
    const pFade = 1 - pFadeProgress
    const pBlur = pFadeProgress * 16

    gsap.set(peripheryInner, {
      opacity: Math.max(0, pFade),
      filter: `blur(${pBlur}px)`
    })

    updateCursorOrbitVisuals(cursorReady ? 1 : 0)

    if (cursorFollower || cursorOrbit) {
      const cursorTransition = clamp((peripheryProgress - 0.04) / 0.26, 0, 1)
      appRoot?.style.setProperty('--cursor-follow-transition', `${cursorTransition}`)
    }
  }

  if (belowIntro && !window.matchMedia('(max-width: 768px)').matches) {
    // Subtract less from offsetTop so the user has to scroll down further before it triggers
    const introStart = belowIntro.offsetTop - window.innerHeight * 0.55
    const introTravel = window.innerHeight * 0.55 // Fixed scroll distance for smooth reveal
    const introProgress = clamp((scrollY - introStart) / introTravel, 0, 1)
    applyIntroScrollState(introProgress)
  }
}

const startScrollLoop = () => {
  const raf = (time) => {
    if (lenis) {
      lenis.raf(time)
    }

    syncScrollState()
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
}

const getHeroTitleTarget = () => {
  let left = Math.min(Math.max(window.innerWidth * 0.0666, 16), 128)
  let top = Math.min(Math.max(window.innerHeight * 0.662, 352), 720)

  try {
    const probe = document.createElement('div')
    probe.style.position = 'absolute'
    probe.style.visibility = 'hidden'
    probe.style.pointerEvents = 'none'
    probe.style.left = 'var(--page-gutter)'
    probe.style.top = '0'
    document.body.appendChild(probe)
    const measuredGutter = probe.getBoundingClientRect().left + window.scrollX
    if (Number.isFinite(measuredGutter)) {
      left = measuredGutter
    }

    probe.style.left = '0'
    probe.style.top = 'var(--hero-title-top)'
    const measuredTop = probe.getBoundingClientRect().top + window.scrollY
    if (Number.isFinite(measuredTop)) {
      top = Math.min(Math.max(measuredTop, 80), Math.max(320, window.innerHeight - 120))
    }

    document.body.removeChild(probe)
  } catch (error) {
    // fall back to viewport math above
  }

  return { left, top }
}

const setReducedMotionState = () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  const { left, top } = getHeroTitleTarget()
  const isMobile = window.matchMedia('(max-width: 768px)').matches

  gsap.set([introScene, sweepScene], { autoAlpha: 0 })
  gsap.set(heroScene, { autoAlpha: 1, clearProps: 'opacity,filter' })
  
  if (isMobile) {
    gsap.set(sharedTitle, {
      left: '50%',
      bottom: 56,
      top: 'auto',
      xPercent: -50,
      yPercent: 0,
      transformOrigin: '50% 100%',
      scale: 1,
      rotation: 0,
      color: '#f4ecdf'
    })
  } else {
    gsap.set(sharedTitle, {
      left,
      top,
      bottom: 'auto',
      xPercent: 0,
      yPercent: 0,
      transformOrigin: '50% 50%',
      scale: 1,
      rotation: 0,
      color: '#f5f7fb'
    })
  }

  gsap.set(titleGlyphs, { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(peripherySection, { autoAlpha: 1 })
  gsap.set(belowIntro, { autoAlpha: 1 })
  gsap.set(belowIntroCopy, { clearProps: 'opacity,filter' })
  gsap.set(introLines, { clearProps: 'opacity,filter,transform' })
  introGlasses.forEach((glass) => gsap.set(glass, { clearProps: 'opacity,transform,filter' }))
  heroTopbar?.classList.add('is-visible')
  gsap.set(heroTopbar, { autoAlpha: 1, y: 0 })
  if (isMobile && mobileMenuBtn) {
    gsap.set(mobileMenuBtn, { autoAlpha: 1, y: 0 })
  }
  applyIntroScrollState(1)
  document.body.classList.remove('is-scroll-locked')
  lenis?.start()
  lenis?.resize()
}

const runAnimation = () => {
  if (!introScene || !sweepScene || !heroScene || !sharedTitle || !heroBg) {
    return
  }

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  document.body.classList.add('is-scroll-locked')
  lenis?.stop()
  window.scrollTo(0, 0)

  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const { left, top } = getHeroTitleTarget()

  gsap.set([introScene, sweepScene, heroScene], { autoAlpha: 0 })
  gsap.set(introScene, { autoAlpha: 1 })
  gsap.set(sweepScene, { autoAlpha: 1, yPercent: -104 })
  gsap.set(heroScene, { autoAlpha: 0 })

  if (isMobile) {
    gsap.set(sharedTitle, {
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.72,
      rotation: 0,
      color: '#0b61ff'
    })
  } else {
    gsap.set(sharedTitle, {
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.47,
      rotation: 0,
      color: '#0b61ff'
    })
  }

  gsap.set(titleGlyphs, {
    y: 34,
    opacity: 0,
    filter: 'blur(14px)'
  })
  appRoot?.style.setProperty('--cursor-follow-transition', '0')
  cursorFollower && gsap.set(cursorFollower, { scale: 1 })
  applyIntroScrollState(0)
  heroTopbar?.classList.remove('is-visible')
  gsap.set(heroTopbar, { autoAlpha: 0, y: 12 })

  if (isMobile && mobileMenuBtn) {
    gsap.set(mobileMenuBtn, { autoAlpha: 0, y: 12 })
  }

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

  timeline.to(sharedTitle, {
    color: '#090b12',
    duration: 1,
    ease: 'power2.out'
  }, 0.25)

  timeline.to(titleGlyphs, {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.98,
    stagger: 0.08,
    ease: 'power3.out'
  }, 0.18)

  // ─── Real progress bar driven by actual asset loading ──────────────────────
  // A GSAP ticker smoothly interpolates the display toward the true loaded
  // fraction. At t=2.5 the timeline pauses and only continues once every
  // critical asset has finished fetching, guaranteeing a pop-in-free hero.
  let _smoothed = 0
  const _progressTick = () => {
    const target = _loaderProgress * 100
    _smoothed += (target - _smoothed) * 0.06  // smooth chase
    const display = Math.min(Math.round(_smoothed), 99)  // never fake 100%
    if (loadingPercentage) loadingPercentage.innerHTML = display + '%'
    if (loadingProgressFill) {
      isMobile
        ? (loadingProgressFill.style.width  = `${_smoothed}%`)
        : (loadingProgressFill.style.height = `${_smoothed}%`)
    }
  }
  gsap.ticker.add(_progressTick)

  // Show the loading UI at t=1.0 (same as before)
  timeline.to([loadingPercentage, loadingProgressBar], { autoAlpha: 1, duration: 0.3 }, 1.0)

  // At t=2.5 pause and wait for real assets, then snap to 100% and fade out
  timeline.call(() => {
    const proceed = () => {
      gsap.ticker.remove(_progressTick)
      // Snap visually to 100%
      if (loadingPercentage) loadingPercentage.innerHTML = '100%'
      if (loadingProgressFill) {
        isMobile
          ? (loadingProgressFill.style.width  = '100%')
          : (loadingProgressFill.style.height = '100%')
      }
      gsap.to([loadingPercentage, loadingProgressBar], {
        autoAlpha: 0,
        filter: isMobile ? 'blur(14px)' : 'none',
        duration: 0.3,
        onComplete: () => timeline.resume()
      })
    }

    if (_assetsLoaded) {
      // Already done — exit immediately (fast connection)
      proceed()
    } else {
      // Slow connection: hold here until every asset resolves
      timeline.pause()
      _assetsReady.then(proceed)
    }
  }, null, 2.5)

  const tapToEnterHint = document.querySelector('.tap-to-enter-hint')
  if (isMobile && tapToEnterHint) {
    timeline.to(tapToEnterHint, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power2.out'
    }, 2.8)

    timeline.addPause('+=0', () => {
      const resumeIntro = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
             navigator.vibrate(15)
             hapticsUnlocked = true
          } catch(err) {}
        }
        document.removeEventListener('click', resumeIntro)
        document.removeEventListener('touchstart', resumeIntro)
        timeline.play()
      }
      document.addEventListener('click', resumeIntro)
      document.addEventListener('touchstart', resumeIntro, { passive: true })
    })

    timeline.to(tapToEnterHint, {
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.4,
      ease: 'power2.in'
    }, '+=0')
  }

  const outTime = isMobile ? 3.8 : 3.52

  timeline.to(introScene, { autoAlpha: 0, duration: 0.68 }, outTime)
  timeline.to(sweepScene, { yPercent: 0, duration: 0.68, ease: 'power4.inOut' }, outTime)

  if (isMobile) {
    // Animate text to bottom-center, horizontal (no rotation).
    // Uses y-based transform for GPU-composited smoothness — no layout thrashing.
    const targetY = window.innerHeight - 56
    const currentCenter = window.innerHeight / 2

    timeline.to(sharedTitle, {
      y: targetY - currentCenter,
      yPercent: -100,
      transformOrigin: '50% 100%',
      scale: 1,
      rotation: 0,
      color: '#f4ecdf',
      duration: 0.92,
      ease: 'power3.out',
      onComplete: () => {
        // Swap to bottom-relative positioning to survive mobile address bar resizes.
        // Explicitly set ALL final-state properties to avoid transform state loss.
        requestAnimationFrame(() => {
          gsap.set(sharedTitle, {
            left: '50%',
            top: 'auto',
            bottom: 56,
            xPercent: -50,
            yPercent: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            transformOrigin: '50% 100%'
          })
        })
      }
    }, outTime)
  } else {
    timeline.to(sharedTitle, {
      left,
      top,
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      rotation: 0,
      color: '#f4ecdf',
      duration: 0.68,
      ease: 'power4.inOut'
    }, outTime)
  }

  timeline.to(heroScene, { autoAlpha: 1, duration: 0.5 }, outTime + 1.24)
  timeline.to(sweepScene, {
    yPercent: 104,
    filter: 'blur(14px)',
    duration: 0.5,
    ease: 'power4.inOut'
  }, outTime + 0.68)
  timeline.to(sweepScene, { autoAlpha: 0, duration: 0.08 }, outTime + 1.18)

  if (isMobile) {
    timeline.call(() => {
      if (mobileMenuBtn) {
        gsap.fromTo(mobileMenuBtn, {
          autoAlpha: 0,
          y: 12
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: 'power3.out'
        })
      }
    }, null, outTime + 1.5)
  } else {
    timeline.call(() => {
      heroTopbar?.classList.add('is-visible')
      gsap.fromTo(heroTopbar, {
        autoAlpha: 0,
        y: 12
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        ease: 'power3.out'
      })
    }, null, outTime + 1.5)
  }

  timeline.add(() => {
    shaderCleanup.start()
    document.body.classList.remove('is-scroll-locked')
    lenis?.start()
    syncScrollState()
    cursorReady = true
    appRoot?.classList.add('is-cursor-active')

    if (!reducedMotion && !isMobile) {
      window.setTimeout(() => {
        cursorOrbit?.classList.add('is-visible')
      }, 1200)
    }
  }, 4.7)
}

const jumpToHash = (immediate = true) => {
  const hash = window.location.hash
  if (!hash) return
  let targetElement = document.querySelector(hash)
  if (hash === '#info' && window.matchMedia('(max-width: 768px)').matches) {
    targetElement = footerSection
  }
  if (targetElement) {
    lenis?.resize()
    if (lenis) {
      lenis.scrollTo(targetElement, { immediate, offset: 0 })
    } else {
      if (immediate) {
        window.scrollTo(0, targetElement.offsetTop)
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
    syncScrollState()
  }
}

const boot = () => {
  if (booted) {
    return
  }

  booted = true

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  const navEntries = performance.getEntriesByType('navigation')
  const isReload = navEntries.length > 0 && navEntries[0].type === 'reload'

  if (isReload && window.location.hash) {
    window.location.replace(window.location.pathname)
    return
  }

  const isWorkHash = window.location.hash === '#work'
  const isInfoHash = window.location.hash === '#info'

  if (reducedMotion) {
    setReducedMotionState()
    return
  }

  if (isWorkHash || isInfoHash) {
    // Skip intro and position at #work or #info instantly
    setReducedMotionState()
    shaderCleanup.start()
    cursorReady = true
    appRoot?.classList.add('is-cursor-active')
    
    // Jump immediately and retry across layout settling cycles
    jumpToHash(true)
    requestAnimationFrame(() => jumpToHash(true))
    setTimeout(() => jumpToHash(true), 80)
    setTimeout(() => jumpToHash(true), 250)
    return
  }

  runAnimation()
}

if (document.fonts?.ready) {
  document.fonts.ready.then(() => {
    requestAnimationFrame(boot)
  })
}

window.addEventListener('resize', syncScrollState)
window.addEventListener('scroll', syncScrollState, { passive: true })
startScrollLoop()
requestAnimationFrame(boot)

// Handle desktop pill navigation clicks smoothly
const heroPillLinks = document.querySelectorAll('.hero-pill__item')
heroPillLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      let targetElement = document.querySelector(href)
      if (href === '#info' && isMobile) {
        targetElement = footerSection
      }
      if (targetElement) {
        lenis?.resize()
        if (lenis) {
          lenis.scrollTo(targetElement, { duration: 1.2, offset: 0 })
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  })
})

// Handle bfcache back-forward navigation & hash changes
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    lenis?.start()
    lenis?.resize()
    syncScrollState()
    if (window.location.hash === '#work' || window.location.hash === '#info') {
      jumpToHash(true)
    }
  }
})

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#work' || window.location.hash === '#info') {
    jumpToHash(false)
  }
})

// --- Cursor follower inertia + hover interactions (intro) ---
if (cursorFollower && appRoot) {
  const follow = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    scaleBase: 1,
    scaleCurrent: 1,
    scaleTarget: 1,
    hoverScale: 1.2
  }

  const parsePx = (v) => {
    if (!v) return 0
    return parseFloat(v.replace('px', '').trim()) || 0
  }

  let wasVisible = false
  let lastTime = performance.now()
  const updateFollow = (now) => {
    const dt = Math.min(64, now - lastTime) / 16.666
    lastTime = now

    const cs = getComputedStyle(appRoot)
    const sx = parsePx(cs.getPropertyValue('--cursor-follow-x'))
    const sy = parsePx(cs.getPropertyValue('--cursor-follow-y'))
    const visible = Number(cs.getPropertyValue('--cursor-follow-visible')) || 0
    const t = Number(cs.getPropertyValue('--cursor-follow-transition')) || 0

    follow.tx = sx || follow.tx
    follow.ty = sy || follow.ty

    if (visible) {
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

    // gently approach final scale based on transition + hover
    const scaleLerp = 0.12
    follow.scaleCurrent += (follow.scaleTarget - follow.scaleCurrent) * scaleLerp * dt
    const targetScale = follow.scaleCurrent

    // position via left/top for pixel-perfect alignment
    cursorFollower.style.left = `${Math.round(follow.x)}px`
    cursorFollower.style.top = `${Math.round(follow.y)}px`
    const translateX = workCursorHover ? '16px' : '-50%'
    cursorFollower.style.transform = `translate(${translateX}, -50%) scale(${targetScale})`
    cursorFollower.style.opacity = `${workCursorHover ? 1 : visible}`

    if (cursorOrbit) {
      cursorOrbit.style.left = `${Math.round(follow.x)}px`
      cursorOrbit.style.top = `${Math.round(follow.y)}px`
      updateCursorOrbitVisuals(visible)
    }

    if (peripheryInner && visible) {
      // Normalize cursor pos from -1 to 1
      const px = (follow.x / window.innerWidth) * 2 - 1
      const py = (follow.y / window.innerHeight) * 2 - 1
      
      const rotateX = py * -8
      const rotateY = px * 8
      
      peripheryInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      
      peripheryItems.forEach(item => {
        const depth = parseFloat(item.dataset.depth) || 0
        // Translate opposite to mouse movement to create parallax
        item.style.transform = `translateZ(${depth}px) translate(${-px * depth * 0.6}px, ${-py * depth * 0.6}px)`
      })
    } else if (peripheryInner && !visible) {
      // Reset smoothly when cursor leaves
      peripheryInner.style.transform = `rotateX(0deg) rotateY(0deg)`
      peripheryItems.forEach(item => {
        const depth = parseFloat(item.dataset.depth) || 0
        item.style.transform = `translateZ(${depth}px) translate(0px, 0px)`
      })
    }

    requestAnimationFrame(updateFollow)
  }

  requestAnimationFrame(updateFollow)

  // Hover interactions for interactive elements
  const interactiveSelector = 'a, button, input, textarea, [role="button"], .hero-pill__item, .hero-links a'
  document.addEventListener('pointerover', (e) => {
    const hit = e.target.closest && e.target.closest(interactiveSelector)
    if (hit) {
      cursorFollower.style.transition = 'transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 160ms ease'
      follow.scaleTarget = follow.hoverScale
    }
  }, true)

  document.addEventListener('pointerout', (e) => {
    const hit = e.target.closest && e.target.closest(interactiveSelector)
    if (hit) {
      cursorFollower.style.transition = 'transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease'
      follow.scaleTarget = follow.scaleBase
    }
  }, true)
}

const initPeripheryAnimation = () => {
  if (!peripherySection || !peripheryText) return

  const pAnims = gsap.utils.toArray('.periphery-section .p-anim')
  if (!pAnims.length) return

  // Set initial states
  gsap.set(peripheryText, { opacity: 0, y: 30, filter: 'blur(10px)' })
  gsap.set(pAnims, { opacity: 0, scale: 0.5, filter: 'blur(10px)' })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: peripherySection,
      start: 'top 50%', // triggers when the section reaches the middle of the screen
      toggleActions: 'play none none reverse'
    }
  })

  // 1. Text fades and lifts in
  tl.to(peripheryText, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.7,
    ease: 'power3.out'
  })

  // 2. Images and tags bloom outward with a stagger
  tl.to(pAnims, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.8,
    stagger: {
      amount: 0.4,
      from: 'center'
    },
    ease: 'back.out(1.2)'
  }, '-=0.3')

  // 3. Start continuous slow rotation independently of the scroll timeline
  const orbit = document.querySelector('.periphery-orbit')
  if (orbit) {
    // Forward orbit rotation runs forever
    gsap.to(orbit, {
      rotation: 360,
      duration: 80,
      ease: 'none',
      repeat: -1
    })
    // Counter rotation to keep items upright runs forever
    gsap.to(pAnims, {
      rotation: -360,
      duration: 80,
      ease: 'none',
      repeat: -1
    })
  }
}
const initBelowIntroAnimationMobile = () => {
  if (!belowIntro || !window.matchMedia('(max-width: 768px)').matches) return

  // Make sure glyphs are filled with their final color since we're fading/blurring line-by-line on mobile
  introGlyphRows.forEach(row => {
    row.forEach(glyph => {
      glyph.style.color = '#e0e0e0'
      glyph.style.opacity = '1'
    })
  })

  // Ensure container wrapper does not obscure child line-by-line animations
  gsap.set(belowIntroCopy, { opacity: 1, filter: 'blur(0px)' })

  // 1. Initial state for text lines (blurred, slightly offset down, transparent)
  gsap.set(introLines, {
    opacity: 0,
    filter: 'blur(16px)',
    y: 16
  })

  // 2. Initial state for glass shapes (blurred, scaled down, transparent)
  gsap.set(introGlasses, {
    opacity: 0,
    scale: 0.45,
    filter: 'blur(14px)'
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: belowIntro,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // Step 1: Text lines fade and blur in line by line with tighter timing
  tl.to(introLines, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.85,
    stagger: 0.22,
    ease: 'power2.out'
  })

  // Step 2: Overlap the 3D glass shapes so they bloom into view as lines finish revealing
  tl.to(introGlasses, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.9,
    stagger: 0.14,
    ease: 'back.out(1.2)'
  }, '-=0.55')
}

const initWorkCardsScrollAnimations = () => {
  if (!workCards || !workCards.length) return

  workCards.forEach((card, index) => {
    const textElements = card.querySelectorAll('.work-card__number, .work-card__title, .work-card__year, .work-chip, .work-card__eyebrow, .work-card__description')
    
    // Set initial 3D transform and opacity state for the card container
    gsap.set(card, { 
      opacity: 0, 
      y: 40, 
      scale: 0.98,
      rotationX: -5,
      transformPerspective: 1200,
      transformOrigin: '50% 100%'
    })

    // Set initial state for internal text elements
    if (textElements.length) {
      gsap.set(textElements, {
        opacity: 0,
        y: 12
      })
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 85%', // Trigger when card enters lower part of viewport
        toggleActions: 'play none none reverse'
      }
    })

    // 1. Reveal the card container
    tl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.6,
      ease: 'power3.out'
    })

    // 2. Stagger text elements inside the card
    if (textElements.length) {
      tl.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power2.out',
        clearProps: 'transform'
      }, '-=0.4') // Start before the card finishes settling
    }

    // 3. Mobile specific: Highlight card and animate arrow when centered
    if (window.matchMedia('(max-width: 768px)').matches) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => highlightMobileCard(card),
        onEnterBack: () => highlightMobileCard(card),
        onLeave: () => unhighlightMobileCard(card),
        onLeaveBack: () => unhighlightMobileCard(card)
      })
    }
  })
}

const highlightMobileCard = (card) => {
  if (window.triggerHaptic) window.triggerHaptic(20)
  card.classList.add('is-centered')
  const arrowContainer = card.querySelector('.work-card__mobile-arrow')
  const arrowPath = card.querySelector('.work-card__mobile-arrow svg path')
  
  if (arrowContainer && arrowPath) {
    // Jump animation
    gsap.to(arrowContainer, {
      y: -6,
      x: 6,
      duration: 0.25,
      delay: 1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      overwrite: 'auto'
    })
    // Flash blue
    gsap.to(arrowPath, {
      fill: '#0b61ff',
      duration: 0.25,
      delay: 1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }
}

const unhighlightMobileCard = (card) => {
  card.classList.remove('is-centered')
}

initPeripheryAnimation()
initBelowIntroAnimationMobile()
initWorkCardsScrollAnimations()

// --- Halftone Footer Animation & Time Initialization ---
const footerContainer = document.querySelector('[data-canvas-container]')
const footerCanvas = document.querySelector('[data-canvas]')

if (footerContainer && footerCanvas) {
  footerContainer.addEventListener('pointerenter', () => {
    setWorkCursorHover(true, '[HOLD TO DISRUPT]')
  })
  footerContainer.addEventListener('pointerleave', () => {
    setWorkCursorHover(false)
  })

  createHalftoneAnimation(footerContainer, footerCanvas, {
    reducedMotion,
    bg: '#4469B4',   // Milder blue requested by user
    fg: '#02040a',   // Dark foreground dots matching site background
    pixelSize: 3,
    gooeyness: 0.58,
    contrast: 1.5,
    bias: 0.0,
    invert: 1,
    amplitude: 0.8,
    timeSpeed: 0.0045,
    interactive: true
  })

  // Footer Entrance Animation
  const footerElements = document.querySelectorAll('.footer_top_row, .footer_links_row, .footer_canvas_brand, .footer_canvas_icon')
  if (footerElements.length) {
    gsap.from(footerElements, {
      scrollTrigger: {
        trigger: '.footer_wrap_main',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out'
    })
  }

}

// ── Footer Scroll Parallax Animation (runs independently of canvas) ──────────
{
  const footerRoot = document.querySelector('[data-footer-parallax]')
  const footerInner = document.querySelector('[data-footer-parallax-inner]')
  const footerContainer = document.querySelector('[data-canvas-container]')
  const canvasContents = document.querySelectorAll('[data-canvas-content]')

  if (footerRoot && footerInner && !reducedMotion) {
    // Text content parallax scroll — inner wrapper slides up as footer enters.
    // invalidateOnRefresh: true forces the start/end positions to be
    // recalculated every time ScrollTrigger.refresh() is called (e.g. after
    // a work card expands and changes the total page height).
    gsap.timeline({
      scrollTrigger: {
        trigger: footerRoot,
        start: 'top bottom',
        // 'top center' = footer top reaches mid-viewport, always reachable
        end: 'top center',
        scrub: true,
        invalidateOnRefresh: true
      }
    }).fromTo(footerInner,
      { yPercent: -18 },
      { yPercent: 0, ease: 'none' }
    )

    if (footerContainer) {
      // ── Bymonolog-style canvas parallax ──────────────────────────────────
      // Clamped scrub: starts when canvas top enters viewport bottom,
      // ends when canvas top reaches viewport top. Brand slides in from
      // the left and the icon from the right, mirroring bymonolog exactly.
      const footerCanvasBottom = document.querySelector('.footer_canvas_bottom')
      const canvasTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerCanvasBottom || footerContainer,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: true,
          invalidateOnRefresh: true
        }
      })

      canvasContents.forEach((el) => {
        const xDir = el.dataset.canvasContent === 'left' ? 100 : -100
        canvasTl.fromTo(el,
          { xPercent: xDir, opacity: 0 },
          { xPercent: 0, opacity: 1, ease: 'none' },
          '<'
        )
      })
    }
  }
}

// Bimonolog-style ticking local time clock for Mumbai, India
const footerTimeEl = document.querySelector('[data-footer-time]')
if (footerTimeEl) {
  const updateTime = () => {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    const formatter = new Intl.DateTimeFormat('en-US', options)
    const timeStr = formatter.format(new Date())

    const parts = timeStr.split(':')
    if (parts.length === 3) {
      const hh = parts[0]
      const mm = parts[1]
      const ssAndPeriod = parts[2].split(' ')
      const ss = ssAndPeriod[0]
      const period = ssAndPeriod[1] || ''

      footerTimeEl.innerHTML = `${hh}<span class="blinking-colon">:</span>${mm}<span class="blinking-colon">:</span>${ss} <span class="footer_time_period">${period}</span>`
    } else {
      footerTimeEl.textContent = timeStr
    }
  }

  updateTime()
  setInterval(updateTime, 1000)
}

// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
const mobileMenuPanel = document.querySelector('.mobile-menu-panel')
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay')
const mobileMenuClose = document.querySelector('.mobile-menu-close')
const mobileNavLinks = document.querySelectorAll('[data-mobile-nav]')

let mobileMenuTimeline = null

const initMobileMenuTimeline = () => {
  if (!mobileMenuPanel || mobileMenuTimeline) return
  
  gsap.set(mobileMenuPanel, { xPercent: 100 })
  gsap.set(mobileMenuOverlay, { autoAlpha: 0, backdropFilter: 'blur(0px)' })
  
  mobileMenuTimeline = gsap.timeline({ paused: true, defaults: { ease: 'power4.inOut' } })
  
  mobileMenuTimeline.to(mobileMenuOverlay, {
    autoAlpha: 1,
    backdropFilter: 'blur(12px)',
    duration: 0.6
  }, 0)
  
  mobileMenuTimeline.to(mobileMenuPanel, {
    autoAlpha: 1,
    xPercent: 0,
    duration: 0.8,
    ease: 'expo.inOut'
  }, 0)
  
  const menuItems = mobileMenuPanel.querySelectorAll('.mobile-menu-section-link, .mobile-menu-links a, .mobile-menu-brand, .mobile-menu-close')
  gsap.set(menuItems, { y: 30, opacity: 0 })
  
  mobileMenuTimeline.to(menuItems, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.04,
    ease: 'power3.out'
  }, 0.3)
}

const openMobileMenu = () => {
  if (window.triggerHaptic) window.triggerHaptic(20)
  if (!mobileMenuTimeline) initMobileMenuTimeline()
  mobileMenuBtn?.setAttribute('aria-expanded', 'true')
  mobileMenuPanel?.setAttribute('aria-hidden', 'false')
  document.body.classList.add('is-scroll-locked')
  lenis?.stop()
  mobileMenuTimeline.timeScale(1).play()
}

const closeMobileMenu = () => {
  if (window.triggerHaptic) window.triggerHaptic(20)
  mobileMenuBtn?.setAttribute('aria-expanded', 'false')
  mobileMenuPanel?.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('is-scroll-locked')
  lenis?.start()
  mobileMenuTimeline.timeScale(1.5).reverse()
}

mobileMenuBtn?.addEventListener('click', openMobileMenu)
mobileMenuClose?.addEventListener('click', closeMobileMenu)
mobileMenuOverlay?.addEventListener('click', closeMobileMenu)

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    closeMobileMenu()
    const target = link.getAttribute('href')
    if (target === '#work' && worksSection) {
      window.scrollTo({ top: worksSection.offsetTop, behavior: 'smooth' })
    }
    if (target === '#info') {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const targetElement = isMobile ? footerSection : document.querySelector('#info')
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' })
      }
    }
  })
})

// End of file
