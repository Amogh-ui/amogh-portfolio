const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf-8');

const targetStr = `  // Bimonolog-style Footer Scroll Parallax Animation`;
const replaceStr = `  // Footer Entrance Animation
  const footerElements = document.querySelectorAll('.footer_top_row, .footer_links_row, .footer_canvas_brand, .footer_canvas_icon');
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
    });
  }

  // Bimonolog-style Footer Scroll Parallax Animation`;

if(code.includes(targetStr) && !code.includes('Footer Entrance Animation')) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/main.js', code);
  console.log('patched footer animation');
} else {
  console.log('already patched or target not found');
}
