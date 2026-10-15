import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5180/study-room', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    // Find canvas and examine scene if possible, or print console logs
    const results = [];
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'no canvas';
    
    // Check window or fiber
    return 'Canvas found: ' + canvas.width + 'x' + canvas.height;
  });
  console.log(info);
  await browser.close();
}
main().catch(console.error);
