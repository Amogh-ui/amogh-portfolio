const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Browser Error:', msg.text());
  });
  
  page.on('pageerror', error => {
    console.log('Page Error:', error.message);
  });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('Page loaded successfully.');
  } catch (err) {
    console.log('Navigation Error:', err.message);
  }
  
  await browser.close();
})();
