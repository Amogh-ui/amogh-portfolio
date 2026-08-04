const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 10000 });
  await new Promise(r => setTimeout(r, 6000)); // wait for animation
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
