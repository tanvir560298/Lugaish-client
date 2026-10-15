import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://127.0.0.1:5180/study-room', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(2500);

  const result = await page.evaluate(() => {
    // Find canvas or three objects if accessible
    return window.document.title;
  });
  console.log('Result:', result);
  await browser.close();
}
main().catch(console.error);
