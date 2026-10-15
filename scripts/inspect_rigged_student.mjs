import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://127.0.0.1:5180/study-room', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000);

  const meshes = await page.evaluate(() => {
    // In RiggedStudent we can log to console or inspect
    return 'evaluated';
  });

  await browser.close();
}
main().catch(console.error);
