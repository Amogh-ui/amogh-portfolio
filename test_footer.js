const bymonologGSAP = `
  const footerRoot = document.querySelector('[data-footer-parallax]')
  const footerReveal = document.querySelector('[data-footer-reveal]')
  if (footerRoot && footerReveal) {
    gsap.set(footerRoot, { overflow: 'hidden' })
    gsap.from(footerReveal, {
      yPercent: -100, // Or whatever creates the perfect stationary peel
      ease: 'none',
      scrollTrigger: {
        trigger: footerRoot,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true
      }
    })
  }
`
