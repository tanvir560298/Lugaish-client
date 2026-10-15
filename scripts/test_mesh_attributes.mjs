import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://127.0.0.1:5180/study-room', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    // Try to find the three mesh via fiber root on canvas
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.log('No canvas found');
      return;
    }
    const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) {
      console.log('No fiber key on canvas');
      return;
    }
    console.log('Fiber key found');
  });

  await browser.close();
}
main().catch(console.error);
